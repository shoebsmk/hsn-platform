import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'
import {
  Search,
  Plus,
  Star,
  LogOut,
  MapPin,
  User,
  Mail,
  ChevronRight,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const roleLabel = {
    seeker: 'Opportunity Seeker',
    provider: 'Opportunity Provider',
    mentor: 'Mentor',
  }[profile?.role ?? 'seeker']

  const locationLabel = {
    hyderabad: 'Hyderabad, India',
    chicago: 'Greater Chicago, USA',
    remote: 'Remote',
  }[profile?.location ?? 'remote']

  const initials = (profile?.full_name ?? user.email ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  const quickActions = [
    {
      icon: Search,
      title: 'Browse Opportunities',
      desc: 'Find verified halal opportunities',
      href: '/opportunities',
      color: '#1B6B3A',
      bg: '#E8F5EE',
    },
    {
      icon: Plus,
      title: 'Post an Opportunity',
      desc: 'Share a job or business opportunity',
      href: '/opportunities/new',
      color: '#1D4ED8',
      bg: '#EFF6FF',
    },
    {
      icon: Star,
      title: 'Find a Mentor',
      desc: 'Connect with experienced professionals',
      href: '/mentorship',
      color: '#C9A84C',
      bg: '#FEFCE8',
    },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Welcome header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--hsn-green) 0%, var(--hsn-green-light) 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.3rem',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(27,107,58,0.3)',
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
            As-salamu alaykum, {firstName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--hsn-green)', background: 'var(--hsn-green-muted)',
              padding: '0.2rem 0.65rem', borderRadius: '9999px',
            }}>
              <User size={12} />
              {roleLabel}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.82rem', color: 'var(--hsn-gray)',
            }}>
              <MapPin size={12} />
              {locationLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {quickActions.map(action => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={action.color} strokeWidth={1.75} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--hsn-gray)', lineHeight: 1.5 }}>
                    {action.desc}
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.8rem', fontWeight: 600, color: action.color, marginTop: 'auto',
                }}>
                  Go <ChevronRight size={13} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Account info */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--hsn-dark)' }}>
          Account Details
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Mail size={16} color="var(--hsn-gray)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)', fontWeight: 500 }}>Email</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--hsn-dark)', fontWeight: 500 }}>{user.email}</div>
            </div>
          </div>
          <div style={{ height: '1px', background: 'var(--hsn-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={16} color="var(--hsn-gray)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)', fontWeight: 500 }}>Role</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--hsn-dark)', fontWeight: 500 }}>{roleLabel}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--hsn-border)' }}>
          <form action={logout}>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: '1.5px solid var(--hsn-border)',
                color: 'var(--hsn-gray)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
