/**
 * Clean and format phone numbers for Twilio & WhatsApp delivery
 * Automatically adds country code if missing (defaults to +91 India, or specified prefix)
 */
export function sanitizePhoneNumber(phone, defaultCountryCode = '+91') {
  if (!phone) return ''

  // Remove all whitespace, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

  // If already starts with '+', validate and return
  if (cleaned.startsWith('+')) {
    return cleaned
  }

  // If starts with '00', replace with '+'
  if (cleaned.startsWith('00')) {
    return '+' + cleaned.substring(2)
  }

  // If starts with leading '0', remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }

  // If 10 digits (standard mobile number), prepend default country code
  if (cleaned.length === 10) {
    const prefix = defaultCountryCode.startsWith('+') ? defaultCountryCode : `+${defaultCountryCode}`
    return `${prefix}${cleaned}`
  }

  // Otherwise prepend '+'
  return `+${cleaned}`
}
