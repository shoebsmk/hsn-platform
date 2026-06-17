import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const roleLabel = {
    seeker: 'Opportunity Seeker',
    provider: 'Opportunity Provider',
    mentor: 'Mentor',
  }[profile?.role ?? 'seeker']

  const locationLabel = {
    hyderabad: 'Hyderabad, India',
    chicago: 'Greater Chicago, USA',
    remote: 'Remote',
  }[profile?.location ?? 'remote']

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--hsn-dark)' }}>
          As-salamu alaykum, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p style={{ color: 'var(--hsn-gray)', marginTop: '0.4rem' }}>
          {roleLabel} · {locationLabel}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { icon: '🔍', title: 'Browse Opportunities', desc: 'Find verified halal opportunities', href: '/opportunities' },
          { icon: '➕', title: 'Post an Opportunity', desc: 'Share a job or business opportunity', href: '/opportunities/new' },
          { icon: '🌟', title: 'Find a Mentor', desc: 'Connect with experienced professionals', href: '/mentorship' },
        ].map(action => (
          <a key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>{action.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)', marginBottom: '0.3rem' }}>{action.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--hsn-gray)' }}>{action.desc}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Account info */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--hsn-dark)' }}>Account</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--hsn-gray)', marginBottom: '0.4rem' }}>
          <strong style={{ color: 'var(--hsn-dark)' }}>Email:</strong> {user.email}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--hsn-gray)', marginBottom: '1.25rem' }}>
          <strong style={{ color: 'var(--hsn-dark)' }}>Role:</strong> {roleLabel}
        </div>
        <form action={logout}>
          <button
            type="submit"
            style={{ background: 'none', border: '1.5px solid #E5E7EB', color: 'var(--hsn-gray)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
