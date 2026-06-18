'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import {
  Briefcase,
  BookOpen,
  Users,
  ShieldCheck,
  LogOut,
  Shield,
  Store,
  ChevronDown,
  Compass,
  LayoutDashboard,
} from 'lucide-react'

const navGroups = [
  {
    id: 'explore' as const,
    label: 'Explore',
    icon: Compass,
    links: [
      { label: 'Jobs',        href: '/jobs',        icon: Briefcase,   desc: 'Halal job opportunities'   },
      { label: 'Business',    href: '/business',    icon: Store,       desc: 'Halal-verified businesses' },
      { label: 'Halal Check', href: '/halal-check', icon: ShieldCheck, desc: 'Verify halal status'       },
    ],
  },
  {
    id: 'learn' as const,
    label: 'Learn',
    icon: BookOpen,
    links: [
      { label: 'Guidance',   href: '/guidance',   icon: BookOpen, desc: 'Articles & resources' },
      { label: 'Mentorship', href: '/mentorship', icon: Users,    desc: 'Connect with mentors' },
    ],
  },
]

type OpenMenu = 'explore' | 'learn' | 'avatar' | null

interface NavbarProps {
  user?: { email?: string; full_name?: string; is_admin?: boolean } | null
}

const groupActivePaths: Record<string, string[]> = {
  explore: ['/jobs', '/business', '/halal-check'],
  learn: ['/guidance', '/mentorship'],
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)

  useEffect(() => { setOpenMenu(null) }, [pathname])

  const toggle = (id: OpenMenu) => setOpenMenu(prev => prev === id ? null : id)

  const initials = (user?.full_name ?? user?.email ?? 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <header style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--hsn-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Click-outside overlay */}
      {openMenu && (
        <div
          onClick={() => setOpenMenu(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
        />
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
              color: 'white', fontWeight: 800, fontSize: '0.9rem',
              padding: '0.35rem 0.65rem', borderRadius: '8px',
              letterSpacing: '0.08em', boxShadow: '0 2px 8px rgba(27,107,58,0.3)',
            }}>HSN</div>
            <span style={{ fontWeight: 700, color: 'var(--hsn-dark)', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Halal Success Network
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }} className="hidden-mobile">
            {navGroups.map(group => {
              const isOpen = openMenu === group.id
              const isActive = groupActivePaths[group.id]?.some(p => pathname.startsWith(p)) ?? false
              const highlighted = isOpen || isActive
              return (
                <div key={group.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggle(group.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      color: highlighted ? 'var(--hsn-green)' : 'var(--hsn-gray)',
                      background: highlighted ? 'var(--hsn-green-50)' : 'transparent',
                      fontWeight: highlighted ? 600 : 500, fontSize: '0.875rem',
                      padding: '0.45rem 0.75rem', borderRadius: '0.5rem',
                      border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!highlighted) {
                        e.currentTarget.style.color = 'var(--hsn-green)'
                        e.currentTarget.style.background = 'var(--hsn-green-50)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!highlighted) {
                        e.currentTarget.style.color = 'var(--hsn-gray)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {group.label}
                    <ChevronDown
                      size={13} strokeWidth={2.5}
                      style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                      zIndex: 51,
                      background: 'white',
                      border: '1px solid var(--hsn-border)',
                      borderRadius: '0.75rem',
                      boxShadow: 'var(--shadow-md)',
                      padding: '0.4rem',
                      minWidth: '220px',
                    }}>
                      {group.links.map(link => (
                        <DropdownItem
                          key={link.href}
                          href={link.href}
                          icon={link.icon}
                          label={link.label}
                          desc={link.desc}
                          onClick={() => setOpenMenu(null)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

          </nav>

          {/* Auth area */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {user ? (
              <div className="hidden-mobile" style={{ position: 'relative' }}>
                <button
                  onClick={() => toggle('avatar')}
                  aria-label="Account menu"
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
                    color: 'white', fontWeight: 700, fontSize: '0.75rem',
                    border: openMenu === 'avatar' ? '2px solid var(--hsn-green)' : '2px solid transparent',
                    outline: openMenu === 'avatar' ? '3px solid var(--hsn-green-muted)' : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {initials}
                </button>

                {openMenu === 'avatar' && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    zIndex: 51,
                    background: 'white',
                    border: '1px solid var(--hsn-border)',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.4rem',
                    minWidth: '190px',
                  }}>
                    <DropdownItem
                      href="/dashboard"
                      icon={LayoutDashboard}
                      label="Dashboard"
                      desc="Your profile & activity"
                      onClick={() => setOpenMenu(null)}
                    />
                    {user.is_admin && (
                      <DropdownItem
                        href="/admin"
                        icon={Shield}
                        label="Admin Panel"
                        desc="Manage HSN content"
                        onClick={() => setOpenMenu(null)}
                        green
                      />
                    )}
                    <div style={{ height: '1px', background: 'var(--hsn-border)', margin: '0.3rem 0.4rem' }} />
                    <form action={logout}>
                      <button type="submit" style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.55rem 0.65rem', borderRadius: '0.5rem',
                        border: 'none', background: 'transparent',
                        color: '#DC2626', cursor: 'pointer', transition: 'background 0.12s',
                        fontSize: '0.875rem', fontWeight: 500,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '7px',
                          background: '#FEF2F2', border: '1px solid #FECACA',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <LogOut size={14} color="#DC2626" strokeWidth={2} />
                        </div>
                        Sign out
                      </button>
                    </form>
                  </div>
                )}
              </div>
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
          </div>

        </div>
      </div>
    </header>
  )
}

function DropdownItem({ href, icon: Icon, label, desc, onClick, green }: {
  href: string; icon: React.ElementType; label: string; desc: string; onClick: () => void; green?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        padding: '0.55rem 0.65rem', borderRadius: '0.5rem',
        textDecoration: 'none', transition: 'background 0.12s',
        background: green ? 'var(--hsn-green-muted)' : 'transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = green ? 'var(--hsn-green-50)' : 'var(--hsn-green-50)' }}
      onMouseLeave={e => { e.currentTarget.style.background = green ? 'var(--hsn-green-muted)' : 'transparent' }}
    >
      <div style={{
        width: '30px', height: '30px', borderRadius: '7px',
        background: green ? 'var(--hsn-green-50)' : 'var(--hsn-bg)',
        border: '1px solid var(--hsn-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} color={green ? 'var(--hsn-green)' : 'var(--hsn-gray)'} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: green ? 'var(--hsn-green)' : 'var(--hsn-dark)', lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--hsn-gray-light)', marginTop: '1px' }}>{desc}</div>
      </div>
    </Link>
  )
}
