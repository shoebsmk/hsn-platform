import { createClient } from '@/lib/supabase/server'
import { saveAnnouncement, deleteAnnouncement } from '../actions'
import { Megaphone, MapPin, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
          Announcements
        </h1>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage site-wide announcements shown to users
        </p>
      </div>

      {/* New announcement form */}
      <div style={{
        background: 'white', borderRadius: '0.875rem', padding: '1.5rem',
        border: '1px solid var(--hsn-border)', marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--hsn-dark)' }}>
          New Announcement
        </h2>
        <form action={saveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            name="message"
            required
            placeholder="Write your announcement…"
            rows={3}
            className="form-input"
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select name="location_target" className="form-input" style={{ width: 'auto', minWidth: '180px' }}>
              <option value="all">All locations</option>
              <option value="hyderabad">Hyderabad only</option>
              <option value="chicago">Chicago only</option>
            </select>
            <input type="hidden" name="active" value="true" />
            <button type="submit" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
              <Megaphone size={15} />
              Post Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Existing announcements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {announcements?.map((a: any) => (
          <div key={a.id} style={{
            background: 'white', borderRadius: '0.875rem', padding: '1.25rem',
            border: `1.5px solid ${a.active ? 'var(--hsn-green)' : 'var(--hsn-border)'}`,
            boxShadow: 'var(--shadow-sm)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  background: a.active ? '#D1FAE5' : '#F1F5F9',
                  color: a.active ? '#065F46' : '#64748B',
                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                }}>
                  {a.active ? 'Active' : 'Inactive'}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.72rem', color: 'var(--hsn-gray)',
                }}>
                  <MapPin size={11} />
                  {a.location_target}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--hsn-gray)' }}>
                  {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p style={{ color: 'var(--hsn-dark)', fontSize: '0.9rem', lineHeight: 1.6 }}>{a.message}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <form action={async () => {
                'use server'
                const fd = new FormData()
                fd.set('id', a.id)
                fd.set('message', a.message)
                fd.set('active', String(!a.active))
                fd.set('location_target', a.location_target)
                await saveAnnouncement(fd)
              }}>
                <button type="submit" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: '#F1F5F9', color: 'var(--hsn-gray)', border: 'none',
                  borderRadius: '0.4rem', padding: '0.45rem 0.75rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  {a.active
                    ? <><ToggleLeft size={14} /> Deactivate</>
                    : <><ToggleRight size={14} color="var(--hsn-green)" /> Activate</>
                  }
                </button>
              </form>
              <form action={async () => { 'use server'; await deleteAnnouncement(a.id) }}>
                <button type="submit" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: '#FEE2E2', color: '#991B1B', border: 'none',
                  borderRadius: '0.4rem', padding: '0.45rem 0.75rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  <Trash2 size={13} />
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!announcements || announcements.length === 0) && (
          <div style={{
            background: 'white', borderRadius: '0.875rem', padding: '3.5rem 2rem',
            textAlign: 'center', color: 'var(--hsn-gray)', border: '1px solid var(--hsn-border)',
          }}>
            <Megaphone size={32} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--hsn-dark)', marginBottom: '0.3rem' }}>No announcements yet</p>
            <p style={{ fontSize: '0.875rem' }}>Post one using the form above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
