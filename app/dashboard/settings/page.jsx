'use client'
import { useEffect, useState } from 'react'

const INDUSTRIES = [
  { value: 'restaurant', label: '🍕 Restaurant / Café' },
  { value: 'salon', label: '💇 Salon / Beauty' },
  { value: 'medical', label: '🏥 Medical / Dental / Clinic' },
  { value: 'retail', label: '🛍️ Retail / Shop' },
  { value: 'hotel', label: '🏨 Hotel / Hospitality' },
  { value: 'home_services', label: '🔧 Home Services' },
  { value: 'default', label: '💼 Other Business' },
]

const FONTS = ['Inter', 'Outfit', 'Roboto', 'Poppins', 'Playfair Display']

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '', slug: '', industry: 'restaurant',
    googleReviewUrl: '', yelpUrl: '', tripadvisorUrl: '',
    brandColor: '#6366f1', brandFont: 'Inter', ctaButtonText: 'Share Your Experience',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch('/api/business/me')
      .then(r => r.json())
      .then(d => {
        if (d.id) setForm(f => ({ ...f, ...d }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/onboarding/create-business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading settings...</div>

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>⚙️ Settings</h1>
          <p>Manage your business profile, review links, and white-label branding.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Business Info */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Business Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} required />
                  <p className="form-hint">reviewboostpro.com/review/{form.slug}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select className="form-select" value={form.industry} onChange={e => set('industry', e.target.value)}>
                  {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
            </div>

            {/* Review Links */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Review Platform Links</h3>
              <div className="form-group">
                <label className="form-label">
                  <span style={{ color: '#4285f4' }}>G</span> Google Review URL *
                </label>
                <input className="form-input" value={form.googleReviewUrl} onChange={e => set('googleReviewUrl', e.target.value)} placeholder="https://g.page/r/.../review" />
                <p className="form-hint">This is where 4-5 star customers will be directed</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">🍽️ Yelp URL</label>
                  <input className="form-input" value={form.yelpUrl} onChange={e => set('yelpUrl', e.target.value)} placeholder="https://yelp.com/biz/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">✈️ TripAdvisor URL</label>
                  <input className="form-input" value={form.tripadvisorUrl} onChange={e => set('tripadvisorUrl', e.target.value)} placeholder="https://tripadvisor.com/..." />
                </div>
              </div>
            </div>

            {/* White-label Branding */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🎨 White-Label Branding</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                Customize how your review funnel looks to customers.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Brand Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.brandColor} onChange={e => set('brandColor', e.target.value)}
                      style={{ width: 44, height: 38, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }} />
                    <input className="form-input" value={form.brandColor} onChange={e => set('brandColor', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand Font</label>
                  <select className="form-select" value={form.brandFont} onChange={e => set('brandFont', e.target.value)}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Button Text</label>
                <input className="form-input" value={form.ctaButtonText} onChange={e => set('ctaButtonText', e.target.value)} placeholder="Share Your Experience" />
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Live Preview</h3>

              {/* Mini funnel preview */}
              <div style={{
                background: 'linear-gradient(135deg, #f8f8ff 0%, #ffffff 100%)',
                borderRadius: 16, padding: 24, border: '1px solid #eee',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px',
                  background: `linear-gradient(135deg, ${form.brandColor}, ${form.brandColor}aa)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>⭐</div>
                <div style={{ fontFamily: form.brandFont + ',sans-serif', fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                  {form.name || 'Your Business'}
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>How was your experience?</div>
                <div style={{ fontSize: 28, marginBottom: 20 }}>⭐⭐⭐⭐⭐</div>
                <div style={{
                  background: form.brandColor, color: 'white',
                  padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                  fontFamily: form.brandFont + ',sans-serif',
                }}>
                  {form.ctaButtonText || 'Share Your Experience'}
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <a href={`/review/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)' }}>
                  👁 Preview full funnel page →
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '14px' }}
              disabled={saving}
            >
              {saved ? '✅ Changes Saved!' : saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
