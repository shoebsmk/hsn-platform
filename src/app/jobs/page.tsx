import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import {
  Search,
  Plus,
  MapPin,
  CheckCircle,
  Briefcase,
  Users,
  Zap,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Star,
  SlidersHorizontal,
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  hidden_jobs: Briefcase,
  community: Users,
  gig_services: Zap,
  business: TrendingUp,
  income: DollarSign,
  career_guidance: GraduationCap,
  mentorship: Star,
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  hidden_jobs:    { color: '#1B6B3A', bg: '#E8F5EE' },
  community:      { color: '#1D4ED8', bg: '#EFF6FF' },
  gig_services:   { color: '#7C3AED', bg: '#F5F3FF' },
  business:       { color: '#B45309', bg: '#FEF9E7' },
  income:         { color: '#0D9488', bg: '#F0FDFA' },
  career_guidance:{ color: '#DC2626', bg: '#FEF2F2' },
  mentorship:     { color: '#C9A84C', bg: '#FEFCE8' },
}

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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 className="section-title">Jobs</h1>
          <p className="section-subtitle">Verified halal jobs from the community</p>
        </div>
        <Link href="/jobs/new" className="btn-primary">
          <Plus size={16} />
          Post Job
        </Link>
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: '1.75rem', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <Search size={16} color="var(--hsn-gray)" />
        </div>
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search opportunities…"
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
        {params.location && <input type="hidden" name="location" value={params.location} />}
      </form>

      {/* Mobile filter chips — hidden on desktop */}
      <div className="hidden-desktop" style={{ marginBottom: '1rem' }}>
        <p className="mobile-filter-label">Category</p>
        <div className="mobile-chip-row">
          <a href="/jobs" className={`mobile-chip${!activeCategory ? ' mobile-chip-active' : ''}`}>All</a>
          {CATEGORIES.map(cat => (
            <a
              key={cat.value}
              href={`/jobs?category=${cat.value}${activeLocation ? `&location=${activeLocation}` : ''}`}
              className={`mobile-chip${activeCategory === cat.value ? ' mobile-chip-active' : ''}`}
            >
              {cat.icon} {cat.label}
            </a>
          ))}
        </div>
        <p className="mobile-filter-label">Location</p>
        <div className="mobile-chip-row">
          <a href={`/jobs${activeCategory ? `?category=${activeCategory}` : ''}`} className={`mobile-chip${!activeLocation ? ' mobile-chip-active' : ''}`}>All</a>
          {LOCATIONS.map(loc => (
            <a
              key={loc.value}
              href={`/jobs?location=${loc.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
              className={`mobile-chip${activeLocation === loc.value ? ' mobile-chip-active' : ''}`}
            >
              📍 {loc.label}
            </a>
          ))}
        </div>
      </div>

      <div className="sidebar-grid">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden-mobile">
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontWeight: 700, fontSize: '0.78rem', color: 'var(--hsn-dark)',
              marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <SlidersHorizontal size={13} />
              Filters
            </div>

            <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--hsn-gray)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Category
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.5rem' }}>
              <FilterLink href="/jobs" label="All Categories" active={!activeCategory} />
              {CATEGORIES.map(cat => {
                const Icon = categoryIcons[cat.value] ?? Briefcase
                return (
                  <FilterLink
                    key={cat.value}
                    href={`/jobs?category=${cat.value}${activeLocation ? `&location=${activeLocation}` : ''}`}
                    label={cat.label}
                    active={activeCategory === cat.value}
                    icon={Icon}
                  />
                )
              })}
            </div>

            <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--hsn-gray)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Location
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <FilterLink href={`/jobs${activeCategory ? `?category=${activeCategory}` : ''}`} label="All Locations" active={!activeLocation} icon={MapPin} />
              {LOCATIONS.map(loc => (
                <FilterLink
                  key={loc.value}
                  href={`/jobs?location=${loc.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                  label={loc.label}
                  active={activeLocation === loc.value}
                  icon={MapPin}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Listings */}
        <div>
          {!opportunities || opportunities.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: 'var(--hsn-green-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <Search size={24} color="var(--hsn-green)" />
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--hsn-dark)' }}>
                No opportunities found
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', marginBottom: '1.5rem' }}>
                Be the first to post one!
              </p>
              <Link href="/jobs/new" className="btn-primary">
                <Plus size={15} />
                Post Job
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
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

function FilterLink({
  href, label, active, icon: Icon,
}: {
  href: string; label: string; active: boolean; icon?: React.ElementType
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.45rem 0.65rem',
        borderRadius: '0.4rem',
        fontSize: '0.85rem',
        textDecoration: 'none',
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--hsn-green-muted)' : 'transparent',
        color: active ? 'var(--hsn-green)' : 'var(--hsn-gray)',
        transition: 'all 0.15s',
      }}
    >
      {Icon && <Icon size={13} strokeWidth={active ? 2.5 : 2} />}
      {label}
    </Link>
  )
}

function OpportunityCard({ opp }: { opp: any }) {
  const cat = CATEGORIES.find(c => c.value === opp.category)
  const loc = LOCATIONS.find(l => l.value === opp.location)
  const Icon = categoryIcons[opp.category] ?? Briefcase
  const colors = categoryColors[opp.category] ?? { color: '#1B6B3A', bg: '#E8F5EE' }
  const dateStr = new Date(opp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link href={`/jobs/${opp.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: colors.bg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, marginTop: '2px',
        }}>
          <Icon size={20} color={colors.color} strokeWidth={1.75} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600,
              background: colors.bg, color: colors.color,
              padding: '0.2rem 0.6rem', borderRadius: '9999px',
            }}>
              {cat?.label}
            </span>
            {loc && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                fontSize: '0.72rem', color: 'var(--hsn-gray)',
              }}>
                <MapPin size={11} />
                {loc.label}
              </span>
            )}
            {opp.is_remote && (
              <span style={{ fontSize: '0.72rem', color: 'var(--hsn-gray)' }}>· Remote OK</span>
            )}
          </div>

          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--hsn-dark)', marginBottom: '0.35rem' }}>
            {opp.title}
          </h3>
          <p style={{
            color: 'var(--hsn-gray)', fontSize: '0.875rem', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {opp.description}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--hsn-gray-light)', marginTop: '0.65rem' }}>
            Posted by {opp.provider?.full_name} · {dateStr}
          </p>
        </div>

        {/* Verified badge */}
        <div style={{ flexShrink: 0 }}>
          <span className="badge-verified">
            <CheckCircle size={11} strokeWidth={2.5} />
            Verified
          </span>
        </div>
      </div>
    </Link>
  )
}
