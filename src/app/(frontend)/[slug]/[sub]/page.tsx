import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServicePage } from '@/components/blocks/ServicePage'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { applyRedirect, lookupRedirect } from '@/lib/redirects/resolve'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * Rota de dois segmentos. Resolve, nesta ordem:
 *   1. página local        → /sao-luis-ma/criacao-de-sites
 *   2. subserviço          → /desenvolvimento-de-sistemas/mvp
 *   3. redirect do CMS
 *   4. 404
 *
 * A página local recebe o 301 do post legado de maior valor do site antigo, e é
 * a prioridade número um do projeto (seo-keyword-map.md, seção 10).
 */

export const revalidate = 3600

type Props = { params: Promise<{ slug: string; sub: string }> }

const resolveContent = async (slug: string, sub: string) => {
  const payload = await getPayloadClient()

  const locations = await payload.find({
    collection: 'locations',
    where: {
      and: [
        { locationSlug: { equals: slug } },
        { slug: { equals: sub } },
        { isHub: { equals: false } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  if (locations.docs[0]) return { type: 'location' as const, doc: locations.docs[0] }

  const services = await payload.find({
    collection: 'services',
    where: { and: [{ slug: { equals: sub } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  const service = services.docs[0]
  const parentSlug = typeof service?.parent === 'object' ? (service.parent as any)?.slug : null
  if (service && parentSlug === slug) return { type: 'service' as const, doc: service }

  return null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const [locations, services] = await Promise.all([
    payload.find({
      collection: 'locations',
      where: { and: [{ isHub: { equals: false } }, { _status: { equals: 'published' } }] },
      limit: 100,
      depth: 0,
    }),
    payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
    }),
  ])

  return [
    ...locations.docs.map((l) => ({ slug: l.locationSlug as string, sub: l.slug as string })),
    ...services.docs
      .filter((s) => typeof s.parent === 'object' && s.parent)
      .map((s) => ({ slug: (s.parent as any).slug as string, sub: s.slug as string })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params
  const content = await resolveContent(slug, sub)
  if (!content) return {}

  const { doc } = content
  const isLocation = content.type === 'location'

  return buildMetadata({
    title: doc.title,
    description: doc.description,
    path: `/${slug}/${sub}`,
    seo: doc.seo,
    modifiedTime: doc.updatedAt,
    // Locations já trazem a cidade no próprio título, então não duplicamos.
    titleTemplate: isLocation ? '%s | GSR Sistemas' : '%s | GSR Sistemas',
  })
}

export default async function SubPage({ params }: Props) {
  const { slug, sub } = await params
  const path = `/${slug}/${sub}`
  const [content, site] = await Promise.all([resolveContent(slug, sub), getSiteSettings()])

  if (!content) {
    const redirect = await lookupRedirect(path)
    if (redirect && redirect.type !== '410') applyRedirect(redirect)
    notFound()
  }

  if (content.type === 'location') {
    const doc = content.doc
    const service = typeof doc.service === 'object' ? doc.service : null

    /**
     * A página local reaproveita o template de serviço, mas com conteúdo próprio
     * deste mercado — nunca o texto nacional com a cidade trocada.
     * O areaServed do schema é o diferencial estrutural entre as duas.
     */
    return (
      <ServicePage
        site={site}
        path={path}
        areaServed={[doc.city, doc.state, 'Brasil'].filter(Boolean)}
        breadcrumbs={[
          { name: 'Início', path: '/' },
          { name: `${doc.city}, ${doc.stateCode}`, path: `/${slug}` },
          { name: service?.shortTitle ?? doc.title, path },
        ]}
        service={{
          ...doc,
          content: doc.localContent,
          description: doc.description,
          relatedServices: doc.relatedServices,
          relatedCases: doc.relatedCases,
          faqs: doc.faqs,
        }}
      />
    )
  }

  const doc = content.doc
  const parent = typeof doc.parent === 'object' ? doc.parent : null

  return (
    <ServicePage
      service={doc}
      site={site}
      path={path}
      breadcrumbs={[
        { name: 'Início', path: '/' },
        { name: 'Serviços', path: '/servicos' },
        ...(parent
          ? [{ name: parent.shortTitle ?? parent.title, path: `/${parent.slug}` }]
          : []),
        { name: doc.shortTitle ?? doc.title, path },
      ]}
    />
  )
}
