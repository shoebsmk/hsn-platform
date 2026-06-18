import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import {
  Briefcase,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Plus,
  BookOpen,
  Store,
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Jobs',
    desc: 'Halal job opportunities from community members and verified employers.',
    href: '/jobs',
  },
  {
    icon: Store,
    title: 'Business Directory',
    desc: 'Discover and list halal-certified businesses in your city.',
    href: '/business',
  },
  {
    icon: BookOpen,
    title: 'Guidance',
    desc: 'Islamic finance, career advice, and community wisdom from trusted voices.',
    href: '/guidance',
  },
  {
    icon: Users,
    title: 'Mentorship',
    desc: 'Connect with experienced Muslim professionals who share your values.',
    href: '/mentorship',
  },
]

const pillars = [
  {
    icon: CheckCircle,
    title: 'Halal-Verified',
    desc: 'Every opportunity reviewed by our community team.',
  },
  {
    icon: Users,
    title: 'Community-Powered',
    desc: 'Built by and for the Muslim community.',
  },
  {
    icon: Star,
    title: 'Islamic Values',
    desc: 'Rooted in the principles of our deen.',
  },
]

const steps = [
  { n: '1', title: 'Create your free account', desc: 'Join the Ummah\'s trusted network in minutes — no fees, no barriers.' },
  { n: '2', title: 'Explore opportunities',    desc: 'Browse halal jobs, businesses, guidance, and mentors in one place.' },
  { n: '3', title: 'Connect & grow',           desc: 'Build your career and community with people who share your values.' },
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
        background: 'linear-gradient(135deg, #0D3D22 0%, var(--hsn-green) 55%, #2E8B57 100%)',
        color: 'white',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(4rem, 8vh, 6rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-140px', left: '-80px',  width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.18)', borderRadius: '9999px',
            padding: '0.4rem 1.1rem', fontSize: '0.78rem', fontWeight: 600,
            marginBottom: '2rem', color: 'var(--hsn-gold-light)', letterSpacing: '0.04em',
          }}>
            ✦&nbsp; Hyderabad &amp; Greater Chicago
          </div>

          <h1 style={{
            fontSize: 'clamp(2.75rem, 6.5vw, 4.25rem)',
            fontWeight: 900, lineHeight: 1.05,
            marginBottom: '1.5rem', letterSpacing: '-0.035em',
          }}>
            Halal Opportunities for<br />
            <span style={{ color: 'var(--hsn-gold-light)' }}>the Muslim Community</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', opacity: 0.8,
            maxWidth: '500px', margin: '0 auto 2.5rem',
            lineHeight: 1.8, fontWeight: 400,
          }}>
            Connecting the Ummah with trusted halal jobs, businesses, guidance, and community.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/jobs" className="btn-primary" style={{
              background: 'white', color: 'var(--hsn-green)',
              fontSize: '1rem', padding: '0.875rem 2rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            }}>
              Browse Jobs <ArrowRight size={16} />
            </Link>
            {user ? (
              <Link href="/jobs/new" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                <Plus size={16} /> Post a Job
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Join HSN
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--hsn-border)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 'clamp(1.35rem, 2.5vw, 1.875rem)',
            fontWeight: 800, color: 'var(--hsn-dark)',
            lineHeight: 1.4, letterSpacing: '-0.025em',
            maxWidth: '680px', margin: '0 auto',
          }}>
            "We exist to make halal success accessible to every Muslim — through community, trust, and shared values."
          </p>

          {/* Gold rule */}
          <div style={{ width: '48px', height: '3px', background: 'var(--hsn-gold)', borderRadius: '9999px', margin: '1.75rem auto 3.5rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {pillars.map(p => (
              <div key={p.title} className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--hsn-green-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon size={24} color="var(--hsn-green)" strokeWidth={1.75} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--hsn-dark)', margin: 0 }}>{p.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Features ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--hsn-bg)', padding: '5.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title">Everything in one place</h2>
            <p className="section-subtitle">Jobs, businesses, guidance, and mentorship — all halal, all community-verified.</p>
          </div>

          <div className="feature-grid">
            {features.map(f => (
              <Link key={f.href} href={f.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', cursor: 'pointer' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--hsn-green-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={22} color="var(--hsn-green)" strokeWidth={1.75} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--hsn-dark)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                      {f.title}
                    </h3>
                    <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {f.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', fontWeight: 700, color: 'var(--hsn-green)', marginTop: 'auto' }}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────── */}
      <section style={{ background: 'white', borderTop: '1px solid var(--hsn-border)', padding: '5.5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', position: 'relative' }}>
            {/* Dashed connector — desktop only */}
            <div className="hidden-mobile" style={{
              position: 'absolute', top: '23px',
              left: 'calc(16.66% + 24px)', right: 'calc(16.66% + 24px)',
              height: '1px',
              background: 'repeating-linear-gradient(90deg, var(--hsn-green) 0, var(--hsn-green) 5px, transparent 5px, transparent 12px)',
              opacity: 0.3, pointerEvents: 'none',
            }} />

            {steps.map(s => (
              <div key={s.n} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--hsn-green)', color: 'white',
                  fontWeight: 800, fontSize: '1.1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 4px 12px rgba(27,107,58,0.3)',
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--hsn-dark)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--hsn-gray)', lineHeight: 1.65, maxWidth: '240px', margin: '0 auto' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0D3D22 0%, var(--hsn-dark) 60%, #1E293B 100%)',
        color: 'white', padding: '6rem 1.5rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px',  right: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(27,107,58,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-40px',  width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '9999px', padding: '0.35rem 1rem',
            fontSize: '0.75rem', fontWeight: 600, color: 'var(--hsn-gold-light)',
            marginBottom: '1.5rem', letterSpacing: '0.04em',
          }}>
            ✦&nbsp; Free to join
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: '1rem', letterSpacing: '-0.03em',
          }}>
            Join the HSN community
          </h2>

          <p style={{
            color: 'var(--hsn-gray-light)', fontSize: '1.05rem',
            lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 2.5rem',
          }}>
            Free to join. Rooted in Islamic values. Built for the Ummah.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link href="/jobs/new" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                <Plus size={16} /> Post a Job
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Join HSN <ArrowRight size={16} />
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
