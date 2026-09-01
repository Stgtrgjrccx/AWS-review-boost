'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        borderRadius: 10, padding: '10px 14px', fontSize: 13,
      }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const session = useSession()?.data
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then(r => r.json()),
      fetch('/api/analytics/chart').then(r => r.json()),
      fetch('/api/analytics/recent').then(r => r.json()),
    ]).then(([s, c, r]) => {
      setStats(s)
      setChartData(c.data || [])
      setRecentRequests(r.requests || [])
      setLoading(false)
    }).catch(() => {
      // Use mock data if API fails in dev
      setStats({ sent: 142, clicked: 98, rated: 67, avgRating: 4.7, negativeFeedback: 5, conversionRate: 47 })
      setChartData(Array.from({ length: 7 }, (_, i) => ({
        date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        sent: Math.floor(Math.random() * 20) + 10,
        clicked: Math.floor(Math.random() * 15) + 5,
      })))
      setRecentRequests([
        { id: '1', customer: { name: 'Priya Sharma' }, channel: 'whatsapp', status: 'delivered', starRating: 5, createdAt: new Date().toISOString() },
        { id: '2', customer: { name: 'Rahul Mehta' }, channel: 'sms', status: 'clicked', starRating: null, createdAt: new Date().toISOString() },
        { id: '3', customer: { name: 'Sneha Patel' }, channel: 'whatsapp', status: 'sent', starRating: null, createdAt: new Date().toISOString() },
      ])
      setLoading(false)
    })
  }, [])

  const statCards = [
    { label: 'Requests Sent', value: stats?.sent ?? '—', change: '+12%', variant: 'brand', icon: '📤' },
    { label: 'Click Rate', value: stats ? `${stats.conversionRate}%` : '—', change: '+5%', variant: 'success', icon: '👆' },
    { label: 'Avg Star Rating', value: stats?.avgRating ?? '—', change: '+0.3', variant: 'gold', icon: '⭐' },
    { label: 'Feedback Received', value: stats?.negativeFeedback ?? '—', change: '-2', variant: 'danger', icon: '📥' },
  ]

  const statusBadge = (status) => {
    const map = {
      pending: ['badge-muted', '⏳ Pending'],
      sent: ['badge-info', '📤 Sent'],
      delivered: ['badge-success', '✅ Delivered'],
      clicked: ['badge-warning', '👆 Clicked'],
      failed: ['badge-danger', '❌ Failed'],
    }
    const [cls, text] = map[status] || ['badge-muted', status]
    return <span className={`badge ${cls}`}>{text}</span>
  }

  return (
    <div>
      {/* Welcome */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋</h1>
          <p>Here's how your review campaigns are performing today.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/send" className="btn btn-primary">
            💬 Send Review Request
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map(s => (
          <div key={s.label} className={`stat-card ${s.variant}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div className="stat-label">{s.label}</div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div className="stat-value">{loading ? '...' : s.value}</div>
            <div className={`stat-change ${s.variant === 'danger' ? '' : ''}`}>
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Area Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Review Requests</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last 7 days</p>
            </div>
            <select className="form-select" style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradClicked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sent" name="Sent" stroke="#6366f1" fill="url(#gradSent)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicked" name="Clicked" stroke="#10b981" fill="url(#gradClicked)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Star distribution */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Star Ratings</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Customer responses</p>
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, width: 16 }}>{star}</span>
              <span style={{ fontSize: 14 }}>⭐</span>
              <div style={{ flex: 1, height: 8, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${[68, 18, 7, 4, 3][5 - star]}%`,
                  background: star >= 4 ? '#10b981' : star === 3 ? '#f59e0b' : '#ef4444',
                  borderRadius: 4,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 30 }}>
                {[68, 18, 7, 4, 3][5 - star]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Review Requests</h3>
          <Link href="/dashboard/campaigns" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {r.customer?.name?.[0] || '?'}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                        {r.customer?.name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {r.channel === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS'}
                    </span>
                  </td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    {r.starRating
                      ? <span style={{ fontWeight: 700 }}>{'⭐'.repeat(r.starRating)}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
                    }
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentRequests.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No requests yet</h3>
              <p>Send your first review request to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 20 }}>
        {[
          { href: '/dashboard/send', icon: '💬', label: 'Send Single Request', desc: 'Enter a customer\'s number' },
          { href: '/dashboard/campaigns', icon: '📢', label: 'Launch Campaign', desc: 'Upload CSV & bulk send' },
          { href: '/dashboard/qr-codes', icon: '📲', label: 'Get QR Code', desc: 'Print for your counter' },
          { href: '/dashboard/feedback', icon: '📥', label: 'Check Feedback', desc: 'View private complaints' },
        ].map(a => (
          <Link key={a.href} href={a.href} className="card" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
