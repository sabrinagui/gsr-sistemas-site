import { getAllPosts } from '@/lib/payload/queries'
import { postPath } from '@/lib/posts'
import { absoluteUrl } from '@/lib/seo/url'

/** RSS do blog. /feed/ do WordPress redireciona para cá. */

export const revalidate = 3600

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const posts = await getAllPosts()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(postPath(post))
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
      <description>${escape(post.excerpt ?? '')}</description>
      <dc:creator>Sabrina Mesquita</dc:creator>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog da GSR Sistemas</title>
    <link>${absoluteUrl('/blog/')}</link>
    <description>Criação de sites, SEO e sistemas para empresas.</description>
    <language>pt-BR</language>
${items}
  </channel>
</rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
