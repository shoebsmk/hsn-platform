'use client'

import Link from 'next/link'
import { useState } from 'react'
import { logout } from '@/app/auth/actions'
import {
  Briefcase,
  BookOpen,
  Users,
  Info,
  ShieldCheck,
  LogOut,
  Shield,
  Menu,
  X,
  Store,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Explore',
    links: [
      { label: 'Jobs',        href: '/jobs',        icon: Briefcase },
      { label: 'Business',    href: '/business',    icon: Store },
      { label: 'Halal Check', href: '/halal-check', icon: ShieldCheck },
    ],
  },
  {
    label: 'Learn',
    links: [
      { label: 'Guidance',   href: '/guidance',   icon: BookOpen },
      { label: 'Mentorship', href: '/mentorship', icon: Users },
    ],
  },
]

const standaloneLinks = [
  { label: 'About', href: '/about', icon: Info },
]

const allNavLinks = [...navGroups.flatMap(g => g.links), ...standaloneLinks]

interface NavbarProps {
  user?: { email?: string; full_name?: string; is_admin?: boolean } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = (user?.full_name ?? user?.email ?? 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--hsn-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '66px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.9rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              letterSpacing: '0.08em',
              boxShadow: '0 2px 8px rgba(27,107,58,0.3)',
            }}>HSN</div>
            <span style={{ fontWeight: 700, color: 'var(--hsn-dark)', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Halal Success Network
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {allNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--hsn-gray)',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.color = 'var(--hsn-green)'
                  el.style.background = 'var(--hsn-green-50)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.color = 'var(--hsn-gray)'
                  el.style.background = 'transparent'
                }}
              >
                <link.icon size={15} strokeWidth={2} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {user ? (
              <>
                {user.is_admin && (
                  <Link href="/admin" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--hsn-green)',
                    textDecoration: 'none',
                    border: '1.5px solid var(--hsn-green)',
                    borderRadius: '0.4rem',
                    padding: '0.3rem 0.65rem',
                    background: 'var(--hsn-green-50)',
                  }}>
                    <Shield size={13} />
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                    borderRadius: '9999px',
                    border: '1.5px solid var(--hsn-border)',
                    background: 'white',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--hsn-green)'
                    e.currentTarget.style.background = 'var(--hsn-green-50)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--hsn-border)'
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                  }}>
                    {initials}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--hsn-dark)' }}>
                    {user.full_name?.split(' ')[0] ?? 'Dashboard'}
                  </span>
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    title="Sign out"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px', borderRadius: '0.5rem',
                      border: '1.5px solid var(--hsn-border)', background: 'white',
                      color: 'var(--hsn-gray)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.borderColor = '#FCA5A5'
                      el.style.color = '#DC2626'
                      el.style.background = '#FEF2F2'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.borderColor = 'var(--hsn-border)'
                      el.style.color = 'var(--hsn-gray)'
                      el.style.background = 'white'
                    }}
                  >
                    <LogOut size={15} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary hidden-mobile" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Log in
                </Link>
                <Link href="/auth/signup" className="btn-primary hidden-mobile" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Join HSN
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="hidden-desktop"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px',
                border: '1.5px solid var(--hsn-border)',
                borderRadius: '0.5rem', background: 'white',
                cursor: 'pointer', color: 'var(--hsn-dark)',
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="hidden-desktop"
            style={{ borderTop: '1px solid var(--hsn-border)', paddingBottom: '1rem' }}
          >
            {/* Grouped nav sections */}
            {navGroups.map(group => (
              <div key={group.label} style={{ paddingTop: '1rem' }}>
                {/* Group label + line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.67rem', fontWeight: 700, color: 'var(--hsn-gray-light)',
                    textTransform: 'uppercase', letterSpacing: '0.09em', whiteSpace: 'nowrap',
                  }}>
                    {group.label}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--hsn-border)' }} />
                </div>

                {group.links.map(link => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.65rem 0.5rem',
                        color: 'var(--hsn-dark)', fontWeight: 500,
                        fontSize: '0.9rem', textDecoration: 'none',
                      }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'var(--hsn-green-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={15} color="var(--hsn-green)" strokeWidth={2} />
                      </div>
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            ))}

            {/* Separator + standalone links */}
            <div style={{ height: '1px', background: 'var(--hsn-border)', margin: '0.75rem 0.5rem' }} />
            {standaloneLinks.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0.5rem',
                    color: 'var(--hsn-dark)', fontWeight: 500,
                    fontSize: '0.9rem', textDecoration: 'none',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} color="var(--hsn-gray)" strokeWidth={2} />
                  </div>
                  {link.label}
                </Link>
              )
            })}

            {/* Auth buttons */}
            {!user && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.875rem 0.5rem 0.25rem' }}>
                <Link href="/auth/login" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                  Log in
                </Link>
                <Link href="/auth/signup" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                  Join HSN
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
