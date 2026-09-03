'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

// Industry-specific quick tags for positive AI drafting
const QUICK_TAGS_MAP = {
  restaurant: ['Delicious Food! 🍕', 'Super Fast Service! ⚡', 'Polite Staff! 😊', 'Great Ambiance! ✨', 'Value for Money! 💰', 'Authentic Taste! 🌟', 'Clean & Hygienic! 🧼'],
  cafe: ['Amazing Coffee! ☕', 'Cozy Vibe! 🏡', 'Friendly Staff! 😊', 'Delicious Pastries! 🥐', 'Fast WiFi & Seating! 💻'],
  salon: ['Loved My Haircut! 💇', 'Pampered Experience! 💅', 'Skilled Stylist! ✨', 'Clean Salon! 🌸', 'Courteous Staff! 😊'],
  beauty: ['Fantastic Glow & Results! ✨', 'Professional Staff! 👑', 'Clean & Comfy! 🌸', 'Great Products! 🧴'],
  fitness: ['Great Equipment! 🏋️', 'Helpful Trainers! 💪', 'Spacious & Clean! 🧼', 'Motivating Vibe! ⚡', 'Great Community! 🤝'],
  gym: ['Great Equipment! 🏋️', 'Helpful Trainers! 💪', 'Spacious & Clean! 🧼', 'Motivating Vibe! ⚡', 'Great Community! 🤝'],
  medical: ['Professional Team! 👨‍⚕️', 'Quick & Efficient! ⚡', 'Very Thorough! 📋', 'Comfortable Experience! 😌'],
  dental: ['Painless Treatment! 😌', 'Great Dentist! 🦷', 'Clean Clinic! ✨', 'Very Professional! 👨‍⚕️'],
  retail: ['Great Collection! 🛍️', 'Helpful Staff! 😊', 'Fair Prices! 💰', 'Easy Checkout! ⚡'],
  hotel: ['Loved the Room! 🛏️', 'Amazing Service! ⭐', 'Great Location! 📍', 'Will Return! 🔁'],
  default: ['Great Service! ⭐', 'Friendly Staff! 😊', 'Highly Recommend! 👍', 'Will Return! 🔁'],
}

// Confetti launch for gamified design
function launchConfetti() {
  if (typeof document === 'undefined') return
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#38bdf8']
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 40 + 20}vh;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.4}s;
      animation-duration: ${1 + Math.random()}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(piece)
    setTimeout(() => piece.remove(), 2500)
  }
}

function ReviewFunnelContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug

  const [business, setBusiness] = useState(null)
  const [design, setDesign] = useState('gamified')
  const [quickTags, setQuickTags] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Funnel steps: 'rating' | 'positive-ai' | 'negative' | 'thanks-negative'
  const [step, setStep] = useState('rating')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  
  // RevMe AI drafting state
  const [selectedTags, setSelectedTags] = useState([])
  const [tone, setTone] = useState('enthusiastic') // 'enthusiastic' | 'concise' | 'detailed'
  const [customNotes, setCustomNotes] = useState('')
  const [aiDraft, setAiDraft] = useState('')
  const [generatingDraft, setGeneratingDraft] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Negative feedback private state
  const [negativeTags, setNegativeTags] = useState([])
  const [comment, setComment] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const customerName = searchParams.get('name') || ''
  const requestId = searchParams.get('rid') || ''

  useEffect(() => {
    // Track click
    if (requestId) {
      fetch('/api/funnel/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      }).catch(() => {})
    }

    // Fetch business + design
    fetch(`/api/funnel/design?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        setBusiness(d.business)
        setDesign(d.design || 'gamified')
        const ind = (d.business?.industry || 'default').toLowerCase()
        setQuickTags(QUICK_TAGS_MAP[ind] || QUICK_TAGS_MAP.default)
        setLoading(false)
      })
      .catch(() => {
        // Fallback demo
        setBusiness({
          name: 'Peshwa Restaurant',
          logoUrl: null,
          industry: 'restaurant',
          googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJPeshwaDeccanPlaceId',
          brandColor: '#38bdf8',
          ctaButtonText: 'Share Your Experience',
        })
        setDesign('gamified')
        setQuickTags(QUICK_TAGS_MAP.restaurant)
        setLoading(false)
      })
  }, [slug, requestId])

  // Call the AI review draft API
  const requestAiReviewDraft = async (tags, toneChoice, notes, ratingNum = selectedStar || 5) => {
    if (!business?.name) return
    setGeneratingDraft(true)
    try {
      const res = await fetch('/api/funnel/draft-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: business.name,
          industry: business.industry || 'restaurant',
          rating: ratingNum,
          selectedTags: tags,
          customNotes: notes,
          tone: toneChoice
        }),
      })
      const data = await res.json()
      if (data.review) {
        setAiDraft(data.review)
      }
    } catch (e) {
      console.error('Draft generation error:', e)
    } finally {
      setGeneratingDraft(false)
    }
  }

  // Handle initial star tap
  const handleStarClick = (star) => {
    setSelectedStar(star)
    if (star >= 4) {
      launchConfetti()
      setStep('positive-ai')
      // Auto generate initial review draft with first 2 popular tags
      const initialTags = (quickTags.length > 0 ? [quickTags[0], quickTags[1]] : ['Great service! ⭐', 'Friendly staff! 😊']).filter(Boolean)
      setSelectedTags(initialTags)
      requestAiReviewDraft(initialTags, tone, customNotes, star)
    } else {
      setStep('negative')
    }
  }

  // Toggle positive tags
  const togglePositiveTag = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(updated)
    requestAiReviewDraft(updated, tone, customNotes, selectedStar)
  }

  // Change tone
  const changeTone = (newTone) => {
    setTone(newTone)
    requestAiReviewDraft(selectedTags, newTone, customNotes, selectedStar)
  }

  // 1-TAP COPY & OPEN GOOGLE (THE VIRAL REEL FEATURE)
  const handleCopyAndOpenGoogle = () => {
    if (!aiDraft) return

    // Copy to clipboard
    navigator.clipboard.writeText(aiDraft).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
    }).catch(() => {
      // Fallback copy
      const el = document.createElement('textarea')
      el.value = aiDraft
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
    })

    // Track platform conversion
    fetch('/api/funnel/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        requestId,
        starRating: selectedStar,
        platformRedirected: 'google',
        customerName,
        reviewDraft: aiDraft
      }),
    }).catch(() => {})

    // Open business's Google Review URL
    const googleUrl = business?.googleReviewUrl || 'https://search.google.com/local/writereview'
    window.open(googleUrl, '_blank')
  }

  // Submit private 1-3 star feedback to Vault
  const submitNegativeFeedback = async () => {
    setSubmitting(true)
    await fetch('/api/funnel/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        requestId,
        starRating: selectedStar,
        quickTags: negativeTags,
        comment: `${comment} ${customerContact ? `[Customer Contact: ${customerContact}]` : ''}`.trim(),
        customerName,
      }),
    }).catch(() => {})
    setStep('thanks-negative')
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="funnel-page" style={{ background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
          <p style={{ color: '#94a3b8' }}>Loading review portal...</p>
        </div>
      </div>
    )
  }

  const displayStar = hoveredStar || selectedStar

  return (
    <div className="funnel-page funnel-gamified" style={{ background: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      
      {/* Background ambient liquid glass glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="funnel-card" style={{
        maxWidth: 500,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 28,
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)',
        padding: '36px 28px',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Business Branding */}
        {business?.logoUrl ? (
          <img src={business.logoUrl} alt={business.name} className="funnel-business-logo" />
        ) : (
          <div style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            margin: '0 auto 18px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            boxShadow: '0 8px 30px rgba(56, 189, 248, 0.25)',
          }}>
            ⭐
          </div>
        )}

        {/* STEP 1: INITIAL STAR RATING */}
        {step === 'rating' && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              {business?.name}
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 28px 0' }}>
              {customerName ? `Hi ${customerName}! ` : ''}How was your experience with us today?
            </p>

            {/* Star Row */}
            <div className="star-row" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${star <= displayStar ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => handleStarClick(star)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  style={{
                    fontSize: 44,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transform: star <= displayStar ? 'scale(1.2)' : 'scale(1)',
                    filter: star <= displayStar ? 'none' : 'grayscale(1) opacity(0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>

            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Tap a star to rate your visit
            </p>
          </>
        )}

        {/* STEP 2: POSITIVE (4-5★) -> REVME AI AUTO-GENERATOR + 1-TAP COPY & GOOGLE OPEN */}
        {step === 'positive-ai' && (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '4px 12px', borderRadius: 980, color: '#4ade80', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
              <span>🎉</span>
              <span>{selectedStar} Star Rating</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              Let AI Draft Your Review ✨
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 18px 0' }}>
              Tap what you enjoyed — our AI writes the perfect review for Google Maps in 1 click!
            </p>

            {/* Quick Sentiment Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {quickTags.map(tag => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => togglePositiveTag(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 980,
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#38bdf8' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Tone Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              {[
                { id: 'enthusiastic', label: '🔥 Enthusiastic' },
                { id: 'concise', label: '⚡ Short & Sweet' },
                { id: 'detailed', label: '📝 Detailed' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => changeTone(t.id)}
                  className={`revme-tone-pill ${tone === t.id ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* AI Generated Review Card (Editable) */}
            <div className="revme-ai-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>✨</span> AI Drafted Review
                </span>

                <button
                  onClick={() => requestAiReviewDraft(selectedTags, tone, customNotes, selectedStar)}
                  disabled={generatingDraft}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  title="Generate a new variation"
                >
                  <span style={{ display: 'inline-block', transform: generatingDraft ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s ease' }}>🔄</span>
                  <span>{generatingDraft ? 'Drafting...' : 'Regenerate'}</span>
                </button>
              </div>

              {generatingDraft ? (
                <div style={{ minHeight: 85, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, gap: 8 }}>
                  <span>Writing authentic review...</span>
                </div>
              ) : (
                <textarea
                  value={aiDraft}
                  onChange={e => setAiDraft(e.target.value)}
                  placeholder="Generating review..."
                  className="revme-review-textarea"
                />
              )}
            </div>

            {/* Copy Feedback Toast */}
            {copied && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: 12,
                padding: '10px 14px',
                color: '#4ade80',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}>
                <span>✅</span> Review copied! Opening Google Maps — just paste & hit post!
              </div>
            )}

            {/* PRIMARY 1-TAP ACTION (THE REEL MECHANISM) */}
            <button
              onClick={handleCopyAndOpenGoogle}
              className="revme-copy-btn"
            >
              <span>📋</span>
              <span>Copy Review & Open Google Maps ↗</span>
            </button>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I just visited ${business?.name} and had a 5-star experience! Check them out: ${typeof window !== 'undefined' ? window.location.origin : ''}/review/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#94a3b8',
                fontSize: 12,
                textDecoration: 'none',
                marginTop: 8,
                padding: '8px',
                borderRadius: 8,
                transition: 'color 0.2s'
              }}
            >
              <span>💬</span> Recommend to friends on WhatsApp
            </a>
          </div>
        )}

        {/* STEP 3: NEGATIVE RATING (1-3★) -> PRIVATE SHIELD / DIRECT TO OWNER */}
        {step === 'negative' && (
          <div>
            <div style={{ fontSize: 44, marginBottom: 12 }}>😔</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              We're Sorry Your Visit Wasn't 5 Stars
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              We take customer satisfaction seriously. Please tell the owner privately what went wrong so we can make it right immediately — this is 100% private and never published online.
            </p>

            {/* Issue Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {['Slow service ⏳', 'Food / Quality 🍲', 'Wait time ⏱️', 'Cleanliness 🧹', 'Staff attitude 😠', 'Billing / Price 💳', 'Other'].map(tag => {
                const isSelected = negativeTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => setNegativeTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 980,
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1px solid rgba(251, 113, 133, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(251, 113, 133, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#fb7185' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Private Comment Area */}
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="What can we improve? (Stay private with management)"
              style={{
                width: '100%',
                borderRadius: 14,
                padding: '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: 13,
                lineHeight: 1.5,
                resize: 'vertical',
                minHeight: 80,
                outline: 'none',
                marginBottom: 12,
                boxSizing: 'border-box'
              }}
            />

            {/* Contact for Management Follow-up */}
            <input
              type="text"
              value={customerContact}
              onChange={e => setCustomerContact(e.target.value)}
              placeholder="Your Phone or Email (optional, so owner can resolve this)"
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
                marginBottom: 16,
                boxSizing: 'border-box'
              }}
            />

            <button
              onClick={submitNegativeFeedback}
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700 }}
            >
              {submitting ? 'Submitting...' : 'Submit Private Feedback to Owner'}
            </button>
          </div>
        )}

        {/* STEP 4: NEGATIVE SUBMITTED ACKNOWLEDGEMENT */}
        {step === 'thanks-negative' && (
          <div>
            <div style={{ fontSize: 50, marginBottom: 14 }}>🙏</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
              Thank You For Letting Us Know
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Your feedback has been sent directly to the owner and management team. We take this seriously and are taking steps to improve.
            </p>
            <div style={{ marginTop: 24, fontSize: 32 }}>💙</div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ReviewFunnelPage() {
  return (
    <Suspense fallback={
      <div className="funnel-page" style={{ background: '#000000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ReviewFunnelContent />
    </Suspense>
  )
}
