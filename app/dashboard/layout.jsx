'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏢', label: 'Operations Hub' },
  { href: '/dashboard/websites', icon: '🌐', label: 'Website Design Studio' },
  { href: '/dashboard/send', icon: '📤', label: 'Dispatch Console' },
  { href: '/dashboard/campaigns', icon: '📢', label: 'Bulk Campaigns' },
  { href: '/dashboard/feedback', icon: '🛡️', label: 'Feedback Vault', badge: true },
  { href: '/dashboard/qr-codes', icon: '📲', label: 'Tabletop QR & NFC' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'System Config' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [feedbackCount, setFeedbackCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', industry: 'restaurant', googleReviewUrl: '', phone: '' })

  useEffect(() => {
    fetch('/api/operator/clients')
      .then(r => r.json())
      .then(d => {
        const list = d.clients || []
        setClients(list)
        if (list.length > 0 && !selectedClient) {
          setSelectedClient(list[0])
        }
      })
      .catch(() => {})

    fetch('/api/analytics/feedback-count')
      .then(r => r.json())
      .then(d => setFeedbackCount(d.count || 2))
      .catch(() => {})
  }, [])

  const currentSlug = selectedClient?.slug || 'rustic-table'
  const livePortalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/live/${currentSlug}`
    : `/live/${currentSlug}`

  const copyLivePortal = () => {
    navigator.clipboard.writeText(livePortalUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleCreateClient = async (e) => {
    e.preventDefault()
    if (!newClient.name) return
    const res = await fetch('/api/operator/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    })
    const data = await res.json()
    if (data.client) {
      setClients(prev => [data.client, ...prev])
      setSelectedClient(data.client)
      setShowAddModal(false)
      setNewClient({ name: '', industry: 'restaurant', googleReviewUrl: '', phone: '' })
    }
  }

  const activePage = NAV_ITEMS.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Opera Cloud Enterprise Style */}
      <aside className="sidebar" style={{ background: '#0b0c16', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="sidebar-logo" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 18, marginBottom: 16 }}>
          <div className="sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>⚡</div>
          <div className="sidebar-logo-text">
            ASW <span>Cloud Ops</span>
          </div>
        </div>

        {/* Client Property Selector Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Client Property
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'rgba(99,102,241,0.2)', border: 'none', color: '#818cf8',
                borderRadius: 6, fontSize: 11, fontWeight: 700, padding: '2px 8px', cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>

          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const found = clients.find(c => c.id === e.target.value)
              if (found) setSelectedClient(found)
            }}
            style={{
              width: '100%',
              background: '#151726',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#f8fafc',
              padding: '8px 10px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.industry})
              </option>
            ))}
          </select>

          {/* Quick link to client's live portal */}
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <a
              href={`/live/${currentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: 'center',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#10b981',
                padding: '6px 8px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              👁 View Live Portal
            </a>
            <button
              onClick={copyLivePortal}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 11,
                cursor: 'pointer',
              }}
              title="Copy link to send to customer"
            >
              {copied ? '✓ Copied' : '📋 Link'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Operations Console</div>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && feedbackCount > 0 && (
                <span className="nav-badge" style={{ background: '#ef4444', color: '#fff' }}>{feedbackCount}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer: System Status */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
            System Gateway Health
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>SMS / WhatsApp</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Database Sync</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Operator Mode</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Single Master</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="dashboard-main" style={{ background: '#07080e' }}>
        <header className="topbar" style={{ background: '#0b0c16', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{activePage?.icon}</span>
            <span>{activePage?.label || 'Operations'}</span>
            <span style={{ color: '#64748b', fontSize: 14 }}>|</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
              Operating on: <strong style={{ color: '#fff' }}>{selectedClient?.name || 'All Clients'}</strong>
            </span>
          </div>

          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Direct button to copy client live portal */}
            <button
              onClick={copyLivePortal}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
            >
              <span>📋</span>
              <span>{copied ? 'Live Link Copied!' : 'Copy Client Dashboard Link'}</span>
            </button>

            {/* Test Customer Review Funnel */}
            <a
              href={`/review/${currentSlug}?name=Valued+Customer`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 12 }}
            >
              ⭐ Open Review Funnel
            </a>

            {/* Quick Dispatch */}
            <Link href="/dashboard/send" className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>
              + Dispatch Request
            </Link>
          </div>
        </header>

        <div className="page-content" style={{ padding: '28px 32px' }}>
          {children}
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0f111e', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: 32, width: '100%', maxWidth: 500,
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Add New Client Property</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#cbd5e1' }}>
                  Business / Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Grand Hotel"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: '#171929',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#cbd5e1' }}>
                  Industry Sector
                </label>
                <select
                  value={newClient.industry}
                  onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: '#171929',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14
                  }}
                >
                  <option value="restaurant">Restaurant / Café</option>
                  <option value="salon">Salon / Spa / Beauty</option>
                  <option value="medical">Medical / Clinic / Dental</option>
                  <option value="retail">Retail / Showroom</option>
                  <option value="hotel">Hotel / Hospitality</option>
                  <option value="home_services">Home Services / Contractor</option>
                  <option value="default">General Business</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#cbd5e1' }}>
                  Google Review URL (Target)
                </label>
                <input
                  type="url"
                  placeholder="https://g.page/r/.../review"
                  value={newClient.googleReviewUrl}
                  onChange={e => setNewClient({ ...newClient, googleReviewUrl: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: '#171929',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14
                  }}
                />
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  5-star rated customers are automatically redirected here.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  ✓ Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
