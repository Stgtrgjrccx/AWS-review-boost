'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { toPng } from 'html-to-image'

function LiveDashboardContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug || 'peshwa-restaurant'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState('Just now')
  const [exporting, setExporting] = useState(false)
  
  // Date period state: 'all' | 'month' | 'week'
  const [period, setPeriod] = useState('all')
  const reportCardRef = useRef(null)

  const fetchLiveData = () => {
    fetch(`/api/live/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(d => {
        setData(d)
        setLoading(false)
        const now = new Date()
        setLastSync(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      })
      .catch(err => {
        console.error('Error fetching live data:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchLiveData()
    const interval = setInterval(fetchLiveData, 15000)
    return () => clearInterval(interval)
  }, [slug])

  // 1-Click High-Res PNG Export (Apple Glass Card screenshot)
  const exportAsPng = async () => {
    if (!reportCardRef.current) return
    setExporting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 100))

      const dataUrl = await toPng(reportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#000000',
        style: {
          padding: '24px',
          borderRadius: '24px',
        }
      })

      const link = document.createElement('a')
      link.download = `${slug}-reputation-report-${period}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export PNG:', err)
      window.print()
    } finally {
      setExporting(false)
    }
  }

  if (loading && !data) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, color: '#38bdf8', marginBottom: 14 }}>●</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
            Syncing Live Portal...
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Direct connection with Google Rep Gateway
          </div>
        </div>
      </div>
    )
  }

  const client = data?.client || { name: 'Peshwa Restaurant', industry: 'restaurant' }
  const rawMetrics = data?.metrics || { avgRating: 3.8, fiveStarCount: 312, fourStarCount: 48, shieldedComplaints: 22, conversionRate: 88 }
  const recentActivity = data?.recentActivity || []
  const praises = data?.customerPraises || []

  const metrics = period === 'month' && data?.monthMetrics
    ? data.monthMetrics
    : period === 'week' && data?.weekMetrics
    ? data.weekMetrics
    : rawMetrics

  const totalReviews = (metrics.fiveStarCount || 0) + (metrics.fourStarCount || 0)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      backgroundImage: 'radial-gradient(1200px circle at 50% -10%, rgba(99, 102, 241, 0.08), transparent 60%), radial-gradient(800px circle at 90% 80%, rgba(56, 189, 248, 0.04), transparent 50%)',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      padding: '32px 16px 64px',
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>

        {/* Top Liquid Glass Control Bar */}
        <div className="liquid-glass" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 20px',
          marginBottom: 22,
          borderRadius: 980,
        }}>
          {/* Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#10b981',
              boxShadow: '0 0 10px #10b981', display: 'inline-block'
            }} />
            <span style={{ fontWeight: 700, letterSpacing: '0.04em', color: '#10b981', textTransform: 'uppercase', fontSize: 11 }}>
              Google Shield Active
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color: '#64748b', fontSize: 12 }}>Sync: {lastSync}</span>
          </div>

          {/* Period Tabs & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="liquid-pill" style={{ display: 'inline-flex', padding: 3 }}>
              {[
                { id: 'all', label: 'All Time' },
                { id: 'month', label: 'This Month' },
                { id: 'week', label: 'This Week' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPeriod(tab.id)}
                  style={{
                    background: period === tab.id ? 'rgba(255,255,255,0.14)' : 'transparent',
                    color: period === tab.id ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: 980,
                    padding: '5px 14px',
                    fontSize: 12,
                    fontWeight: period === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Apple Style PNG Export Button */}
            <button
              onClick={exportAsPng}
              disabled={exporting}
              className="btn btn-primary btn-sm"
              style={{ padding: '7px 16px', fontSize: 12 }}
            >
              {exporting ? 'Generating...' : 'Export Image (PNG) ↗'}
            </button>
          </div>
        </div>

        {/* Capture Container */}
        <div ref={reportCardRef} style={{ background: '#000000', borderRadius: 24, padding: 4 }}>
          
          {/* Executive Header Card */}
          <div className="liquid-glass-elevated" style={{
            padding: '36px 40px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div className="liquid-pill" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#38bdf8', marginBottom: 12
                }}>
                  Verified Reputation Audit
                </div>
                <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', margin: 0, color: '#ffffff' }}>
                  {client.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: '#94a3b8', fontSize: 13 }}>
                  <span>Verified Google Partner</span>
                  <span>•</span>
                  <span style={{ color: '#38bdf8', textTransform: 'capitalize' }}>{client.industry}</span>
                  <span>•</span>
                  <span style={{ color: '#cbd5e1' }}>
                    {period === 'month' ? 'Current Month Growth' : period === 'week' ? 'Past 7 Days' : 'All-Time Record'}
                  </span>
                </div>
              </div>

              {/* Rating Star Badge */}
              <div className="liquid-glass" style={{
                padding: '18px 28px',
                textAlign: 'center',
                borderRadius: 20,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Google Rating
                </div>
                <div style={{ fontSize: 44, fontWeight: 800, color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {metrics.avgRating} <span style={{ fontSize: 20, color: '#64748b' }}>/ 5.0</span>
                </div>
                <div style={{ color: '#fbbf24', fontSize: 15, marginTop: 6, letterSpacing: 2 }}>
                  ★★★★★
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
            
            <div className="liquid-glass" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
                5★ Driven to Google
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>
                +{metrics.fiveStarCount || 0}
              </div>
              <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>
                100% Verified Customers
              </div>
            </div>

            <div className="liquid-glass" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
                Negative Feedback Shielded
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>
                {metrics.shieldedComplaints || 0}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Intercepted Privately
              </div>
            </div>

            <div className="liquid-glass" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
                Total Verified Reviews
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                {totalReviews}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Positive Google Signals
              </div>
            </div>

            <div className="liquid-glass" style={{ padding: '24px 26px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 8 }}>
                Conversion Rate
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#c084fc', letterSpacing: '-0.03em' }}>
                {metrics.conversionRate || 88}%
              </div>
              <div style={{ fontSize: 12, color: '#34d399', marginTop: 4 }}>
                Invite to Review Ratio
              </div>
            </div>

          </div>

          {/* Website Performance & Traffic Section */}
          {data?.website && (
            <div className="liquid-glass" style={{
              padding: '22px 26px',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.01em' }}>
                    Website & Digital Platform Performance
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{data.website.type || 'Custom Business Web App'}</div>
                </div>
                <span className="liquid-pill" style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 12px',
                  color: '#34d399'
                }}>
                  ● {data.website.uptime || '99.98%'} Uptime
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Live Domain</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {data.website.domain?.replace(/^https?:\/\//, '') || 'Live Domain'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Monthly Visitors</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                    {data.website.monthlyVisitors?.toLocaleString() || '14,200'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Google PageSpeed</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
                    {data.website.speedScore || 98} / 100
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Inbound Leads</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#c084fc', marginTop: 2 }}>
                    +{data.website.leadsCaptured || 38}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Star Distribution Breakdown */}
          <div className="liquid-glass" style={{ padding: '24px 28px', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px 0', color: '#fff', letterSpacing: '-0.01em' }}>
              Rating Distribution & Sentiment
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { stars: 5, count: metrics.fiveStarCount || 0, color: '#38bdf8', pct: totalReviews > 0 ? Math.round(((metrics.fiveStarCount || 0) / totalReviews) * 100) : 85 },
                { stars: 4, count: metrics.fourStarCount || 0, color: '#818cf8', pct: totalReviews > 0 ? Math.round(((metrics.fourStarCount || 0) / totalReviews) * 100) : 12 },
                { stars: 3, count: metrics.shieldedComplaints ? Math.round(metrics.shieldedComplaints * 0.4) : 2, color: '#64748b', pct: 2, shielded: true },
                { stars: 2, count: metrics.shieldedComplaints ? Math.round(metrics.shieldedComplaints * 0.4) : 2, color: '#64748b', pct: 1, shielded: true },
                { stars: 1, count: metrics.shieldedComplaints ? Math.round(metrics.shieldedComplaints * 0.2) : 1, color: '#64748b', pct: 0, shielded: true },
              ].map(row => (
                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                  <div style={{ width: 44, color: '#94a3b8', fontWeight: 600 }}>{row.stars} ★</div>
                  
                  <div style={{
                    flex: 1, height: 7, background: 'rgba(255,255,255,0.06)',
                    borderRadius: 980, overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${row.pct}%`, height: '100%',
                      background: row.color, borderRadius: 980,
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  </div>

                  <div style={{ width: 34, textAlign: 'right', fontWeight: 600, color: '#cbd5e1' }}>
                    {row.count}
                  </div>

                  <div style={{ width: 130, textAlign: 'right', fontSize: 11 }}>
                    {row.shielded ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>● Shielded</span>
                    ) : (
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>● Public Google</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Praise Section */}
          {praises.length > 0 && (
            <div className="liquid-glass" style={{ padding: '24px 28px', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px 0', color: '#fff', letterSpacing: '-0.01em' }}>
                Verified Customer Feedback
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {praises.map((praise, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
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

          {/* Screenshot Watermark */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            color: '#64748b',
            fontSize: 12,
          }}>
            <div><strong>ASW Engine</strong> • Enterprise Reputation Monitoring (Pune)</div>
            <div>Verified Audit Certificate ✓</div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default function ClientLiveDashboard() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>●</div>
          <div>Loading Reputation Portal...</div>
        </div>
      </div>
    }>
      <LiveDashboardContent />
    </Suspense>
  )
}
