import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const INDUSTRY_DESIGN_MAP = {
  restaurant: 'gamified',
  cafe: 'gamified',
  food: 'gamified',
  salon: 'warm',
  beauty: 'warm',
  spa: 'warm',
  medical: 'clean',
  dental: 'clean',
  clinic: 'clean',
  healthcare: 'clean',
  retail: 'social',
  ecommerce: 'social',
  shop: 'social',
  hotel: 'warm',
  hospitality: 'warm',
  home_services: 'social',
  plumbing: 'social',
  cleaning: 'social',
  default: 'clean',
}

const INDUSTRY_QUICK_TAGS = {
  restaurant: ['Great food! 🍕', 'Amazing staff! 😊', 'Perfect ambiance! ✨', 'Will return! 🔁', 'Great value! 💰'],
  cafe: ['Amazing coffee! ☕', 'Cozy vibe! 🏡', 'Friendly staff! 😊', 'Great pastries! 🥐'],
  salon: ['Love my hair! 💇', 'Great service! ✂️', 'Felt pampered! 💅', 'Amazing results! ✨'],
  beauty: ['Fantastic results! ✨', 'Professional staff! 👑', 'Clean and comfy! 🌸'],
  medical: ['Professional team! 👨‍⚕️', 'Quick & efficient! ⚡', 'Very thorough! 📋', 'Comfortable experience! 😌'],
  dental: ['Painless experience! 😌', 'Great dentist! 🦷', 'Clean clinic! ✨', 'Very professional! 👨‍⚕️'],
  retail: ['Great products! 🛍️', 'Helpful staff! 😊', 'Good prices! 💰', 'Easy returns! 🔄'],
  hotel: ['Loved the room! 🛏️', 'Amazing service! ⭐', 'Great location! 📍', 'Will return! 🔁'],
  default: ['Great service! ⭐', 'Friendly staff! 😊', 'Highly recommend! 👍', 'Will return! 🔁'],
}

/**
 * Get the funnel design type based on business industry
 */
export function getFunnelDesign(industry) {
  const key = (industry || 'default').toLowerCase()
  return INDUSTRY_DESIGN_MAP[key] || INDUSTRY_DESIGN_MAP.default
}

/**
 * Get quick-tap chips for the funnel based on industry
 */
export function getQuickTags(industry) {
  const key = (industry || 'default').toLowerCase()
  return INDUSTRY_QUICK_TAGS[key] || INDUSTRY_QUICK_TAGS.default
}

/**
 * Generate an AI-personalized review request message
 */
export async function generatePersonalizedMessage(businessName, customerName, industry) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Generate a short, warm, personalized WhatsApp/SMS message asking ${customerName} to leave a Google review for "${businessName}" (a ${industry} business). 
    
    Rules:
    - Max 2 sentences + 1 line with the review link placeholder [LINK]
    - Sound human, not corporate
    - Match the industry tone (${industry} = ${industry === 'medical' || industry === 'dental' ? 'professional and calm' : industry === 'restaurant' || industry === 'cafe' ? 'warm and fun' : 'friendly and appreciative'})
    - Include the customer's name
    - Do NOT use emojis excessively (max 1-2)
    - End with [LINK]
    
    Return ONLY the message text, nothing else.`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Gemini error, using template:', error.message)
    // Fallback template
    return `Hi ${customerName}! Thanks for visiting ${businessName} 🙏 Your experience means a lot to us — would you mind leaving a quick review? It takes just 30 seconds: [LINK]`
  }
}

/**
 * Generate a generic review request message template
 */
export function getTemplateMessage(businessName, customerName) {
  return `Hi ${customerName}! Thanks for visiting ${businessName}. We'd love to hear about your experience — could you spare 30 seconds to leave us a review? 👉 [LINK]`
}
