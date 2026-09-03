'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🎯', label: 'Potential Buyers (20)' },
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
      .then(d => setFeedbackCount(d.count || 0))
      .catch(() => {})
  }, [])

  const currentSlug = selectedClient?.slug || ''
  const livePortalUrl = typeof window !== 'undefined' && currentSlug
    ? `${window.location.origin}/live/${currentSlug}`
    : ''

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
      {/* Sidebar - Apple Liquid Glass VisionOS Style */}
      <aside className="sidebar" style={{
        background: 'rgba(10, 12, 18, 0.65)',
        backdropFilter: 'blur(40px) saturate(190%)',
        WebkitBackdropFilter: 'blur(40px) saturate(190%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.05)',
      }}>
        <div className="sidebar-logo" style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 14,
          }}>
            ⌘
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ASW Studio
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Opera Cloud OS
            </div>
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

          {clients.length === 0 ? (
            <div style={{ padding: '6px 2px' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                0 Active Clients
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                Pitch the 20 Pune leads below to onboard your first client.
              </div>
            </div>
          ) : (
            <>
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

              {currentSlug && (
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
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && feedbackCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 800,
                  }}>
                    {feedbackCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontWeight: 600 }}>Pune Market</div>
            <div>20 Verified Leads</div>
          </div>
          <div style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 6,
            padding: '3px 8px',
            color: '#10b981',
            fontWeight: 700,
            fontSize: 10,
          }}>
            LIVE
          </div>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="dashboard-main" style={{ background: 'transparent' }}>
        <header className="topbar" style={{
          background: 'rgba(10, 12, 18, 0.65)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16 }}>{activePage?.icon}</span>
            <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{activePage?.label || 'Operations'}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>/</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
              {selectedClient ? (
                <>Active Client: <strong style={{ color: '#fff', fontWeight: 600 }}>{selectedClient.name}</strong></>
              ) : (
                <>Pipeline: <strong style={{ color: '#38bdf8', fontWeight: 600 }}>20 Potential Buyers (Pune)</strong></>
              )}
            </span>
          </div>

          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="/exports/pune_business_leads_under_4_stars.xlsx"
              download="pune_business_leads_under_4_stars.xlsx"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 12 }}
            >
              📊 Export Leads (.xlsx)
            </a>

            {selectedClient && currentSlug && (
              <>
                <button
                  onClick={copyLivePortal}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                >
                  <span>📋</span>
                  <span>{copied ? 'Link Copied!' : 'Copy Client Portal Link'}</span>
                </button>
                <a
                  href={`/review/${currentSlug}?name=Customer`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12 }}
                >
                  ⭐ Review Funnel
                </a>
              </>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: 12 }}
            >
              + Onboard Client
            </button>
          </div>
        </header>

        <div className="page-content" style={{ padding: '28px 32px' }}>
          {children}
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'rgba(15, 18, 28, 0.85)',
            backdropFilter: 'blur(50px) saturate(200%)',
            WebkitBackdropFilter: 'blur(50px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 24, padding: 32, width: '100%', maxWidth: 500,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 35px 80px rgba(0,0,0,0.8)'
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
