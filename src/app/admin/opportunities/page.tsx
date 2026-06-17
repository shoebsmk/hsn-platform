import { createClient } from '@/lib/supabase/server'
import { updateOpportunityStatus } from '../actions'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

export default async function AdminOpportunitiesPage() {
  const supabase = await createClient()

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name, email)')
    .order('created_at', { ascending: false })

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending:  { bg: '#FEF3C7', color: '#92400E' },
    active:   { bg: '#D1FAE5', color: '#065F46' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
    closed:   { bg: '#F3F4F6', color: '#6B7280' },
    flagged:  { bg: '#FEE2E2', color: '#B45309' },
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
                <tr key={opp.id} style={{ borderBottom: '1px solid var(--hsn-border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--hsn-dark)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opp.title}
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
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {opp.status !== 'active' && (
                        <form action={async () => { 'use server'; await updateOpportunityStatus(opp.id, 'active') }}>
                          <button type="submit" style={actionBtn('var(--hsn-green)', 'white')}>Approve</button>
                        </form>
                      )}
                      {opp.status !== 'rejected' && (
                        <form action={async () => { 'use server'; await updateOpportunityStatus(opp.id, 'rejected') }}>
                          <button type="submit" style={actionBtn('#EF4444', 'white')}>Reject</button>
                        </form>
                      )}
                      {opp.status !== 'flagged' && (
                        <form action={async () => { 'use server'; await updateOpportunityStatus(opp.id, 'flagged') }}>
                          <button type="submit" style={actionBtn('#F59E0B', 'white')}>Flag</button>
                        </form>
                      )}
                    </div>
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

function actionBtn(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.3rem 0.65rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }
}
