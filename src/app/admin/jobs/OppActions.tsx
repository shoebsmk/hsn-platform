'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { approveOpportunity, rejectOpportunity, flagOpportunity } from '../actions'

export default function OppActions({ id, status, redirectTo }: { id: string; status: string; redirectTo?: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handle(action: (formData: FormData) => Promise<void>) {
    startTransition(async () => {
      const fd = new FormData()
      fd.append('id', id)
      await action(fd)
      if (redirectTo) router.refresh()
    })
  }

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', opacity: pending ? 0.5 : 1 }}>
      {status !== 'active' && (
        <button onClick={() => handle(approveOpportunity)} disabled={pending} style={actionBtn('var(--hsn-green)', 'white')}>
          Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button onClick={() => handle(rejectOpportunity)} disabled={pending} style={actionBtn('#EF4444', 'white')}>
          Reject
        </button>
      )}
      {status !== 'flagged' && (
        <button onClick={() => handle(flagOpportunity)} disabled={pending} style={actionBtn('#F59E0B', 'white')}>
          Flag
        </button>
      )}
    </div>
  )
}

function actionBtn(bg: string, color: string): React.CSSProperties {
  return {
    background: bg, color, border: 'none', borderRadius: '0.375rem',
    padding: '0.3rem 0.65rem', fontSize: '0.75rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
  }
}
