'use client'

import Link from 'next/link'
import { useState } from 'react'
import { logout } from '@/app/auth/actions'

const navLinks = [
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'About', href: '/about' },
]

interface NavbarProps {
  user?: { email?: string; full_name?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: 'white', borderBottom: '1px solid var(--hsn-border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{
              background: 'var(--hsn-green)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              letterSpacing: '0.05em'
            }}>HSN</span>
            <span style={{ fontWeight: 600, color: 'var(--hsn-dark)', fontSize: '0.95rem' }}>
              Halal Success Network
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: 'var(--hsn-gray)', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--hsn-dark)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--hsn-green)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}>
                    {(user.full_name ?? user.email ?? 'U')[0].toUpperCase()}
                  </span>
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', cursor: 'pointer', border: 'none' }}
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Log in
                </Link>
                <Link href="/auth/signup" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Join HSN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
