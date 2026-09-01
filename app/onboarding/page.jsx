'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = ['Business Info', 'Review Links', 'Branding', 'Test Send']

const INDUSTRIES = [
  { value: 'restaurant', label: '🍕 Restaurant / Café' },
  { value: 'salon', label: '💇 Salon / Beauty' },
  { value: 'medical', label: '🏥 Medical / Dental / Clinic' },
  { value: 'retail', label: '🛍️ Retail / Shop' },
  { value: 'hotel', label: '🏨 Hotel / Hospitality' },
  { value: 'home_services', label: '🔧 Home Services' },
  { value: 'default', label: '💼 Other Business' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    industry: 'restaurant',
    googleReviewUrl: '',
    yelpUrl: '',
    tripadvisorUrl: '',
    brandColor: '#6366f1',
    ctaButtonText: 'Share Your Experience',
    testPhone: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-')
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/create-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/dashboard')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const sendTestMessage = async () => {
    setLoading(true)
    await fetch('/api/send-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: form.testPhone,
        name: 'Test Customer',
        businessName: form.name,
        slug: form.slug,
        messageType: 'template',
      }),
    })
    setTestSent(true)
    setLoading(false)
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>⭐</div>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 17 }}>
            Review<span style={{ color: '#6366f1' }}>Boost</span> Pro
          </span>
        </div>

        {/* Step indicator */}
        <div className="step-indicator">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i <= step ? 'active' : ''}`} />
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800 }}>
            {STEPS[step]}
          </h2>
        </div>

        <div style={{ marginTop: 28 }}>
          {/* Step 0: Business Info */}
          {step === 0 && (
            <>
              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Glow Beauty Studio"
                  value={form.name}
                  onChange={e => {
                    set('name', e.target.value)
                    set('slug', generateSlug(e.target.value))
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your review link URL *</label>
                <input
                  className="form-input"
                  placeholder="reviewboostpro.com/review/..."
                  value={form.slug}
                  onChange={e => set('slug', e.target.value)}
                />
                <p className="form-hint">Your customers will visit: reviewboostpro.com/review/{form.slug || 'your-business'}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Business Type *</label>
                <select className="form-select" value={form.industry} onChange={e => set('industry', e.target.value)}>
                  {INDUSTRIES.map(i => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
                <p className="form-hint">This helps our AI pick the best funnel design for your customers.</p>
              </div>
            </>
          )}

          {/* Step 1: Review Links */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Google Review URL * (most important!)</label>
                <input
                  className="form-input"
                  placeholder="https://g.page/r/YOUR_PLACE_ID/review"
                  value={form.googleReviewUrl}
                  onChange={e => set('googleReviewUrl', e.target.value)}
                />
                <p className="form-hint">
                  Go to Google Maps → find your business → "Get more reviews" → copy the link
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Yelp URL (optional)</label>
                <input
                  className="form-input"
                  placeholder="https://www.yelp.com/biz/..."
                  value={form.yelpUrl}
                  onChange={e => set('yelpUrl', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">TripAdvisor URL (optional)</label>
                <input
                  className="form-input"
                  placeholder="https://www.tripadvisor.com/..."
                  value={form.tripadvisorUrl}
                  onChange={e => set('tripadvisorUrl', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Branding */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label">Brand Color</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.brandColor}
                    onChange={e => set('brandColor', e.target.value)}
                    style={{ width: 52, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }}
                  />
                  <input
                    className="form-input"
                    value={form.brandColor}
                    onChange={e => set('brandColor', e.target.value)}
                    style={{ flex: 1 }}
                    placeholder="#6366f1"
                  />
                </div>
                <p className="form-hint">This color will appear on your review funnel page for customers.</p>
              </div>
              <div className="form-group">
                <label className="form-label">Review Button Text</label>
                <input
                  className="form-input"
                  value={form.ctaButtonText}
                  onChange={e => set('ctaButtonText', e.target.value)}
                  placeholder="Share Your Experience"
                />
              </div>
              {/* Preview */}
              <div style={{
                marginTop: 24, padding: 24, borderRadius: 16,
                background: form.brandColor + '15',
                border: `1px solid ${form.brandColor}40`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Preview</div>
                <div style={{
                  background: form.brandColor,
                  color: 'white', padding: '12px 28px',
                  borderRadius: 12, display: 'inline-block',
                  fontWeight: 700, fontSize: 15,
                }}>
                  {form.ctaButtonText || 'Share Your Experience'}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Test Send */}
          {step === 3 && (
            <>
              {testSent ? (
                <div style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 16, padding: 28, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    Check your WhatsApp — you should receive the test message within seconds.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                    Send a test WhatsApp review request to your own number to see exactly what your customers will receive.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Your WhatsApp Number</label>
                    <input
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={form.testPhone}
                      onChange={e => set('testPhone', e.target.value)}
                    />
                    <p className="form-hint">Include country code (e.g. +91 for India)</p>
                  </div>
                  <button
                    onClick={sendTestMessage}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                    disabled={!form.testPhone || loading}
                  >
                    💬 Send Test WhatsApp
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Skip this step and go straight to the dashboard
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
              disabled={step === 0 && (!form.name || !form.slug)}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Setting up...' : '🚀 Go to Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
