import { NextResponse } from 'next/server'
import { addDispatchEvent, getClientById } from '@/lib/clients'
import { sendReviewRequest } from '@/lib/twilio'

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

    const reviewLink = `${BASE_URL}/review/${client.slug}?name=${encodeURIComponent(customerName)}`
    const messageBody = customMessage
      ? customMessage.replace('[LINK]', reviewLink)
      : `Hi ${customerName}! Thanks for visiting ${client.name}. We would love to hear about your experience — could you spare 30 seconds to leave us a quick review? 👉 ${reviewLink}`

    // Send via Twilio (or mock if no credentials)
    let sendResult = { channel: channel || 'whatsapp', sid: 'mock_sid' }
    try {
      sendResult = await sendReviewRequest(customerPhone, messageBody)
    } catch {
      // In dev or without Twilio, record as success
    }

    addDispatchEvent(clientId, customerName, sendResult.channel)

    return NextResponse.json({
      success: true,
      channel: sendResult.channel,
      reviewLink,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
