import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/twilio'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://reviewboostpro.com'

export async function POST(req) {
  try {
    const { slug, requestId, starRating, quickTags, comment, platformRedirected, customerName } = await req.json()

    // Get business
    const business = await prisma.business.findUnique({
      where: { slug },
      include: { owner: { select: { email: true } } },
    })

    if (!business) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Get customer from requestId if available
    let customerId = null
    let customerPhone = null
    if (requestId) {
      const request = await prisma.reviewRequest.findUnique({
        where: { id: requestId },
        include: { customer: true },
      })
      if (request) {
        customerId = request.customerId
        customerPhone = request.customer?.phone

        // Update the review request with star rating
        await prisma.reviewRequest.update({
          where: { id: requestId },
          data: {
            starRating,
            platformRedirected: platformRedirected || null,
            status: 'delivered',
          },
        })
      }
    }

    // For negative feedback (1-3 stars), save to feedback table
    if (starRating && starRating <= 3) {
      await prisma.feedback.create({
        data: {
          businessId: business.id,
          customerId,
          starRating,
          quickTags: quickTags || [],
          comment: comment || null,
        },
      })

      // Auto-reply to customer (sorry message)
      if (customerPhone) {
        const sorryMessage = `Hi ${customerName || 'there'}! We're truly sorry about your experience at ${business.name}. Our team has been notified and we'll do our best to make it right. Thank you for the feedback 🙏`
        await sendSMS(customerPhone, sorryMessage).catch(() => {})

        // Mark auto-replied
        await prisma.feedback.updateMany({
          where: { businessId: business.id, customerId, createdAt: { gte: new Date(Date.now() - 60000) } },
          data: { autoReplied: true },
        })
      }

      // Notify business owner via WhatsApp about negative feedback
      // (This would use the owner's phone — for now we log it)
      console.log(`[ALERT] Negative feedback for ${business.name}: ${starRating} stars — "${comment}"`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
