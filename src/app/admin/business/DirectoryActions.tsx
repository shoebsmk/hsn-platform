'use client'

import { updateBusinessStatus, toggleVerified } from './actions'

export function StatusActions({ id, status }: { id: string; status: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      {status !== 'active' && (
        <button
          onClick={() => updateBusinessStatus(id, 'active')}
          style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem',
            borderRadius: '0.35rem', border: 'none', cursor: 'pointer',
            background: '#D1FAE5', color: '#065F46',
          }}
        >
          Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button
          onClick={() => updateBusinessStatus(id, 'rejected')}
          style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem',
            borderRadius: '0.35rem', border: 'none', cursor: 'pointer',
            background: '#FEE2E2', color: '#991B1B',
          }}
        >
          Reject
        </button>
      )}
    </div>
  )
}

export function VerifyToggle({ id, is_verified }: { id: string; is_verified: boolean }) {
  return (
    <button
      onClick={() => toggleVerified(id, !is_verified)}
      style={{
        fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem',
        borderRadius: '0.35rem', border: 'none', cursor: 'pointer',
        background: is_verified ? '#FEF9C3' : '#E0F2FE',
        color: is_verified ? '#854D0E' : '#075985',
      }}
    >
      {is_verified ? 'Unverify' : 'Verify'}
    </button>
  )
}
