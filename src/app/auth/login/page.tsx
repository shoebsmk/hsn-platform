'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, signInWithOAuth } from '../actions'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: 'var(--hsn-green)', color: 'white', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '6px' }}>HSN</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)' }}>Welcome back</h1>
          <p style={{ color: 'var(--hsn-gray)', marginTop: '0.4rem', fontSize: '0.9rem' }}>Sign in to your HSN account</p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => signInWithOAuth('google')}
              style={oauthButtonStyle}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M46.145 24.504c0-1.636-.146-3.21-.418-4.722H24v8.932h12.418c-.536 2.886-2.163 5.332-4.61 6.972v5.796h7.464c4.368-4.02 6.873-9.944 6.873-16.978z"/>
                <path fill="#34A853" d="M24 47c6.24 0 11.472-2.07 15.296-5.618l-7.464-5.796c-2.07 1.386-4.716 2.206-7.832 2.206-6.022 0-11.118-4.066-12.942-9.532H3.354v5.984C7.16 42.012 15.02 47 24 47z"/>
                <path fill="#FBBC05" d="M11.058 28.26A14.93 14.93 0 0 1 10.5 24c0-1.482.254-2.922.558-4.26v-5.984H3.354A23.94 23.94 0 0 0 0 24c0 3.864.926 7.524 2.574 10.744l8.484-6.484z" transform="translate(.78)"/>
                <path fill="#EA4335" d="M24 9.524c3.394 0 6.44 1.168 8.836 3.46l6.622-6.622C35.468 2.626 30.236.5 24 .5 15.02.5 7.16 5.488 3.354 13.256l8.704 6.484C13.882 13.59 18.978 9.524 24 9.524z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => signInWithOAuth('linkedin_oidc')}
              style={{ ...oauthButtonStyle, borderColor: '#0A66C2', color: '#0A66C2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" style={{ flexShrink: 0 }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--hsn-border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', whiteSpace: 'nowrap' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--hsn-border)' }} />
          </div>

          <form action={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--hsn-dark)' }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--hsn-dark)' }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#9CA3AF' : 'var(--hsn-green)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--hsn-gray)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--hsn-green)', fontWeight: 600, textDecoration: 'none' }}>
            Join HSN
          </Link>
        </p>
      </div>
    </div>
  )
}

const oauthButtonStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  padding: '0.65rem',
  borderRadius: '0.5rem',
  border: '1.5px solid var(--hsn-border)',
  background: 'white',
  color: 'var(--hsn-dark)',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'border-color 0.15s, background 0.15s',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid var(--hsn-border)',
  borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  color: 'var(--hsn-dark)',
  background: 'white',
}
