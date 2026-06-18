import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SubmitForm from './SubmitForm'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ submitted?: string }>
}

const verdictConfig = {
  permissible: {
    label: 'Permissible',
    icon: CheckCircle,
    color: '#1B6B3A',
    bg: '#E8F5EE',
    border: '#B7DEC7',
  },
  not_permissible: {
    label: 'Not Permissible',
    icon: XCircle,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  needs_context: {
    label: 'Needs Context',
    icon: AlertCircle,
    color: '#B45309',
    bg: '#FEF9E7',
    border: '#FDE68A',
  },
}

export default async function HalalCheckPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: verdicts } = await supabase
    .from('halal_checks')
    .select('*')
    .eq('status', 'reviewed')
    .order('reviewed_at', { ascending: false })

  if (params.submitted) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--hsn-green-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <ShieldCheck size={30} color="var(--hsn-green)" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Submitted for Review
        </h1>
        <p style={{ color: 'var(--hsn-gray)', marginBottom: '2rem', lineHeight: 1.7 }}>
          Our scholars will review your submission and post a ruling. You can check back here to see the verdict once published. JazakAllahu Khayran!
        </p>
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/halal-check" className="btn-primary">View Verdicts</Link>
          <Link href="/halal-check?new=1" className="btn-secondary">Submit Another</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Header */}
      <div style={{ maxWidth: '620px', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--hsn-green-muted)', color: 'var(--hsn-green)',
          borderRadius: '9999px', padding: '0.3rem 0.875rem',
          fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem',
        }}>
          <ShieldCheck size={14} />
          Scholar-Verified Rulings
        </div>
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Halal Check</h1>
        <p className="section-subtitle">
          Unsure if a job or opportunity is permissible? Submit it and HSN scholars will review it and publish a ruling for the community.
        </p>
      </div>

      <div className="halal-check-grid">

        {/* Verdicts */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '1.25rem' }}>
            Published Rulings
          </h2>

          {!verdicts || verdicts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'var(--hsn-green-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Clock size={24} color="var(--hsn-green)" />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.3rem' }}>No rulings yet</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)' }}>
                Be the first to submit a job for review.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {verdicts.map((item: any) => {
                const cfg = verdictConfig[item.verdict as keyof typeof verdictConfig]
                if (!cfg) return null
                const Icon = cfg.icon
                return (
                  <div key={item.id} className="card" style={{ borderLeft: `4px solid ${cfg.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                        background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={18} color={cfg.color} strokeWidth={2} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            background: cfg.bg, color: cfg.color,
                            padding: '0.2rem 0.65rem', borderRadius: '9999px',
                          }}>
                            {cfg.label}
                          </span>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                              fontSize: '0.72rem', color: 'var(--hsn-gray)', textDecoration: 'none',
                            }}>
                              <ExternalLink size={11} /> Source
                            </a>
                          )}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--hsn-dark)', fontWeight: 500, marginBottom: '0.5rem', lineHeight: 1.5 }}>
                          {item.description}
                        </p>
                        {item.scholar_notes && (
                          <div style={{
                            background: '#F8FAFC', borderRadius: '0.5rem',
                            padding: '0.75rem', fontSize: '0.85rem',
                            color: 'var(--hsn-gray)', lineHeight: 1.6,
                            borderLeft: '3px solid var(--hsn-border)',
                          }}>
                            <strong style={{ color: 'var(--hsn-dark)', display: 'block', fontSize: '0.78rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Scholar's Note
                            </strong>
                            {item.scholar_notes}
                          </div>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--hsn-gray-light)', marginTop: '0.6rem' }}>
                          Reviewed {new Date(item.reviewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Submit form */}
        <div className="halal-form-sticky">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '1.25rem' }}>
            Submit for Review
          </h2>
          <SubmitForm />
        </div>

      </div>
    </div>
  )
}
