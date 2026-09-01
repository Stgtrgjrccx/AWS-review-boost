import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Twilio webhook — handles STOP, DELIVERED, FAILED callbacks
 */
export async function POST(req) {
  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())

    const { MessageStatus, SmsSid, Body, From } = body

    // Handle STOP / UNSUBSCRIBE opt-outs
    const bodyText = (Body || '').trim().toUpperCase()
    const OPT_OUT_KEYWORDS = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT']

    if (OPT_OUT_KEYWORDS.includes(bodyText)) {
      const phone = From?.replace('whatsapp:', '') || ''
      if (phone) {
        await prisma.optOut.upsert({
          where: { phone },
          update: {},
          create: { phone },
        })
        // Also mark the customer as opted out
        await prisma.customer.updateMany({
          where: { phone },
          data: { optOut: true },
        })
        console.log(`[OPT-OUT] ${phone} has opted out`)
      }
      return new Response('<?xml version="1.0" encoding="UTF-8"?><Response><Message>You have been unsubscribed and will receive no further messages.</Message></Response>', {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Handle delivery status updates
    if (SmsSid && MessageStatus) {
      await prisma.reviewRequest.updateMany({
        where: { twilioSid: SmsSid },
        data: {
          status: MessageStatus === 'delivered' ? 'delivered' : MessageStatus === 'failed' ? 'failed' : undefined,
          deliveredAt: MessageStatus === 'delivered' ? new Date() : undefined,
        },
      })
    }

    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    })
  } catch (error) {
    console.error('Twilio webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
