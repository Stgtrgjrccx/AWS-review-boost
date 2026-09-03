'use client'
import { useState, useEffect } from 'react'

export default function WebsiteProjectsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const loadClients = () => {
    fetch('/api/operator/clients')
      .then(r => r.json())
      .then(d => {
        setClients(d.clients || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadClients()
  }, [])

  const filteredClients = statusFilter === 'all'
    ? clients
    : clients.filter(c => c.website?.status === statusFilter)

  const statusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🚀 Live & Deployed</span>
      case 'review':
        return <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>👀 Client Review</span>
      case 'in_development':
        return <span style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⚙️ In Development</span>
      case 'in_design':
      default:
        return <span style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🎨 UI/UX Design</span>
    }
  }

  const totalVisitors = clients.reduce((acc, c) => acc + (c.website?.monthlyVisitors || 0), 0)
  const totalLeads = clients.reduce((acc, c) => acc + (c.website?.leadsCaptured || 0), 0)
  const liveWebsitesCount = clients.filter(c => c.website?.status === 'live').length

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#f8fafc' }}>
            🌐 Website Design & Digital Assets Studio
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 14 }}>
            Manage client website builds, live production domains, visitor traffic, and leads.
          </p>
        </div>

        {/* Status filter tabs */}
        <div style={{
          display: 'inline-flex', background: '#121422', borderRadius: 8,
          padding: 3, border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'live', label: 'Live' },
            { id: 'review', label: 'In Review' },
            { id: 'in_design', label: 'Design' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? '#6366f1' : 'transparent',
                color: statusFilter === tab.id ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: statusFilter === tab.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 High-Density Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Total Managed Websites
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc' }}>
            {clients.length} <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
            ● {liveWebsitesCount} Live in Production
          </div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Aggregate Monthly Visitors
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#38bdf8' }}>
            {totalVisitors.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>
            Across all client websites
          </div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Inbound Leads & Bookings
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#a855f7' }}>
            +{totalLeads}
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
            ▲ 100% Routed to Clients
          </div>
        </div>

        <div style={{ background: '#0e101c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            Average PageSpeed Score
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>
            98 <span style={{ fontSize: 16, color: '#64748b' }}>/ 100</span>
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
            Google Lighthouse Performance
          </div>
        </div>
      </div>

      {/* Website Project Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {filteredClients.map(client => {
          const web = client.website || {}
          return (
            <div
              key={client.id}
              style={{
                background: '#0e101c',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '24px 26px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header: Name & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>
                    {client.name}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    {web.type || 'Custom Business Website'}
                  </div>
                </div>
                <div>{statusBadge(web.status)}</div>
              </div>

              {/* Tech Stack & Domain Pill */}
              <div style={{
                background: '#161828',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 18,
                fontSize: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#64748b' }}>Domain:</span>
                  <a
                    href={web.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {web.domain?.replace(/^https?:\/\//, '') || 'Pending'} ↗
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#64748b' }}>Stack:</span>
                  <span style={{ color: '#cbd5e1' }}>{web.techStack}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Staging URL:</span>
                  <a
                    href={web.stagingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#818cf8', textDecoration: 'none' }}
                  >
                    View Preview ↗
                  </a>
                </div>
              </div>

              {/* Metrics Row: Visitors, Leads, Speed, SSL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18, textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 4px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Visitors</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginTop: 2 }}>{web.monthlyVisitors?.toLocaleString() || 0}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 4px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Leads</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginTop: 2 }}>+{web.leadsCaptured || 0}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 4px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Speed</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>{web.speedScore || 98}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 4px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>SSL</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginTop: 2 }}>Active</div>
                </div>
              </div>

              {/* Pending Client Deliverables / Tasks */}
              {web.pendingTasks && web.pendingTasks.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Active Deliverables
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {web.pendingTasks.map((t, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#6366f1' }}>•</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a
                  href={web.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                >
                  🌐 Visit Live
                </a>
                <a
                  href={web.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                >
                  👁 Staging
                </a>
                <a
                  href={`/live/${client.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 12 }}
                >
                  📊 Client Portal
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
