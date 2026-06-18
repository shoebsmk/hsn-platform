import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BUSINESS_CATEGORIES, LOCATIONS } from '@/lib/constants'
import {
  ArrowLeft, CheckCircle, MapPin, Phone, Globe,
  Utensils, ShoppingCart, ChefHat, Briefcase, Landmark,
  BookOpen, Heart, Package,
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  restaurant: Utensils, grocery: ShoppingCart, catering: ChefHat,
  services: Briefcase, finance: Landmark, education: BookOpen,
  health: Heart, other: Package,
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

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: biz } = await supabase
    .from('businesses')
    .select('*, submitter:profiles(full_name)')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!biz) notFound()

  const cat = BUSINESS_CATEGORIES.find(c => c.value === biz.category)
  const loc = LOCATIONS.find(l => l.value === biz.location)
  const Icon = categoryIcons[biz.category] ?? Package
  const colors = categoryColors[biz.category] ?? { color: '#64748B', bg: '#F1F5F9' }
  const dateStr = new Date(biz.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link href="/directory" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--hsn-gray)', fontSize: '0.875rem', textDecoration: 'none',
        marginBottom: '1.75rem',
      }}>
        <ArrowLeft size={15} />
        Back to Directory
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '14px',
            background: colors.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={28} color={colors.color} strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', margin: 0 }}>
                {biz.name}
              </h1>
              {biz.is_verified && (
                <span className="badge-verified">
                  <CheckCircle size={11} strokeWidth={2.5} />
                  Verified
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600,
                background: colors.bg, color: colors.color,
                padding: '0.25rem 0.7rem', borderRadius: '9999px',
              }}>
                {cat?.label}
              </span>
              {loc && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--hsn-gray)' }}>
                  <MapPin size={13} />
                  {loc.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '2rem' }}>
          {biz.description}
        </p>

        {/* Contact info */}
        {(biz.address || biz.phone || biz.website) && (
          <div style={{
            borderTop: '1px solid var(--hsn-border)', paddingTop: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--hsn-gray)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              Contact
            </h3>
            {biz.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--hsn-dark)' }}>
                <MapPin size={15} color="var(--hsn-gray)" style={{ marginTop: '2px', flexShrink: 0 }} />
                {biz.address}
              </div>
            )}
            {biz.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--hsn-dark)' }}>
                <Phone size={15} color="var(--hsn-gray)" />
                <a href={`tel:${biz.phone}`} style={{ color: 'var(--hsn-green)', textDecoration: 'none' }}>{biz.phone}</a>
              </div>
            )}
            {biz.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--hsn-dark)' }}>
                <Globe size={15} color="var(--hsn-gray)" />
                <a href={biz.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hsn-green)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {biz.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: '0.78rem', color: 'var(--hsn-gray-light)', marginTop: '2rem', borderTop: '1px solid var(--hsn-border)', paddingTop: '1rem' }}>
          Submitted {dateStr}{biz.submitter?.full_name ? ` by ${biz.submitter.full_name}` : ''}
        </p>
      </div>
    </div>
  )
}
