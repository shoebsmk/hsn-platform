import { createAdminClient } from '@/lib/supabase/admin'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import OppActions from './OppActions'
import ClickableRow from './ClickableRow'
import Link from 'next/link'
import {
  Briefcase, Users, Zap, TrendingUp, DollarSign, GraduationCap, Star,
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  hidden_jobs:     Briefcase,
  community:       Users,
  gig_services:    Zap,
  business:        TrendingUp,
  income:          DollarSign,
  career_guidance: GraduationCap,
  mentorship:      Star,
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  hidden_jobs:     { color: '#1B6B3A', bg: '#E8F5EE' },
  community:       { color: '#1D4ED8', bg: '#EFF6FF' },
  gig_services:    { color: '#7C3AED', bg: '#F5F3FF' },
  business:        { color: '#B45309', bg: '#FEF9E7' },
  income:          { color: '#0D9488', bg: '#F0FDFA' },
  career_guidance: { color: '#DC2626', bg: '#FEF2F2' },
  mentorship:      { color: '#C9A84C', bg: '#FEFCE8' },
}

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#FEF3C7', color: '#92400E' },
  active:   { bg: '#D1FAE5', color: '#065F46' },
  rejected: { bg: '#FEE2E2', color: '#991B1B' },
  closed:   { bg: '#F1F5F9', color: '#64748B' },
  flagged:  { bg: '#FFE4B5', color: '#92400E' },
  expired:  { bg: '#F1F5F9', color: '#64748B' },
}

export default async function AdminOpportunitiesPage() {
  const supabase = createAdminClient()

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
          Opportunities
        </h1>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Review and moderate all posted opportunities
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
              {['Title', 'Category', 'Location', 'Posted By', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '0.875rem 1rem', textAlign: 'left',
                  fontWeight: 600, color: 'var(--hsn-gray)',
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities?.map((opp: any) => {
              const cat = CATEGORIES.find(c => c.value === opp.category)
              const loc = LOCATIONS.find(l => l.value === opp.location)
              const sc = statusColors[opp.status] ?? { bg: '#F1F5F9', color: '#64748B' }
              const Icon = categoryIcons[opp.category] ?? Briefcase
              const colors = categoryColors[opp.category] ?? { color: '#1B6B3A', bg: '#E8F5EE' }

              return (
                <ClickableRow key={opp.id} href={`/admin/opportunities/${opp.id}`}>
                  <td style={{ padding: '0.875rem 1rem', maxWidth: '200px' }}>
                    <span style={{
                      fontWeight: 600, color: 'var(--hsn-dark)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                    }}>
                      {opp.title}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '5px',
                        background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={12} color={colors.color} strokeWidth={2} />
                      </div>
                      <span style={{ color: 'var(--hsn-gray)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{cat?.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--hsn-gray)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {loc?.label}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--hsn-gray)', fontSize: '0.82rem' }}>
                    {opp.provider?.full_name || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--hsn-gray)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {new Date(opp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      background: sc.bg, color: sc.color,
                      padding: '0.2rem 0.6rem', borderRadius: '9999px',
                      fontWeight: 600, fontSize: '0.72rem', whiteSpace: 'nowrap',
                    }}>
                      {opp.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <OppActions id={opp.id} status={opp.status} />
                  </td>
                </ClickableRow>
              )
            })}
            {(!opportunities || opportunities.length === 0) && (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--hsn-gray)' }}>
                  No opportunities yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
