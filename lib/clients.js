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

// -------------------------------------------------------------
// POTENTIAL CLIENTS (PROSPECTS & PIPELINE STORE)
// -------------------------------------------------------------

let defaultProspects = [
  {
    id: "prospect-1",
    businessName: "Amazing Beauty Salon",
    contactName: "Pooja Sharma",
    contactRole: "Salon Head / Manager",
    phone: "+91 98230 44551",
    email: "pooja@amazingbeauty.in",
    industry: "salon",
    city: "Bavdhan, Pune",
    googleReviewUrl: "",
    currentRating: 3.6,
    currentReviewsCount: 85,
    websiteStatus: "No Website (Only Justdial listing)",
    painPoints: ["Negative reviews about wait times", "No online appointment booking"],
    targetPitch: "Private Feedback Vault + Luxury Salon Showcase Website with Online Slot Booking",
    estimatedValue: "₹35,000 upfront + ₹3,000/mo",
    stage: "pitch_sent",
    opportunity: "hot",
    lastContact: "Yesterday",
    notes: "3.6 rating with 85 reviews is hurting footfall from new Bavdhan residents. Ready for demo."
  },
  {
    id: "prospect-2",
    businessName: "Kothrud Fitness (VCPL Fit)",
    contactName: "Sachin More",
    contactRole: "Gym Manager",
    phone: "+91 98221 88992",
    email: "sachin@kothrudfitness.com",
    industry: "fitness",
    city: "Paud Road, Kothrud, Pune",
    googleReviewUrl: "",
    currentRating: 3.6,
    currentReviewsCount: 24,
    websiteStatus: "No Website (Only Facebook page)",
    painPoints: ["Low review count", "2 bad reviews dropped rating below 4.0", "Losing new gym memberships"],
    targetPitch: "QR Check-in Review Gating + Gym Tour & Membership Lead Funnel Website",
    estimatedValue: "₹30,000 upfront + ₹2,500/mo",
    stage: "demo_scheduled",
    opportunity: "hot",
    lastContact: "Today, 11:00 AM",
    notes: "Manager wants to shield equipment complaints and get more trial pass leads."
  },
  {
    id: "prospect-3",
    businessName: "Smita Divine Beauty Salon & Academy",
    contactName: "Smita Patil",
    contactRole: "Founder",
    phone: "+91 98900 11223",
    email: "smita@smitadivine.in",
    industry: "salon",
    city: "Bhandarkar Road, Pune",
    googleReviewUrl: "",
    currentRating: 3.6,
    currentReviewsCount: 64,
    websiteStatus: "Outdated static page without SSL",
    painPoints: ["Students and salon clients mixed reviews", "SSL security warning on browser"],
    targetPitch: "Academy Student Portal + VIP Salon Lookbook + Review Separation Shield",
    estimatedValue: "₹45,000 upfront + ₹4,000/mo",
    stage: "follow_up",
    opportunity: "hot",
    lastContact: "2 days ago",
    notes: "Follow up with screenshot of Glow Salon live portal."
  },
  {
    id: "prospect-4",
    businessName: "P-Zzzas",
    contactName: "Kunal Kapoor",
    contactRole: "Partner",
    phone: "+91 98205 66778",
    email: "kunal@pzzzas.in",
    industry: "restaurant",
    city: "Koregaon Park, Pune",
    googleReviewUrl: "",
    currentRating: 3.7,
    currentReviewsCount: 142,
    websiteStatus: "Aggregator link only (No direct website)",
    painPoints: ["Delivery temperature complaints dragging dine-in rating", "Paying 28% Zomato commissions"],
    targetPitch: "Direct Online Ordering Website (0% Commission) + Post-Delivery Review Gating",
    estimatedValue: "₹50,000 upfront + ₹4,500/mo",
    stage: "pitch_sent",
    opportunity: "hot",
    lastContact: "May 30, 2026",
    notes: "Owner hates high commissions and bad delivery ratings on Google."
  },
  {
    id: "prospect-5",
    businessName: "Yogi Tree Restaurant & Cafe",
    contactName: "Arun Malhotra",
    contactRole: "Manager",
    phone: "+91 98231 77884",
    email: "arun@yogitreecafe.com",
    industry: "restaurant",
    city: "Lane A, Koregaon Park, Pune",
    googleReviewUrl: "",
    currentRating: 3.7,
    currentReviewsCount: 310,
    websiteStatus: "Legacy Flash/PHP site (Unusable on mobile)",
    painPoints: ["Rush hour delays causing 1-star reviews", "Menu unreadable on smartphones"],
    targetPitch: "Mobile-First Digital QR Menu + Table Reservation System + Rating Recovery Engine",
    estimatedValue: "₹40,000 upfront + ₹3,500/mo",
    stage: "new",
    opportunity: "hot",
    lastContact: "Just added",
    notes: "Iconic cafe in KP with high tourist footfall suffering from 3.7 rating."
  },
  {
    id: "prospect-6",
    businessName: "Iron Sanctuary Gym",
    contactName: "Rohit Deshmukh",
    contactRole: "Head Trainer",
    phone: "+91 98500 33445",
    email: "rohit@ironsanctuary.in",
    industry: "fitness",
    city: "Paud Road, Kothrud, Pune",
    googleReviewUrl: "",
    currentRating: 3.7,
    currentReviewsCount: 101,
    websiteStatus: "Outdated Wix template (6.2s load time)",
    painPoints: ["Equipment maintenance complaints public on Google", "No free trial pass capture system"],
    targetPitch: "High-Speed Next.js Lead Funnel + Automated 1-Day Trial Pass SMS + In-Gym Review Gating",
    estimatedValue: "₹35,000 upfront + ₹3,000/mo",
    stage: "pitch_sent",
    opportunity: "high",
    lastContact: "Yesterday",
    notes: "Sent WhatsApp pitch linking to trial funnel concept."
  },
  {
    id: "prospect-7",
    businessName: "Tbs Pizza & Grills",
    contactName: "Rohan Gupta",
    contactRole: "Store Incharge",
    phone: "+91 98600 55667",
    email: "rohan@tbsgrills.in",
    industry: "restaurant",
    city: "Rajaram Park, Koregaon Park, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 185,
    websiteStatus: "No custom domain (Relies on food portals)",
    painPoints: ["Delivery transit time complaints on Google", "No direct online table or takeout ordering"],
    targetPitch: "Direct Takeaway & Table Booking Portal + Review Shielding WhatsApp Bot",
    estimatedValue: "₹38,000 upfront + ₹3,000/mo",
    stage: "follow_up",
    opportunity: "high",
    lastContact: "2 days ago",
    notes: "Interested in table booking module."
  },
  {
    id: "prospect-8",
    businessName: "Ganesh Bhel",
    contactName: "Nitin Gudgila",
    contactRole: "Franchise Owner",
    phone: "+91 98220 99881",
    email: "nitin@ganeshbhelbaner.com",
    industry: "restaurant",
    city: "Baner Road, Baner, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 220,
    websiteStatus: "Informational static page (No ordering or feedback)",
    painPoints: ["Cleanliness and queue complaints on busy evenings", "Losing corporate party orders"],
    targetPitch: "Corporate Bulk Order Portal + Digital Counter QR Review Filter",
    estimatedValue: "₹30,000 upfront + ₹2,500/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "High volume brand. Needs corporate bulk catering portal."
  },
  {
    id: "prospect-9",
    businessName: "Optimum Health Club",
    contactName: "Gaurav Shinde",
    contactRole: "Owner",
    phone: "+91 98233 11220",
    email: "gaurav@optimumfit.in",
    industry: "fitness",
    city: "Above Reliance Fresh, Kothrud, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 43,
    websiteStatus: "No Website",
    painPoints: ["Low review footprint", "Newer chain gyms taking away members", "Zero digital presence"],
    targetPitch: "Modern Fitness Showcase Website + WhatsApp Auto-Review Trigger on Biometric Exit",
    estimatedValue: "₹35,000 upfront + ₹2,500/mo",
    stage: "pitch_sent",
    opportunity: "high",
    lastContact: "Yesterday",
    notes: "Prime location above Reliance Fresh. Owner agrees 43 reviews is too low."
  },
  {
    id: "prospect-10",
    businessName: "Peshwa Restaurant",
    contactName: "Anand Joshi",
    contactRole: "Owner",
    phone: "+91 98224 55661",
    email: "anand@peshwafcroad.com",
    industry: "restaurant",
    city: "FC Road, Deccan, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 410,
    websiteStatus: "No Website",
    painPoints: ["Peak morning Misal rush causes long queues and 2-star reviews", "Tourists skip 3.8 rating"],
    targetPitch: "Live Queue Token Status Web App + Tabletop QR Review Gating",
    estimatedValue: "₹40,000 upfront + ₹3,500/mo",
    stage: "demo_scheduled",
    opportunity: "hot",
    lastContact: "Today, 2:00 PM",
    notes: "Owner eager to see queue token demo on phone."
  },
  {
    id: "prospect-11",
    businessName: "Aaoji Khhaoji Thali",
    contactName: "Harpreet Singh",
    contactRole: "General Manager",
    phone: "+91 98238 77665",
    email: "harpreet@aaojikhhaoji.in",
    industry: "restaurant",
    city: "Near JM Road / FC Road, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 890,
    websiteStatus: "Slow WordPress blog (5.8s load time)",
    painPoints: ["Viral food concept hurt by wait time complaints", "High viral search but low Google rating"],
    targetPitch: "High-Performance Next.js Food Showcase + Instant Private Feedback System",
    estimatedValue: "₹50,000 upfront + ₹4,500/mo",
    stage: "follow_up",
    opportunity: "hot",
    lastContact: "Yesterday",
    notes: "Huge viral brand in Pune. Perfect candidate for review gating."
  },
  {
    id: "prospect-12",
    businessName: "Meridian Ice Cream & Desserts",
    contactName: "Deepak Oswal",
    contactRole: "Store Owner",
    phone: "+91 98227 44332",
    email: "deepak@meridianicecream.in",
    industry: "retail",
    city: "FC Road, Pune",
    googleReviewUrl: "",
    currentRating: 3.8,
    currentReviewsCount: 290,
    websiteStatus: "No Website",
    painPoints: ["Flavor stockout complaints", "No digital gift box ordering portal"],
    targetPitch: "Luxury Ice Cream Flavors Digital Showcase + Post-Billing WhatsApp Review Request",
    estimatedValue: "₹28,000 upfront + ₹2,000/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "FC Road landmark. Wants to sell pre-packed tubs online."
  },
  {
    id: "prospect-13",
    businessName: "The Lotus Bistro",
    contactName: "Sameer Sen",
    contactRole: "Managing Partner",
    phone: "+91 98209 88112",
    email: "sameer@lotusbistrokp.com",
    industry: "restaurant",
    city: "Lane 5, Koregaon Park, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 215,
    websiteStatus: "No custom domain (Outdated social links)",
    painPoints: ["High check size (₹1500 for two) leads to high expectations", "Small flaws become 2-star reviews"],
    targetPitch: "Glassmorphic Fine-Dine Website + Private VIP Feedback Interceptor",
    estimatedValue: "₹45,000 upfront + ₹4,000/mo",
    stage: "pitch_sent",
    opportunity: "high",
    lastContact: "Yesterday",
    notes: "Pitched executive reputation management. Awaiting response."
  },
  {
    id: "prospect-14",
    businessName: "Street Side Cafe",
    contactName: "Kunal Bhalerao",
    contactRole: "Owner",
    phone: "+91 98226 33990",
    email: "kunal@streetsidecafekp.com",
    industry: "restaurant",
    city: "Lane 5, Koregaon Park, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 140,
    websiteStatus: "No Website",
    painPoints: ["No digital menu", "1-star reviews for table wait times"],
    targetPitch: "QR Digital Touch Menu + Table Reservation Web App + 5★ Google Booster",
    estimatedValue: "₹35,000 upfront + ₹3,000/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "Very popular veg cafe in KP. Needs digital menu QR."
  },
  {
    id: "prospect-15",
    businessName: "Swaadesi Restaurant",
    contactName: "Virendra Singh",
    contactRole: "Manager",
    phone: "+91 98235 44119",
    email: "virendra@swaadesibaner.com",
    industry: "restaurant",
    city: "Baner Road, Baner, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 380,
    websiteStatus: "Slow template site with broken reservation forms",
    painPoints: ["Losing Baner IT crowd to Maratha Samrat (4.4★)", "Online reservation form sends leads into spam"],
    targetPitch: "Enterprise Next.js Table Booking System + Corporate Lunch Event Lead Funnel + Review Gating",
    estimatedValue: "₹45,000 upfront + ₹4,000/mo",
    stage: "follow_up",
    opportunity: "high",
    lastContact: "3 days ago",
    notes: "Baner IT companies book lunches here. Needs corporate booking funnel."
  },
  {
    id: "prospect-16",
    businessName: "PMSC Multi Cuisine Restaurant",
    contactName: "Prashant Mane",
    contactRole: "Owner",
    phone: "+91 98230 77112",
    email: "prashant@pmscbaner.in",
    industry: "restaurant",
    city: "Baner, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 195,
    websiteStatus: "No Website",
    painPoints: ["Weekend family crowd complaints on AC and parking", "Rating stuck under 4.0 for over 6 months"],
    targetPitch: "Family Dining Web Portal + Tabletop NFC Cards + Review Shield",
    estimatedValue: "₹38,000 upfront + ₹3,000/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "Wants to cross 4.0★ milestone."
  },
  {
    id: "prospect-17",
    businessName: "Makrana Restaurant",
    contactName: "Imran Makrani",
    contactRole: "Owner",
    phone: "+91 98228 99001",
    email: "imran@makranabaner.in",
    industry: "restaurant",
    city: "Baner, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 160,
    websiteStatus: "No Website",
    painPoints: ["Delivery orders getting mixed with dine-in reviews", "Rating stagnating"],
    targetPitch: "Online Food Catalog + Automated Review Dispatch on Order Delivery",
    estimatedValue: "₹32,000 upfront + ₹2,500/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "Non-veg casual diner in Baner."
  },
  {
    id: "prospect-18",
    businessName: "Bharat Vyanjanam",
    contactName: "K. Ramanathan",
    contactRole: "Partner",
    phone: "+91 98401 22334",
    email: "ramanathan@bharatvyanjanam.com",
    industry: "restaurant",
    city: "Baner, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 275,
    websiteStatus: "Basic Google Business Site only",
    painPoints: ["Breakfast peak crowd wait times", "Google Business free website shutting down/deprecating"],
    targetPitch: "Modern Responsive South Indian Cuisine Website + Breakfast Pre-order Web App",
    estimatedValue: "₹35,000 upfront + ₹3,000/mo",
    stage: "pitch_sent",
    opportunity: "high",
    lastContact: "Yesterday",
    notes: "Pitching replacement for deprecated Google Business site."
  },
  {
    id: "prospect-19",
    businessName: "Capital Saloon",
    contactName: "Mahesh Salunkhe",
    contactRole: "Proprietor",
    phone: "+91 98221 66554",
    email: "mahesh@capitalsaloon.com",
    industry: "salon",
    city: "Kothrud, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 628,
    websiteStatus: "No Website (Only Justdial listing)",
    painPoints: ["Huge footfall (628 reviews) but queue wait times drag score to 3.9", "Lost upscale clientele"],
    targetPitch: "Appointment Scheduling Web App + Post-Haircut WhatsApp 5★ Prompt",
    estimatedValue: "₹40,000 upfront + ₹3,500/mo",
    stage: "demo_scheduled",
    opportunity: "hot",
    lastContact: "Today, 12:30 PM",
    notes: "Mahesh wants appointment app to eliminate shop overcrowding on weekends."
  },
  {
    id: "prospect-20",
    businessName: "Lalit Mahal Restaurant",
    contactName: "Suresh Hegde",
    contactRole: "Managing Partner",
    phone: "+91 98225 11009",
    email: "suresh@lalitmahal.com",
    industry: "restaurant",
    city: "FC Road / Deccan, Pune",
    googleReviewUrl: "",
    currentRating: 3.9,
    currentReviewsCount: 540,
    websiteStatus: "No Website",
    painPoints: ["Heavy student rush", "No digital takeaway ordering", "Students post fast critical reviews"],
    targetPitch: "Student Meal Subscription & Takeaway Web App + Fast QR Review Shield",
    estimatedValue: "₹38,000 upfront + ₹3,000/mo",
    stage: "new",
    opportunity: "medium",
    lastContact: "Just added",
    notes: "High volume student diner on FC Road."
  }
]

