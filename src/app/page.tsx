import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import {
  Briefcase,
  Users,
  Zap,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Plus,
} from 'lucide-react'

const categories = [
  {
    icon: Briefcase,
    label: 'Hidden Jobs',
    desc: 'Opportunities shared through community, mosques & referrals',
    href: '/jobs?category=hidden_jobs',
    color: '#1B6B3A',
    bg: '#E8F5EE',
  },
  {
    icon: Users,
    label: 'Community',
    desc: 'Local needs — tutors, caregivers, event support',
    href: '/jobs?category=community',
    color: '#1D4ED8',
    bg: '#EFF6FF',
  },
  {
    icon: Zap,
    label: 'Gig & Services',
    desc: 'Freelance, design, dev, translation & more',
    href: '/jobs?category=gig_services',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: TrendingUp,
    label: 'Business',
    desc: 'Partnerships, franchises & investment networking',
    href: '/jobs?category=business',
    color: '#B45309',
    bg: '#FEF9E7',
  },
  {
    icon: DollarSign,
    label: 'Income Generation',
    desc: 'E-commerce, consulting, digital products',
    href: '/jobs?category=income',
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    icon: GraduationCap,
    label: 'Career Guidance',
    desc: 'Certifications, resume help & roadmaps',
    href: '/jobs?category=career_guidance',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    icon: Star,
    label: 'Mentorship',
    desc: 'Connect with experienced professionals',
    href: '/mentorship',
    color: '#C9A84C',
    bg: '#FEFCE8',
  },
]

const trustItems = [
  { icon: CheckCircle, label: 'All opportunities verified' },
  { icon: Users, label: 'Community-powered network' },
  { icon: Star, label: 'Rooted in Islamic values' },
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

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0D3D22 0%, var(--hsn-green) 50%, #2E8B57 100%)',
        color: 'white',
        padding: '5.5rem 1.5rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-60px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '9999px',
            padding: '0.4rem 1.1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.75rem',
            color: 'var(--hsn-gold-light)',
          }}>
            <MapPin size={13} />
            Serving Hyderabad &amp; Greater Chicago
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
          }}>
            Halal Opportunities for<br />
            <span style={{ color: 'var(--hsn-gold-light)' }}>the Muslim Community</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            opacity: 0.85,
            maxWidth: '520px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.75,
          }}>
            Discover jobs, business opportunities, mentorship, and community connections — all verified and rooted in Islamic values.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/jobs" className="btn-primary" style={{
              background: 'white',
              color: 'var(--hsn-green)',
              fontSize: '0.95rem',
              padding: '0.8rem 1.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              Browse Jobs
              <ArrowRight size={16} />
            </Link>
            {user ? (
              <Link href="/jobs/new" className="btn-outline-white" style={{ fontSize: '0.95rem', padding: '0.8rem 1.75rem' }}>
                <Plus size={16} />
                Post an Opportunity
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-outline-white" style={{ fontSize: '0.95rem', padding: '0.8rem 1.75rem' }}>
                Join the Network
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{
        background: 'white',
        borderBottom: '1px solid var(--hsn-border)',
        padding: '1rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
        }}>
          {trustItems.map(item => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--hsn-green)',
              fontWeight: 600,
            }}>
              <item.icon size={15} strokeWidth={2.5} />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Explore Opportunities</h2>
          <p className="section-subtitle">Seven categories of halal opportunities, all in one place</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.25rem',
        }}>
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} color={cat.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--hsn-dark)', marginBottom: '0.3rem' }}>
                      {cat.label}
                    </h3>
                    <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {cat.desc}
                    </p>
                  </div>
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: cat.color,
                  }}>
                    Browse <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--hsn-dark) 0%, #1E293B 100%)',
        color: 'white',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(27,107,58,0.4)',
          marginBottom: '1.5rem',
        }}>
          <Plus size={28} color="var(--hsn-gold-light)" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>
          Have an opportunity to share?
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: '2rem', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Post a job, business opportunity, or community need — help a fellow Muslim thrive.
        </p>
        <Link href="/jobs/new" className="btn-primary" style={{ fontSize: '0.975rem', padding: '0.8rem 2rem' }}>
          Post an Opportunity
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  )
}
