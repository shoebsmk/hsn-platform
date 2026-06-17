import ArticleForm from '../ArticleForm'

export default function NewArticlePage() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsn-dark)', marginBottom: '0.25rem' }}>New Article</h1>
      <p style={{ color: 'var(--hsn-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>Create a new guidance article</p>
      <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid var(--hsn-border)' }}>
        <ArticleForm />
      </div>
    </div>
  )
}
