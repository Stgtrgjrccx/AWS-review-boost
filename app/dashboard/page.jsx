'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PotentialBuyersHub() {
  const [prospects, setProspects] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [convertingId, setConvertingId] = useState(null)
  const [notification, setNotification] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New Lead Form
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    contactRole: 'Owner',
    phone: '',
    email: '',
    industry: 'restaurant',
    city: 'Pune',
    currentRating: '3.8',
    currentReviewsCount: '50',
    websiteStatus: 'No website',
    targetPitch: 'Review Gating Shield + Next.js Mobile Website',
    estimatedValue: '₹35,000',
    opportunity: 'hot',
    stage: 'new',
    notes: '',
  })

  const loadData = () => {
    Promise.all([
      fetch('/api/operator/prospects').then(r => r.json()).catch(() => ({ prospects: [] })),
      fetch('/api/operator/clients').then(r => r.json()).catch(() => ({ clients: [] }))
    ]).then(([pData, cData]) => {
      setProspects(pData.prospects || [])
      setClients(cData.clients || [])
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStageChange = async (id, newStage) => {
    try {
      await fetch('/api/operator/prospects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { stage: newStage } }),
      })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleConvert = async (prospect) => {
    if (!confirm(`Convert ${prospect.businessName} to an active client?`)) {
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
        setNotification({ type: 'success', text: `${prospect.businessName} is now an Active Client!` })
        loadData()
        setTimeout(() => setNotification(null), 4000)
      }
    } catch {
      setNotification({ type: 'error', text: 'Error converting client' })
    } finally {
      setConvertingId(null)
    }
  }

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
        loadData()
        setNotification({ type: 'success', text: `Added ${form.businessName} to pipeline` })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to add prospect' })
    }
  }

  const generateWhatsAppLink = (p) => {
    const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '')
    const msg = encodeURIComponent(
      `Hello ${p.contactName || 'there'}, this is Siddhant from ASW Studio Pune.\n\n` +
      `I noticed ${p.businessName} on Google Maps in ${p.city}. You currently have a ${p.currentRating}★ rating with ${p.currentReviewsCount} reviews.\n\n` +
      `We build private review shielding funnels and high-speed mobile booking websites for Pune businesses to filter out 1-star complaints and drive authentic 5-star Google reviews.\n\n` +
      `Would you be open to a quick 2-minute demonstration tailored for ${p.businessName}?`
    )
    return `https://wa.me/${cleanPhone}?text=${msg}`
  }

  const filtered = prospects.filter(p => {
    const matchesSearch = !searchQuery ||
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
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
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.025em' }}>
            Potential Buyers (Pune Market)
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: 13, letterSpacing: '-0.01em' }}>
            Real verified businesses in Pune with Google ratings under 4.0★ and outdated digital infrastructure.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/exports/pune_business_leads_under_4_stars.xlsx"
            download="pune_business_leads_under_4_stars.xlsx"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            Export Excel (.xlsx) ↗
          </a>
          <a
            href="/exports/pune_business_leads_under_4_stars.csv"
            download="pune_business_leads_under_4_stars.csv"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            Export CSV
          </a>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
            style={{ fontSize: 12, padding: '7px 16px' }}
          >
            + Add Buyer Lead
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className="liquid-pill" style={{
          marginBottom: 20, padding: '10px 18px', fontSize: 13, fontWeight: 500,
          background: notification.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
          color: notification.type === 'success' ? '#34d399' : '#fb7185',
          border: `1px solid ${notification.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
        }}>
          {notification.text}
        </div>
      )}

      {/* 4 Apple Liquid Glass Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 26 }}>
        
        {/* Verified Potential Buyers */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Verified Potential Buyers
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            {prospects.length}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            Pune local businesses (&lt; 4.0★)
          </div>
        </div>

        {/* Priority Rating Vulnerability */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            High Priority (&lt; 3.8★)
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.03em' }}>
            {hotCount}
          </div>
          <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>
            Urgent review shielding need
          </div>
        </div>

        {/* Demos & Pitches */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Demos & Pitches Active
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>
            {demoCount}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>
            In active discussions
          </div>
        </div>

        {/* Converted Active Clients */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Active Converted Clients
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: clients.length > 0 ? '#10b981' : '#64748b', letterSpacing: '-0.03em' }}>
            {clients.length}
          </div>
          <div style={{ fontSize: 12, color: clients.length > 0 ? '#10b981' : '#64748b', marginTop: 4 }}>
            {clients.length > 0 ? 'Managing reviews & websites' : '0 onboarded yet'}
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        
        {/* Stage Filter Buttons */}
        <div className="liquid-pill" style={{ display: 'inline-flex', padding: 4 }}>
          {[
            { id: 'all', label: 'All (20)' },
            { id: 'hot', label: 'Priority' },
            { id: 'new', label: 'New' },
            { id: 'pitch_sent', label: 'Pitched' },
            { id: 'demo_scheduled', label: 'Demo' },
            { id: 'follow_up', label: 'Follow Up' },
            { id: 'won', label: 'Won' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: filter === tab.id ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: 980,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: filter === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Filter by business name or area..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="liquid-input"
          style={{ width: 260, padding: '8px 14px', fontSize: 12 }}
        />

      </div>

      {/* Potential Buyers Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
        {filtered.map(p => {
          const isHot = p.opportunity === 'hot'
          return (
            <div
              key={p.id}
              className="liquid-glass"
              style={{
                padding: '24px 26px',
                position: 'relative',
                borderTop: isHot ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.18)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {p.businessName}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                    {p.city} • <span style={{ textTransform: 'capitalize' }}>{p.industry}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isHot && (
                    <span className="liquid-pill" style={{
                      color: '#fbbf24', padding: '3px 9px', fontSize: 10, fontWeight: 700,
                      background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)'
                    }}>
                      PRIORITY
                    </span>
                  )}
                  <select
                    value={p.stage}
                    onChange={e => handleStageChange(p.id, e.target.value)}
                    className="liquid-input"
                    style={{ fontSize: 11, padding: '4px 8px', borderRadius: 8 }}
                  >
                    <option value="new" style={{ background: '#121422' }}>New Lead</option>
                    <option value="pitch_sent" style={{ background: '#121422' }}>Pitch Sent</option>
                    <option value="follow_up" style={{ background: '#121422' }}>Follow Up</option>
                    <option value="demo_scheduled" style={{ background: '#121422' }}>Demo Scheduled</option>
                    <option value="won" style={{ background: '#121422' }}>Won</option>
                  </select>
                </div>
              </div>

              {/* Contact Person */}
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '10px 14px',
                marginBottom: 14,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{p.contactName}</span>
                  <span style={{ color: '#64748b', marginLeft: 6 }}>({p.contactRole})</span>
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 500 }}>{p.phone}</div>
              </div>

              {/* Real Audit Metrics */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 14,
                fontSize: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Google Rating:</span>
                  <span style={{ color: p.currentRating <= 3.7 ? '#fb7185' : '#fbbf24', fontWeight: 700 }}>
                    {p.currentRating} ★ ({p.currentReviewsCount} reviews)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Website Status:</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 500, textAlign: 'right', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.websiteStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Est. Deal Value:</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{p.estimatedValue}</span>
                </div>
              </div>

              {/* Solution Strategy */}
              <div style={{ marginBottom: 14, fontSize: 12 }}>
                <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: 10, marginBottom: 4 }}>
                  Solution Strategy
                </div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.4 }}>
                  {p.targetPitch}
                </div>
              </div>

              {/* Notes */}
              {p.notes && (
                <div style={{ marginBottom: 16, fontSize: 11, color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 8 }}>
                  "{p.notes}"
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a
                  href={generateWhatsAppLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                >
                  WhatsApp Pitch ↗
                </a>

                <a
                  href={`tel:${p.phone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  title="Call contact"
                >
                  Call
                </a>

                {p.stage !== 'won' ? (
                  <button
                    onClick={() => handleConvert(p)}
                    disabled={convertingId === p.id}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1.1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                  >
                    {convertingId === p.id ? 'Converting...' : 'Convert to Client'}
                  </button>
                ) : (
                  <span className="liquid-pill" style={{ padding: '6px 12px', fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                    ✓ Converted Client
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
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="liquid-glass-elevated" style={{
            padding: 28, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>
                Add New Potential Buyer (Pune)
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
                    placeholder="e.g. Swaad Sweets"
                    value={form.businessName}
                    onChange={e => setForm({ ...form, businessName: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Locality in Pune</label>
                  <input
                    type="text"
                    placeholder="e.g. FC Road, Pune"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Joshi"
                    value={form.contactName}
                    onChange={e => setForm({ ...form, contactName: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 12345"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Google Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.currentRating}
                    onChange={e => setForm({ ...form, currentRating: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Total Reviews</label>
                  <input
                    type="number"
                    value={form.currentReviewsCount}
                    onChange={e => setForm({ ...form, currentReviewsCount: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Website Status</label>
                <input
                  type="text"
                  placeholder="e.g. No website / Slow mobile page"
                  value={form.websiteStatus}
                  onChange={e => setForm({ ...form, websiteStatus: e.target.value })}
                  className="liquid-input"
                  style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Est. Deal Value</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹35,000"
                    value={form.estimatedValue}
                    onChange={e => setForm({ ...form, estimatedValue: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Priority</label>
                  <select
                    value={form.opportunity}
                    onChange={e => setForm({ ...form, opportunity: e.target.value })}
                    className="liquid-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: 12 }}
                  >
                    <option value="hot" style={{ background: '#121422' }}>Priority Lead</option>
                    <option value="high" style={{ background: '#121422' }}>High</option>
                    <option value="medium" style={{ background: '#121422' }}>Standard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: 13, justifyContent: 'center' }}
              >
                Save to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
