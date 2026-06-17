import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

interface PageProps {
  searchParams: Promise<{ category?: string; location?: string; q?: string }>
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('opportunities')
    .select('*, provider:profiles(full_name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (params.category) query = query.eq('category', params.category)
  if (params.location) query = query.eq('location', params.location)
  if (params.q) query = query.ilike('title', `%${params.q}%`)

  const { data: opportunities } = await query

  const activeCategory = params.category ?? ''
  const activeLocation = params.location ?? ''

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Opportunities</h1>
          <p className="section-subtitle">Verified halal opportunities from the community</p>
        </div>
        <Link href="/opportunities/new" className="btn-primary">
          + Post Opportunity
        </Link>
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: '1.5rem' }}>
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search opportunities…"
          style={{
            width: '100%',
            border: '1.5px solid var(--hsn-border)',
            borderRadius: '0.5rem',
            padding: '0.7rem 1rem',
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
        {params.location && <input type="hidden" name="location" value={params.location} />}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar filters */}
        <aside>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--hsn-dark)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
              <FilterLink href="/opportunities" label="All Categories" active={!activeCategory} />
              {CATEGORIES.map(cat => (
                <FilterLink
                  key={cat.value}
                  href={`/opportunities?category=${cat.value}${activeLocation ? `&location=${activeLocation}` : ''}`}
                  label={`${cat.icon} ${cat.label}`}
                  active={activeCategory === cat.value}
                />
              ))}
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--hsn-dark)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Location
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <FilterLink href={`/opportunities${activeCategory ? `?category=${activeCategory}` : ''}`} label="All Locations" active={!activeLocation} />
              {LOCATIONS.map(loc => (
                <FilterLink
                  key={loc.value}
                  href={`/opportunities?location=${loc.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                  label={loc.label}
                  active={activeLocation === loc.value}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Listings */}
        <div>
          {!opportunities || opportunities.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--hsn-gray)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--hsn-dark)' }}>No opportunities found</p>
              <p style={{ fontSize: '0.875rem' }}>Be the first to post one!</p>
              <Link href="/opportunities/new" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.25rem' }}>
                Post Opportunity
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {opportunities.map((opp: any) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '0.4rem 0.6rem',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        textDecoration: 'none',
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--hsn-green-muted)' : 'transparent',
        color: active ? 'var(--hsn-green)' : 'var(--hsn-gray)',
      }}
    >
      {label}
    </Link>
  )
}

function OpportunityCard({ opp }: { opp: any }) {
  const cat = CATEGORIES.find(c => c.value === opp.category)
  const loc = LOCATIONS.find(l => l.value === opp.location)

  return (
    <Link href={`/opportunities/${opp.id}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', background: 'var(--hsn-green-muted)', color: 'var(--hsn-green)', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                {cat?.icon} {cat?.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>📍 {loc?.label}</span>
              {opp.is_remote && (
                <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>· Remote OK</span>
              )}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--hsn-dark)', marginBottom: '0.4rem' }}>{opp.title}</h3>
            <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {opp.description}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', marginTop: '0.75rem' }}>
              Posted by {opp.provider?.full_name} · {new Date(opp.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className="badge-verified">✓ Verified</span>
        </div>
      </div>
    </Link>
  )
}
