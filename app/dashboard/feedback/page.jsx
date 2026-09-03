'use client'
import { useEffect, useState } from 'react'

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/feedback')
      .then(r => r.json())
      .then(d => { setFeedbacks(d.feedbacks || []); setLoading(false) })
      .catch(() => {
        setFeedbacks([])
        setLoading(false)
      })
  }, [])

  const markResolved = async (id) => {
    await fetch(`/api/feedback/${id}/resolve`, { method: 'POST' })
    setFeedbacks(f => f.map(item => item.id === id ? { ...item, resolved: true } : item))
  }

  const filtered = feedbacks.filter(f => filter === 'all' ? true : filter === 'unresolved' ? !f.resolved : f.resolved)

  const starColor = (rating) => {
    if (rating <= 1) return '#ef4444'
    if (rating <= 2) return '#f97316'
    return '#f59e0b'
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>📥 Feedback Inbox</h1>
          <p>Private complaints from customers who rated 1–3 stars. Handle these before they go public.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'unresolved', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              style={{ textTransform: 'capitalize' }}
            >
              {f} {f === 'unresolved' && feedbacks.filter(x => !x.resolved).length > 0
                ? `(${feedbacks.filter(x => !x.resolved).length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      {feedbacks.filter(f => !f.resolved).length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 14, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24, fontSize: 14,
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <strong>Action required:</strong> You have {feedbacks.filter(f => !f.resolved).length} unresolved complaint{feedbacks.filter(f => !f.resolved).length > 1 ? 's' : ''}.
            Respond quickly to turn unhappy customers into loyal ones.
          </div>
        </div>
      )}

      {/* Feedback Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <h3>{filter === 'unresolved' ? 'No unresolved complaints!' : 'No feedback yet'}</h3>
            <p>{filter === 'unresolved' ? 'All complaints have been addressed.' : 'Private feedback from 1-3 star ratings will appear here.'}</p>
          </div>
        )}

        {filtered.map(fb => (
          <div key={fb.id} className="card" style={{
            borderLeft: `4px solid ${starColor(fb.starRating)}`,
            opacity: fb.resolved ? 0.6 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar">
                  {fb.customer?.name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{fb.customer?.name || 'Anonymous'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Star rating */}
                <div style={{
                  display: 'flex', gap: 2, background: `${starColor(fb.starRating)}18`,
                  borderRadius: 8, padding: '5px 10px',
                }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ fontSize: 14, filter: i < fb.starRating ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
                  ))}
                </div>
                <span className={`badge ${fb.resolved ? 'badge-success' : 'badge-danger'}`}>
                  {fb.resolved ? '✅ Resolved' : '🔴 Needs Action'}
                </span>
              </div>
            </div>

            {/* Quick tags */}
            {fb.quickTags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {fb.quickTags.map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#ef4444',
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Comment */}
            {fb.comment && (
              <div style={{
                background: 'var(--bg-input)', borderRadius: 10, padding: '12px 16px',
                fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16,
                fontStyle: 'italic',
              }}>
                "{fb.comment}"
              </div>
            )}

            {/* Actions */}
            {!fb.resolved && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => markResolved(fb.id)}
                  className="btn btn-success btn-sm"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '7px 14px', fontSize: 13 }}
                >
                  ✅ Mark Resolved
                </button>
                {fb.customer?.phone && (
                  <a
                    href={`tel:${fb.customer.phone}`}
                    className="btn btn-secondary btn-sm"
                  >
                    📞 Call Customer
                  </a>
                )}
                {fb.customer?.phone && (
                  <a
                    href={`https://wa.me/${fb.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(fb.customer.name || '')}%2C%20we%27re%20sorry%20about%20your%20experience.%20Could%20we%20make%20it%20right%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ background: 'rgba(37,211,102,0.08)', color: '#25d366', borderColor: 'rgba(37,211,102,0.2)' }}
                  >
                    💬 WhatsApp Reply
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
