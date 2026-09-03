'use client'
import { useEffect, useState, useRef } from 'react'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [csvPreview, setCsvPreview] = useState([])
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: '',
    channel: 'both',
    messageType: 'template',
    sendTime: 'immediate',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch('/api/campaigns')
      .then(r => r.json())
      .then(d => setCampaigns(d.campaigns || []))
      .catch(() => setCampaigns([]))
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      const preview = lines.slice(0, 5).map(line => {
        const [name, phone] = line.split(',')
        return { name: name?.trim(), phone: phone?.trim() }
      })
      setCsvPreview(preview)
    }
    reader.readAsText(file)
  }

  const sendCampaign = async () => {
    if (!csvFile || !form.name) return
    setSending(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('csv', csvFile)
    formData.append('campaignName', form.name)
    formData.append('channel', form.channel)
    formData.append('messageType', form.messageType)

    const res = await fetch('/api/campaigns/bulk', { method: 'POST', body: formData })
    const data = await res.json()

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200))
      setProgress(i)
    }

    setSending(false)
    setDone(true)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>📢 Campaigns</h1>
          <p>Send bulk review requests via CSV upload. Track performance per campaign.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewCampaign(true)}>
          + New Campaign
        </button>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 24, padding: 36,
            width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid var(--border-default)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800 }}>New Bulk Campaign</h2>
              <button onClick={() => { setShowNewCampaign(false); setDone(false); setProgress(0); setCsvPreview([]) }}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Campaign Launched!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                  Messages are being sent. Check back in a few minutes to see delivery stats.
                </p>
              </div>
            ) : sending ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📤</div>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Sending messages...</h3>
                <div style={{ background: 'var(--border-subtle)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 8,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                    width: `${progress}%`, transition: 'width 0.3s',
                  }} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>{progress}% complete</p>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Campaign Name *</label>
                  <input className="form-input" placeholder="e.g. August Follow-up Campaign" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Channel</label>
                    <select className="form-select" value={form.channel} onChange={e => set('channel', e.target.value)}>
                      <option value="both">💬 WhatsApp + SMS fallback</option>
                      <option value="whatsapp">💬 WhatsApp only</option>
                      <option value="sms">📱 SMS only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message Type</label>
                    <select className="form-select" value={form.messageType} onChange={e => set('messageType', e.target.value)}>
                      <option value="template">📝 Template</option>
                      <option value="ai">🤖 AI Personalized</option>
                    </select>
                  </div>
                </div>

                {/* CSV Upload */}
                <div className="form-group">
                  <label className="form-label">Upload Customer List (CSV) *</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border-default)', borderRadius: 12,
                      padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s', background: csvFile ? 'rgba(16,185,129,0.06)' : 'var(--bg-input)',
                      borderColor: csvFile ? '#10b981' : 'var(--border-default)',
                    }}
                  >
                    {csvFile ? (
                      <>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                        <div style={{ fontWeight: 600, color: '#10b981' }}>{csvFile.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                          {csvPreview.length}+ rows detected
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                        <div style={{ fontWeight: 600 }}>Click to upload CSV</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                          Format: Name, Phone (one per row)
                        </div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
                  <p className="form-hint">CSV format: Name,Phone — e.g. "Priya Sharma,+919876543210"</p>
                </div>

                {/* CSV Preview */}
                {csvPreview.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Preview (first 5 rows)</label>
                    <div style={{ background: 'var(--bg-input)', borderRadius: 10, overflow: 'hidden' }}>
                      {csvPreview.map((row, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, padding: '8px 14px', borderBottom: i < csvPreview.length - 1 ? '1px solid var(--border-subtle)' : 'none', fontSize: 13 }}>
                          <span style={{ flex: 1, fontWeight: 500 }}>{row.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{row.phone}</span>
                          <span style={{ color: '#10b981' }}>✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setShowNewCampaign(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button
                    onClick={sendCampaign}
                    className="btn btn-primary"
                    style={{ flex: 2, justifyContent: 'center' }}
                    disabled={!form.name || !csvFile}
                  >
                    🚀 Launch Campaign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Channel</th>
                <th>Sent</th>
                <th>Clicked</th>
                <th>Click Rate</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                  <td>
                    <span className="badge badge-info">
                      {c.channel === 'whatsapp' ? '💬 WhatsApp' : c.channel === 'sms' ? '📱 SMS' : '💬+📱 Both'}
                    </span>
                  </td>
                  <td>{c.totalSent}</td>
                  <td>{c.totalClicked}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: c.totalSent > 0 && (c.totalClicked / c.totalSent) > 0.5 ? '#10b981' : 'var(--text-secondary)' }}>
                      {c.totalSent > 0 ? Math.round((c.totalClicked / c.totalSent) * 100) : 0}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'completed' ? 'badge-success' : c.status === 'sending' ? 'badge-warning' : 'badge-muted'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {campaigns.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📢</div>
              <h3>No campaigns yet</h3>
              <p>Launch your first bulk campaign to send to multiple customers at once</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
