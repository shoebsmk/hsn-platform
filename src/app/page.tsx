import Link from 'next/link'

const categories = [
  { icon: '💼', label: 'Hidden Jobs', desc: 'Opportunities shared through community, mosques & referrals', href: '/opportunities?category=hidden_jobs' },
  { icon: '🤝', label: 'Community', desc: 'Local needs — tutors, caregivers, event support', href: '/opportunities?category=community' },
  { icon: '⚡', label: 'Gig & Services', desc: 'Freelance, design, dev, translation & more', href: '/opportunities?category=gig_services' },
  { icon: '📈', label: 'Business', desc: 'Partnerships, franchises & investment networking', href: '/opportunities?category=business' },
  { icon: '💰', label: 'Income Generation', desc: 'E-commerce, consulting, digital products', href: '/opportunities?category=income' },
  { icon: '🎓', label: 'Career Guidance', desc: 'Certifications, resume help & roadmaps', href: '/opportunities?category=career_guidance' },
  { icon: '🌟', label: 'Mentorship', desc: 'Connect with experienced professionals', href: '/mentorship' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--hsn-green) 0%, #2E8B57 100%)', color: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--hsn-gold-light)' }}>
            🌙 Serving Hyderabad & Greater Chicago
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Halal Opportunities for<br />the Muslim Community
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Discover jobs, business opportunities, mentorship, and community connections — all verified and rooted in Islamic values.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/opportunities" style={{ background: 'white', color: 'var(--hsn-green)', padding: '0.75rem 1.75rem', borderRadius: '0.5rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
              Browse Opportunities
            </Link>
            <Link href="/auth/signup" style={{ border: '2px solid white', color: 'white', padding: '0.75rem 1.75rem', borderRadius: '0.5rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
              Join the Network
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: 'var(--hsn-green-muted)', padding: '1rem 1.5rem', borderBottom: '1px solid #D1E8DA' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--hsn-green)', fontWeight: 600 }}>
          <span>✓ All opportunities verified</span>
          <span>✓ Community-powered network</span>
          <span>✓ Rooted in Islamic values</span>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Explore Opportunities</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          Seven categories of halal opportunities, all in one place
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {categories.map(cat => (
            <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--hsn-dark)', marginBottom: '0.4rem' }}>{cat.label}</h3>
                <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--hsn-dark)', color: 'white', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Have an opportunity to share?</h2>
        <p style={{ color: '#9CA3AF', marginBottom: '1.75rem', fontSize: '1rem' }}>
          Post a job, business opportunity, or community need — help a fellow Muslim thrive.
        </p>
        <Link href="/opportunities/new" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
          Post an Opportunity
        </Link>
      </section>
    </>
  )
}
