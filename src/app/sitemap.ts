import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload/client'
import { postPath } from '@/lib/posts'
import { absoluteUrl } from '@/lib/seo/url'

/**
 * Sitemap gerado a partir do banco.
 *
 * Entra: página publicada, com seo.index !== false, canônica própria e 200.
 * Não entra: rascunho, noindex, redirect, 404/410, /admin, /api, /preview,
 * /obrigado, paginação, filtro e busca.
 *
 * lastModified é o updatedAt real do documento — nunca a data do build. Publicar
 * o site não pode alterar a data de conteúdo que não mudou.
 */

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

const isIndexable = (doc: { seo?: { index?: boolean | null } | null }): boolean =>
  doc?.seo?.index !== false

const entry = (path: string, updatedAt?: string | null): Entry => ({
  url: absoluteUrl(path),
  lastModified: updatedAt ? new Date(updatedAt) : undefined,
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const published = { _status: { equals: 'published' } }
  const common = { depth: 0, limit: 1000, pagination: false as const }

  const [pages, services, locations, posts, cases] = await Promise.all([
    payload.find({ collection: 'pages', where: published, ...common }),
    payload.find({ collection: 'services', where: published, ...common }),
    payload.find({ collection: 'locations', where: published, ...common }),
    payload.find({ collection: 'posts', where: published, ...common }),
    payload.find({ collection: 'case-studies', where: published, ...common }),
  ])

  const entries: Entry[] = [entry('/'), entry('/blog/'), entry('/author/sabrina/')]

  // Páginas institucionais. /obrigado é excluída por não ser conteúdo indexável.
  const excludedPages = new Set(['obrigado', 'links'])
  for (const page of pages.docs) {
    if (!isIndexable(page) || excludedPages.has(page.slug as string)) continue
    entries.push(entry(page.slug === 'home' ? '/' : `/${page.slug}`, page.updatedAt))
  }

  for (const service of services.docs) {
    if (!isIndexable(service)) continue
    const parentSlug =
      typeof service.parent === 'object' && service.parent ? (service.parent as any).slug : null
    const path = parentSlug ? `/${parentSlug}/${service.slug}` : `/${service.slug}`
    entries.push(entry(path, service.updatedAt))
  }

  for (const location of locations.docs) {
    if (!isIndexable(location)) continue
    const path = location.isHub
      ? `/${location.locationSlug}`
      : `/${location.locationSlug}/${location.slug}`
    entries.push(entry(path, location.updatedAt))
  }

  for (const post of posts.docs) {
    if (!isIndexable(post)) continue
    entries.push(entry(postPath(post), post.updatedAt))
  }

  // Cada case publicado entra desde o primeiro, mesmo que o índice ainda não
  // esteja no menu — um case sozinho já é conteúdo útil e ranqueável.
  for (const item of cases.docs) {
    if (!isIndexable(item)) continue
    entries.push(entry(`/portfolio/${item.slug}`, item.updatedAt))
  }

  // O índice do portfólio só entra quando houver case publicado, porque só
  // então a página responde 200.
  if (cases.docs.length > 0) {
    entries.push(entry('/portfolio'))
  }

  // Deduplicação defensiva: nenhuma URL pode aparecer duas vezes.
  const seen = new Set<string>()
  return entries.filter((item) => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  })
}
