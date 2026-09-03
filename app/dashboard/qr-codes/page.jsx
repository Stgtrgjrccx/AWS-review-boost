'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QRCode from 'qrcode'

function QRCodesContent() {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('slug')

  const [mode, setMode] = useState('select') // 'select' | 'custom'
  const [slug, setSlug] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [customInputName, setCustomInputName] = useState('')
  const [businessesList, setBusinessesList] = useState([])
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [size, setSize] = useState(300)
  const [fgColor, setFgColor] = useState('#0f172a')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }

    // Fetch all available businesses and prospects
    Promise.all([
      fetch('/api/operator/clients').then(r => r.json()).catch(() => ({ clients: [] })),
      fetch('/api/operator/prospects').then(r => r.json()).catch(() => ({ prospects: [] })),
    ]).then(([cData, pData]) => {
      const clients = cData.clients || []
      const prospects = pData.prospects || []
      const all = [
        ...clients.map(c => ({ name: c.name, slug: c.slug })),
        ...prospects.map(p => ({
          name: p.businessName,
          slug: p.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        }))
      ]
      setBusinessesList(all)

      if (initialSlug) {
        const found = all.find(b => b.slug === initialSlug)
        if (found) {
          setSlug(found.slug)
          setBusinessName(found.name)
          return
        } else {
          setSlug(initialSlug)
          setBusinessName(initialSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
          return
        }
      }

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
  }, [initialSlug])

  const reviewUrl = slug ? `${origin || 'https://reviewboostpro.com'}/review/${slug}` : ''

  const generateQR = async () => {
    if (!reviewUrl) return
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
  }, [slug, size, fgColor, bgColor, origin])

  const handleCustomNameChange = (val) => {
    setCustomInputName(val)
    const newSlug = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    setSlug(newSlug || 'my-business')
    setBusinessName(val || 'My Business')
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-table-qr.png`
    link.href = qrDataUrl
    link.click()
  }

  const printTableStand = () => {
    window.print()
  }

  return (
    <div>
      {/* Print-only CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-table-card, #printable-table-card * {
            visibility: visible;
          }
          #printable-table-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="page-header-left">
          <div className="liquid-pill" style={{ display: 'inline-flex', padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#38bdf8', marginBottom: 8 }}>
            TABLETOP &amp; COUNTER DEPLOYMENT
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            📲 QR Code &amp; NFC Stand Generator
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
            Generate print-ready counter stands and table tent QR codes for any business. When scanned, customers experience the 1-tap AI review generator.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
        
        {/* SETTINGS CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#ffffff' }}>
              1. Choose or Enter Any Business
            </h3>

            {/* Mode Toggle Tabs */}
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 12, marginBottom: 18 }}>
              <button
                type="button"
                onClick={() => setMode('select')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'select' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: mode === 'select' ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                🏢 Select from Directory
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'custom' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: mode === 'custom' ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                ⚡ Type Any Custom Name
              </button>
            </div>

            {mode === 'select' ? (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12, color: '#cbd5e1' }}>Select Target Business</label>
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
            ) : (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12, color: '#cbd5e1' }}>Enter Any Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chaitanya Paranthas, Blue Tokai Coffee, Rawat Salon"
                  value={customInputName}
                  onChange={e => handleCustomNameChange(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 13, fontWeight: 600 }}
                />
                <p className="form-hint" style={{ fontSize: 11, color: '#64748b' }}>
                  A unique review link and QR code will instantly generate for this name.
                </p>
              </div>
            )}

            {/* Review Link URL */}
            <div className="form-group" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0, fontSize: 12, color: '#cbd5e1' }}>Consumer Review URL</label>
                {slug && (
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 8px', fontSize: 11, fontWeight: 600, color: '#38bdf8' }}
                  >
                    🚀 Test Consumer Flow ↗
                  </a>
                )}
              </div>
              <input
                className="form-input"
                value={reviewUrl}
                readOnly
                style={{ color: '#38bdf8', fontSize: 12 }}
              />
            </div>

            {/* Custom Styling */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12, color: '#cbd5e1' }}>QR Code Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    style={{ width: 38, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'var(--bg-input)', flexShrink: 0 }} />
                  <input className="form-input" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ fontSize: 12 }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12, color: '#cbd5e1' }}>Background</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: 38, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'var(--bg-input)', flexShrink: 0 }} />
                  <input className="form-input" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ fontSize: 12 }} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label" style={{ fontSize: 12, color: '#cbd5e1' }}>Print Resolution: {size}×{size}px</label>
              <input
                type="range" min={200} max={600} step={50}
                value={size} onChange={e => setSize(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>
          </div>

          {/* NFC Card Instructions */}
          <div className="card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>📡</span>
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#ffffff' }}>NFC Tap Coaster / Card Alternative</h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5, margin: '0 0 10px 0' }}>
              You can write this link to physical NFC acrylic pucks. When patrons tap their phone on the coaster, the AI review prompt opens automatically without scanning!
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(reviewUrl)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11 }}
            >
              📋 Copy NFC Link
            </button>
          </div>
        </div>

        {/* PRINTABLE TABLETOP STAND PREVIEW */}
        <div>
          <div className="card" style={{ textAlign: 'center', position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#ffffff' }}>
              2. Print-Ready Table Stand Preview
            </h3>

            {/* Stand Card Container */}
            <div
              id="printable-table-card"
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'inline-block',
                width: '100%',
                maxWidth: 290,
                color: '#0f172a',
                textAlign: 'center',
                margin: '0 auto 20px auto'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>⭐</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Enjoyed Your Visit?
              </div>
              <div style={{ fontSize: 11, color: '#64748b', margin: '4px 0 14px 0', fontWeight: 500 }}>
                Scan to let AI draft your 5★ review!
              </div>

              {/* QR Image */}
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Review QR Code"
                  style={{ width: 190, height: 190, borderRadius: 12, margin: '0 auto', display: 'block', border: '1px solid #e2e8f0' }}
                />
              ) : (
                <div style={{ width: 190, height: 190, background: '#f1f5f9', borderRadius: 12, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>
                  Generating QR...
                </div>
              )}

              {/* Business Name Badge */}
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 14, color: '#0f172a', marginTop: 14 }}>
                {businessName || 'Your Business'}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                Takes 10 seconds • 1-Tap Google Post
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button
                onClick={downloadQR}
                className="btn btn-primary"
                style={{
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                  boxShadow: '0 4px 18px rgba(14,165,233,0.35)',
                  border: 'none'
                }}
                disabled={!qrDataUrl}
              >
                ⬇️ Download High-Res Stand (PNG)
              </button>

              <button
                onClick={printTableStand}
                className="btn btn-secondary"
                style={{ justifyContent: 'center', fontSize: 13, fontWeight: 600 }}
              >
                🖨️ Print Acrylic Table Tent Stand
              </button>

              <button
                onClick={() => navigator.clipboard.writeText(reviewUrl)}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', fontSize: 12 }}
              >
                🔗 Copy Review Link
              </button>
            </div>

            <p style={{ fontSize: 11, color: '#64748b', marginTop: 14, lineHeight: 1.4 }}>
              Place on dining tables, reception counters, or print on customer receipts!
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function QRCodesPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        Loading QR Generator...
      </div>
    }>
      <QRCodesContent />
    </Suspense>
  )
}
