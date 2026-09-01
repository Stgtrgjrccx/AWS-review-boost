'use client'
import { useEffect, useRef, useState } from 'react'

export default function MarketingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { value: '347%', label: 'Average review increase' },
    { value: '98%', label: 'WhatsApp open rate' },
    { value: '2 min', label: 'Setup time' },
    { value: '10k+', label: 'Businesses trust us' },
  ]

  const features = [
    {
      icon: '⭐',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      title: 'AI-Adaptive Review Funnels',
      desc: 'Our AI picks the perfect funnel design for your industry. Restaurant? Gamified. Clinic? Clean & professional. Every design is psychologically optimized to maximize 5-star completions.',
    },
    {
      icon: '💬',
      color: '#25d366',
      bg: 'rgba(37,211,102,0.12)',
      title: 'WhatsApp-First Messaging',
      desc: '98% open rate vs 45% for email. Send personalized review requests via WhatsApp with automatic SMS fallback. Customers respond in seconds, not days.',
    },
    {
      icon: '🛡️',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      title: 'Review Gating Protection',
      desc: 'Happy customers go to Google. Unhappy ones go to your private inbox. Stop negative reviews from ever going public. Handle complaints privately and win customers back.',
    },
    {
      icon: '🤖',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.12)',
      title: 'AI-Personalized Messages',
      desc: '"Hi Sarah! Your haircut yesterday was amazing 💇" — not "Dear Customer". Gemini AI writes unique, warm messages for every customer that feel human, not automated.',
    },
    {
      icon: '📊',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      title: 'Full Analytics Suite',
      desc: 'Track every step: sent → delivered → clicked → rated → reviewed. See click rates, conversion rates, star distribution, and campaign performance in real time.',
    },
    {
      icon: '🎨',
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.12)',
      title: 'White-Label Branding',
      desc: 'Your customers see your logo, your brand colors, your fonts. Every review funnel is completely branded to your business — not ours.',
    },
  ]

  const testimonials = [
    { name: 'Riya Sharma', biz: 'Glow Beauty Studio', text: 'We went from 47 to 312 Google reviews in 3 months. The WhatsApp messages get an insane response rate. Every salon owner needs this.' },
    { name: 'Rahul Verma', biz: 'Spice Garden Restaurant', text: 'The gamified funnel is genius. Customers love the confetti when they give 5 stars. Our rating went from 3.8 to 4.7 in 2 months.' },
    { name: 'Dr. Priya Mehta', biz: 'Smile Dental Clinic', text: 'The clean professional design works perfectly for a clinic. Patients trust it instantly. Review gating saved us from 3 unfair 1-star reviews.' },
  ]

  const pricing = [
    {
      name: 'Starter',
      price: '₹999',
      period: '/mo',
      desc: 'Perfect to get started',
      features: ['30 review requests/month', 'WhatsApp + SMS', 'QR Code generator', 'Basic analytics', '1 business location'],
      cta: 'Start Free Trial',
      featured: false,
    },
    {
      name: 'Growth',
      price: '₹2,499',
      period: '/mo',
      desc: 'For growing businesses',
      features: ['200 requests/month', 'AI-personalized messages', 'White-label branding', 'Full analytics suite', 'Private feedback inbox', 'Bulk CSV campaigns'],
      cta: 'Get Growth',
      featured: true,
    },
    {
      name: 'Pro',
      price: '₹4,999',
      period: '/mo',
      desc: 'For agencies & chains',
      features: ['Unlimited requests', 'Multi-location support', 'Team member access', 'Priority support', 'API access', 'Custom integrations'],
      cta: 'Go Pro',
      featured: false,
    },
  ]

  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav" style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>⭐</div>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18 }}>
            ASW Review<span style={{ color: '#6366f1' }}>Boost</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Features</a>
          <a href="#pricing" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Pricing</a>
          <a href="/login" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sign In</a>
          <a href="/signup" className="btn btn-primary btn-sm">Start Free →</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-badge">
          🚀 Trusted by 10,000+ businesses across India
        </div>
        <h1 className="hero-title">
          Turn Every Customer Into<br />
          <span className="gradient-text">a 5-Star Google Review</span>
        </h1>
        <p className="hero-subtitle">
          The AI-powered review platform that sends personalized WhatsApp messages, gates negative reviews, and multiplies your Google rating — on autopilot.
        </p>
        <div className="hero-actions">
          <a href="/signup" className="btn btn-primary btn-lg">
            🚀 Start Free — No Credit Card
          </a>
          <a href="#features" className="btn btn-secondary btn-lg">
            See How It Works
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center',
          padding: '32px 40px',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border-subtle)',
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 32, fontWeight: 900, color: '#6366f1' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900, marginBottom: 12 }}>
            Everything you need to <span className="gradient-text">dominate your reviews</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Built with one goal: get you more 5-star reviews than any other tool on the market.
          </p>
        </div>
        <div className="features-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.bg, color: f.color, fontSize: 24 }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 60px', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900 }}>
            3 steps. 2 minutes setup. <span className="gradient-text">Results in 24 hours.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 32, maxWidth: 900, margin: '0 auto', flexWrap: 'wrap' }}>
          {[
            { step: '01', title: 'Set up in 2 minutes', desc: 'Add your business, paste your Google review link, upload your logo. Our wizard guides you step by step.' },
            { step: '02', title: 'Send review requests', desc: 'Enter a customer\'s number or upload a CSV. AI writes a personalized WhatsApp message. You hit Send.' },
            { step: '03', title: 'Reviews pour in', desc: 'Happy customers go straight to Google. Unhappy ones go to your private inbox. You\'re protected either way.' },
          ].map(s => (
            <div key={s.step} style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                fontFamily: 'Outfit,sans-serif', fontSize: 56, fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px rgba(99,102,241,0.3)',
                marginBottom: 12, lineHeight: 1
              }}>{s.step}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900 }}>
            Real businesses. <span className="gradient-text">Real results.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {testimonials.map(t => (
            <div key={t.name} className="card">
              <div style={{ fontSize: 22, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ fontSize: 14 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.biz}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 60px', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900 }}>
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>14-day free trial. No credit card required.</p>
        </div>
        <div className="pricing-grid">
          {pricing.map(p => (
            <div key={p.name} className={`pricing-card${p.featured ? ' featured' : ''}`}>
              {p.featured && <div className="pricing-popular">⭐ Most Popular</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{p.name}</div>
              <div className="pricing-price">
                <sup style={{ fontSize: 20 }}></sup>{p.price}<sub>{p.period}</sub>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="/signup" className={`btn w-full ${p.featured ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center', display: 'flex' }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 44, fontWeight: 900, marginBottom: 20 }}>
          Ready to get your first<br /><span className="gradient-text">100 new reviews?</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>
          Join 10,000+ businesses already growing with ASW Review Boost.
        </p>
        <a href="/signup" className="btn btn-primary btn-lg">🚀 Start Free Today — No Credit Card</a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16 }}>
          ASW Review<span style={{ color: '#6366f1' }}>Boost</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2026 ASW Review Boost. Built to get you more 5-star reviews.
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
