import { createClient } from '@/lib/supabase/server'
import { saveAnnouncement, deleteAnnouncement } from '../actions'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Announcements</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage site-wide announcements shown to users</p>

      {/* New announcement form */}
      <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--hsn-border)', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--hsn-dark)' }}>New Announcement</h2>
        <form action={saveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            name="message"
            required
            placeholder="Write your announcement…"
            rows={3}
            style={{ width: '100%', border: '1.5px solid var(--hsn-border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select name="location_target" style={{ border: '1.5px solid var(--hsn-border)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', background: 'white' }}>
              <option value="all">All locations</option>
              <option value="hyderabad">Hyderabad only</option>
              <option value="chicago">Chicago only</option>
            </select>
            <input type="hidden" name="active" value="true" />
            <button type="submit" style={{ background: 'var(--hsn-green)', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.55rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
              Post Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Existing announcements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements?.map((a: any) => (
          <div key={a.id} style={{
            background: 'white', borderRadius: '0.75rem', padding: '1.25rem',
            border: `1px solid ${a.active ? 'var(--hsn-green)' : 'var(--hsn-border)'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', background: a.active ? '#D1FAE5' : '#F3F4F6', color: a.active ? '#065F46' : '#6B7280', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                  {a.active ? 'Active' : 'Inactive'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>📍 {a.location_target}</span>
              </div>
              <p style={{ color: 'var(--hsn-dark)', fontSize: '0.9rem' }}>{a.message}</p>
              <p style={{ color: 'var(--hsn-gray)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <form action={async () => { 'use server'; await saveAnnouncement(Object.assign(new FormData(), { id: a.id, message: a.message, active: String(!a.active), location_target: a.location_target })) }}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="message" value={a.message} />
                <input type="hidden" name="active" value={String(!a.active)} />
                <input type="hidden" name="location_target" value={a.location_target} />
                <button type="submit" style={{ background: '#F3F4F6', color: 'var(--hsn-gray)', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  {a.active ? 'Deactivate' : 'Activate'}
                </button>
              </form>
              <form action={async () => { 'use server'; await deleteAnnouncement(a.id) }}>
                <button type="submit" style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!announcements || announcements.length === 0) && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', color: 'var(--hsn-gray)', border: '1px solid var(--hsn-border)' }}>
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  )
}
