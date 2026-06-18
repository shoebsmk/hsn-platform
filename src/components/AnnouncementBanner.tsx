'use client'

import { useState, useEffect } from 'react'
import { Megaphone, X } from 'lucide-react'
import type { Announcement } from '@/types'

const STORAGE_KEY = 'hsn_dismissed_announcements'

export default function AnnouncementBanner({ announcements }: { announcements: Announcement[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) setDismissed(new Set(JSON.parse(stored)))
    } catch {}
    setMounted(true)
  }, [])

  function dismiss(id: string) {
    const next = new Set(dismissed)
    next.add(id)
    setDismissed(next)
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
    } catch {}
  }

  if (!mounted) return null

  const visible = announcements.filter(a => !dismissed.has(a.id))
  if (visible.length === 0) return null

  return (
    <div>
      {visible.map(a => (
        <div key={a.id} style={{
          background: 'var(--hsn-green-muted)',
          borderBottom: '1px solid #B7DEC7',
          padding: '0.6rem 1.5rem',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <Megaphone size={15} color="var(--hsn-green)" style={{ flexShrink: 0 }} />
            <span style={{
              flex: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--hsn-green)',
              lineHeight: 1.5,
            }}>
              {a.message}
            </span>
            <button
              onClick={() => dismiss(a.id)}
              aria-label="Dismiss announcement"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--hsn-green)',
                opacity: 0.6,
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
