'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveArticle } from '../actions'

const categories = [
  { value: 'islamic_finance', label: '🏦 Islamic Finance' },
  { value: 'career', label: '🎓 Career' },
  { value: 'business', label: '📈 Business' },
  { value: 'community', label: '🤝 Community' },
  { value: 'general', label: '📄 General' },
]

interface Props {
  article?: {
    id: string
    title: string
    content: string
    category: string
    published: boolean
  }
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(article?.published ?? false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set('published', String(published))
    if (article?.id) formData.set('id', article.id)
    await saveArticle(formData)
    router.push('/admin/guidance')
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Title</label>
        <input name="title" required defaultValue={article?.title} placeholder="Article title" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Category</label>
        <select name="category" defaultValue={article?.category ?? 'general'} style={{ ...inputStyle, appearance: 'auto' }}>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Content</label>
        <textarea
          name="content"
          required
          defaultValue={article?.content}
          placeholder="Write your article content here…"
          rows={16}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setPublished(!published)}
          style={{
            width: '42px', height: '24px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
            background: published ? 'var(--hsn-green)' : '#D1D5DB',
            transition: 'background 0.2s', position: 'relative',
          }}
        >
          <span style={{
            position: 'absolute', top: '3px', left: published ? '21px' : '3px',
            width: '18px', height: '18px', borderRadius: '50%', background: 'white',
            transition: 'left 0.2s',
          }} />
        </button>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--hsn-dark)' }}>
          {published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#9CA3AF' : 'var(--hsn-green)', color: 'white',
            border: 'none', borderRadius: '0.5rem', padding: '0.7rem 1.5rem',
            fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving…' : 'Save Article'}
        </button>
        <a href="/admin/guidance" style={{
          background: '#F3F4F6', color: 'var(--hsn-gray)', borderRadius: '0.5rem',
          padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
        }}>
          Cancel
        </a>
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.875rem',
  marginBottom: '0.4rem', color: 'var(--hsn-dark)',
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid var(--hsn-border)', borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem', fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box', color: 'var(--hsn-dark)', background: 'white',
}
