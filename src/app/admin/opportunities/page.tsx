import { createAdminClient } from '@/lib/supabase/admin'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import OppActions from './OppActions'

export default async function AdminOpportunitiesPage() {
  const supabase = createAdminClient()

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name, email)')
    .order('created_at', { ascending: false })

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending:  { bg: '#FEF3C7', color: '#92400E' },
    active:   { bg: '#D1FAE5', color: '#065F46' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
    closed:   { bg: '#F3F4F6', color: '#6B7280' },
    flagged:  { bg: '#FFE4B5', color: '#92400E' },
    expired:  { bg: '#F3F4F6', color: '#6B7280' },
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Opportunities</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Review and moderate all posted opportunities
      </p>

      <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid var(--hsn-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--hsn-border)' }}>
              {['Title', 'Category', 'Location', 'Posted By', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--hsn-gray)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities?.map((opp: any) => {
              const cat = CATEGORIES.find(c => c.value === opp.category)
              const loc = LOCATIONS.find(l => l.value === opp.location)
              const sc = statusColors[opp.status] ?? { bg: '#F3F4F6', color: '#6B7280' }

              return (
                <tr key={opp.id} style={{ borderBottom: '1px solid var(--hsn-border)', cursor: 'pointer' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--hsn-dark)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={`/admin/opportunities/${opp.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {opp.title}
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)' }}>{cat?.icon} {cat?.label}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)' }}>{loc?.label}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)' }}>{opp.provider?.full_name || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--hsn-gray)', whiteSpace: 'nowrap' }}>
                    {new Date(opp.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.75rem' }}>
                      {opp.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <OppActions id={opp.id} status={opp.status} />
                  </td>
                </tr>
              )
            })}
            {(!opportunities || opportunities.length === 0) && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--hsn-gray)' }}>No opportunities yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

