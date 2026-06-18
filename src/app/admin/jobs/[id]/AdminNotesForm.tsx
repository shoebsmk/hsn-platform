'use client'

import { useState, useTransition } from 'react'
import { saveAdminNotes } from '../../actions'

export default function AdminNotesForm({ id, notes }: { id: string; notes: string }) {
  const [value, setValue] = useState(notes)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData()
      fd.append('id', id)
      fd.append('notes', value)
      await saveAdminNotes(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <textarea
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false) }}
        placeholder="Add internal notes about this opportunity (only visible to admins)…"
        rows={5}
        style={{
          width: '100%', border: '1.5px solid var(--hsn-border)', borderRadius: '0.5rem',
          padding: '0.625rem 0.875rem', fontSize: '0.9rem', outline: 'none',
          boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleSave}
          disabled={pending}
          style={{
            background: 'var(--hsn-dark)', color: 'white', border: 'none',
            borderRadius: '0.5rem', padding: '0.55rem 1.25rem',
            fontWeight: 600, fontSize: '0.875rem', cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? 'Saving…' : 'Save Notes'}
        </button>
        {saved && <span style={{ color: 'var(--hsn-green)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Saved</span>}
      </div>
    </div>
  )
}
