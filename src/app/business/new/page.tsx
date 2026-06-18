import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BUSINESS_CATEGORIES, LOCATIONS } from '@/lib/constants'
import { submitBusiness } from './actions'

export default async function NewBusinessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link href="/business" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--hsn-gray)', fontSize: '0.875rem', textDecoration: 'none',
        marginBottom: '1.75rem',
      }}>
        <ArrowLeft size={15} />
        Back to Business
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Submit a Business</h1>
        <p className="section-subtitle">Add a halal business to the community directory</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form action={submitBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <label className="form-label">Business Name *</label>
            <input name="name" required placeholder="e.g. Al-Noor Restaurant" className="form-input" />
          </div>

          <div>
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your business, what you offer, and what makes it halal…"
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Category *</label>
              <select name="category" required className="form-input">
                <option value="">Select category…</option>
                {BUSINESS_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Location *</label>
              <select name="location" required className="form-input">
                <option value="">Select location…</option>
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Address</label>
            <input name="address" placeholder="Street address, city" className="form-input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className="form-input" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input name="website" type="url" placeholder="https://example.com" className="form-input" />
            </div>
          </div>

          <div style={{ paddingTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Submit Business
            </button>
            <Link href="/business" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
