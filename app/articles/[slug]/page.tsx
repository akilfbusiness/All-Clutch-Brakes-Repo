// Individual article page — dynamic route [slug]
// AEO/GEO engine — full template with all schema built in Step 8
// Placeholder until Step 8

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <h1>Article: {params.slug}</h1>
      <p>Placeholder — individual article page coming soon.</p>
    </main>
  )
}
