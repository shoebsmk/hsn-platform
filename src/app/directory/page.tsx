import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BUSINESS_CATEGORIES, LOCATIONS } from '@/lib/constants'
import {
  Search, Plus, MapPin, CheckCircle, SlidersHorizontal,
  Utensils, ShoppingCart, ChefHat, Briefcase, Landmark,
  BookOpen, Heart, Package,
} from 'lucide-react'
import type { Business } from '@/types'

const categoryIcons: Record<string, React.ElementType> = {
  restaurant: Utensils,
  grocery:    ShoppingCart,
  catering:   ChefHat,
  services:   Briefcase,
  finance:    Landmark,
  education:  BookOpen,
  health:     Heart,
  other:      Package,
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  restaurant: { color: '#DC2626', bg: '#FEF2F2' },
  grocery:    { color: '#16A34A', bg: '#F0FDF4' },
  catering:   { color: '#D97706', bg: '#FFFBEB' },
  services:   { color: '#1D4ED8', bg: '#EFF6FF' },
  finance:    { color: '#1B6B3A', bg: '#E8F5EE' },
  education:  { color: '#7C3AED', bg: '#F5F3FF' },
  health:     { color: '#0D9488', bg: '#F0FDFA' },
  other:      { color: '#64748B', bg: '#F1F5F9' },
}

interface PageProps {
  searchParams: Promise<{ category?: string; location?: string; q?: string }>
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('businesses')
    .select('*, submitter:profiles(full_name)')
    .eq('status', 'active')
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })

  if (params.category) query = query.eq('category', params.category)
  if (params.location) query = query.eq('location', params.location)
  if (params.q) query = query.ilike('name', `%${params.q}%`)

  const { data: businesses } = await query

  const activeCategory = params.category ?? ''
  const activeLocation = params.location ?? ''

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 className="section-title">Halal Business Directory</h1>
          <p className="section-subtitle">Verified halal businesses in your community</p>
        </div>
        <Link href="/directory/new" className="btn-primary">
          <Plus size={16} />
          Submit Business
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
          placeholder="Search businesses…"
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
        {params.location && <input type="hidden" name="location" value={params.location} />}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside>
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
              <FilterLink href="/directory" label="All Categories" active={!activeCategory} />
              {BUSINESS_CATEGORIES.map(cat => {
                const Icon = categoryIcons[cat.value] ?? Package
                return (
                  <FilterLink
                    key={cat.value}
                    href={`/directory?category=${cat.value}${activeLocation ? `&location=${activeLocation}` : ''}`}
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
              <FilterLink href={`/directory${activeCategory ? `?category=${activeCategory}` : ''}`} label="All Locations" active={!activeLocation} icon={MapPin} />
              {LOCATIONS.map(loc => (
                <FilterLink
                  key={loc.value}
                  href={`/directory?location=${loc.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
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
          {!businesses || businesses.length === 0 ? (
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
                No businesses found
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', marginBottom: '1.5rem' }}>
                Be the first to submit one!
              </p>
              <Link href="/directory/new" className="btn-primary">
                <Plus size={15} />
                Submit Business
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {businesses.map((biz: Business) => (
                <BusinessCard key={biz.id} biz={biz} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterLink({ href, label, active, icon: Icon }: {
  href: string; label: string; active: boolean; icon?: React.ElementType
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.45rem 0.65rem', borderRadius: '0.4rem',
        fontSize: '0.85rem', textDecoration: 'none',
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

function BusinessCard({ biz }: { biz: Business }) {
  const cat = BUSINESS_CATEGORIES.find(c => c.value === biz.category)
  const loc = LOCATIONS.find(l => l.value === biz.location)
  const Icon = categoryIcons[biz.category] ?? Package
  const colors = categoryColors[biz.category] ?? { color: '#64748B', bg: '#F1F5F9' }

  return (
    <Link href={`/directory/${biz.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: colors.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={20} color={colors.color} strokeWidth={1.75} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--hsn-dark)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {biz.name}
              </h3>
              {biz.is_verified && (
                <CheckCircle size={14} color="var(--hsn-green)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                background: colors.bg, color: colors.color,
                padding: '0.15rem 0.55rem', borderRadius: '9999px',
              }}>
                {cat?.label}
              </span>
              {loc && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', color: 'var(--hsn-gray)' }}>
                  <MapPin size={10} />
                  {loc.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{
          color: 'var(--hsn-gray)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {biz.description}
        </p>

        {/* Footer */}
        {(biz.address || biz.phone) && (
          <div style={{ fontSize: '0.78rem', color: 'var(--hsn-gray-light)', marginTop: 'auto' }}>
            {biz.address && <p style={{ margin: 0 }}>{biz.address}</p>}
            {biz.phone && <p style={{ margin: 0 }}>{biz.phone}</p>}
          </div>
        )}
      </div>
    </Link>
  )
}
