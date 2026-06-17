import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/opportunities', label: '💼 Opportunities' },
    { href: '/admin/guidance', label: '📚 Guidance' },
    { href: '/admin/users', label: '👥 Users' },
    { href: '/admin/announcements', label: '📣 Announcements' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--hsn-dark)',
        color: 'white',
        padding: '1.5rem 0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--hsn-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>HSN Admin</div>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{profile.full_name}</div>
        </div>
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/dashboard" style={{ fontSize: '0.8rem', color: '#9CA3AF', textDecoration: 'none' }}>
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#F9FAFB', padding: '2rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
