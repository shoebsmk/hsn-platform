import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import OppActions from '../OppActions'
import AdminNotesForm from './AdminNotesForm'

export default async function AdminOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: opp } = await supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name, email, role, location)')
    .eq('id', id)
    .single()

  if (!opp) notFound()

  const cat = CATEGORIES.find(c => c.value === opp.category)
  const loc = LOCATIONS.find(l => l.value === opp.location)

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending:  { bg: '#FEF3C7', color: '#92400E' },
    active:   { bg: '#D1FAE5', color: '#065F46' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
    closed:   { bg: '#F3F4F6', color: '#6B7280' },
    flagged:  { bg: '#FFE4B5', color: '#B45309' },
    expired:  { bg: '#F3F4F6', color: '#6B7280' },
  }
  const sc = statusColors[opp.status] ?? { bg: '#F3F4F6', color: '#6B7280' }

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Back */}
      <a href="/admin/jobs" style={{ color: 'var(--hsn-green)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
        ← Back to Jobs
      </a>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header card */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.75rem', border: '1px solid var(--hsn-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--hsn-green-muted)', color: 'var(--hsn-green)', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  {cat?.icon} {cat?.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)' }}>📍 {loc?.label}</span>
                {opp.is_remote && <span style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)' }}>· Remote OK</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--hsn-dark)', lineHeight: 1.25 }}>{opp.title}</h1>
            </div>
            <span style={{ background: sc.bg, color: sc.color, padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
              {opp.status}
            </span>
          </div>

          <p style={{ color: 'var(--hsn-dark)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
            {opp.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem', borderTop: '1px solid var(--hsn-border)', paddingTop: '1.25rem' }}>
            {opp.contact_info && (
              <div>
                <span style={{ color: 'var(--hsn-gray)', fontWeight: 600 }}>Contact: </span>
                <span style={{ color: 'var(--hsn-dark)' }}>{opp.contact_info}</span>
              </div>
            )}
            {opp.external_url && (
              <div>
                <span style={{ color: 'var(--hsn-gray)', fontWeight: 600 }}>Link: </span>
                <a href={opp.external_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hsn-green)' }}>{opp.external_url}</a>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--hsn-gray)', fontWeight: 600 }}>Posted: </span>
              <span style={{ color: 'var(--hsn-dark)' }}>{new Date(opp.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--hsn-gray)', fontWeight: 600 }}>Updated: </span>
              <span style={{ color: 'var(--hsn-dark)' }}>{new Date(opp.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Provider card */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--hsn-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)', marginBottom: '1rem' }}>Posted By</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--hsn-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
              {(opp.provider?.full_name || opp.provider?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--hsn-dark)' }}>{opp.provider?.full_name || '—'}</div>
              <div style={{ color: 'var(--hsn-gray)', fontSize: '0.85rem' }}>{opp.provider?.email}</div>
              <div style={{ color: 'var(--hsn-gray)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {opp.provider?.role} · {opp.provider?.location}
              </div>
            </div>
          </div>
        </div>

        {/* Moderation actions */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--hsn-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)', marginBottom: '1rem' }}>Moderation</h2>
          <OppActions id={opp.id} status={opp.status} redirectTo={`/admin/jobs/${opp.id}`} />
        </div>

        {/* Admin notes */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--hsn-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--hsn-dark)', marginBottom: '1rem' }}>Admin Notes</h2>
          <AdminNotesForm id={opp.id} notes={opp.admin_notes ?? ''} />
        </div>

      </div>
    </div>
  )
}
