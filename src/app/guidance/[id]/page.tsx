import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function GuidanceArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('guidance_articles')
    .select('*, author:profiles(full_name)')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (!article) notFound()

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link href="/guidance" style={{ color: 'var(--hsn-green)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
        ← Back to Guidance
      </Link>

      <article style={{ marginTop: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--hsn-dark)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
          {article.title}
        </h1>
        <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {article.author?.full_name && `By ${article.author.full_name} · `}
          {new Date(article.created_at).toLocaleDateString()}
        </p>
        <div style={{ color: 'var(--hsn-dark)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>
      </article>
    </div>
  )
}
