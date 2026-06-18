import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: opp } = await supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name, bio, location)')
    .eq('id', id)
    .single()

  if (!opp) notFound()

  const cat = CATEGORIES.find(c => c.value === opp.category)
  const loc = LOCATIONS.find(l => l.value === opp.location)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link href="/jobs" style={{ color: 'var(--hsn-green)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
        ← Back to Jobs
      </Link>

      <div className="card">
        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', background: 'var(--hsn-green-muted)', color: 'var(--hsn-green)', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: '9999px' }}>
            {cat?.icon} {cat?.label}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)' }}>📍 {loc?.label}</span>
          {opp.is_remote && <span style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)' }}>· Remote OK</span>}
          <span className="badge-verified" style={{ marginLeft: 'auto' }}>✓ Verified by HSN</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', marginBottom: '1rem' }}>{opp.title}</h1>

        <p style={{ color: 'var(--hsn-gray)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
          {opp.description}
        </p>

        {/* Contact / Apply */}
        <div style={{ borderTop: '1px solid var(--hsn-border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {opp.external_url && (
            <a href={opp.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Apply / Learn More →
            </a>
          )}
          {opp.contact_info && (
            <div style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>📬</span>
              <span>{opp.contact_info}</span>
            </div>
          )}
        </div>
      </div>

      {/* Provider info */}
      {opp.provider && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--hsn-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Posted by
          </h3>
          <p style={{ fontWeight: 700, color: 'var(--hsn-dark)' }}>{opp.provider.full_name}</p>
          {opp.provider.bio && <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', marginTop: '0.3rem' }}>{opp.provider.bio}</p>}
          <p style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', marginTop: '0.5rem' }}>
            Posted {new Date(opp.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  )
}
