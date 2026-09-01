'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '📊', label: 'Overview' },
  { href: '/dashboard/client-view', icon: '📸', label: 'Client Report (SS)' },
  { href: '/dashboard/send', icon: '💬', label: 'Send Request' },
  { href: '/dashboard/campaigns', icon: '📢', label: 'Campaigns' },
  { href: '/dashboard/qr-codes', icon: '📲', label: 'QR Codes' },
  { href: '/dashboard/feedback', icon: '📥', label: 'Feedback Inbox', badge: true },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const session = useSession()?.data
  const [theme, setTheme] = useState('dark')
  const [feedbackCount, setFeedbackCount] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/api/analytics/feedback-count')
      .then(r => r.json())
      .then(d => setFeedbackCount(d.count || 0))
      .catch(() => {})
  }, [])

  const activePage = NAV_ITEMS.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⭐</div>
          <div className="sidebar-logo-text">
            ASW Review<span>Boost</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV_ITEMS.slice(0, 5).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Inbox</div>
          <Link
            href="/dashboard/feedback"
            className={`nav-item ${pathname.startsWith('/dashboard/feedback') ? 'active' : ''}`}
          >
            <span style={{ fontSize: 16 }}>📥</span>
            <span>Feedback Inbox</span>
            {feedbackCount > 0 && <span className="nav-badge">{feedbackCount}</span>}
          </Link>

          <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
          <Link href="/dashboard/settings" className={`nav-item ${pathname.startsWith('/dashboard/settings') ? 'active' : ''}`}>
            <span style={{ fontSize: 16 }}>⚙️</span>
            <span>Settings</span>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', marginBottom: 12 }}>
            <div className="avatar" style={{ fontSize: 13 }}>
              {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session?.user?.name || 'Business Owner'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session?.user?.email}
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
            </span>
            <button
              className={`theme-toggle ${theme === 'dark' ? 'dark' : ''}`}
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            />
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: 13 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar-title">
            {activePage?.icon} {activePage?.label || 'Dashboard'}
          </div>
          <div className="topbar-actions">
            {session?.user?.business?.name && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '6px 14px', fontSize: 13,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{session.user.business.name}</span>
              </div>
            )}
            <a
              href={`/review/${session?.user?.business?.slug || 'demo-restaurant'}?name=Valued+Customer`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="Test the live customer review page"
            >
              ⭐ Test Review Funnel
            </a>
            <Link href="/dashboard/send" className="btn btn-primary btn-sm">
              + Send Request
            </Link>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
