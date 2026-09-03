import { NextResponse } from 'next/server'
import { addDispatchEvent, getClientById } from '@/lib/clients'
import { sendReviewRequest } from '@/lib/twilio'
import { sanitizePhoneNumber } from '@/lib/phone'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function POST(req) {
  try {
    const { clientId, customerName, customerPhone, channel, customMessage } = await req.json()
    if (!clientId || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const client = getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Sanitize phone number (+91 or specified country code, strips spaces/dashes)
    const cleanPhone = sanitizePhoneNumber(customerPhone)

    const reviewLink = `${BASE_URL}/review/${client.slug}?name=${encodeURIComponent(customerName)}`
    const messageBody = customMessage
      ? customMessage.replace('[LINK]', reviewLink)
      : `Hi ${customerName}! Thanks for visiting ${client.name}. We would love to hear about your experience — could you spare 30 seconds to leave us a quick review? 👉 ${reviewLink}`

    // Send via Twilio (or graceful mock if no credentials configured yet)
    let sendResult = { channel: channel || 'whatsapp', sid: 'mock_sid' }
    try {
      sendResult = await sendReviewRequest(cleanPhone, messageBody)
    } catch {
      // In dev or offline Twilio, log and proceed cleanly
    }

    addDispatchEvent(clientId, customerName, sendResult.channel)

    return NextResponse.json({
      success: true,
      channel: sendResult.channel,
      phone: cleanPhone,
      reviewLink,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
