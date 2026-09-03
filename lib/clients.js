import { formatDirectReviewUrl } from './googleReview'

let defaultClients = [
  {
    id: 'client-rustic-table',
    name: 'The Rustic Table Café',
    slug: 'rustic-table',
    industry: 'restaurant',
    phone: '+91 98201 12345',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    brandColor: '#f59e0b',
    status: 'active',
    liveToken: 'rt_9812a',
    // Website Design & Digital Assets
    website: {
      status: 'live',
      domain: 'https://therustictable.in',
      stagingUrl: 'https://rustic-table.preview.asw.agency',
      techStack: 'Next.js 14, Tailwind, Framer Motion',
      type: 'Online Menu & Table Reservation Portal',
      monthlyVisitors: 14850,
      speedScore: 98,
      leadsCaptured: 42,
      uptime: '99.98%',
      ssl: 'Active 🟢',
      lastDeployed: 'Yesterday, 4:20 PM',
      pendingTasks: ['Update Summer Specials Menu', 'Add Sunday Brunch Video Reel'],
    },
    // All-time review metrics
    reviewsSent: 248,
    fiveStarCount: 194,
    fourStarCount: 38,
    interceptedCount: 16,
    avgRating: 4.88,
    conversionRate: 78,
    monthMetrics: {
      reviewsSent: 54,
      fiveStarCount: 46,
      fourStarCount: 6,
      interceptedCount: 2,
      avgRating: 4.92,
      conversionRate: 85,
    },
    weekMetrics: {
      reviewsSent: 18,
      fiveStarCount: 16,
      fourStarCount: 2,
      interceptedCount: 0,
      avgRating: 5.0,
      conversionRate: 88,
    },
    recentActivity: [
      { id: 'act-w1', type: 'web_lead', customer: 'Deepa Sen', time: '2 mins ago', note: 'Website table reservation booked (Party of 4)' },
      { id: 'act-1', type: 'five_star', customer: 'Priya Sharma', time: '14 mins ago', note: '5★ Google Review verified' },
      { id: 'act-w2', type: 'web_deploy', customer: 'ASW Dev Team', time: '1 hour ago', note: 'Website speed optimized (LCP 0.8s)' },
      { id: 'act-2', type: 'sent', customer: 'Arjun Verma', time: '2 hours ago', note: 'WhatsApp review request delivered' },
      { id: 'act-3', type: 'intercepted', customer: 'Rohan Joshi', time: '3 hours ago', note: '2★ Shielded privately (Wait time issue)' },
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
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ12345ApexDentalPlaceId',
    brandColor: '#0ea5e9',
    status: 'active',
    liveToken: 'ad_4421b',
    // Website Design & Digital Assets
    website: {
      status: 'review',
      domain: 'https://apexdentalcare.in',
      stagingUrl: 'https://apex-dental.preview.asw.agency',
      techStack: 'Custom React, Tailwind, Cal.com API',
      type: 'Doctor Directory & Instant Appointment Booking',
      monthlyVisitors: 8400,
      speedScore: 99,
      leadsCaptured: 68,
      uptime: '100%',
      ssl: 'Active 🟢',
      lastDeployed: '3 days ago',
      pendingTasks: ['Integrate WhatsApp chat widget', 'Client review on Doctor profiles'],
    },
    reviewsSent: 165,
    fiveStarCount: 142,
    fourStarCount: 18,
    interceptedCount: 5,
    avgRating: 4.92,
    conversionRate: 86,
    monthMetrics: {
      reviewsSent: 38,
      fiveStarCount: 34,
      fourStarCount: 3,
      interceptedCount: 1,
      avgRating: 4.95,
      conversionRate: 89,
    },
    weekMetrics: {
      reviewsSent: 11,
      fiveStarCount: 10,
      fourStarCount: 1,
      interceptedCount: 0,
      avgRating: 5.0,
      conversionRate: 91,
    },
    recentActivity: [
      { id: 'act-w10', type: 'web_lead', customer: 'Meera Iyer', time: '10 mins ago', note: 'New patient appointment requested via website' },
      { id: 'act-10', type: 'five_star', customer: 'Meera Iyer', time: '22 mins ago', note: '5★ Google Review verified' },
      { id: 'act-11', type: 'sent', customer: 'Karan Dave', time: '1 hour ago', note: 'SMS review link dispatched' },
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
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ56789GlowSalonPlaceId',
    brandColor: '#ec4899',
    status: 'active',
    liveToken: 'gs_7712c',
    // Website Design & Digital Assets
    website: {
      status: 'in_design',
      domain: 'https://glowluxurystudio.com',
      stagingUrl: 'https://glow-salon.preview.asw.agency',
      techStack: 'Next.js 14, Glassmorphism, Shopify Headless',
      type: 'Luxury Salon Portfolio & Service Price List',
      monthlyVisitors: 6200,
      speedScore: 96,
      leadsCaptured: 29,
      uptime: '99.95%',
      ssl: 'Active 🟢',
      lastDeployed: 'May 28, 2026',
      pendingTasks: ['Complete Bridal Package Lookbook', 'Set up automated booking SMS'],
    },
    reviewsSent: 310,
    fiveStarCount: 265,
    fourStarCount: 32,
    interceptedCount: 13,
    avgRating: 4.85,
    conversionRate: 81,
    monthMetrics: {
      reviewsSent: 68,
      fiveStarCount: 59,
      fourStarCount: 7,
      interceptedCount: 2,
      avgRating: 4.89,
      conversionRate: 84,
    },
    weekMetrics: {
      reviewsSent: 22,
      fiveStarCount: 20,
      fourStarCount: 2,
      interceptedCount: 0,
      avgRating: 5.0,
      conversionRate: 90,
    },
    recentActivity: [
      { id: 'act-20', type: 'five_star', customer: 'Divya Nair', time: '25 mins ago', note: '5★ Google Review verified' },
      { id: 'act-w20', type: 'web_deploy', customer: 'ASW UI Designer', time: '40 mins ago', note: 'New Bridal Showcase design uploaded to staging' },
      { id: 'act-21', type: 'sent', customer: 'Nisha Pillai', time: '1 hour ago', note: 'WhatsApp request delivered' },
    ],
    customerPraises: [
      'Incredible hair spa and styling! Staff treated me like royalty 💆‍♀️',
      'Clean aesthetic and great nail art. ⭐',
    ],
    interceptedFeedback: []
  }
]

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

export function createClient({ name, slug, industry, googleReviewUrl, phone, brandColor, websiteDomain, websiteType }) {
  const newSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const directReviewUrl = formatDirectReviewUrl(googleReviewUrl)
  const token = Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4)

  const newClient = {
    id: `client-${Date.now()}`,
    name,
    slug: newSlug,
    industry: industry || 'default',
    phone: phone || '',
    googleReviewUrl: directReviewUrl,
    brandColor: brandColor || '#6366f1',
    status: 'active',
    liveToken: token,
    website: {
      status: 'in_design',
      domain: websiteDomain || `https://${newSlug}.com`,
      stagingUrl: `https://${newSlug}.preview.asw.agency`,
      techStack: 'Next.js 14, Tailwind, Modern Responsive UI',
      type: websiteType || 'Business Showcase & Lead Capture',
      monthlyVisitors: 0,
      speedScore: 99,
      leadsCaptured: 0,
      uptime: '100%',
      ssl: 'Pending Setup ⏳',
      lastDeployed: 'Just created',
      pendingTasks: ['Initial wireframing & moodboard', 'Gather client brand assets & photos'],
    },
    reviewsSent: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    interceptedCount: 0,
    avgRating: 5.0,
    conversionRate: 0,
    monthMetrics: { reviewsSent: 0, fiveStarCount: 0, fourStarCount: 0, interceptedCount: 0, avgRating: 5.0, conversionRate: 0 },
    weekMetrics: { reviewsSent: 0, fiveStarCount: 0, fourStarCount: 0, interceptedCount: 0, avgRating: 5.0, conversionRate: 0 },
    recentActivity: [
      { id: `act-${Date.now()}`, type: 'system', customer: 'System', time: 'Just now', note: 'Client account & website project initialized' }
    ],
    customerPraises: [],
    interceptedFeedback: []
  }
  globalThis._aswClients.unshift(newClient)
  return newClient
}

export function updateWebsiteProject(clientId, updates) {
  const client = getClientById(clientId)
  if (!client) return null
  client.website = { ...client.website, ...updates }
  return client.website
}

export function addDispatchEvent(clientId, customerName, channel) {
  const client = getClientById(clientId)
  if (!client) return
  client.reviewsSent += 1
  if (client.monthMetrics) client.monthMetrics.reviewsSent += 1
  if (client.weekMetrics) client.weekMetrics.reviewsSent += 1

  client.recentActivity.unshift({
    id: `act-${Date.now()}`,
    type: 'sent',
    customer: customerName,
    time: 'Just now',
    note: `${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} review request dispatched`
  })
}

export function recordClientReview(slug, stars, comment = '', quickTags = [], customerName = 'Customer') {
  const client = getClientBySlug(slug)
  if (!client) return

  if (stars >= 4) {
    if (stars === 5) {
      client.fiveStarCount += 1
      if (client.monthMetrics) client.monthMetrics.fiveStarCount += 1
      if (client.weekMetrics) client.weekMetrics.fiveStarCount += 1
    }
    if (stars === 4) {
      client.fourStarCount += 1
      if (client.monthMetrics) client.monthMetrics.fourStarCount += 1
      if (client.weekMetrics) client.weekMetrics.fourStarCount += 1
    }
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
    if (client.monthMetrics) client.monthMetrics.interceptedCount += 1
    if (client.weekMetrics) client.weekMetrics.interceptedCount += 1

    client.recentActivity.unshift({
      id: `act-${Date.now()}`,
      type: 'intercepted',
      customer: customerName,
      time: 'Just now',
      note: `${stars}★ Shielded privately (${quickTags[0] || 'Customer issue'})`
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

  const totalRatings = (client.fiveStarCount * 5) + (client.fourStarCount * 4) + (client.interceptedCount * 2)
  const totalCount = client.fiveStarCount + client.fourStarCount + client.interceptedCount
  if (totalCount > 0) {
    client.avgRating = Math.round((totalRatings / totalCount) * 100) / 100
  }
}
