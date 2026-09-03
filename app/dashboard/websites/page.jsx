'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
        return <span className="liquid-pill" style={{ color: '#34d399', fontSize: 11, fontWeight: 600, padding: '4px 10px' }}>● Live</span>
      case 'review':
        return <span className="liquid-pill" style={{ color: '#fbbf24', fontSize: 11, fontWeight: 600, padding: '4px 10px' }}>In Review</span>
      case 'in_development':
      default:
        return <span className="liquid-pill" style={{ color: '#38bdf8', fontSize: 11, fontWeight: 600, padding: '4px 10px' }}>In Development</span>
    }
  }

  const totalVisitors = clients.reduce((acc, c) => acc + (c.website?.monthlyVisitors || 0), 0)
  const totalLeads = clients.reduce((acc, c) => acc + (c.website?.leadsCaptured || 0), 0)
  const liveWebsitesCount = clients.filter(c => c.website?.status === 'live').length

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.025em' }}>
            Website Design Studio
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: 13, letterSpacing: '-0.01em' }}>
            Production domains, staging previews, visitor traffic, and inbound lead funnels.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="liquid-pill" style={{ display: 'inline-flex', padding: 3 }}>
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'live', label: 'Live' },
            { id: 'review', label: 'In Review' },
            { id: 'in_development', label: 'In Dev' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: statusFilter === tab.id ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: 980,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: statusFilter === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Apple Liquid Glass Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        
        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Active Client Sites
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            {clients.length} <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            {liveWebsitesCount} live in production
          </div>
        </div>

        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Aggregate Monthly Traffic
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>
            {totalVisitors.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>
            Across client domains
          </div>
        </div>

        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Inbound Leads & Bookings
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c084fc', letterSpacing: '-0.03em' }}>
            +{totalLeads}
          </div>
          <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>
            Form captures & reservations
          </div>
        </div>

        <div className="liquid-glass" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
            Target PageSpeed Score
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>
            99 <span style={{ fontSize: 16, color: '#64748b' }}>/ 100</span>
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
            Next.js Core Web Vitals
          </div>
        </div>

      </div>

      {/* Website Project Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {filteredClients.length === 0 ? (
          <div className="liquid-glass" style={{
            gridColumn: '1 / -1', padding: '48px 32px', textAlign: 'center', borderRadius: 24,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: '#38bdf8' }}>🌐</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              No Active Website Projects Yet
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 460, margin: '0 auto 20px auto', lineHeight: 1.5 }}>
              You have 20 verified Potential Buyers in Pune with weak or missing websites. Pitch and convert your first prospect to start their custom website build.
            </p>
            <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontSize: 12 }}>
              View 20 Potential Buyers →
            </Link>
          </div>
        ) : (
          filteredClients.map(client => {
            const web = client.website || {}
            return (
              <div
                key={client.id}
                className="liquid-glass"
                style={{ padding: '24px 26px', position: 'relative' }}
              >
                {/* Header: Name & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
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
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                }}>
                  <span style={{ color: '#64748b' }}>Domain:</span>
                  <a
                    href={web.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {web.domain?.replace(/^https?:\/\//, '') || 'staging'} ↗
                  </a>
                </div>

                {/* Performance Metrics */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Speed</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
                      {web.speedScore || 99}/100
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Monthly Visits</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                      {web.monthlyVisitors?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Leads</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#c084fc', marginTop: 2 }}>
                      +{web.leadsCaptured || 0}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
