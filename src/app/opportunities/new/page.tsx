'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { submitOpportunity } from './actions'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

function NewOpportunityForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    const result = await submitOpportunity(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.75rem' }}>
          Opportunity Submitted!
        </h1>
        <p style={{ color: 'var(--hsn-gray)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
          Your opportunity is under review. Once verified by the HSN team, it will be visible to the community.
          JazakAllahu Khayran for contributing!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/opportunities" className="btn-primary">Browse Opportunities</Link>
          <Link href="/opportunities/new" className="btn-secondary">Post Another</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link href="/opportunities" style={{ color: 'var(--hsn-green)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
        ← Back
      </Link>

      <h1 className="section-title" style={{ marginBottom: '0.4rem' }}>Post an Opportunity</h1>
      <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
        All submissions are reviewed before going live. Please be accurate and honest.
      </p>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form action={handleSubmit}>
          <Field label="Title" required>
            <input name="title" type="text" required placeholder="e.g. Part-time bookkeeper needed at Islamic school" style={inputStyle} />
          </Field>

          <Field label="Category" required>
            <select name="category" required style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Location" required>
            <select name="location" required style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="">Select location</option>
              {LOCATIONS.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </Field>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--hsn-dark)', cursor: 'pointer' }}>
              <input name="is_remote" type="checkbox" />
              <span>Remote / online work is possible</span>
            </label>
          </div>

          <Field label="Description" required>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe the opportunity in detail — role, requirements, compensation, how to apply, etc."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <Field label="Contact Info" hint="Email, phone, or WhatsApp">
            <input name="contact_info" type="text" placeholder="contact@example.com" style={inputStyle} />
          </Field>

          <Field label="External Link" hint="Job posting, website, or form URL">
            <input name="external_url" type="url" placeholder="https://..." style={inputStyle} />
          </Field>

          <div style={{ background: 'var(--hsn-green-muted)', border: '1px solid #B7DEC7', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--hsn-green)', marginBottom: '1.5rem' }}>
            ✓ By submitting, you confirm this is a genuine halal opportunity and agree to HSN&apos;s community guidelines.
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
            {loading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.3rem', color: 'var(--hsn-dark)' }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
        {hint && <span style={{ fontWeight: 400, color: 'var(--hsn-gray)', marginLeft: '0.4rem' }}>({hint})</span>}
      </label>
      {children}
    </div>
  )
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
  fontFamily: 'inherit',
}

export default function NewOpportunityPage() {
  return (
    <Suspense>
      <NewOpportunityForm />
    </Suspense>
  )
}
