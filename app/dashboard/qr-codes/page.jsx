'use client'
import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QRCodesPage() {
  const canvasRef = useRef(null)
  const [slug, setSlug] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessesList, setBusinessesList] = useState([])
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [size, setSize] = useState(300)
  const [fgColor, setFgColor] = useState('#1a1a2e')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch all available businesses and prospects
    Promise.all([
      fetch('/api/operator/clients').then(r => r.json()).catch(() => []),
      fetch('/api/operator/prospects').then(r => r.json()).catch(() => []),
    ]).then(([clients, prospects]) => {
      const all = [
        ...(clients || []).map(c => ({ name: c.name, slug: c.slug })),
        ...(prospects || []).map(p => ({
          name: p.businessName,
          slug: p.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        }))
      ]
      setBusinessesList(all)
      if (all.length > 0) {
        setSlug(all[0].slug)
        setBusinessName(all[0].name)
      } else {
        setSlug('peshwa-restaurant')
        setBusinessName('Peshwa Restaurant')
      }
    }).catch(() => {
      setSlug('peshwa-restaurant')
      setBusinessName('Peshwa Restaurant')
    })
  }, [])

  const reviewUrl = typeof window !== 'undefined' ? `${window.location.origin}/review/${slug}` : `https://reviewboostpro.com/review/${slug}`

  const generateQR = async () => {
    setLoading(true)
    try {
      const url = await QRCode.toDataURL(reviewUrl, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      })
      setQrDataUrl(url)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) generateQR()
  }, [slug, size, fgColor, bgColor])

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `${businessName}-review-qr.png`
    link.href = qrDataUrl
    link.click()
  }

  const nfcLink = reviewUrl

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>📲 QR Code Generator</h1>
          <p>Print and place at your counter. Customers scan to leave a review instantly.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Customize Table Stand QR Code</h3>

            <div className="form-group">
              <label className="form-label">Select Business</label>
              <select
                className="form-input"
                value={slug}
                onChange={e => {
                  const selected = businessesList.find(b => b.slug === e.target.value)
                  if (selected) {
                    setSlug(selected.slug)
                    setBusinessName(selected.name)
                  }
                }}
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                {businessesList.map(b => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Review Link URL</label>
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600 }}
                >
                  🚀 Test Consumer Flow ↗
                </a>
              </div>
              <input
                className="form-input"
                value={reviewUrl}
                readOnly
                style={{ color: 'var(--brand-primary)' }}
              />
              <p className="form-hint">When consumers scan this table QR, the AI review generator immediately launches on their phone.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">QR Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    style={{ width: 44, height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'var(--bg-input)', flexShrink: 0 }} />
                  <input className="form-input" value={fgColor} onChange={e => setFgColor(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: 44, height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'var(--bg-input)', flexShrink: 0 }} />
                  <input className="form-input" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Size: {size}×{size}px</label>
              <input
                type="range" min={200} max={600} step={50}
                value={size} onChange={e => setSize(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
              />
            </div>
          </div>

          {/* NFC Instructions */}
          <div className="card" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.15)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>📡</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>NFC Tag Setup</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Program an NFC tag with this URL — customers just tap their phone on it. No camera needed. Works on all modern smartphones.
            </p>
            <div style={{
              background: 'var(--bg-input)', borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: 'var(--brand-primary)', wordBreak: 'break-all', marginBottom: 12,
            }}>
              {reviewUrl}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(reviewUrl)}
              className="btn btn-secondary btn-sm"
            >
              📋 Copy NFC URL
            </button>
          </div>

          {/* Printing tips */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🖨️ Printing Tips</h3>
            {[
              'Print at minimum 5×5 cm for easy scanning',
              'Add text above: "Happy with your experience? Scan to review us!"',
              'Place at eye level near checkout/reception',
              'Laminate for durability',
              'Consider a tent card or acrylic stand for desk placement',
            ].map(tip => (
              <div key={tip} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '5px 0', display: 'flex', gap: 8 }}>
                <span>✅</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR Preview */}
        <div>
          <div className="card" style={{ textAlign: 'center', position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Preview</h3>

            {/* Print preview card */}
            <div style={{
              background: 'white', borderRadius: 16, padding: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'inline-block', maxWidth: '100%',
            }}>
              <div style={{ color: '#1a1a2e', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
                ⭐ Enjoyed your visit?
              </div>
              <div style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
                Scan to share your experience
              </div>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Review QR Code"
                  style={{ width: 200, height: 200, borderRadius: 8 }}
                />
              ) : (
                <div style={{
                  width: 200, height: 200, background: '#f0f0f0',
                  borderRadius: 8, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#999', fontSize: 14,
                }}>
                  Generating...
                </div>
              )}
              <div style={{ color: '#1a1a2e', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13, marginTop: 12 }}>
                {businessName}
              </div>
              <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                Takes 30 seconds • Appreciated! 🙏
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10, flexDirection: 'column' }}>
              <button
                onClick={downloadQR}
                className="btn btn-primary"
                style={{ justifyContent: 'center' }}
                disabled={!qrDataUrl}
              >
                ⬇️ Download QR Code (PNG)
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(reviewUrl)}
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                🔗 Copy Review Link
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
              Share this link on Instagram, WhatsApp, email, or anywhere else!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
