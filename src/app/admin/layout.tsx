import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Users,
  Megaphone,
  ShieldCheck,
  ArrowLeft,
  Shield,
  Store,
} from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const navItems = [
    { href: '/admin',               label: 'Dashboard',    icon: LayoutDashboard },
    { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/admin/directory',     label: 'Directory',    icon: Store },
    { href: '/admin/guidance',      label: 'Guidance',     icon: BookOpen },
    { href: '/admin/users',         label: 'Users',        icon: Users },
    { href: '/admin/announcements', label: 'Announcements',icon: Megaphone },
    { href: '/admin/halal-checks',  label: 'Halal Check',  icon: ShieldCheck },
  ]

  const initials = (profile.full_name ?? 'A')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '230px',
        background: '#0F172A',
        color: 'white',
        padding: '0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Brand */}
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '7px',
              background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={15} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--hsn-gold-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                HSN Admin
              </div>
            </div>
          </div>

          {/* User pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
          }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.full_name}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.75rem 0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="admin-nav-link">
                <Icon size={15} strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.8rem', color: '#64748B', textDecoration: 'none',
            transition: 'color 0.15s',
          }}>
            <ArrowLeft size={13} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#F8FAFC', padding: '2.5rem', overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
