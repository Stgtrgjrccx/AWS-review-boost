import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendReviewRequest, sendSMS } from '@/lib/twilio'
import { generatePersonalizedMessage, getTemplateMessage } from '@/lib/gemini'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://reviewboostpro.com'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, messageType, channel, sendTime, scheduledAt } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    // Normalize phone number
    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/[^0-9]/g, '')}`

    // Check opt-out list
    const optOut = await prisma.optOut.findUnique({ where: { phone: normalizedPhone } })
    if (optOut) {
      return NextResponse.json({ error: 'This number has opted out of messages' }, { status: 400 })
    }

    // Get business
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    })
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Rate limiting: max 3 requests per customer per 30 days
    const recentRequests = await prisma.reviewRequest.count({
      where: {
        businessId: business.id,
        customer: { phone: normalizedPhone },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })
    if (recentRequests >= 3) {
      return NextResponse.json({ error: 'Rate limit: max 3 messages per 30 days per customer' }, { status: 429 })
    }

    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { businessId_phone: { businessId: business.id, phone: normalizedPhone } },
      update: { name },
      create: { businessId: business.id, name, phone: normalizedPhone, source: 'manual' },
    })

    // Generate message
    const reviewLink = `${BASE_URL}/review/${business.slug}`

    let messageBody
    if (messageType === 'ai') {
      const aiMsg = await generatePersonalizedMessage(business.name, name, business.industry)
      messageBody = aiMsg.replace('[LINK]', reviewLink)
    } else {
      messageBody = getTemplateMessage(business.name, name).replace('[LINK]', reviewLink)
    }

    // For scheduled sends, just save the record (a cron job would process it)
    if (sendTime === 'scheduled' && scheduledAt) {
      const request = await prisma.reviewRequest.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          channel: channel === 'whatsapp' ? 'whatsapp' : channel === 'sms' ? 'sms' : 'whatsapp',
          messageType: messageType || 'template',
          messageBody,
          status: 'pending',
        },
      })
      return NextResponse.json({ success: true, scheduled: true, requestId: request.id })
    }

    // Send now
    const result = await sendReviewRequest(normalizedPhone, messageBody)

    // Save to DB
    const request = await prisma.reviewRequest.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        channel: result.channel,
        messageType: messageType || 'template',
        messageBody,
        status: 'sent',
        sentAt: new Date(),
        twilioSid: result.sid,
      },
    })

    return NextResponse.json({ success: true, channel: result.channel, requestId: request.id })
  } catch (error) {
    console.error('Send request error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
