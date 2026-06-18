import Link from 'next/link'

const upcomingFeatures = [
  { icon: '🔍', title: 'Browse Mentors', desc: 'Find experienced professionals by industry, skill, and location' },
  { icon: '📅', title: 'Request Sessions', desc: 'Book 1-on-1 sessions directly with mentors in your field' },
  { icon: '🎯', title: 'Topic Matching', desc: 'Get matched with mentors based on your career goals' },
  { icon: '🤝', title: 'Community Circles', desc: 'Join small peer groups for ongoing accountability and support' },
]

export default function MentorshipPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">Mentorship</h1>
        <p className="section-subtitle">Connect with experienced Muslim professionals in your field</p>
      </div>

      {/* Under progress banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--hsn-green-muted) 0%, var(--hsn-green-50) 100%)',
        border: '1.5px solid var(--hsn-green-50)',
        borderRadius: '1rem',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--hsn-green)', color: 'white',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', padding: '0.3rem 0.75rem',
          borderRadius: '9999px', marginBottom: '1rem',
        }}>
          In Progress
        </div>
        <h2 style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--hsn-dark)', marginBottom: '0.5rem' }}>
          Mentorship is being built
        </h2>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto' }}>
          We're working on a mentorship platform that connects community members with experienced professionals who share our values.
        </p>
      </div>

      {/* Upcoming features grid */}
      <h3 style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--hsn-gray-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
        What's coming
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {upcomingFeatures.map(f => (
          <div key={f.title} className="card" style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', padding: '1rem 1.1rem' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0, lineHeight: 1 }}>{f.icon}</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--hsn-dark)', marginBottom: '0.2rem' }}>{f.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link href="/jobs" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          Browse Jobs
        </Link>
        <Link href="/guidance" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          Read Guidance Articles
        </Link>
      </div>

    </div>
  )
}
