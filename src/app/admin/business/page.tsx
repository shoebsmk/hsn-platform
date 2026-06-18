import { createAdminClient } from '@/lib/supabase/admin'
import { BUSINESS_CATEGORIES, LOCATIONS } from '@/lib/constants'
import { CheckCircle, MapPin } from 'lucide-react'
import { StatusActions, VerifyToggle } from './DirectoryActions'

const statusColors: Record<string, { bg: string; color: string }> = {
  active:   { bg: '#D1FAE5', color: '#065F46' },
  pending:  { bg: '#FEF9C3', color: '#854D0E' },
  rejected: { bg: '#FEE2E2', color: '#991B1B' },
}

export default async function AdminDirectoryPage() {
  const supabase = createAdminClient()
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, submitter:profiles(full_name)')
    .order('created_at', { ascending: false })

  const counts = {
    total:    businesses?.length ?? 0,
    active:   businesses?.filter(b => b.status === 'active').length ?? 0,
    pending:  businesses?.filter(b => b.status === 'pending').length ?? 0,
    verified: businesses?.filter(b => b.is_verified).length ?? 0,
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Business</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage halal business listings</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total', value: counts.total },
          { label: 'Active', value: counts.active },
          { label: 'Pending', value: counts.pending },
          { label: 'Verified', value: counts.verified },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>{s.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              {['Business', 'Category', 'Location', 'Status', 'Verified', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!businesses || businesses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                  No businesses submitted yet
                </td>
              </tr>
            ) : businesses.map((biz: any) => {
              const cat = BUSINESS_CATEGORIES.find(c => c.value === biz.category)
              const loc = LOCATIONS.find(l => l.value === biz.location)
              const sc = statusColors[biz.status] ?? statusColors.pending

              return (
                <tr key={biz.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>{biz.name}</span>
                      {biz.is_verified && <CheckCircle size={13} color="var(--hsn-green)" />}
                    </div>
                    {biz.submitter?.full_name && (
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>by {biz.submitter.full_name}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#475569' }}>{cat?.label ?? biz.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#475569' }}>
                      <MapPin size={12} />
                      {loc?.label ?? biz.location}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px', background: sc.bg, color: sc.color }}>
                      {biz.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <VerifyToggle id={biz.id} is_verified={biz.is_verified} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusActions id={biz.id} status={biz.status} />
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
