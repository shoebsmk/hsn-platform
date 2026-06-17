import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleForm from '../ArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('guidance_articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) notFound()

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Edit Article</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>Update guidance article</p>
      <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid var(--hsn-border)' }}>
        <ArticleForm article={article} />
      </div>
    </div>
  )
}
