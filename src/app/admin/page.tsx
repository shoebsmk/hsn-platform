import { createClient } from '@/lib/supabase/server'

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
    { label: 'Total Members', value: totalUsers ?? 0, icon: '👥', color: '#3B82F6' },
    { label: 'Total Opportunities', value: totalOpportunities ?? 0, icon: '💼', color: 'var(--hsn-green)' },
    { label: 'Pending Review', value: pendingOpportunities ?? 0, icon: '⏳', color: '#F59E0B', alert: (pendingOpportunities ?? 0) > 0 },
    { label: 'Guidance Articles', value: totalArticles ?? 0, icon: '📚', color: '#8B5CF6' },
    { label: 'Active Announcements', value: activeAnnouncements ?? 0, icon: '📣', color: '#EF4444' },
  ]

  // Recent signups
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('full_name, email, role, location, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Recent opportunities
  const { data: recentOpps } = await supabase
    .from('opportunities')
    .select('title, status, category, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>Platform overview</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            border: stat.alert ? '2px solid #F59E0B' : '1px solid var(--hsn-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent users */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid var(--hsn-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--hsn-dark)' }}>Recent Members</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentUsers?.map(u => (
              <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--hsn-dark)' }}>{u.full_name || '—'}</div>
                  <div style={{ color: 'var(--hsn-gray)', fontSize: '0.8rem' }}>{u.email}</div>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--hsn-green-muted)', color: 'var(--hsn-green)', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent opportunities */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid var(--hsn-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--hsn-dark)' }}>Recent Opportunities</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOpps?.map(opp => (
              <div key={opp.title + opp.created_at} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--hsn-dark)', flex: 1, marginRight: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opp.title}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  flexShrink: 0,
                  background: opp.status === 'active' ? 'var(--hsn-green-muted)' : opp.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                  color: opp.status === 'active' ? 'var(--hsn-green)' : opp.status === 'pending' ? '#92400E' : '#991B1B',
                }}>
                  {opp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
