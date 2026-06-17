import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const categoryLabels: Record<string, { label: string; icon: string }> = {
  islamic_finance: { label: 'Islamic Finance', icon: '🏦' },
  career:          { label: 'Career',           icon: '🎓' },
  business:        { label: 'Business',         icon: '📈' },
  community:       { label: 'Community',        icon: '🤝' },
  general:         { label: 'General',          icon: '📄' },
}

export default async function GuidancePage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('guidance_articles')
    .select('id, title, category, created_at, author:profiles(full_name)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const grouped = articles?.reduce((acc: Record<string, any[]>, article: any) => {
    const cat = article.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(article)
    return acc
  }, {}) ?? {}

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">Guidance</h1>
        <p className="section-subtitle">Islamic finance, career advice, and community wisdom</p>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--hsn-gray)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
          <p style={{ fontWeight: 600, color: 'var(--hsn-dark)' }}>Guidance articles coming soon</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.4rem' }}>Check back soon for resources from the community.</p>
        </div>
      )}

      {Object.entries(grouped).map(([cat, catArticles]) => {
        const meta = categoryLabels[cat] ?? { label: cat, icon: '📄' }
        return (
          <div key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--hsn-dark)', marginBottom: '1rem' }}>
              {meta.icon} {meta.label}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(catArticles as any[]).map((article: any) => (
                <Link key={article.id} href={`/guidance/${article.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--hsn-dark)', fontSize: '0.95rem' }}>{article.title}</h3>
                      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {article.author?.full_name && `By ${article.author.full_name} · `}
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ color: 'var(--hsn-green)', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
