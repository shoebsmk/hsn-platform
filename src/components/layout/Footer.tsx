import Link from 'next/link'
import { MapPin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--hsn-dark)', color: '#94A3B8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.875rem',
                padding: '0.3rem 0.6rem',
                borderRadius: '7px',
                letterSpacing: '0.08em',
              }}>HSN</div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                Halal Success Network
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Connecting the Ummah with trusted halal opportunities for income, employment, and community growth.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                <MapPin size={13} color="var(--hsn-gold)" /> Hyderabad, India
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                <MapPin size={13} color="var(--hsn-gold)" /> Greater Chicago, USA
              </div>
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h4 style={{
              color: 'white', fontWeight: 700, marginBottom: '1rem',
              fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase',
            }}>
              Opportunities
            </h4>
            {[
              ['Hidden Jobs', '/jobs?category=hidden_jobs'],
              ['Business', '/jobs?category=business'],
              ['Gig & Services', '/jobs?category=gig_services'],
              ['Income Generation', '/jobs?category=income'],
              ['Community', '/jobs?category=community'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <h4 style={{
              color: 'white', fontWeight: 700, marginBottom: '1rem',
              fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase',
            }}>
              Platform
            </h4>
            {[
              ['Mentorship', '/mentorship'],
              ['Career Guidance', '/guidance'],
              ['Post an Opportunity', '/jobs/new'],
              ['About HSN', '/about'],
              ['Join the Network', '/auth/signup'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Halal Success Network. All rights reserved.
          </p>
          <p style={{
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--hsn-gold)',
          }}>
            <Heart size={13} fill="currentColor" />
            Building Stronger Muslim Careers &amp; Businesses
          </p>
        </div>
      </div>
    </footer>
  )
}
