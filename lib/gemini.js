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

/**
 * Generate an AI review draft for consumers to post on Google (RevMe AI mechanism)
 */
export async function generateConsumerReviewDraft({
  businessName,
  industry = 'restaurant',
  rating = 5,
  selectedTags = [],
  customNotes = '',
  tone = 'enthusiastic'
}) {
  try {
    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const tagsText = selectedTags.length > 0 ? selectedTags.join(', ') : 'Great overall service'
      const prompt = `You are a real happy customer writing a genuine ${rating}-star Google review for "${businessName}" (${industry} in Pune, India).
Selected highlights: ${tagsText}.
Customer note: ${customNotes || 'None'}.
Tone: ${tone} (Options: enthusiastic, concise, detailed).

Instructions:
- Write a natural, human, authentic 2-3 sentence Google review.
- Sound like a real customer, not promotional marketing copy.
- Do NOT wrap in quotes.
- Do NOT mention that you were given tags or asked to write this.
- If notes or tags mention specific items, reference them naturally.

Return ONLY the review text.`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim().replace(/^["']|["']$/g, '')
      if (text) return text
    }
  } catch (error) {
    console.error('Gemini consumer review draft error, using fallback template:', error.message)
  }

  // Fallback intelligent templates
  const cleanTags = selectedTags.map(t => t.replace(/[^\w\s]/gi, '').trim()).filter(Boolean)
  const highlight = cleanTags.length > 0 ? cleanTags.join(' and ') : 'the exceptional service'
  
  if (tone === 'concise') {
    return `Fantastic experience at ${businessName}! Really appreciated ${highlight.toLowerCase()}. Will definitely be coming back soon.`
  }
  
  if (tone === 'detailed') {
    return `Visited ${businessName} recently and had an amazing experience from start to finish. Loved ${highlight.toLowerCase()}${customNotes ? `, especially ${customNotes}` : ''}. The team was very professional and courteous. Highly recommend to everyone in Pune!`
  }
  
  // Default: enthusiastic
  return `Had an incredible experience at ${businessName}! ${highlight} was top notch${customNotes ? ` — ${customNotes}` : ''}. Friendly staff and great vibes all around. Deserves a solid 5 stars! ⭐⭐⭐⭐⭐`
}
