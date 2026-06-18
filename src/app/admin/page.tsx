import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Users,
  Briefcase,
  Clock,
  BookOpen,
  Megaphone,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalOpportunities },
    { count: pendingOpportunities },
    { count: totalArticles },
    { count: activeAnnouncements },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('guidance_articles').select('*', { count: 'exact', head: true }),
    supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  const stats = [
    { label: 'Total Members',        value: totalUsers ?? 0,           icon: Users,      color: '#1D4ED8', bg: '#EFF6FF', href: '/admin/users' },
    { label: 'Total Opportunities',  value: totalOpportunities ?? 0,   icon: Briefcase,  color: '#1B6B3A', bg: '#E8F5EE', href: '/admin/opportunities' },
    { label: 'Pending Review',       value: pendingOpportunities ?? 0, icon: Clock,      color: '#B45309', bg: '#FEF9E7', href: '/admin/opportunities', alert: (pendingOpportunities ?? 0) > 0 },
    { label: 'Guidance Articles',    value: totalArticles ?? 0,        icon: BookOpen,   color: '#7C3AED', bg: '#F5F3FF', href: '/admin/guidance' },
    { label: 'Active Announcements', value: activeAnnouncements ?? 0,  icon: Megaphone,  color: '#DC2626', bg: '#FEF2F2', href: '/admin/announcements' },
  ]

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentOpps } = await supabase
    .from('opportunities')
    .select('id, title, status, category, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const roleColors: Record<string, { bg: string; color: string }> = {
    seeker:   { bg: '#EFF6FF', color: '#1D4ED8' },
    provider: { bg: '#E8F5EE', color: '#1B6B3A' },
    mentor:   { bg: '#F5F3FF', color: '#7C3AED' },
  }

  const statusColors: Record<string, { bg: string; color: string }> = {
    active:   { bg: '#D1FAE5', color: '#065F46' },
    pending:  { bg: '#FEF3C7', color: '#92400E' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
    closed:   { bg: '#F1F5F9', color: '#64748B' },
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Platform overview</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '0.875rem',
                padding: '1.25rem',
                border: stat.alert ? `2px solid ${stat.color}` : '1px solid var(--hsn-border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '9px',
                  background: stat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.875rem',
                }}>
                  <Icon size={19} color={stat.color} strokeWidth={1.75} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--hsn-gray)', marginTop: '0.35rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
                {stat.alert && (
                  <div style={{ fontSize: '0.72rem', color: stat.color, fontWeight: 700, marginTop: '0.3rem' }}>
                    Needs attention
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent members */}
        <div style={{ background: 'white', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid var(--hsn-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)' }}>Recent Members</h2>
            <Link href="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--hsn-green)', fontWeight: 600, textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentUsers?.map(u => {
              const rc = roleColors[u.role] ?? { bg: '#F1F5F9', color: '#64748B' }
              const initials = (u.full_name ?? u.email ?? 'U').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
              return (
                <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1B6B3A 0%, #2E8B57 100%)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--hsn-dark)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name || '—'}</div>
                      <div style={{ color: 'var(--hsn-gray)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: rc.bg, color: rc.color, padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 600, flexShrink: 0 }}>
                    {u.role}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent opportunities */}
        <div style={{ background: 'white', borderRadius: '0.875rem', padding: '1.5rem', border: '1px solid var(--hsn-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)' }}>Recent Opportunities</h2>
            <Link href="/admin/opportunities" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--hsn-green)', fontWeight: 600, textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentOpps?.map(opp => {
              const sc = statusColors[opp.status] ?? { bg: '#F1F5F9', color: '#64748B' }
              return (
                <div key={opp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <Link href={`/admin/opportunities/${opp.id}`} style={{
                    fontWeight: 600, color: 'var(--hsn-dark)', fontSize: '0.875rem',
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textDecoration: 'none',
                  }}>
                    {opp.title}
                  </Link>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 600, flexShrink: 0, background: sc.bg, color: sc.color }}>
                    {opp.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
