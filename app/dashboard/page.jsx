'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ScrollytellingCommandCenter() {
  const [prospects, setProspects] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHub, setSelectedHub] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [convertingId, setConvertingId] = useState(null)
  const [notification, setNotification] = useState(null)
  
  // Attach New Business Modal State
  const [showAttachModal, setShowAttachModal] = useState(false)
  const [attachName, setAttachName] = useState('')
  const [attachIndustry, setAttachIndustry] = useState('restaurant')
  const [attachGoogleUrl, setAttachGoogleUrl] = useState('')
  const [attachPhone, setAttachPhone] = useState('')
  const [attachCity, setAttachCity] = useState('Pune')
  const [attaching, setAttaching] = useState(false)
  const [attachSuccess, setAttachSuccess] = useState(null)

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

  const handleAttachSubmit = async (e) => {
    e.preventDefault()
    if (!attachName.trim()) return
    setAttaching(true)
    try {
      const res = await fetch('/api/operator/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: attachName.trim(),
          industry: attachIndustry,
          googleReviewUrl: attachGoogleUrl.trim() || `https://search.google.com/local/writereview?query=${encodeURIComponent(attachName.trim())}`,
          phone: attachPhone.trim(),
        })
      })
      const data = await res.json()
      if (data.client) {
        setAttachSuccess(data.client)
        loadData()
      }
    } catch (err) {
      console.error('Attach error:', err)
    } finally {
      setAttaching(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleConvert = async (prospect) => {
    if (!confirm(`Convert ${prospect.businessName} to an active managed client?`)) {
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
        setNotification({ type: 'success', text: `${prospect.businessName} is now an Active Managed Client!` })
        loadData()
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
      `Hello ${p.contactName || 'there'}, this is Siddhant from ASW Studio Pune.\n\n` +
      `I noticed ${p.businessName} on Google Maps in ${p.city}. You currently have a ${p.currentRating}★ rating with ${p.currentReviewsCount} reviews.\n\n` +
      `We build private review shielding funnels and high-speed mobile booking websites for Pune businesses to filter out 1-star complaints and drive authentic 5-star Google reviews.\n\n` +
      `Would you be open to a quick 2-minute preview tailored for ${p.businessName}?`
    )
    return `https://wa.me/${cleanPhone}?text=${msg}`
  }

  // Filter prospects
  const filtered = prospects.filter(p => {
    const matchesSearch = !searchQuery ||
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedHub === 'all') return true
    if (selectedHub === 'fcroad') return p.city?.toLowerCase().includes('fc road') || p.city?.toLowerCase().includes('deccan')
    if (selectedHub === 'kp') return p.city?.toLowerCase().includes('koregaon park')
    if (selectedHub === 'kothrud') return p.city?.toLowerCase().includes('kothrud')
    if (selectedHub === 'baner') return p.city?.toLowerCase().includes('baner')
    if (selectedHub === 'bavdhan') return p.city?.toLowerCase().includes('bavdhan')
    return true
  })

  // Scrollytelling Segments
  const criticalTier = filtered.filter(p => p.currentRating < 3.8)
  const landmarkTier = filtered.filter(p => p.currentRating >= 3.8)

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 100 }}>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(30px)',
          border: '1px solid rgba(16,185,129,0.4)', borderRadius: 980,
          padding: '12px 24px', color: '#34d399', fontWeight: 600, fontSize: 13,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          {notification.text}
        </div>
      )}

      {/* ACT 0: THE NARRATIVE HERO */}
      <section className="scrolly-hero">
        <div className="liquid-pill" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#38bdf8',
          marginBottom: 20, letterSpacing: '0.04em'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
          PUNE MARKET AUDIT • MARCH 2026
        </div>

        <h1 className="scrolly-chapter-title">
          The Pune Reputation &amp; Digital Deficit.
        </h1>

        <p className="scrolly-subtitle">
          A documented study of 20 verified local businesses across Koregaon Park, FC Road, Kothrud, and Baner. 
          Each establishment is actively losing customers due to sub-4.0★ Google ratings and obsolete digital touchpoints.
        </p>

        {/* Narrative Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 36 }}>
          
          <div className="scrolly-card" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Verified Businesses
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
              {prospects.length}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Active Pune establishments
            </div>
          </div>

          <div className="scrolly-card" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Immediate Danger (&lt; 3.8★)
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.03em' }}>
              {prospects.filter(p => p.currentRating < 3.8).length}
            </div>
            <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>
              High customer churn risk
            </div>
          </div>

          <div className="scrolly-card" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              High-Footfall Tier (3.8–3.9★)
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>
              {prospects.filter(p => p.currentRating >= 3.8).length}
            </div>
            <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>
              Stuck below 4.0 barrier
            </div>
          </div>

          <div className="scrolly-card" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Active Managed Clients
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: clients.length > 0 ? '#10b981' : '#64748b', letterSpacing: '-0.03em' }}>
              {clients.length}
            </div>
            <div style={{ fontSize: 12, color: clients.length > 0 ? '#10b981' : '#64748b', marginTop: 4 }}>
              {clients.length > 0 ? 'Managing operations' : 'Ready for first conversion'}
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setAttachSuccess(null)
              setShowAttachModal(true)
            }}
            className="btn btn-primary btn-sm"
            style={{
              padding: '8px 18px',
              fontSize: 12,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              boxShadow: '0 4px 18px rgba(14,165,233,0.35)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ⚡ Attach Any Business (30-Sec Setup)
          </button>
          <a
            href="/exports/pune_business_leads_under_4_stars.xlsx"
            download="pune_business_leads_under_4_stars.xlsx"
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 16px', fontSize: 12 }}
          >
            📊 Download Lead Workbook (.xlsx) ↗
          </a>
          <a
            href="/exports/pune_business_leads_under_4_stars.csv"
            download="pune_business_leads_under_4_stars.csv"
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 16px', fontSize: 12 }}
          >
            📄 Download CSV
          </a>
        </div>
      </section>

      {/* STICKY INTERACTIVE NAVIGATION RAIL */}
      <div className="scrolly-sticky-nav">
        
        {/* Locality Hub Filter Pills */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Hubs (${filtered.length})` },
            { id: 'kp', label: 'Koregaon Park' },
            { id: 'fcroad', label: 'FC Road / Deccan' },
            { id: 'kothrud', label: 'Kothrud' },
            { id: 'baner', label: 'Baner' },
            { id: 'bavdhan', label: 'Bavdhan' },
          ].map(hub => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub.id)}
              style={{
                background: selectedHub === hub.id ? 'rgba(255,255,255,0.16)' : 'transparent',
                color: selectedHub === hub.id ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: 980,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: selectedHub === hub.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {hub.label}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <input
          type="text"
          placeholder="Search by name or area..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="liquid-input"
          style={{ width: 220, padding: '6px 14px', fontSize: 12, borderRadius: 980 }}
        />

      </div>

      {/* ACT 1: THE CRITICAL VULNERABILITY TIER (< 3.8★) */}
      {criticalTier.length > 0 && (
        <section style={{ marginBottom: 60 }} className="scrolly-reveal">
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fb7185', marginBottom: 6 }}>
              Chapter 01
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              The Immediate Danger Zone (&lt; 3.8★)
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '6px 0 0 0', maxWidth: 640 }}>
              Ratings under 3.8★ trigger severe algorithm penalties on Google Maps and drive potential customers directly into nearby competitors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {criticalTier.map(p => (
              <div
                key={p.id}
                className="scrolly-card"
                style={{
                  borderTop: '1px solid rgba(251, 113, 133, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        {p.businessName}
                      </h3>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                        {p.city} • <span style={{ textTransform: 'capitalize' }}>{p.industry}</span>
                      </div>
                    </div>

                    <div className="liquid-pill" style={{
                      padding: '4px 10px', fontSize: 11, fontWeight: 700,
                      color: '#fb7185', background: 'rgba(251, 113, 133, 0.12)', border: '1px solid rgba(251, 113, 133, 0.25)'
                    }}>
                      {p.currentRating} ★
                    </div>
                  </div>

                  {/* Decision Maker */}
                  <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    marginBottom: 14,
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.contactName}</span>
                      <span style={{ color: '#64748b', marginLeft: 6 }}>({p.contactRole})</span>
                    </div>
                    <div style={{ color: '#38bdf8', fontWeight: 500 }}>{p.phone}</div>
                  </div>

                  {/* Current Situation & Website Asset */}
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
                    <div style={{ color: '#cbd5e1', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>Web Asset:</span>
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: p.hasDirectWebsite ? '#38bdf8' : '#94a3b8',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            maxWidth: 210,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>{p.hasDirectWebsite ? '🌐' : '🔗'}</span>
                          <span>{p.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]} ↗</span>
                        </a>
                      ) : (
                        <span style={{ color: '#64748b' }}>No Website</span>
                      )}
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: '#64748b' }}>Strategy:</strong> {p.targetPitch}
                    </div>
                  </div>

                  {/* Notes */}
                  {p.notes && (
                    <div style={{
                      fontSize: 11, color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                      padding: '8px 12px', borderRadius: 10, marginBottom: 18, lineHeight: 1.4
                    }}>
                      "{p.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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

                  <Link
                    href={`/dashboard/qr-codes?slug=${p.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    title="Generate Tabletop QR Code"
                  >
                    📲 QR
                  </Link>

                  {p.stage !== 'won' ? (
                    <button
                      onClick={() => handleConvert(p)}
                      disabled={convertingId === p.id}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 14px', fontSize: 12 }}
                    >
                      {convertingId === p.id ? 'Converting...' : 'Convert'}
                    </button>
                  ) : (
                    <span className="liquid-pill" style={{ padding: '4px 10px', fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                      ✓ Converted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACT 2: HIGH-FOOTFALL LANDMARKS (3.8★ – 3.9★) */}
      {landmarkTier.length > 0 && (
        <section style={{ marginBottom: 60 }} className="scrolly-reveal">
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', marginBottom: 6 }}>
              Chapter 02
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              High-Footfall Icons (3.8★ – 3.9★)
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '6px 0 0 0', maxWidth: 640 }}>
              Landmark restaurants, parlors, and diners with hundreds of reviews, suffering from wait-time complaints and missing direct mobile booking apps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {landmarkTier.map(p => (
              <div
                key={p.id}
                className="scrolly-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        {p.businessName}
                      </h3>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                        {p.city} • <span style={{ textTransform: 'capitalize' }}>{p.industry}</span>
                      </div>
                    </div>

                    <div className="liquid-pill" style={{
                      padding: '4px 10px', fontSize: 11, fontWeight: 700,
                      color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)'
                    }}>
                      {p.currentRating} ★ ({p.currentReviewsCount})
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    marginBottom: 14,
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.contactName}</span>
                      <span style={{ color: '#64748b', marginLeft: 6 }}>({p.contactRole})</span>
                    </div>
                    <div style={{ color: '#38bdf8', fontWeight: 500 }}>{p.phone}</div>
                  </div>

                  {/* Current Situation & Website Asset */}
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
                    <div style={{ color: '#cbd5e1', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>Web Asset:</span>
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: p.hasDirectWebsite ? '#38bdf8' : '#94a3b8',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            maxWidth: 210,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>{p.hasDirectWebsite ? '🌐' : '🔗'}</span>
                          <span>{p.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]} ↗</span>
                        </a>
                      ) : (
                        <span style={{ color: '#64748b' }}>No Website</span>
                      )}
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: '#64748b' }}>Strategy:</strong> {p.targetPitch}
                    </div>
                  </div>

                  {/* Notes */}
                  {p.notes && (
                    <div style={{
                      fontSize: 11, color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                      padding: '8px 12px', borderRadius: 10, marginBottom: 18, lineHeight: 1.4
                    }}>
                      "{p.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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

                  <Link
                    href={`/dashboard/qr-codes?slug=${p.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    title="Generate Tabletop QR Code"
                  >
                    📲 QR
                  </Link>

                  {p.stage !== 'won' ? (
                    <button
                      onClick={() => handleConvert(p)}
                      disabled={convertingId === p.id}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 14px', fontSize: 12 }}
                    >
                      {convertingId === p.id ? 'Converting...' : 'Convert'}
                    </button>
                  ) : (
                    <span className="liquid-pill" style={{ padding: '4px 10px', fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                      ✓ Converted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACT 3: ACTIVE MANAGED CLIENT PORTFOLIO */}
      <section className="scrolly-reveal">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', marginBottom: 6 }}>
            Chapter 03
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Active Managed Portfolio
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: '6px 0 0 0', maxWidth: 640 }}>
            Real-time reputation shielding and live web properties currently onboarded.
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="scrolly-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: '#38bdf8' }}>✦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Portfolio Ready for First Client
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 460, margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Attach any business in 30 seconds to immediately generate their consumer AI review portal and tabletop QR stands, or convert one of your 20 Pune leads above.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setAttachSuccess(null)
                  setShowAttachModal(true)
                }}
                className="btn btn-primary btn-sm"
                style={{ padding: '9px 20px', fontSize: 13, fontWeight: 700 }}
              >
                + Attach Any Business in 30s ⚡
              </button>
              <a
                href="#critical-tier"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 350, behavior: 'smooth' })
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '9px 20px', fontSize: 12 }}
              >
                Explore Pune Leads ↑
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {clients.map(client => (
              <div key={client.id} className="scrolly-card" style={{ borderTop: '1px solid rgba(16,185,129,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#ffffff' }}>
                        {client.name}
                      </h3>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {client.industry} • Active System
                      </div>
                    </div>
                    <span className="liquid-pill" style={{ color: '#34d399', fontSize: 11, fontWeight: 700, padding: '3px 10px' }}>
                      ● LIVE
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
                    <div style={{ color: '#cbd5e1', marginBottom: 4 }}>
                      <strong style={{ color: '#64748b' }}>Consumer URL:</strong> /review/{client.slug}
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: '#64748b' }}>Google Target:</strong> Active Direct Dialog
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <a
                    href={`/review/${client.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                  >
                    🚀 Test Consumer Flow ↗
                  </a>
                  <a
                    href={`/live/${client.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    📊 Live Stats
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ATTACH ANY BUSINESS MODAL */}
      {showAttachModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'rgba(20, 20, 25, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 24,
            padding: 32,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowAttachModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {!attachSuccess ? (
              <form onSubmit={handleAttachSubmit}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '4px 12px', borderRadius: 980, color: '#38bdf8', fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                  <span>⚡</span> 30-SECOND SETUP
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                  Attach Any Business
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                  Instantly activates their AI review generator, tabletop counter QR stands, and private feedback shielding.
                </p>

                {/* Business Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blue Tokai Coffee, Chaitanya Paranthas"
                    value={attachName}
                    onChange={e => setAttachName(e.target.value)}
                    className="liquid-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Industry Category */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Industry / Category
                  </label>
                  <select
                    value={attachIndustry}
                    onChange={e => setAttachIndustry(e.target.value)}
                    className="liquid-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="restaurant">Restaurant / Dining</option>
                    <option value="cafe">Cafe / Bakery / Coffee</option>
                    <option value="salon">Salon / Hair &amp; Spa</option>
                    <option value="fitness">Gym / Fitness Center</option>
                    <option value="medical">Clinic / Healthcare</option>
                    <option value="dental">Dental Practice</option>
                    <option value="retail">Retail Shop / Store</option>
                    <option value="hotel">Hotel / Hospitality</option>
                  </select>
                </div>

                {/* Google Review Link */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Google Review Link / Maps Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://search.google.com/local/writereview?placeid=... or Maps link"
                    value={attachGoogleUrl}
                    onChange={e => setAttachGoogleUrl(e.target.value)}
                    className="liquid-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0 0' }}>
                    If left blank, the system automatically builds a search link for the business name.
                  </p>
                </div>

                {/* Contact Phone */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Manager WhatsApp / Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98220 12345"
                    value={attachPhone}
                    onChange={e => setAttachPhone(e.target.value)}
                    className="liquid-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={attaching}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {attaching ? 'Activating System...' : '⚡ Activate System & Generate Live Demo'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                  System Active &amp; Live!
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>{attachSuccess.name}</strong> is now configured with the AI review generator and private shielding.
                </p>

                {/* Instant Action 1: Test Consumer AI Review Flow */}
                <a
                  href={`/review/${attachSuccess.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 10,
                    textDecoration: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  🚀 Test Consumer AI Review Flow (Live Demo) ↗
                </a>

                {/* Instant Action 2: Tabletop QR Stand */}
                <a
                  href="/dashboard/qr-codes"
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '12px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 10,
                    textDecoration: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  📲 View &amp; Download Tabletop QR Stand ↗
                </a>

                {/* Instant Action 3: Client Live Portal */}
                <a
                  href={`/live/${attachSuccess.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '12px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16,
                    textDecoration: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  📊 Open Manager Live Reporting Portal ↗
                </a>

                <button
                  onClick={() => {
                    setShowAttachModal(false)
                    setAttachSuccess(null)
                    setAttachName('')
                    setAttachGoogleUrl('')
                    setAttachPhone('')
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Close &amp; View Portfolio
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