if (!globalThis._aswProspects) {
  globalThis._aswProspects = defaultProspects
}

export function getAllProspects() {
  return globalThis._aswProspects
}

export function createProspect(data) {
  const newProspect = {
    id: `prospect-${Date.now()}`,
    businessName: data.businessName || 'New Prospect',
    contactName: data.contactName || '',
    contactRole: data.contactRole || 'Owner',
    phone: data.phone || '',
    email: data.email || '',
    industry: data.industry || 'general',
    city: data.city || 'India',
    googleReviewUrl: data.googleReviewUrl || '',
    currentRating: Number(data.currentRating) || 4.0,
    currentReviewsCount: Number(data.currentReviewsCount) || 10,
    websiteStatus: data.websiteStatus || 'Needs evaluation',
    painPoints: data.painPoints || [],
    targetPitch: data.targetPitch || 'Website Redesign + Review Acceleration',
    estimatedValue: data.estimatedValue || '₹30,000',
    stage: data.stage || 'new',
    opportunity: data.opportunity || 'high',
    lastContact: 'Just added',
    notes: data.notes || '',
  }
  globalThis._aswProspects.unshift(newProspect)
  return newProspect
}

export function updateProspect(id, updates) {
  const p = globalThis._aswProspects.find(item => item.id === id)
  if (!p) return null
  Object.assign(p, updates)
  return p
}

export function convertProspectToClient(prospectId) {
  const p = globalThis._aswProspects.find(item => item.id === prospectId)
  if (!p) return null
  p.stage = 'won'

  // Create active client in system
  const client = createClient({
    name: p.businessName,
    industry: p.industry,
    phone: p.phone,
    googleReviewUrl: p.googleReviewUrl,
    websiteDomain: `https://${p.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    websiteType: p.targetPitch,
  })

  return { prospect: p, client }
}

