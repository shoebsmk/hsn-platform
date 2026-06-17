import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteArticle } from '../actions'

const categoryLabels: Record<string, string> = {
  islamic_finance: '🏦 Islamic Finance',
  career: '🎓 Career',
  business: '📈 Business',
  community: '🤝 Community',
  general: '📄 General',
}

export default async function AdminGuidancePage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('guidance_articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>Guidance Articles</h1>
          <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem' }}>Create and manage guidance content</p>
        </div>
        <Link href="/admin/guidance/new" style={{
          background: 'var(--hsn-green)', color: 'white', padding: '0.6rem 1.25rem',
          borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
        }}>
          + New Article
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {articles?.map((article: any) => (
          <div key={article.id} style={{
            background: 'white', borderRadius: '0.75rem', padding: '1.25rem',
            border: '1px solid var(--hsn-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--hsn-gray)' }}>{categoryLabels[article.category]}</span>
                <span style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600,
                  background: article.published ? '#D1FAE5' : '#FEF3C7',
                  color: article.published ? '#065F46' : '#92400E',
                }}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 style={{ fontWeight: 700, color: 'var(--hsn-dark)', fontSize: '0.95rem' }}>{article.title}</h3>
              <p style={{ color: 'var(--hsn-gray)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href={`/admin/guidance/${article.id}`} style={{
                background: '#EFF6FF', color: '#1D4ED8', padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none',
              }}>
                Edit
              </Link>
              <form action={async () => { 'use server'; await deleteArticle(article.id) }}>
                <button type="submit" style={{
                  background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!articles || articles.length === 0) && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', color: 'var(--hsn-gray)', border: '1px solid var(--hsn-border)' }}>
            No articles yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  )
}
