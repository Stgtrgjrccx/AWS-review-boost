// In-memory + DB client repository for ASW Review Boost Operator Software

let defaultClients = [
  {
    id: 'client-rustic-table',
    name: 'The Rustic Table Café',
    slug: 'rustic-table',
    industry: 'restaurant',
    phone: '+91 98201 12345',
    googleReviewUrl: 'https://g.page/r/rustic-table/review',
    brandColor: '#f59e0b',
    status: 'active',
    reviewsSent: 248,
    fiveStarCount: 194,
    fourStarCount: 38,
    interceptedCount: 16,
    avgRating: 4.88,
    conversionRate: 78,
    liveToken: 'live_rt_9812',
    recentActivity: [
      { id: 'act-1', type: 'five_star', customer: 'Priya Sharma', time: '4 mins ago', note: '5★ Google Review verified' },
      { id: 'act-2', type: 'sent', customer: 'Arjun Verma', time: '18 mins ago', note: 'WhatsApp request delivered' },
      { id: 'act-3', type: 'intercepted', customer: 'Rohan Joshi', time: '1 hour ago', note: '2★ Shielded privately (Wait time)' },
      { id: 'act-4', type: 'five_star', customer: 'Ananya Roy', time: '2 hours ago', note: '5★ Google Review verified' },
      { id: 'act-5', type: 'clicked', customer: 'Vikram Mehta', time: '3 hours ago', note: 'Tabletop QR scanned' },
    ],
    customerPraises: [
      'The iced hazelnut latte and service was incredible! ☕',
      'Warm ambiance and welcoming staff. Will definitely visit again. ✨',
      'Best wood-fired pizza in the neighborhood! 🍕',
    ],
    interceptedFeedback: [
      { id: 'fb-1', customer: 'Rohan Joshi', phone: '+91 98111 22334', rating: 2, tags: ['Long wait ⏳'], comment: 'Waited 35 mins for table despite booking.', time: '1 hour ago', resolved: false },
      { id: 'fb-2', customer: 'Sunita Rao', phone: '+91 98222 44556', rating: 3, tags: ['AC too cold ❄️'], comment: 'Food was delicious but AC was freezing.', time: '1 day ago', resolved: true },
    ]
  },
  {
    id: 'client-apex-dental',
    name: 'Apex Dental & Orthodontics',
    slug: 'apex-dental',
    industry: 'medical',
    phone: '+91 98990 67890',
    googleReviewUrl: 'https://g.page/r/apex-dental/review',
    brandColor: '#0ea5e9',
    status: 'active',
    reviewsSent: 165,
    fiveStarCount: 142,
    fourStarCount: 18,
    interceptedCount: 5,
    avgRating: 4.92,
    conversionRate: 86,
    liveToken: 'live_ad_4421',
    recentActivity: [
      { id: 'act-10', type: 'five_star', customer: 'Meera Iyer', time: '12 mins ago', note: '5★ Google Review verified' },
      { id: 'act-11', type: 'sent', customer: 'Karan Dave', time: '45 mins ago', note: 'SMS review link dispatched' },
      { id: 'act-12', type: 'five_star', customer: 'Deepak Singhania', time: '3 hours ago', note: '5★ Google Review verified' },
    ],
    customerPraises: [
      'Painless root canal treatment, Dr. Kapoor was fantastic! 🦷',
      'Clean clinic and courteous team. Highly recommended. ⭐',
    ],
    interceptedFeedback: [
      { id: 'fb-10', customer: 'Rajesh Nair', phone: '+91 98333 77889', rating: 3, tags: ['Appointment delayed ⏳'], comment: 'Doctor was 20 mins late for slot.', time: '2 days ago', resolved: true },
    ]
  },
  {
    id: 'client-glow-salon',
    name: 'Glow Luxury Studio & Spa',
    slug: 'glow-salon',
    industry: 'salon',
    phone: '+91 98777 11223',
    googleReviewUrl: 'https://g.page/r/glow-salon/review',
    brandColor: '#ec4899',
    status: 'active',
    reviewsSent: 310,
    fiveStarCount: 265,
    fourStarCount: 32,
    interceptedCount: 13,
    avgRating: 4.85,
    conversionRate: 81,
    liveToken: 'live_gs_7712',
    recentActivity: [
      { id: 'act-20', type: 'five_star', customer: 'Divya Nair', time: '25 mins ago', note: '5★ Google Review verified' },
      { id: 'act-21', type: 'sent', customer: 'Nisha Pillai', time: '1 hour ago', note: 'WhatsApp request delivered' },
    ],
    customerPraises: [
      'Incredible hair spa and styling! Staff treated me like royalty 💆‍♀️',
      'Clean aesthetic and great nail art. ⭐',
    ],
    interceptedFeedback: []
  }
]

