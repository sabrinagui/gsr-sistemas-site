import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServicePage } from '@/components/blocks/ServicePage'
import { getPayloadClient } from '@/lib/payload/client'
import { getServiceBySlug, getSiteSettings } from '@/lib/payload/queries'
import { applyRedirect, lookupRedirect } from '@/lib/redirects/resolve'
import { buildMetadata } from '@/lib/seo/metadata'

import { LocationHub } from './LocationHub'

/**
 * Rota de um segmento. Resolve, nesta ordem:
 *   1. serviço raiz   → /criacao-de-sites
 *   2. hub local      → /sao-luis-ma
 *   3. redirect do CMS
 *   4. 404
 *
 * Rotas estáticas (/servicos, /blog, /contato) têm precedência sobre esta no
 * roteador do Next, então não há conflito.
 *
 * A consulta a redirects só acontece aqui, quando nada correspondeu — é o
 * desenho da FASE 2: o caminho feliz nunca paga esse custo.
 */

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const resolveContent = async (slug: string) => {
  const service = await getServiceBySlug(slug)
  // Subserviço tem pai e vive em /pai/filho — não responde na raiz.
  if (service && !service.parent) return { type: 'service' as const, doc: service }

  const payload = await getPayloadClient()
  const locations = await payload.find({
    collection: 'locations',
    where: {
      and: [
        { locationSlug: { equals: slug } },
        { isHub: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  if (locations.docs[0]) return { type: 'location' as const, doc: locations.docs[0] }

  return null
}

export async function generateStaticParams() {
  if (process.env.GSR_IMAGE_BUILD === '1') return []
  const payload = await getPayloadClient()
  const [services, locations] = await Promise.all([
    payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 0,
    }),
    payload.find({
      collection: 'locations',
      where: { and: [{ isHub: { equals: true } }, { _status: { equals: 'published' } }] },
      limit: 50,
      depth: 0,
    }),
  ])

  return [
    ...services.docs.filter((s) => !s.parent).map((s) => ({ slug: s.slug as string })),
    ...locations.docs.map((l) => ({ slug: l.locationSlug as string })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const content = await resolveContent(slug)
  if (!content) return {}

  const { doc } = content

  return buildMetadata({
    title: doc.title,
    description: doc.description,
    path: `/${slug}`,
    seo: doc.seo,
    modifiedTime: doc.updatedAt,
  })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const [content, site] = await Promise.all([resolveContent(slug), getSiteSettings()])

  if (!content) {
    const redirect = await lookupRedirect(`/${slug}`)
    if (redirect && redirect.type !== '410') applyRedirect(redirect)
    notFound()
  }

  if (content.type === 'location') {
    return <LocationHub location={content.doc} site={site} />
  }

  return (
    <ServicePage
      service={content.doc}
      site={site}
      path={`/${slug}`}
      breadcrumbs={[
        { name: 'Início', path: '/' },
        { name: 'Serviços', path: '/servicos' },
        { name: content.doc.shortTitle ?? content.doc.title, path: `/${slug}` },
      ]}
    />
  )
}
