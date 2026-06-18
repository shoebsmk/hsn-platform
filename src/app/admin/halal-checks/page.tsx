import { createAdminClient } from '@/lib/supabase/admin'
import { reviewHalalCheck, deleteHalalCheck } from './actions'
import {
  ShieldCheck, CheckCircle, XCircle, AlertCircle,
  ExternalLink, Clock, Trash2,
} from 'lucide-react'
import VerdictPicker from './VerdictPicker'

const verdictOptions = [
  { value: 'permissible',     label: 'Permissible',     icon: CheckCircle, color: '#1B6B3A', bg: '#E8F5EE' },
  { value: 'not_permissible', label: 'Not Permissible', icon: XCircle,     color: '#DC2626', bg: '#FEF2F2' },
  { value: 'needs_context',   label: 'Needs Context',   icon: AlertCircle, color: '#B45309', bg: '#FEF9E7' },
]

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#FEF3C7', color: '#92400E' },
  reviewed: { bg: '#D1FAE5', color: '#065F46' },
}

export default async function AdminHalalChecksPage() {
  const supabase = createAdminClient()

  const { data: items, error } = await supabase
    .from('halal_checks')
    .select('*, submitter:profiles!halal_checks_submitter_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })

  if (error) console.error('halal_checks query error:', error.message)

  const pending = items?.filter(i => i.status === 'pending') ?? []
  const reviewed = items?.filter(i => i.status === 'reviewed') ?? []

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
            Halal Check
          </h1>
          {pending.length > 0 && (
            <span style={{
              background: '#FEF3C7', color: '#92400E',
              fontSize: '0.72rem', fontWeight: 700,
              padding: '0.2rem 0.65rem', borderRadius: '9999px',
            }}>
              {pending.length} pending
            </span>
          )}
        </div>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem' }}>
          Review community submissions and publish halal rulings
        </p>
      </div>

      {/* Pending */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} color="var(--hsn-gray)" />
          Awaiting Review
        </h2>

        {pending.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--hsn-gray)' }}>
            <ShieldCheck size={28} color="#CBD5E1" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--hsn-dark)' }}>All caught up!</p>
            <p style={{ fontSize: '0.875rem' }}>No pending submissions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pending.map((item: any) => (
              <div key={item.id} className="card" style={{ borderLeft: '4px solid #FDE68A' }}>
                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                        Pending
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {item.submitter?.full_name && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>
                          · by {item.submitter.full_name}
                        </span>
                      )}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          fontSize: '0.8rem', color: '#1D4ED8', marginBottom: '0.4rem',
                          textDecoration: 'none', fontWeight: 500,
                        }}
                      >
                        <ExternalLink size={12} />
                        {item.url.length > 60 ? item.url.slice(0, 60) + '…' : item.url}
                      </a>
                    )}
                    <p style={{ fontSize: '0.9rem', color: 'var(--hsn-dark)', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                  <form action={async () => { 'use server'; await deleteHalalCheck(item.id) }}>
                    <button type="submit" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '0.4rem',
                      background: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>

                {/* Review form */}
                <form action={reviewHalalCheck} style={{
                  borderTop: '1px solid var(--hsn-border)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}>
                  <input type="hidden" name="id" value={item.id} />

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: 'var(--hsn-dark)', marginBottom: '0.5rem' }}>
                      Verdict
                    </label>
                    <VerdictPicker />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: 'var(--hsn-dark)', marginBottom: '0.4rem' }}>
                      Scholar's Note <span style={{ fontWeight: 400, color: 'var(--hsn-gray)' }}>(optional)</span>
                    </label>
                    <textarea
                      name="scholar_notes"
                      rows={3}
                      placeholder="Explain the reasoning, relevant hadith, or conditions that apply…"
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}>
                      <ShieldCheck size={15} />
                      Publish Ruling
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} color="var(--hsn-green)" />
            Published Rulings ({reviewed.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reviewed.map((item: any) => {
              const opt = verdictOptions.find(o => o.value === item.verdict)
              if (!opt) return null
              const Icon = opt.icon
              return (
                <div key={item.id} style={{
                  background: 'white', borderRadius: '0.875rem', padding: '1rem 1.25rem',
                  border: '1px solid var(--hsn-border)', boxShadow: 'var(--shadow-sm)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                      background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={15} color={opt.color} strokeWidth={2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--hsn-dark)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)', marginTop: '0.15rem' }}>
                        {opt.label} · Reviewed {new Date(item.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <form action={async () => { 'use server'; await deleteHalalCheck(item.id) }}>
                    <button type="submit" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '30px', height: '30px', borderRadius: '0.4rem',
                      background: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
