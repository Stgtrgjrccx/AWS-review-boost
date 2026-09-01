'use client'
import { useState } from 'react'

export default function SendRequestPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    messageType: 'template',
    channel: 'both',
    sendTime: 'immediate',
    scheduledAt: '',
    preview: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [generating, setGenerating] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generateAIMessage = async () => {
    if (!form.name) return
    setGenerating(true)
    const res = await fetch('/api/ai/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: form.name }),
    })
    const data = await res.json()
    set('preview', data.message || '')
    setGenerating(false)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSent(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const templatePreview = `Hi ${form.name || '[Customer Name]'}! Thanks for visiting us. We'd love to hear about your experience — could you spare 30 seconds to leave us a review? 👉 [link]`

  if (sent) {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1>Send Review Request</h1>
          </div>
        </div>
        <div style={{
          maxWidth: 500, margin: '0 auto',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 20, padding: 48, textAlign: 'center',
        }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Request Sent!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>
            A {form.channel === 'whatsapp' ? 'WhatsApp message' : 'message'} was sent to <strong>{form.name}</strong> at <strong>{form.phone}</strong>.
          </p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { setSent(false); setForm({ name: '', phone: '', messageType: 'template', channel: 'both', sendTime: 'immediate', scheduledAt: '', preview: '' }) }}
              className="btn btn-primary">
              Send Another
            </button>
            <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>💬 Send Review Request</h1>
          <p>Send a personalized WhatsApp or SMS to a customer asking for a review.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, maxWidth: 1000 }}>
        {/* Form */}
        <div className="card">
          <form onSubmit={handleSend}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Customer Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  className="form-input"
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '4px 0 20px' }} />
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Message Settings</h3>

            <div className="form-group">
              <label className="form-label">Message Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { value: 'template', label: '📝 Standard Template', desc: 'Simple and reliable' },
                  { value: 'ai', label: '🤖 AI Personalized', desc: 'Unique for each customer' },
                ].map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => set('messageType', opt.value)}
                    style={{
                      flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${form.messageType === opt.value ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                      background: form.messageType === opt.value ? 'rgba(99,102,241,0.08)' : 'var(--bg-input)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Channel</label>
              <select className="form-select" value={form.channel} onChange={e => set('channel', e.target.value)}>
                <option value="both">💬 WhatsApp first, SMS fallback (Recommended)</option>
                <option value="whatsapp">💬 WhatsApp only</option>
                <option value="sms">📱 SMS only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">When to Send</label>
              <select className="form-select" value={form.sendTime} onChange={e => set('sendTime', e.target.value)}>
                <option value="immediate">⚡ Send now</option>
                <option value="ai">🤖 AI picks best time (recommended)</option>
                <option value="scheduled">📅 Schedule for specific time</option>
              </select>
            </div>

            {form.sendTime === 'scheduled' && (
              <div className="form-group">
                <label className="form-label">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.scheduledAt}
                  onChange={e => set('scheduledAt', e.target.value)}
                />
              </div>
            )}

            {form.messageType === 'ai' && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>AI Generated Message</label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={generateAIMessage}
                    disabled={!form.name || generating}
                  >
                    {generating ? '⏳ Generating...' : '✨ Generate'}
                  </button>
                </div>
                <textarea
                  className="form-textarea"
                  value={form.preview}
                  onChange={e => set('preview', e.target.value)}
                  placeholder="Click 'Generate' to create an AI-personalized message, or type your own..."
                  style={{ minHeight: 80 }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
              disabled={loading || !form.name || !form.phone}
            >
              {loading ? '⏳ Sending...' : '🚀 Send Review Request'}
            </button>
          </form>
        </div>

        {/* Preview Panel */}
        <div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📱 Message Preview</h3>
            <div style={{
              background: '#0b141a',
              borderRadius: 16, padding: 20,
              minHeight: 200,
            }}>
              {/* WhatsApp UI mock */}
              <div style={{
                background: '#dcf8c6',
                borderRadius: '12px 12px 0 12px',
                padding: '10px 14px',
                maxWidth: '85%',
                marginLeft: 'auto',
                color: '#111',
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                {form.messageType === 'ai'
                  ? (form.preview || 'Click "Generate" to preview your AI message...')
                  : templatePreview
                }
              </div>
              <div style={{ textAlign: 'right', marginTop: 4, fontSize: 11, color: '#8696a0' }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Customer will be taken to your review funnel page:
              </div>
              <div style={{
                background: 'var(--bg-input)',
                borderRadius: 8, padding: '8px 12px',
                fontSize: 13, color: 'var(--brand-primary)',
                wordBreak: 'break-all',
              }}>
                reviewboostpro.com/review/your-business?name={encodeURIComponent(form.name || 'Customer')}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>💡 Pro Tips</h3>
            {[
              'Send within 2 hours of service for highest response rate',
              'AI messages get 34% more clicks than templates',
              'WhatsApp has 98% open rate vs 45% for SMS',
              'Always include the customer\'s name for +22% conversion',
            ].map(tip => (
              <div key={tip} style={{
                fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
                padding: '6px 0', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', gap: 8,
              }}>
                <span>✅</span> <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
