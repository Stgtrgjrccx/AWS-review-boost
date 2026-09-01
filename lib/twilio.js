import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
const SMS_FROM = process.env.TWILIO_SMS_FROM

/**
 * Send a WhatsApp message, with automatic SMS fallback.
 * @param {string} to - Phone number e.g. "+919876543210"
 * @param {string} body - Message body
 * @returns {{ sid: string, channel: string }}
 */
export async function sendReviewRequest(to, body) {
  const toWhatsApp = `whatsapp:${to}`

  try {
    const msg = await client.messages.create({
      from: WHATSAPP_FROM,
      to: toWhatsApp,
      body,
    })
    return { sid: msg.sid, channel: 'whatsapp', status: msg.status }
  } catch (waError) {
    console.warn('WhatsApp failed, falling back to SMS:', waError.message)
    try {
      const msg = await client.messages.create({
        from: SMS_FROM,
        to,
        body,
      })
      return { sid: msg.sid, channel: 'sms', status: msg.status }
    } catch (smsError) {
      console.error('SMS also failed:', smsError.message)
      throw new Error(`Both WhatsApp and SMS delivery failed: ${smsError.message}`)
    }
  }
}

/**
 * Send an SMS only (for opt-out confirmations, sorry messages, etc.)
 */
export async function sendSMS(to, body) {
  const msg = await client.messages.create({
    from: SMS_FROM,
    to,
    body,
  })
  return { sid: msg.sid, status: msg.status }
}

export default client
