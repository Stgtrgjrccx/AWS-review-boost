'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await signIn('email', { email, redirect: false })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 24,
        padding: '40px 36px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
          }}>⭐</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 6 }}>
            Welcome to ASW Review Boost
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Sign in to your business dashboard
          </p>
        </div>

        {sent ? (
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 14, padding: 24, textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Check your inbox!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              We sent a magic sign-in link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <>
            {/* 1-Click Demo Login */}
            <button
              onClick={() => signIn('credentials', { email: 'demo@rustic-table.com', callbackUrl: '/dashboard' })}
              className="btn btn-primary"
              style={{
                width: '100%', padding: '14px 20px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                borderRadius: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 15, fontWeight: 700, color: 'white',
                marginBottom: 16,
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              ⚡ Instant Demo Login (1-Click)
            </button>

            {/* Google OAuth */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              style={{
                width: '100%', padding: '13px 20px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                transition: 'all 0.2s', marginBottom: 20,
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="form-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px 20px' }}
                disabled={loading}
              >
                {loading ? 'Sending magic link...' : '✉️ Send Magic Link'}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          New to ASW Review Boost?{' '}
          <a href="/signup" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Create an account →
          </a>
        </p>
      </div>
    </div>
  )
}
