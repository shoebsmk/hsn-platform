'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logout } from '@/app/auth/actions'
import {
  Home,
  Compass,
  BookOpen,
  User,
  Briefcase,
  Store,
  ShieldCheck,
  Users,
  LayoutDashboard,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  X,
} from 'lucide-react'

interface BottomTabBarProps {
  user?: { email?: string; full_name?: string; is_admin?: boolean } | null
}

type SheetId = 'explore' | 'learn' | 'me' | null

export default function BottomTabBar({ user }: BottomTabBarProps) {
  const pathname = usePathname()
  const [openSheet, setOpenSheet] = useState<SheetId>(null)

  useEffect(() => { setOpenSheet(null) }, [pathname])

  const toggle = (id: SheetId) => setOpenSheet(prev => prev === id ? null : id)

  const initials = (user?.full_name ?? user?.email ?? 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const isExploreActive = ['/jobs', '/business', '/halal-check'].some(p => pathname.startsWith(p))
  const isLearnActive   = ['/guidance', '/mentorship'].some(p => pathname.startsWith(p))
  const isMeActive      = ['/dashboard', '/admin'].some(p => pathname.startsWith(p))

  const tab = (active: boolean) => ({
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center' as const, justifyContent: 'center' as const,
    gap: '3px', flex: 1, padding: '6px 0 4px',
    border: 'none', background: 'transparent', cursor: 'pointer',
    color: active ? 'var(--hsn-green)' : 'var(--hsn-gray)',
    transition: 'color 0.15s', textDecoration: 'none',
    fontSize: '0.65rem', fontWeight: active ? 700 : 500,
    WebkitTapHighlightColor: 'transparent',
  })

  return (
    <>
      {openSheet && (
        <div
          onClick={() => setOpenSheet(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.2)' }}
        />
      )}

      {openSheet === 'explore' && (
        <Sheet title="Explore" onClose={() => setOpenSheet(null)}>
          <SheetLink href="/jobs"        icon={Briefcase}   label="Jobs"             desc="Halal job opportunities"    onClick={() => setOpenSheet(null)} />
          <SheetLink href="/business"    icon={Store}       label="Business"         desc="Halal-verified businesses"  onClick={() => setOpenSheet(null)} />
          <SheetLink href="/halal-check" icon={ShieldCheck} label="Halal Check"      desc="Verify halal status"        onClick={() => setOpenSheet(null)} />
        </Sheet>
      )}

      {openSheet === 'learn' && (
        <Sheet title="Learn" onClose={() => setOpenSheet(null)}>
          <SheetLink href="/guidance"   icon={BookOpen} label="Guidance"   desc="Articles & resources"  onClick={() => setOpenSheet(null)} />
          <SheetLink href="/mentorship" icon={Users}    label="Mentorship" desc="Connect with mentors"  onClick={() => setOpenSheet(null)} />
        </Sheet>
      )}

      {openSheet === 'me' && (
        <Sheet title={user ? (user.full_name?.split(' ')[0] ?? 'Account') : 'Account'} onClose={() => setOpenSheet(null)}>
          {user ? (
            <>
              <SheetLink href="/dashboard" icon={LayoutDashboard} label="Dashboard"   desc="Your profile & activity"  onClick={() => setOpenSheet(null)} />
              {user.is_admin && (
                <SheetLink href="/admin" icon={Shield} label="Admin Panel" desc="Manage HSN content" onClick={() => setOpenSheet(null)} green />
              )}
              <form action={logout} style={{ marginTop: '0.25rem' }}>
                <button type="submit" style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '0.6rem',
                  border: '1.5px solid #FECACA', background: '#FEF2F2',
                  color: '#DC2626', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <LogOut size={16} color="#DC2626" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#DC2626', lineHeight: 1.2 }}>Sign out</div>
                    <div style={{ fontSize: '0.75rem', color: '#F87171', marginTop: '1px' }}>{user.email}</div>
                  </div>
                </button>
              </form>
            </>
          ) : (
            <>
              <SheetLink href="/auth/login"  icon={LogIn}     label="Log in"   desc="Access your account"    onClick={() => setOpenSheet(null)} />
              <SheetLink href="/auth/signup" icon={UserPlus}  label="Join HSN" desc="Create a free account"  onClick={() => setOpenSheet(null)} green />
            </>
          )}
        </Sheet>
      )}

      <nav className="hidden-desktop" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--hsn-border)',
        display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <Link href="/" style={tab(pathname === '/')}>
          <Home size={22} strokeWidth={pathname === '/' ? 2.5 : 2} />
          <span>Home</span>
        </Link>

        <button onClick={() => toggle('explore')} style={tab(isExploreActive || openSheet === 'explore')}>
          <Compass size={22} strokeWidth={(isExploreActive || openSheet === 'explore') ? 2.5 : 2} />
          <span>Explore</span>
        </button>

        <button onClick={() => toggle('learn')} style={tab(isLearnActive || openSheet === 'learn')}>
          <BookOpen size={22} strokeWidth={(isLearnActive || openSheet === 'learn') ? 2.5 : 2} />
          <span>Learn</span>
        </button>

        <button onClick={() => toggle('me')} style={tab(isMeActive || openSheet === 'me')}>
          {user ? (
            <span style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: (isMeActive || openSheet === 'me')
                ? 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)'
                : 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.6rem', flexShrink: 0,
            }}>
              {initials}
            </span>
          ) : (
            <User size={22} strokeWidth={(isMeActive || openSheet === 'me') ? 2.5 : 2} />
          )}
          <span>Me</span>
        </button>
      </nav>
    </>
  )
}

function Sheet({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(64px + env(safe-area-inset-bottom))',
      left: '0.75rem', right: '0.75rem',
      zIndex: 99,
      background: 'white', borderRadius: '1rem',
      boxShadow: '0 -4px 32px rgba(0,0,0,0.12), 0 0 0 1px var(--hsn-border)',
      padding: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--hsn-gray-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {title}
        </span>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--hsn-gray-light)', display: 'flex', padding: '2px' }}>
          <X size={16} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {children}
      </div>
    </div>
  )
}

function SheetLink({ href, icon: Icon, label, desc, onClick, green }: {
  href: string; icon: React.ElementType; label: string; desc: string; onClick: () => void; green?: boolean
}) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem', borderRadius: '0.6rem', textDecoration: 'none',
      background: green ? 'var(--hsn-green-muted)' : '#F8FAFC',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px',
        background: green ? 'var(--hsn-green-50)' : 'white',
        border: '1px solid var(--hsn-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} color={green ? 'var(--hsn-green)' : 'var(--hsn-gray)'} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: green ? 'var(--hsn-green)' : 'var(--hsn-dark)', lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--hsn-gray-light)', marginTop: '1px' }}>{desc}</div>
      </div>
    </Link>
  )
}