// Global cache for development / runtime memory persistence
if (!globalThis._aswClients) {
  globalThis._aswClients = defaultClients
}

export function getAllClients() {
  return globalThis._aswClients
}

export function getClientBySlug(slug) {
  return globalThis._aswClients.find(c => c.slug === slug) || globalThis._aswClients[0]
}

export function getClientById(id) {
  return globalThis._aswClients.find(c => c.id === id) || globalThis._aswClients[0]
}

export function createClient({ name, slug, industry, googleReviewUrl, phone, brandColor }) {
  const newSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const newClient = {
    id: `client-${Date.now()}`,
    name,
    slug: newSlug,
    industry: industry || 'default',
    phone: phone || '',
    googleReviewUrl: googleReviewUrl || '',
    brandColor: brandColor || '#6366f1',
    status: 'active',
    reviewsSent: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    interceptedCount: 0,
    avgRating: 5.0,
    conversionRate: 0,
    liveToken: `live_${Math.random().toString(36).substring(2, 8)}`,
    recentActivity: [
      { id: `act-${Date.now()}`, type: 'system', customer: 'System', time: 'Just now', note: 'Client account activated' }
    ],
    customerPraises: [],
    interceptedFeedback: []
  }
  globalThis._aswClients.unshift(newClient)
  return newClient
}

export function addDispatchEvent(clientId, customerName, channel) {
  const client = getClientById(clientId)
  if (!client) return
  client.reviewsSent += 1
  client.recentActivity.unshift({
    id: `act-${Date.now()}`,
    type: 'sent',
    customer: customerName,
    time: 'Just now',
    note: `${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} request dispatched`
  })
}

export function recordClientReview(slug, stars, comment = '', quickTags = [], customerName = 'Customer') {
  const client = getClientBySlug(slug)
  if (!client) return

  if (stars >= 4) {
    if (stars === 5) client.fiveStarCount += 1
    if (stars === 4) client.fourStarCount += 1
    client.recentActivity.unshift({
      id: `act-${Date.now()}`,
      type: 'five_star',
      customer: customerName,
      time: 'Just now',
      note: `${stars}★ Google Review verified`
    })
    if (comment && comment.length > 5) {
      client.customerPraises.unshift(comment)
      if (client.customerPraises.length > 5) client.customerPraises.pop()
    }
  } else {
    client.interceptedCount += 1
    client.recentActivity.unshift({
      id: `act-${Date.now()}`,
      type: 'intercepted',
      customer: customerName,
      time: 'Just now',
      note: `${stars}★ Shielded privately (${quickTags[0] || 'Issue'})`
    })
    client.interceptedFeedback.unshift({
      id: `fb-${Date.now()}`,
      customer: customerName,
      phone: '',
      rating: stars,
      tags: quickTags,
      comment,
      time: 'Just now',
      resolved: false
    })
  }

  // Recalculate average rating
  const totalRatings = (client.fiveStarCount * 5) + (client.fourStarCount * 4) + (client.interceptedCount * 2)
  const totalCount = client.fiveStarCount + client.fourStarCount + client.interceptedCount
  if (totalCount > 0) {
    client.avgRating = Math.round((totalRatings / totalCount) * 100) / 100
  }
}
