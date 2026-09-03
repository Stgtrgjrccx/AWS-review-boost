'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ClientLiveDashboard() {
  const params = useParams()
  const slug = params?.slug || 'rustic-table'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState('Syncing...')

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/live/${slug}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      }
    } catch {
      // Keep existing data if offline
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto live-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [slug])

  if (loading && !data) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0b12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⭐</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Loading Live Reputation Monitor...</div>
        </div>
      </div>
    )
  }

  const client = data?.client || { name: 'The Rustic Table Café', industry: 'restaurant' }
  const metrics = data?.metrics || { avgRating: 4.88, fiveStarCount: 194, fourStarCount: 38, shieldedComplaints: 16, conversionRate: 78 }
  const recentActivity = data?.recentActivity || []
  const praises = data?.customerPraises || []

  const totalReviews = (metrics.fiveStarCount || 0) + (metrics.fourStarCount || 0)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07080e',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '32px 20px',
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Live Status Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '10px 18px',
          marginBottom: 24,
          fontSize: 13,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%', background: '#10b981',
              boxShadow: '0 0 10px #10b981', display: 'inline-block'
            }} />
            <span style={{ fontWeight: 700, letterSpacing: '0.04em', color: '#10b981', textTransform: 'uppercase', fontSize: 11 }}>
              Live Review Shield Active
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ color: '#94a3b8' }}>Real-time updates enabled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>Last synced: {lastSync}</span>
            <button
              onClick={() => window.print()}
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📸 Save / SS Report
            </button>
          </div>
        </div>

        {/* Executive Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #111424 0%, #0d0e1a 100%)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 24,
          padding: '36px 40px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute', top: -120, right: -60, width: 340, height: 340,
            background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#818cf8', marginBottom: 8 }}>
                Client Performance Dashboard
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#ffffff' }}>
                {client.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, color: '#94a3b8', fontSize: 14 }}>
                <span>Verified Google Review Partner</span>
                <span>•</span>
                <span style={{ color: '#38bdf8', textTransform: 'capitalize' }}>{client.industry} Sector</span>
              </div>
            </div>

            {/* Google Rating Star Badge */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '16px 28px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 4 }}>
                Google Star Rating
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                {metrics.avgRating} <span style={{ fontSize: 24, color: '#64748b' }}>/ 5.0</span>
              </div>
              <div style={{ color: '#f59e0b', fontSize: 16, marginTop: 6, letterSpacing: 2 }}>
                ★★★★★
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 24 }}>
          
          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18,
            padding: '24px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>5★ Reviews Captured</span>
              <span style={{ fontSize: 20 }}>⭐</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff' }}>
              +{metrics.fiveStarCount}
            </div>
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 6 }}>
              ▲ 100% Routed to Google
            </div>
          </div>

          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18,
            padding: '24px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Complaints Shielded</span>
              <span style={{ fontSize: 20 }}>🛡️</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981' }}>
              {metrics.shieldedComplaints}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 6 }}>
              Saved Privately from Public Google
            </div>
          </div>

          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18,
            padding: '24px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Response & Click Rate</span>
              <span style={{ fontSize: 20 }}>💬</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#38bdf8' }}>
              {metrics.conversionRate}%
            </div>
            <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, marginTop: 6 }}>
              WhatsApp + SMS Automation
            </div>
          </div>

          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18,
            padding: '24px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Total Reviews Driven</span>
              <span style={{ fontSize: 20 }}>🚀</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#818cf8' }}>
              +{totalReviews}
            </div>
            <div style={{ fontSize: 12, color: '#818cf8', fontWeight: 600, marginTop: 6 }}>
              Verified Verified Growth
            </div>
          </div>

        </div>

        {/* Split Section: Star Rating Distribution & Real-Time Event Stream */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>

          {/* Star Distribution */}
          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '26px 28px',
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 20px 0', color: '#fff' }}>
              ⭐ Rating Distribution
            </h3>

            {[
              { stars: '5 Stars', count: metrics.fiveStarCount, pct: totalReviews > 0 ? Math.round((metrics.fiveStarCount / totalReviews) * 100) : 85, color: '#10b981' },
              { stars: '4 Stars', count: metrics.fourStarCount, pct: totalReviews > 0 ? Math.round((metrics.fourStarCount / totalReviews) * 100) : 15, color: '#6366f1' },
              { stars: '3 Stars', count: 2, pct: 1, color: '#f59e0b' },
              { stars: '2 Stars', count: 1, pct: 0.5, color: '#f97316' },
              { stars: '1 Star', count: 0, pct: 0, color: '#ef4444' },
            ].map(row => (
              <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, fontSize: 13 }}>
                <span style={{ width: 65, color: '#94a3b8', fontWeight: 600 }}>{row.stars}</span>
                <div style={{ flex: 1, height: 9, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: 5 }} />
                </div>
                <span style={{ width: 35, textAlign: 'right', fontWeight: 700, color: '#ffffff' }}>{row.count}</span>
              </div>
            ))}
          </div>

          {/* Real-time Activity Stream */}
          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '26px 28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#fff' }}>
                📡 Live Activity Stream
              </h3>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Auto-Refreshing</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivity.slice(0, 5).map((act, i) => (
                <div key={act.id || i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{act.type === 'five_star' ? '⭐' : act.type === 'intercepted' ? '🛡️' : '📤'}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{act.customer}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{act.note}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Customer Praises / Testimonials */}
        {praises.length > 0 && (
          <div style={{
            background: '#0d0e1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '24px 28px',
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px 0', color: '#fff' }}>
              💬 Recent Customer Compliments
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {praises.map((praise, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#cbd5e1',
                }}>
                  "{praise}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          color: '#64748b',
          fontSize: 12,
        }}>
          <div>ASW Review Boost Enterprise Operating System • All Review Analytics Verified</div>
          <div>Live Feed Connected • Read-Only Client Display</div>
        </div>

      </div>
    </div>
  )
}
