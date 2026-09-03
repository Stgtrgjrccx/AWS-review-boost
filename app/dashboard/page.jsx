'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OperationsHub() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState(null)

  // Quick Dispatch Form
  const [dispatchForm, setDispatchForm] = useState({
    clientId: '',
    customerName: '',
    customerPhone: '',
    channel: 'whatsapp',
  })
  const [dispatchStatus, setDispatchStatus] = useState(null)
  const [dispatching, setDispatching] = useState(false)

  const loadClients = () => {
    fetch('/api/operator/clients')
      .then(r => r.json())
      .then(d => {
        const list = d.clients || []
        setClients(list)
        if (list.length > 0 && !dispatchForm.clientId) {
          setDispatchForm(prev => ({ ...prev, clientId: list[0].id }))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleQuickDispatch = async (e) => {
    e.preventDefault()
    if (!dispatchForm.customerName || !dispatchForm.customerPhone) return
    setDispatching(true)
    setDispatchStatus(null)

    try {
      const res = await fetch('/api/operator/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchForm),
      })
      const data = await res.json()
      if (data.success) {
        setDispatchStatus({ success: true, message: `Dispatched to ${dispatchForm.customerName} via ${dispatchForm.channel}` })
        setDispatchForm(prev => ({ ...prev, customerName: '', customerPhone: '' }))
        loadClients()
      } else {
        setDispatchStatus({ success: false, message: data.error || 'Failed to dispatch' })
      }
    } catch (err) {
      setDispatchStatus({ success: false, message: 'Gateway error' })
    } finally {
      setDispatching(false)
    }
  }

  const copyLiveLink = (slug) => {
    const url = `${window.location.origin}/live/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  // Aggregate stats across all client properties
  const totalSent = clients.reduce((acc, c) => acc + (c.reviewsSent || 0), 0)
  const totalFiveStars = clients.reduce((acc, c) => acc + (c.fiveStarCount || 0), 0)
  const totalIntercepted = clients.reduce((acc, c) => acc + (c.interceptedCount || 0), 0)
  const totalWebVisitors = clients.reduce((acc, c) => acc + (c.website?.monthlyVisitors || 0), 0)
  const totalWebLeads = clients.reduce((acc, c) => acc + (c.website?.leadsCaptured || 0), 0)
  const liveWebsitesCount = clients.filter(c => c.website?.status === 'live').length

  const avgRating = clients.length > 0
    ? (clients.reduce((acc, c) => acc + (c.avgRating || 5), 0) / clients.length).toFixed(2)
    : '5.0'

  // Consolidate recent unified activity across all clients
  const allActivity = clients.flatMap(c =>
    (c.recentActivity || []).map(a => ({ ...a, clientName: c.name, clientSlug: c.slug }))
  ).slice(0, 7)

  return (
    <div>
      {/* Top Welcome & Summary */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#f8fafc' }}>
            ASW Cloud Operations Command Center
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 14 }}>
            Dual Operations Suite: <strong>Google Review Acceleration</strong> & <strong>Client Website Design</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/dashboard/websites" className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
            🌐 Website Studio →
          </Link>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            padding: '6px 14px', borderRadius: 20, fontSize: 12, color: '#10b981', fontWeight: 700
          }}>
            ● Operations Online 🟢
          </div>
        </div>
      </div>

      {/* 5 High-Impact Unified Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 26 }}>
        
        {/* Total Properties */}
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Client Properties
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#f8fafc' }}>
            {clients.length} <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Full Digital Coverage</div>
        </div>

        {/* 5-Star Reviews */}
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            5★ Reviews Generated
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#6366f1' }}>
            +{totalFiveStars}
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>▲ 94.2% Routed to Google</div>
        </div>

        {/* Shielded Complaints */}
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Shielded from Google
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#10b981' }}>
            {totalIntercepted}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Private Feedback Vault</div>
        </div>

        {/* Website Traffic */}
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Monthly Website Traffic
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8' }}>
            {totalWebVisitors.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>Across {liveWebsitesCount} Live Domains</div>
        </div>

        {/* Inbound Leads */}
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Client Inbound Leads
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#a855f7' }}>
            +{totalWebLeads}
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>Bookings & Enquiries</div>
        </div>

      </div>

      {/* Main Operational Split: Dispatch Terminal + Unified Properties Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start', marginBottom: 28 }}>

        {/* Quick Dispatch Terminal */}
        <div style={{
          background: '#0e101c',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 20,
          padding: 22,
          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#fff' }}>
                Instant Dispatch Terminal
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>
                Fire review invites for any client
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickDispatch}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Target Client Property
              </label>
              <select
                value={dispatchForm.clientId}
                onChange={e => setDispatchForm({ ...dispatchForm, clientId: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', background: '#161828',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 13
                }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={dispatchForm.customerName}
                onChange={e => setDispatchForm({ ...dispatchForm, customerName: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', background: '#161828',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 13
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Customer Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={dispatchForm.customerPhone}
                onChange={e => setDispatchForm({ ...dispatchForm, customerPhone: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', background: '#161828',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 13
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Channel
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'whatsapp', label: '💬 WhatsApp' },
                  { id: 'sms', label: '📱 SMS' },
                ].map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setDispatchForm({ ...dispatchForm, channel: ch.id })}
                    style={{
                      flex: 1, padding: '8px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: dispatchForm.channel === ch.id ? 'rgba(99,102,241,0.2)' : '#161828',
                      border: `1px solid ${dispatchForm.channel === ch.id ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                      color: dispatchForm.channel === ch.id ? '#fff' : '#94a3b8',
                    }}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={dispatching}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 13, fontWeight: 700 }}
            >
              {dispatching ? 'Dispatching...' : '🚀 Dispatch Review Invite'}
            </button>

            {dispatchStatus && (
              <div style={{
                marginTop: 10, padding: '8px 12px', borderRadius: 8, fontSize: 12,
                background: dispatchStatus.success ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: dispatchStatus.success ? '#10b981' : '#ef4444',
                border: `1px solid ${dispatchStatus.success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
                {dispatchStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Client Properties Unified Table */}
        <div style={{
          background: '#0e101c',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#fff' }}>
                🏢 Managed Properties: Reviews & Website Projects
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
                Live overview of each client's Google rating and website design assets.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Property</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Google Reviews</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Website Project</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Traffic & Leads</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Client Live Links</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  const web = client.website || {}
                  return (
                    <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      
                      {/* Property Name */}
                      <td style={{ padding: '14px 12px', fontWeight: 700, color: '#fff' }}>
                        <div>{client.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize', marginTop: 2 }}>
                          {client.industry}
                        </div>
                      </td>

                      {/* Review Stats */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#f59e0b', fontWeight: 800 }}>{client.avgRating} ★</span>
                          <span style={{ color: '#6366f1', fontWeight: 700 }}>(+{client.fiveStarCount} 5★)</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>
                          {client.interceptedCount} complaints shielded
                        </div>
                      </td>

                      {/* Website Project */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                            background: web.status === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)',
                            color: web.status === 'live' ? '#10b981' : '#38bdf8',
                            border: `1px solid ${web.status === 'live' ? 'rgba(16,185,129,0.3)' : 'rgba(56,189,248,0.3)'}`,
                          }}>
                            {web.status === 'live' ? '● Live Website' : '⚙️ ' + (web.status || 'In Dev')}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                          <a href={web.domain} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                            {web.domain?.replace(/^https?:\/\//, '')} ↗
                          </a>
                        </div>
                      </td>

                      {/* Traffic & Leads */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>
                          {web.monthlyVisitors?.toLocaleString() || 0} visits/mo
                        </div>
                        <div style={{ fontSize: 11, color: '#a855f7', marginTop: 2, fontWeight: 600 }}>
                          +{web.leadsCaptured || 0} leads captured
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => copyLiveLink(client.slug)}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 6,
                              color: '#cbd5e1',
                              padding: '5px 8px',
                              fontSize: 11,
                              cursor: 'pointer',
                            }}
                            title="Copy live dashboard link for client"
                          >
                            {copiedSlug === client.slug ? '✓ Copied' : '📋 Copy Link'}
                          </button>

                          <a
                            href={`/live/${client.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(99,102,241,0.15)',
                              border: '1px solid rgba(99,102,241,0.3)',
                              borderRadius: 6,
                              color: '#818cf8',
                              padding: '5px 8px',
                              fontSize: 11,
                              textDecoration: 'none',
                              fontWeight: 600,
                            }}
                          >
                            👁 Live View
                          </a>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Unified Live Activity & Inbound Stream */}
      <div style={{
        background: '#0e101c',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#fff' }}>
              📡 Unified Real-Time Stream (Reviews & Website Activity)
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0 0' }}>
              Live customer ratings, dispatches, website leads, and project deployments.
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>● Live Feed Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {allActivity.map((act, i) => (
            <div key={act.id || i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>{act.clientName}</span>
                <span style={{ color: '#64748b' }}>{act.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span>
                  {act.type === 'five_star' ? '⭐'
                    : act.type === 'web_lead' ? '🎯'
                    : act.type === 'web_deploy' ? '🚀'
                    : act.type === 'intercepted' ? '🛡️'
                    : '📤'}
                </span>
                <span style={{ color: '#e2e8f0', lineHeight: 1.4 }}>{act.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
