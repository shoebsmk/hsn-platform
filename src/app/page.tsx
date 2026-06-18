import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    title: 'Jobs',
    desc: 'Halal-reviewed listings from employers who share your values.',
    href: '/jobs',
  },
  {
    title: 'Business Directory',
    desc: 'Find and list halal-certified businesses in your city.',
    href: '/business',
  },
  {
    title: 'Guidance',
    desc: 'Islamic finance, career advice, and community wisdom from trusted voices.',
    href: '/guidance',
  },
  {
    title: 'Mentorship',
    desc: 'One-on-one connections with Muslim professionals in your field.',
    href: '/mentorship',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userLocation: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('location')
      .eq('id', user.id)
      .single()
    userLocation = profile?.location ?? null
  }

  let announcementsQuery = supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (userLocation) {
    announcementsQuery = announcementsQuery.in('location_target', ['all', userLocation])
  } else {
    announcementsQuery = announcementsQuery.eq('location_target', 'all')
  }

  const { data: announcements } = await announcementsQuery

  return (
    <>
      <AnnouncementBanner announcements={announcements ?? []} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(150deg, #0A2E18 0%, var(--hsn-green) 100%)',
        color: 'white',
        padding: 'clamp(5rem, 10vh, 8rem) 1.5rem',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

          <p style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'var(--hsn-gold-light)', letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: '1.75rem', opacity: 0.85,
          }}>
            Hyderabad · Greater Chicago
          </p>

          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            maxWidth: '680px',
            marginBottom: '1.75rem',
          }}>
            Halal work.<br />
            Trusted businesses.<br />
            <span style={{ color: 'var(--hsn-gold-light)' }}>Real community.</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', opacity: 0.72,
            maxWidth: '420px', lineHeight: 1.75,
            marginBottom: '2.75rem',
          }}>
            A platform for Muslim professionals — jobs, businesses, guidance, and mentorship in one place.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/jobs" className="btn-primary" style={{
              background: 'white', color: 'var(--hsn-green)',
              fontSize: '1rem', padding: '0.875rem 2rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            }}>
              Browse Jobs <ArrowRight size={16} />
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Join HSN
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* ── Platform ──────────────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <p style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'var(--hsn-gray-light)', letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: '3rem',
          }}>
            The Platform
          </p>

          {features.map(f => (
            <Link key={f.href} href={f.href} className="editorial-row">
              <div>
                <div className="editorial-row-name">{f.title}</div>
                <div className="editorial-row-desc">{f.desc}</div>
              </div>
              <div className="editorial-row-arrow">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--hsn-dark)',
        color: 'white',
        padding: '6rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'var(--hsn-gold-light)', letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.8,
          }}>
            Free to join
          </p>

          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: '-0.04em', marginBottom: '1rem',
          }}>
            Join the community.
          </h2>

          <p style={{
            color: 'var(--hsn-gray-light)', fontSize: '1.05rem',
            lineHeight: 1.7, marginBottom: '2.5rem',
          }}>
            Built for the Ummah. Rooted in Islamic values.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Create Account <ArrowRight size={16} />
              </Link>
            )}
            <Link href="/jobs" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
