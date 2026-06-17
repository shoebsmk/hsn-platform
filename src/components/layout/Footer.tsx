import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--hsn-dark)', color: '#9CA3AF', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ background: 'var(--hsn-green)', color: 'white', fontWeight: 700, fontSize: '0.9rem', padding: '0.25rem 0.5rem', borderRadius: '5px' }}>HSN</span>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Halal Success Network</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              Connecting the Ummah with trusted halal opportunities.
            </p>
          </div>

          {/* Opportunities */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Opportunities</h4>
            {['Jobs', 'Business', 'Gig & Services', 'Income', 'Community'].map(item => (
              <div key={item} style={{ marginBottom: '0.4rem' }}>
                <Link href="/opportunities" style={{ color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none' }}>{item}</Link>
              </div>
            ))}
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Platform</h4>
            {[['Mentorship', '/mentorship'], ['Post an Opportunity', '/opportunities/new'], ['About HSN', '/about']].map(([label, href]) => (
              <div key={href} style={{ marginBottom: '0.4rem' }}>
                <Link href={href} style={{ color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Locations */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Serving</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>📍 Hyderabad, India</p>
            <p style={{ fontSize: '0.85rem' }}>📍 Greater Chicago, USA</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} Halal Success Network. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--hsn-gold)' }}>Building Stronger Muslim Careers and Businesses</p>
        </div>
      </div>
    </footer>
  )
}
