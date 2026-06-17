import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const roleColors: Record<string, { bg: string; color: string }> = {
    seeker:   { bg: '#EFF6FF', color: '#1D4ED8' },
    provider: { bg: '#D1FAE5', color: '#065F46' },
    mentor:   { bg: '#F5F3FF', color: '#6D28D9' },
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Users</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {users?.length ?? 0} total members
      </p>

      <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid var(--hsn-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--hsn-border)' }}>
              {['Name', 'Email', 'Role', 'Location', 'Admin', 'Joined'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--hsn-gray)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const rc = roleColors[u.role] ?? { bg: '#F3F4F6', color: '#6B7280' }
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--hsn-border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--hsn-dark)' }}>{u.full_name || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: rc.bg, color: rc.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.75rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)' }}>{u.location || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {u.is_admin ? <span style={{ color: 'var(--hsn-green)', fontWeight: 700 }}>✓</span> : <span style={{ color: '#D1D5DB' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)', whiteSpace: 'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString()}
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
