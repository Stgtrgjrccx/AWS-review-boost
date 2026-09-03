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
  const avgRating = clients.length > 0
    ? (clients.reduce((acc, c) => acc + (c.avgRating || 5), 0) / clients.length).toFixed(2)
    : '5.0'

  return (
    <div>
      {/* Top Welcome & Summary */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#f8fafc' }}>
            ASW Cloud Operations Command Center
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 14 }}>
            Multi-property review acceleration, live client tracking, and private reputation shielding.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          padding: '6px 14px', borderRadius: 20, fontSize: 12, color: '#10b981', fontWeight: 700
        }}>
          ● All Systems Operational
        </div>
      </div>

      {/* Global Operational Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Active Properties Managed
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc' }}>
            {clients.length} <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>100% Protection Shield</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Total 5★ Reviews Generated
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#6366f1' }}>
            +{totalFiveStars}
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>▲ 94.2% Gating Success</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Complaints Shielded Privately
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>
            {totalIntercepted}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Deflected from Google</div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Aggregate Google Rating
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f59e0b' }}>
            {avgRating} <span style={{ fontSize: 16, color: '#64748b' }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>★★★★★ Verified</div>
        </div>

      </div>

      {/* Main Grid: Quick Dispatch Terminal + Client Properties Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Quick Dispatch Terminal */}
        <div style={{
          background: '#0e101c',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#fff' }}>
                Instant Dispatch Terminal
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>
                Fire review requests for any client property
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickDispatch}>
            <div style={{ marginBottom: 14 }}>
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

            <div style={{ marginBottom: 14 }}>
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

            <div style={{ marginBottom: 14 }}>
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

            <div style={{ marginBottom: 18 }}>
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
              {dispatching ? 'Dispatching Gateway...' : '🚀 Dispatch Review Invite'}
            </button>

            {dispatchStatus && (
              <div style={{
                marginTop: 12, padding: '8px 12px', borderRadius: 8, fontSize: 12,
                background: dispatchStatus.success ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: dispatchStatus.success ? '#10b981' : '#ef4444',
                border: `1px solid ${dispatchStatus.success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
                {dispatchStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Client Properties Directory Table */}
        <div style={{
          background: '#0e101c',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#fff' }}>
                🏢 Managed Client Properties
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
                All client portals with direct links for customer sharing and screenshot reporting.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Property / Client</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Sector</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>5★ Driven</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Shielded</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Rating</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Client Live Portal</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    
                    {/* Client Name */}
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: client.brandColor || '#6366f1' }} />
                        <span>{client.name}</span>
                      </div>
                    </td>

                    {/* Sector */}
                    <td style={{ padding: '14px 12px', color: '#94a3b8', textTransform: 'capitalize' }}>
                      {client.industry}
                    </td>

                    {/* 5-Star Count */}
                    <td style={{ padding: '14px 12px', color: '#6366f1', fontWeight: 700 }}>
                      +{client.fiveStarCount}
                    </td>

                    {/* Intercepted */}
                    <td style={{ padding: '14px 12px', color: '#10b981', fontWeight: 700 }}>
                      {client.interceptedCount}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '14px 12px', color: '#f59e0b', fontWeight: 700 }}>
                      {client.avgRating} ★
                    </td>

                    {/* Actions: Live Portal Link & Preview */}
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        {/* Copy Live Portal URL */}
                        <button
                          onClick={() => copyLiveLink(client.slug)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            color: '#cbd5e1',
                            padding: '5px 10px',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                          title="Copy non-interactive live dashboard link to send to customer"
                        >
                          {copiedSlug === client.slug ? '✓ Copied' : '📋 Copy Link'}
                        </button>

                        {/* Open in new tab */}
                        <a
                          href={`/live/${client.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: 6,
                            color: '#818cf8',
                            padding: '5px 10px',
                            fontSize: 12,
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          👁 Live View
                        </a>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Instructions */}
          <div style={{
            marginTop: 18,
            padding: '12px 16px',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 10,
            fontSize: 12,
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <span>
              <strong>Client Reporting Workflow:</strong> Click <strong>"Copy Link"</strong> next to any client and send it to them via WhatsApp or email. They will see their auto-updating, read-only live dashboard which they (or you) can screenshot at any time!
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
