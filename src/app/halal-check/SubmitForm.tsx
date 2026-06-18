'use client'

import { useState } from 'react'
import { submitHalalCheck } from './actions'
import { Link2, FileText, Loader2, ShieldCheck } from 'lucide-react'

export default function SubmitForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    const result = await submitHalalCheck(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
          padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem',
        }}>
          {error}
        </div>
      )}
      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--hsn-dark)', marginBottom: '0.4rem' }}>
            <Link2 size={14} color="var(--hsn-gray)" />
            Job / Listing URL
            <span style={{ fontWeight: 400, color: 'var(--hsn-gray)', marginLeft: '0.25rem' }}>(optional)</span>
          </label>
          <input
            name="url"
            type="url"
            placeholder="https://example.com/job-posting"
            className="form-input"
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--hsn-dark)', marginBottom: '0.4rem' }}>
            <FileText size={14} color="var(--hsn-gray)" />
            Job Title or Description <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Paste the job title, description, company name, or your specific concern about the role…"
            className="form-input"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{
          background: 'var(--hsn-green-muted)', border: '1px solid #B7DEC7',
          borderRadius: '0.5rem', padding: '0.75rem 1rem',
          fontSize: '0.8rem', color: 'var(--hsn-green)',
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        }}>
          <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
          Your submission will be reviewed by HSN scholars. You'll be able to see the ruling once published.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.75rem',
            fontSize: '0.95rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
            : 'Submit for Scholar Review'
          }
        </button>
      </form>
    </div>
  )
}
