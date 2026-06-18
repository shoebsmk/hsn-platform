'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateProfile } from '@/app/dashboard/actions'
import { LOCATIONS } from '@/lib/constants'
import type { Profile } from '@/types'

const roles = [
  { value: 'seeker', label: 'Opportunity Seeker', desc: 'Looking for jobs, income, or business opportunities' },
  { value: 'provider', label: 'Opportunity Provider', desc: 'Sharing jobs, gigs, or business opportunities' },
  { value: 'mentor', label: 'Mentor', desc: 'Guiding others through career or business advice' },
]

export default function ProfileEditForm({ profile, email }: { profile: Profile; email: string }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(profile.role)

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    formData.set('role', selectedRole)
    const result = await updateProfile(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.875rem', color: 'var(--hsn-green)', fontWeight: 600,
          textDecoration: 'none', marginBottom: '1.5rem',
        }}>
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)' }}>Edit Profile</h1>
          <p style={{ color: 'var(--hsn-gray)', marginTop: '0.4rem', fontSize: '0.9rem' }}>Update your profile information</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form action={handleSubmit}>
            {/* Email (read-only) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                disabled
                style={{ ...inputStyle, background: '#F1F5F9', color: 'var(--hsn-gray)', cursor: 'not-allowed' }}
              />
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input name="full_name" type="text" required defaultValue={profile.full_name} style={inputStyle} />
            </div>

            {/* Role */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>I am joining as…</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                {roles.map(role => (
                  <div
                    key={role.value}
                    onClick={() => setSelectedRole(role.value as Profile['role'])}
                    style={{
                      border: `2px solid ${selectedRole === role.value ? 'var(--hsn-green)' : 'var(--hsn-border)'}`,
                      background: selectedRole === role.value ? 'var(--hsn-green-muted)' : 'white',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedRole === role.value ? 'var(--hsn-green)' : 'var(--hsn-dark)' }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--hsn-gray)', marginTop: '0.2rem' }}>{role.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Location</label>
              <select name="location" required defaultValue={profile.location} style={{ ...inputStyle, appearance: 'auto' }}>
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                rows={4}
                defaultValue={profile.bio ?? ''}
                placeholder="Tell the community about yourself..."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#9CA3AF' : 'var(--hsn-green)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: '0.4rem',
  color: 'var(--hsn-dark)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid var(--hsn-border)',
  borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  color: 'var(--hsn-dark)',
  background: 'white',
}
