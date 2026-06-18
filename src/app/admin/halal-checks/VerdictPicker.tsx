'use client'

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const verdictOptions = [
  { value: 'permissible',     label: 'Permissible',     icon: CheckCircle, color: '#1B6B3A', bg: '#E8F5EE' },
  { value: 'not_permissible', label: 'Not Permissible', icon: XCircle,     color: '#DC2626', bg: '#FEF2F2' },
  { value: 'needs_context',   label: 'Needs Context',   icon: AlertCircle, color: '#B45309', bg: '#FEF9E7' },
]

export default function VerdictPicker() {
  const [selected, setSelected] = useState('')

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {verdictOptions.map(opt => {
        const Icon = opt.icon
        const isSelected = selected === opt.value
        return (
          <label key={opt.value} style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="verdict"
              value={opt.value}
              required
              checked={isSelected}
              onChange={() => setSelected(opt.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.875rem', borderRadius: '0.5rem',
              border: `1.5px solid ${isSelected ? opt.color : 'var(--hsn-border)'}`,
              fontSize: '0.82rem', fontWeight: 600,
              color: isSelected ? opt.color : 'var(--hsn-gray)',
              background: isSelected ? opt.bg : 'white',
              transition: 'all 0.15s',
              userSelect: 'none',
            }}>
              <Icon size={14} />
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
