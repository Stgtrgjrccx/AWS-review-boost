'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

// Industry-specific quick tags (matches lib/gemini.js)
const QUICK_TAGS_MAP = {
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

// Map design type to CSS class
const DESIGN_CLASS = {
  warm: 'funnel-warm',
  social: 'funnel-social',
  clean: 'funnel-clean',
  gamified: 'funnel-gamified',
}

// Text color per design
const TEXT_COLOR = {
  warm: '#2d1b00',
  social: '#ffffff',
  clean: '#111',
  gamified: '#ffffff',
}

// Confetti launch for gamified design
function launchConfetti(canvas) {
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: ${window.innerHeight * 0.5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${1 + Math.random()}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `
    document.body.appendChild(piece)
    setTimeout(() => piece.remove(), 2500)
  }
}

function ReviewFunnelContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { slug } = params

  const [business, setBusiness] = useState(null)
  const [design, setDesign] = useState('clean')
  const [quickTags, setQuickTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('rating') // rating | negative | thanks-positive | thanks-negative
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState('')
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
        setDesign(d.design || 'clean')
        const industry = d.business?.industry || 'default'
        setQuickTags(QUICK_TAGS_MAP[industry] || QUICK_TAGS_MAP.default)
        setLoading(false)
      })
      .catch(() => {
        // Mock data for preview
        setBusiness({
          name: 'Demo Business',
          logoUrl: null,
          industry: 'restaurant',
          googleReviewUrl: '#',
          yelpUrl: null,
          tripadvisorUrl: null,
          brandColor: '#6366f1',
          ctaButtonText: 'Share Your Experience',
        })
        setDesign('gamified')
        setQuickTags(QUICK_TAGS_MAP.restaurant)
        setLoading(false)
      })
  }, [slug, requestId])

  const handleStarClick = (star) => {
    setSelectedStar(star)
    if (star >= 4) {
      // Launch confetti for gamified design on high rating
      if (design === 'gamified') launchConfetti()
      setStep('thanks-positive')
    } else {
      setStep('negative')
    }
  }

  const submitNegativeFeedback = async () => {
    setSubmitting(true)
    await fetch('/api/funnel/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        requestId,
        starRating: selectedStar,
        quickTags: selectedTags,
        comment,
        customerName,
      }),
    }).catch(() => {})
    setStep('thanks-negative')
    setSubmitting(false)
  }

  const trackPlatformClick = (platform) => {
    fetch('/api/funnel/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug, requestId,
        starRating: selectedStar,
        platformRedirected: platform,
        customerName,
      }),
    }).catch(() => {})
  }

  const designClass = DESIGN_CLASS[design] || 'funnel-clean'
  const textColor = TEXT_COLOR[design] || '#111'
  const brandColor = business?.brandColor || '#6366f1'

  if (loading) {
    return (
      <div className="funnel-page" style={{ background: '#0a0a0f' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const displayStar = hoveredStar || selectedStar

  return (
    <>
      {/* Language auto-detect meta */}
      <style>{`
        :root { --funnel-brand: ${brandColor}; }
        .funnel-submit-btn { background: ${brandColor}; color: white; }
        .funnel-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .star-btn.active { filter: grayscale(0) opacity(1); }
      `}</style>

      <div className={`funnel-page ${designClass}`}>
        {/* Social proof counter for 'social' design */}
        {design === 'social' && (
          <div style={{ position: 'absolute', top: 24, left: 0, right: 0, textAlign: 'center' }}>
            <span className="social-proof-counter">
              ⭐ 500+ happy customers have shared their experience
            </span>
          </div>
        )}

        <div className="funnel-card">
          {/* Business branding */}
          {business?.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="funnel-business-logo" />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: '0 auto 20px',
              background: `linear-gradient(135deg, ${brandColor}, ${brandColor}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, boxShadow: `0 8px 32px ${brandColor}40`,
            }}>
              ⭐
            </div>
          )}

          {/* STEP: Rating */}
          {step === 'rating' && (
            <>
              <h1 className="funnel-business-name" style={{ color: textColor }}>
                {business?.name}
              </h1>
              <p className="funnel-tagline" style={{ color: textColor }}>
                {customerName ? `Hi ${customerName}! ` : ''}How was your experience?
              </p>

              {/* Animated star row */}
              <div className="star-row">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star-btn ${star <= displayStar ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleStarClick(star)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    style={{
                      transform: star <= displayStar ? 'scale(1.2)' : star === displayStar + 1 ? 'scale(1.05)' : 'scale(1)',
                      filter: star <= displayStar ? 'none grayscale(0)' : 'grayscale(1) opacity(0.35)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <p style={{ fontSize: 13, color: textColor, opacity: 0.5, marginTop: -16 }}>
                Tap a star to rate
              </p>
            </>
          )}

          {/* STEP: Negative Feedback Form */}
          {step === 'negative' && (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8, color: textColor }}>
                We're sorry to hear that
              </h2>
              <p style={{ fontSize: 14, color: textColor, opacity: 0.7, marginBottom: 24 }}>
                Your feedback helps us improve. Please tell us what went wrong — this stays private.
              </p>

              {/* Quick tags */}
              <div className="quick-tags">
                {['Slow service ⏳', 'Poor quality 😞', 'Unfriendly staff 😠', 'Dirty environment 🧹', 'Wrong order ❌', 'Other'].map(tag => (
                  <button
                    key={tag}
                    className={`quick-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                    style={{ color: design === 'social' || design === 'gamified' ? 'white' : 'inherit' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us more (optional)..."
                style={{
                  width: '100%', borderRadius: 12, padding: '12px 16px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.5)',
                  fontSize: 14, lineHeight: 1.5, resize: 'vertical',
                  minHeight: 80, outline: 'none', color: '#111',
                }}
              />

              <button
                onClick={submitNegativeFeedback}
                className="funnel-submit-btn"
                disabled={submitting}
                style={{ marginTop: 16 }}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </>
          )}

          {/* STEP: Positive Thanks — drive to Google/Yelp */}
          {step === 'thanks-positive' && (
            <>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8, color: textColor }}>
                Thank you so much!
              </h2>
              <p style={{ fontSize: 15, color: textColor, opacity: 0.75, marginBottom: 28 }}>
                We're so glad you loved it! Would you mind sharing your experience online? It takes just 30 seconds and means the world to us. 🙏
              </p>

              {/* Google — Primary CTA */}
              <a
                href={business?.googleReviewUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="google-btn"
                onClick={() => trackPlatformClick('google')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" opacity=".8"/>
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".8"/>
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity=".8"/>
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity=".8"/>
                </svg>
                ⭐ Leave a Google Review
              </a>

              {/* Secondary platforms */}
              <div className="secondary-platform-btns">
                {business?.yelpUrl && (
                  <a href={business.yelpUrl} target="_blank" rel="noopener noreferrer"
                    className="platform-btn" onClick={() => trackPlatformClick('yelp')}>
                    🍽️ Yelp
                  </a>
                )}
                {business?.tripadvisorUrl && (
                  <a href={business.tripadvisorUrl} target="_blank" rel="noopener noreferrer"
                    className="platform-btn" onClick={() => trackPlatformClick('tripadvisor')}>
                    ✈️ TripAdvisor
                  </a>
                )}
              </div>

              {/* WhatsApp viral share */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just visited ${business?.name} and had an amazing experience! You should try it — check them out here: ${window.location.origin}/review/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-share-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.847L.057 23.999l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.94a9.912 9.912 0 01-5.062-1.388l-.363-.215-3.743.982.999-3.648-.236-.374A9.9 9.9 0 012.06 12C2.06 6.492 6.492 2.06 12 2.06S21.94 6.492 21.94 12 17.508 21.94 12 21.94z"/>
                </svg>
                Tell a Friend via WhatsApp
              </a>
            </>
          )}

          {/* STEP: Negative Thanks */}
          {step === 'thanks-negative' && (
            <>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 10, color: textColor }}>
                Thank you for letting us know
              </h2>
              <p style={{ fontSize: 15, color: textColor, opacity: 0.75, lineHeight: 1.6 }}>
                We're sorry you didn't have the best experience. Your feedback has been shared directly with our team and we'll do our best to make it right.
              </p>
              <div style={{ marginTop: 24, fontSize: 36 }}>💙</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function ReviewFunnelPage() {
  return (
    <Suspense fallback={
      <div className="funnel-page" style={{ background: '#0a0a0f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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
