'use client'
import { useState, useEffect } from 'react'

export default function ProspectsPage() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [convertingId, setConvertingId] = useState(null)
  const [notification, setNotification] = useState(null)

  // New Prospect Form
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    contactRole: 'Owner',
    phone: '',
    email: '',
    industry: 'restaurant',
    city: 'Mumbai',
    currentRating: '3.9',
    currentReviewsCount: '25',
    websiteStatus: 'Needs mobile redesign',
    targetPitch: 'Review Gating Shield + Next.js Mobile Website',
    estimatedValue: '₹35,000',
    opportunity: 'hot',
    stage: 'new',
    notes: '',
  })

  const loadProspects = () => {
    fetch('/api/operator/prospects')
      .then(r => r.json())
      .then(d => {
        setProspects(d.prospects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadProspects()
  }, [])

  const handleAddProspect = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/operator/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        loadProspects()
        setNotification({ type: 'success', text: `Added ${form.businessName} to pipeline!` })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to add prospect' })
    }
  }

  const handleStageChange = async (id, newStage) => {
    try {
      await fetch('/api/operator/prospects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { stage: newStage } }),
      })
      loadProspects()
    } catch (err) {
      console.error(err)
    }
  }

  const handleConvert = async (prospect) => {
    if (!confirm(`Convert ${prospect.businessName} to an active managed client? This will create their live review portal and website project.`)) {
      return
    }
    setConvertingId(prospect.id)
    try {
      const res = await fetch('/api/operator/prospects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prospect.id, action: 'convert' }),
      })
      const data = await res.json()
      if (data.success) {
        setNotification({ type: 'success', text: `🎉 ${prospect.businessName} is now an Active Managed Client!` })
        loadProspects()
        setTimeout(() => setNotification(null), 4000)
      }
    } catch {
      setNotification({ type: 'error', text: 'Error converting client' })
    } finally {
      setConvertingId(null)
    }
  }

  const generateWhatsAppLink = (p) => {
    const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '')
    const msg = encodeURIComponent(
      `Hi ${p.contactName || 'there'}, Siddhant here from ASW Agency.\n\n` +
      `I came across ${p.businessName} and noticed you currently have ${p.currentRating}★ on Google. We recently built a reputation shield and high-speed mobile website for businesses in ${p.city}.\n\n` +
      `Here is a 1-minute live demo of how we shield from negative reviews & drive 5-stars: ${typeof window !== 'undefined' ? window.location.origin : ''}/live/rustic-table\n\n` +
      `Can I send you a 2-minute video preview tailored for ${p.businessName}?`
    )
    return `https://wa.me/${cleanPhone}?text=${msg}`
  }

  const filtered = prospects.filter(p => {
    if (filter === 'all') return true
    if (filter === 'hot') return p.opportunity === 'hot'
    return p.stage === filter
  })

  const hotCount = prospects.filter(p => p.opportunity === 'hot').length
  const wonCount = prospects.filter(p => p.stage === 'won').length
  const demoCount = prospects.filter(p => p.stage === 'demo_scheduled').length

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#f8fafc' }}>
            👥 Potential Clients & Deals Pipeline
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 14 }}>
            Prospect intelligence, website audits, Google review vulnerabilities, and 1-click WhatsApp outreach.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/exports/pune_business_leads_under_4_stars.xlsx"
            download="pune_business_leads_under_4_stars.xlsx"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 12, fontWeight: 700, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
          >
            📊 Download Excel (.xlsx)
          </a>
          <a
            href="/exports/pune_business_leads_under_4_stars.csv"
            download="pune_business_leads_under_4_stars.csv"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 12, fontWeight: 700 }}
          >
            📄 Download CSV
          </a>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700 }}
          >
            <span>+</span> Add Potential Client
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div style={{
          marginBottom: 18, padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: notification.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: notification.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${notification.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          {notification.text}
        </div>
      )}

      {/* 4 Pipeline Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Total Pipeline Leads
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#f8fafc' }}>
            {prospects.length}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>High-intent prospective businesses</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Hot Opportunities 🔥
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#f59e0b' }}>
            {hotCount}
          </div>
          <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>Urgent review & site pain points</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Demos / Pitches Active
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8' }}>
            {demoCount}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>In active discussion</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Closed & Converted
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#10b981' }}>
            {wonCount} <span style={{ fontSize: 14, color: '#10b981' }}>Won</span>
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>Onboarded to Active Properties</div>
        </div>
      </div>

      {/* Stage Filter Buttons */}
      <div style={{
        display: 'inline-flex', background: '#121422', borderRadius: 8,
        padding: 3, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20
      }}>
        {[
          { id: 'all', label: 'All Prospects' },
          { id: 'hot', label: '🔥 Hot' },
          { id: 'new', label: 'New' },
          { id: 'pitch_sent', label: 'Pitched' },
          { id: 'demo_scheduled', label: 'Demo Scheduled' },
          { id: 'follow_up', label: 'Follow Up' },
          { id: 'won', label: 'Won 🚀' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              background: filter === tab.id ? '#6366f1' : 'transparent',
              color: filter === tab.id ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: filter === tab.id ? 700 : 500,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prospect Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
        {filtered.map(p => {
          const isHot = p.opportunity === 'hot'
          return (
            <div
              key={p.id}
              style={{
                background: '#0e101c',
                border: `1px solid ${isHot ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                padding: '22px 24px',
                position: 'relative',
                boxShadow: isHot ? '0 10px 30px rgba(245,158,11,0.05)' : 'none',
              }}
            >
              {/* Header: Business Name & Opportunity Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>
                    {p.businessName}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                    📍 {p.city} • <span style={{ textTransform: 'capitalize' }}>{p.industry}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isHot && (
                    <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 800 }}>
                      🔥 HOT
                    </span>
                  )}
                  <select
                    value={p.stage}
                    onChange={e => handleStageChange(p.id, e.target.value)}
                    style={{
                      background: '#161828',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#cbd5e1',
                      fontSize: 11,
                      padding: '3px 8px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="new">New Lead</option>
                    <option value="pitch_sent">Pitch Sent</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="won">Won 🚀</option>
                  </select>
                </div>
              </div>

              {/* Decision Maker Contact */}
              <div style={{
                background: '#161828',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 14,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{p.contactName}</span>
                  <span style={{ color: '#64748b', marginLeft: 6 }}>({p.contactRole})</span>
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>{p.phone}</div>
              </div>

              {/* Intelligence Audit Box: Rating & Website Vulnerability */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 14,
                fontSize: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Google Reputation:</span>
                  <span style={{ color: p.currentRating < 4.0 ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                    {p.currentRating} ★ ({p.currentReviewsCount} reviews) {p.currentRating < 4.0 ? '⚠️ Vulnerable' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Current Website:</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 600, textAlign: 'right', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.websiteStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Est. Deal Value:</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>{p.estimatedValue}</span>
                </div>
              </div>

              {/* Target Pitch / Solution */}
              <div style={{ marginBottom: 14, fontSize: 12 }}>
                <div style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, marginBottom: 4 }}>
                  Target Pitch
                </div>
                <div style={{ color: '#818cf8', fontWeight: 600 }}>
                  🎯 {p.targetPitch}
                </div>
              </div>

              {/* Notes */}
              {p.notes && (
                <div style={{ marginBottom: 16, fontSize: 11, color: '#94a3b8', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: 8 }}>
                  "{p.notes}"
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* WhatsApp Pitch */}
                <a
                  href={generateWhatsAppLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12,
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981'
                  }}
                >
                  💬 WhatsApp
                </a>

                {/* Call */}
                <a
                  href={`tel:${p.phone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  title="Call contact"
                >
                  📞
                </a>

                {/* Convert to Active Client */}
                {p.stage !== 'won' ? (
                  <button
                    onClick={() => handleConvert(p)}
                    disabled={convertingId === p.id}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1.2, textAlign: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}
                  >
                    {convertingId === p.id ? 'Converting...' : '🚀 Convert Client'}
                  </button>
                ) : (
                  <span style={{
                    padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#10b981',
                    background: 'rgba(16,185,129,0.15)', borderRadius: 6, display: 'inline-flex', alignItems: 'center',
                  }}>
                    ✓ Active Client
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div style={{
            background: '#0e101c', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
            padding: 26, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>
                Add New Potential Client / Prospect
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddProspect}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spice Route Bistro"
                    value={form.businessName}
                    onChange={e => setForm({ ...form, businessName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ajay Mehra"
                    value={form.contactName}
                    onChange={e => setForm({ ...form, contactName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Current Google Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.currentRating}
                    onChange={e => setForm({ ...form, currentRating: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Total Google Reviews</label>
                  <input
                    type="number"
                    value={form.currentReviewsCount}
                    onChange={e => setForm({ ...form, currentReviewsCount: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Current Website Status</label>
                <input
                  type="text"
                  placeholder="e.g. No website / Slow WordPress site"
                  value={form.websiteStatus}
                  onChange={e => setForm({ ...form, websiteStatus: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Est. Deal Value</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹35,000"
                    value={form.estimatedValue}
                    onChange={e => setForm({ ...form, estimatedValue: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Priority</label>
                  <select
                    value={form.opportunity}
                    onChange={e => setForm({ ...form, opportunity: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  >
                    <option value="hot">Hot Opportunity 🔥</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Notes & Follow-up Context</label>
                <textarea
                  rows={2}
                  placeholder="Key conversation details or requirements..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#161828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px', fontSize: 13, fontWeight: 700, justifyContent: 'center' }}
              >
                Save Potential Client to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
