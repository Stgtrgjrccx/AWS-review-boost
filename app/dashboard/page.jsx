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

  // Aggregate stats across verified Pune client properties
  const totalSent = clients.reduce((acc, c) => acc + (c.reviewsSent || 0), 0)
  const totalFiveStars = clients.reduce((acc, c) => acc + (c.fiveStarCount || 0), 0)
  const totalIntercepted = clients.reduce((acc, c) => acc + (c.interceptedCount || 0), 0)
  const totalWebVisitors = clients.reduce((acc, c) => acc + (c.website?.monthlyVisitors || 0), 0)
  const totalWebLeads = clients.reduce((acc, c) => acc + (c.website?.leadsCaptured || 0), 0)
  const liveWebsitesCount = clients.filter(c => c.website?.status === 'live').length

  const avgRating = clients.length > 0
    ? (clients.reduce((acc, c) => acc + (c.avgRating || 5), 0) / clients.length).toFixed(2)
    : '5.0'

  const allActivity = clients.flatMap(c =>
    (c.recentActivity || []).map(a => ({ ...a, clientName: c.name, clientSlug: c.slug }))
  ).slice(0, 7)

  return (
    <div>
      {/* Top Welcome & Overview */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.025em' }}>
            Command Center
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: 13, letterSpacing: '-0.01em' }}>
            Reputation Shielding & Web Infrastructure for Pune Client Properties
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/dashboard/prospects" className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
            Potential Clients (20) →
          </Link>
          <Link href="/dashboard/websites" className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
            Website Studio →
          </Link>
          <div className="liquid-pill" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', fontSize: 11, color: '#34d399', fontWeight: 600, letterSpacing: '0.02em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            SYSTEM LIVE
          </div>
        </div>
      </div>

      {/* 5 Apple Liquid Glass Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        
        {/* Managed Properties */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Active Pune Properties
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            {clients.length} <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Full Coverage Shield</div>
        </div>

        {/* 5-Star Reviews */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            5★ Reviews Generated
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>
            +{totalFiveStars}
          </div>
          <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>94.2% Routed to Google</div>
        </div>

        {/* Shielded Complaints */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Shielded from Google
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>
            {totalIntercepted}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Private Feedback Vault</div>
        </div>

        {/* Monthly Traffic */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Monthly Website Traffic
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>
            {totalWebVisitors.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>Across {liveWebsitesCount} Live Domains</div>
        </div>

        {/* Inbound Leads */}
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Inbound Leads Captured
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c084fc', letterSpacing: '-0.03em' }}>
            +{totalWebLeads}
          </div>
          <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>Table & Slot Bookings</div>
        </div>

      </div>

      {/* Main Split: Instant Dispatch Terminal + Unified Properties Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start', marginBottom: 28 }}>

        {/* Instant Dispatch Terminal */}
        <div className="liquid-glass-elevated" style={{ padding: 24 }}>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
              Instant Dispatch
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0 0' }}>
              Send review invitations via gateway
            </p>
          </div>

          <form onSubmit={handleQuickDispatch}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Target Client Property
              </label>
              <select
                value={dispatchForm.clientId}
                onChange={e => setDispatchForm({ ...dispatchForm, clientId: e.target.value })}
                className="liquid-input"
                style={{ width: '100%', padding: '10px 12px', fontSize: 13 }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#121422', color: '#fff' }}>
                    {c.name} ({c.address?.split(',')[0] || c.industry})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Customer Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={dispatchForm.customerName}
                onChange={e => setDispatchForm({ ...dispatchForm, customerName: e.target.value })}
                className="liquid-input"
                style={{ width: '100%', padding: '10px 12px', fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98220 12345"
                value={dispatchForm.customerPhone}
                onChange={e => setDispatchForm({ ...dispatchForm, customerPhone: e.target.value })}
                className="liquid-input"
                style={{ width: '100%', padding: '10px 12px', fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
                Channel
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'sms', label: 'SMS' },
                ].map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setDispatchForm({ ...dispatchForm, channel: ch.id })}
                    style={{
                      flex: 1, padding: '8px 10px', borderRadius: 980, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: dispatchForm.channel === ch.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${dispatchForm.channel === ch.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      color: dispatchForm.channel === ch.id ? '#ffffff' : '#94a3b8',
                      boxShadow: dispatchForm.channel === ch.id ? 'inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
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
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 13 }}
            >
              {dispatching ? 'Dispatching...' : 'Dispatch Invitation'}
            </button>

            {dispatchStatus && (
              <div style={{
                marginTop: 12, padding: '9px 12px', borderRadius: 10, fontSize: 12,
                background: dispatchStatus.success ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                color: dispatchStatus.success ? '#34d399' : '#fb7185',
                border: `1px solid ${dispatchStatus.success ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
              }}>
                {dispatchStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Managed Client Properties Table */}
        <div className="liquid-glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                Managed Client Properties (Pune)
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0 0' }}>
                Active reputation shields and live production websites.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Property / Locality</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Google Reviews</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Website Asset</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Traffic & Leads</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Portals</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  const web = client.website || {}
                  return (
                    <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      
                      {/* Property Name */}
                      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#fff' }}>
                        <div>{client.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {client.address || client.industry}
                        </div>
                      </td>

                      {/* Review Stats */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{client.avgRating} ★</span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>(+{client.fiveStarCount} 5★)</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>
                          {client.interceptedCount} complaints shielded
                        </div>
                      </td>

                      {/* Website Asset */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="liquid-pill" style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 8px',
                            color: web.status === 'live' ? '#34d399' : '#38bdf8',
                          }}>
                            {web.status === 'live' ? '● Live' : 'In Dev'}
                          </span>
                          <a href={web.domain} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>
                            {web.domain?.replace(/^https?:\/\//, '')} ↗
                          </a>
                        </div>
                      </td>

                      {/* Traffic & Leads */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>
                          {web.monthlyVisitors?.toLocaleString() || 0} visits/mo
                        </div>
                        <div style={{ fontSize: 11, color: '#c084fc', marginTop: 2, fontWeight: 500 }}>
                          +{web.leadsCaptured || 0} leads captured
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => copyLiveLink(client.slug)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                            title="Copy live dashboard link for client"
                          >
                            {copiedSlug === client.slug ? '✓ Copied' : 'Copy Link'}
                          </button>

                          <a
                            href={`/live/${client.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                          >
                            Live View ↗
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

      {/* Unified Real-Time Stream */}
      <div className="liquid-glass" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
              Real-Time Activity & Lead Stream
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0 0' }}>
              Live customer ratings, dispatches, website leads, and project updates across Pune.
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>● Live Stream Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {allActivity.map((act, i) => (
            <div key={act.id || i} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{act.clientName}</span>
                <span style={{ color: '#64748b' }}>{act.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ color: '#cbd5e1', lineHeight: 1.4 }}>{act.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
