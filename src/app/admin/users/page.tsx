import { createClient } from '@/lib/supabase/server'
import { CheckCircle, Minus } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const roleColors: Record<string, { bg: string; color: string }> = {
    seeker:   { bg: '#EFF6FF', color: '#1D4ED8' },
    provider: { bg: '#E8F5EE', color: '#1B6B3A' },
    mentor:   { bg: '#F5F3FF', color: '#7C3AED' },
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
          Users
        </h1>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {users?.length ?? 0} total members
        </p>
      </div>

      <div style={{
        background: 'white', borderRadius: '0.875rem',
        border: '1px solid var(--hsn-border)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--hsn-border)' }}>
              {['Member', 'Role', 'Location', 'Admin', 'Joined'].map(h => (
                <th key={h} style={{
                  padding: '0.875rem 1rem', textAlign: 'left',
                  fontWeight: 600, color: 'var(--hsn-gray)',
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const rc = roleColors[u.role] ?? { bg: '#F1F5F9', color: '#64748B' }
              const initials = (u.full_name ?? u.email ?? 'U').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--hsn-border)' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #1B6B3A 0%, #2E8B57 100%)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700,
                      }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--hsn-dark)' }}>{u.full_name || '—'}</div>
                        <div style={{ color: 'var(--hsn-gray)', fontSize: '0.78rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: rc.bg, color: rc.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.72rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--hsn-gray)', fontSize: '0.82rem' }}>
                    {u.location || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {u.is_admin
                      ? <CheckCircle size={17} color="var(--hsn-green)" strokeWidth={2.5} />
                      : <Minus size={17} color="#CBD5E1" strokeWidth={2} />
                    }
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--hsn-gray)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
