'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ClickableRow({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onClick={() => router.push(href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--hsn-border)',
        cursor: 'pointer',
        background: hovered ? '#F8FAFC' : 'white',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </tr>
  )
}
