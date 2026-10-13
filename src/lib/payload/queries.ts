import { unstable_cache } from 'next/cache'

import { getPayloadClient } from './client'

/**
 * Consultas usadas por layout e páginas.
 *
 * Tudo aqui filtra por _status: 'published'. Rascunho nunca aparece em página
 * pública, listagem ou sitemap — é a garantia do item 64 do briefing.
 */

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  ['site-settings'],
  { tags: ['globals'], revalidate: 3600 },
)

export const getSEOSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'seo-settings', depth: 1 })
  },
  ['seo-settings'],
  { tags: ['globals'], revalidate: 3600 },
)

export const getHeader = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'header', depth: 1 })
  },
  ['header'],
  { tags: ['globals'], revalidate: 3600 },
)

export const getFooter = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'footer', depth: 1 })
  },
  ['footer'],
  { tags: ['globals'], revalidate: 3600 },
)

/** Serviços publicados, para o menu e para a grade de serviços. */
export const getNavServices = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: {
        and: [{ _status: { equals: 'published' } }, { showInNav: { equals: true } }],
      },
      sort: 'order',
      depth: 0,
      limit: 20,
    })
    return result.docs
  },
  ['nav-services'],
  { tags: ['services'], revalidate: 3600 },
)

/** Contagem de cases publicados. Define se /portfolio responde 200 ou 404. */
export const getPublishedCaseCount = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.count({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
    })
    return result.totalDocs
  },
  ['case-count'],
  { tags: ['cases'], revalidate: 3600 },
)

/**
 * Projetos publicados e autorizados, na ordem definida no painel.
 * Com onlyHome, só os marcados como "Mostrar na home" (se nenhum estiver
 * marcado, cai para todos, para a home nunca ficar sem projetos).
 */
export const getFeaturedCases = (limit = 3, onlyHome = false) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const base = [{ _status: { equals: 'published' } }, { clientApproved: { equals: true } }]
      const find = (extra: object[]) =>
        payload.find({
          collection: 'case-studies',
          where: { and: [...base, ...extra] } as never,
          sort: ['order', '-publishedAt'],
          limit,
          depth: 1,
        })
      let result = await find(onlyHome ? [{ featured: { equals: true } }] : [])
      if (onlyHome && result.docs.length === 0) result = await find([])
      return result.docs
    },
    ['featured-cases', String(limit), String(onlyHome)],
    { tags: ['cases'], revalidate: 3600 },
  )()

/**
 * Depoimentos em destaque.
 *
 * O filtro por approvedForWebsite é aplicado na consulta, não na renderização:
 * depoimento não autorizado nunca chega ao componente.
 */
export const getFeaturedTestimonials = (limit = 3) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'testimonials',
        where: { approvedForWebsite: { equals: true } },
        sort: '-featured',
        limit,
        depth: 0,
      })
      return result.docs
    },
    ['featured-testimonials', String(limit)],
    { tags: ['testimonials'], revalidate: 3600 },
  )()

export const getRecentPosts = (limit = 3) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit,
        depth: 1,
      })
      return result.docs
    },
    ['recent-posts', String(limit)],
    { tags: ['posts'], revalidate: 3600 },
  )()

export const getTechnologies = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'technologies',
      sort: 'order',
      limit: 40,
      depth: 1,
    })
    return result.docs
  },
  ['technologies'],
  { tags: ['technologies'], revalidate: 3600 },
)

/** Um serviço pelo slug, com tudo que a página precisa. */
export const getServiceBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['service', slug],
    { tags: ['services'], revalidate: 3600 },
  )()

/** Uma página institucional pelo slug. */
export const getPageBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['page', slug],
    { tags: ['pages'], revalidate: 3600 },
  )()

/** Todos os artigos publicados, do mais recente ao mais antigo. */
export const getAllPosts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 200,
      depth: 1,
    })
    return result.docs
  },
  ['all-posts'],
  { tags: ['posts'], revalidate: 3600 },
)

/** Um artigo pelo slug, com relacionamentos para a página. */
export const getPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['post', slug],
    { tags: ['posts'], revalidate: 3600 },
  )()
