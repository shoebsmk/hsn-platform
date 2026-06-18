import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteArticle } from '../actions'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  islamic_finance: 'Islamic Finance',
  career:          'Career',
  business:        'Business',
  community:       'Community',
  general:         'General',
}

export default async function AdminGuidancePage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('guidance_articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsn-dark)', letterSpacing: '-0.02em' }}>
            Guidance Articles
          </h1>
          <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Create and manage guidance content
          </p>
        </div>
        <Link href="/admin/guidance/new" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}>
          <Plus size={15} />
          New Article
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {articles?.map((article: any) => (
          <div key={article.id} style={{
            background: 'white', borderRadius: '0.875rem', padding: '1.25rem',
            border: '1px solid var(--hsn-border)', boxShadow: 'var(--shadow-sm)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '9px',
                background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <BookOpen size={18} color="#7C3AED" strokeWidth={1.75} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--hsn-gray)', fontWeight: 500 }}>
                    {categoryLabels[article.category] ?? article.category}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: 600,
                    background: article.published ? '#D1FAE5' : '#FEF3C7',
                    color: article.published ? '#065F46' : '#92400E',
                  }}>
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--hsn-dark)', fontSize: '0.925rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </h3>
                <p style={{ color: 'var(--hsn-gray)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                  {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <Link href={`/admin/guidance/${article.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: '#EFF6FF', color: '#1D4ED8', padding: '0.45rem 0.75rem',
                borderRadius: '0.4rem', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none',
              }}>
                <Pencil size={13} />
                Edit
              </Link>
              <form action={async () => { 'use server'; await deleteArticle(article.id) }}>
                <button type="submit" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: '#FEE2E2', color: '#991B1B', border: 'none',
                  padding: '0.45rem 0.75rem', borderRadius: '0.4rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  <Trash2 size={13} />
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!articles || articles.length === 0) && (
          <div style={{
            background: 'white', borderRadius: '0.875rem', padding: '3.5rem 2rem',
            textAlign: 'center', color: 'var(--hsn-gray)', border: '1px solid var(--hsn-border)',
          }}>
            <BookOpen size={32} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--hsn-dark)', marginBottom: '0.3rem' }}>No articles yet</p>
            <p style={{ fontSize: '0.875rem' }}>Create your first guidance article.</p>
          </div>
        )}
      </div>
    </div>
  )
}
