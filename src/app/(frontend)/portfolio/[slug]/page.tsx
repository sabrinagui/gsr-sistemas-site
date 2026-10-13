import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLink, Breadcrumbs, CtaBand, Section, SectionHeader } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { whatsappLink } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { applyRedirect, lookupRedirect } from '@/lib/redirects/resolve'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  buildGraph,
  generateBreadcrumbSchema,
  generateCreativeWorkSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema'

/**
 * Página de case.
 *
 * Estrutura pensada para fortalecer autoridade temática: desafio, solução, o que
 * foi construído, tecnologia e — quando existir — resultado. Não é galeria.
 *
 * `results` é opcional e vem vazio por padrão. Case sem número publica
 * normalmente: melhor sem métrica do que com métrica inventada.
 */

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const TYPE_LABELS: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  app: 'Aplicativo',
}

const getCase = async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
        { clientApproved: { equals: true } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [{ _status: { equals: 'published' } }, { clientApproved: { equals: true } }],
    },
    limit: 100,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: doc.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getCase(slug)
  if (!item) return {}

  const image = typeof item.featuredImage === 'object' ? item.featuredImage : null

  return buildMetadata({
    title: item.title,
    description: item.summary,
    path: `/portfolio/${slug}`,
    image: image?.url,
    seo: item.seo,
    modifiedTime: item.updatedAt,
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const path = `/portfolio/${slug}`
  const [item, site] = await Promise.all([getCase(slug), getSiteSettings()])

  if (!item) {
    const redirect = await lookupRedirect(path)
    if (redirect && redirect.type !== '410') applyRedirect(redirect)
    notFound()
  }

  const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
  const technologies = (item.technologies ?? []).filter((t: any) => typeof t === 'object')
  const services = (item.relatedServices ?? []).filter((s: any) => typeof s === 'object')
  const gallery = (item.gallery ?? []).filter((g: any) => typeof g?.image === 'object')
  const testimonial = typeof item.testimonial === 'object' ? item.testimonial : null
  const results = item.results ?? []
  const features = item.features ?? []

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: item.title, path },
  ]

  const graph = buildGraph([
    generateWebPageSchema({
      path,
      name: item.title,
      description: item.summary,
      dateModified: item.updatedAt,
    }),
    generateCreativeWorkSchema({
      name: item.title,
      description: item.summary,
      path,
      image: image?.url,
      datePublished: item.publishedAt,
    }),
    generateBreadcrumbSchema(breadcrumbs),
  ])

  const facts = [
    { label: 'Cliente', value: item.client },
    { label: 'Segmento', value: item.industry },
    { label: 'Tipo', value: TYPE_LABELS[item.projectType as string] ?? item.projectType },
    { label: 'Ano', value: item.year ? String(item.year) : null },
  ].filter((f) => Boolean(f.value))

  return (
    <>
      <JsonLd data={graph} />

      <section className="container-page pb-12 pt-8 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        {/* Sem Reveal no topo: nao atrasar o LCP. */}
        <div className="mt-8 max-w-4xl">
          <h1 className="text-display-md md:text-display-lg">{item.title}</h1>
          {item.summary ? (
            <p className="mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">{item.summary}</p>
          ) : null}
        </div>

        {facts.length > 0 ? (
          <Reveal delay={80}>
            <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-ink-100 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-2 font-display text-lg font-semibold text-ink-950">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </section>

      {image?.url ? (
        <section className="container-page pb-8">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </section>
      ) : null}

      {item.challenge || item.solution ? (
        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            {item.challenge ? (
              <Reveal>
                <h2 className="text-display-sm">O desafio</h2>
                <div className="prose-gsr mt-5 text-ink-600">
                  <RichText data={item.challenge} />
                </div>
              </Reveal>
            ) : null}
            {item.solution ? (
              <Reveal delay={90}>
                <h2 className="text-display-sm">A solução</h2>
                <div className="prose-gsr mt-5 text-ink-600">
                  <RichText data={item.solution} />
                </div>
              </Reveal>
            ) : null}
          </div>
        </Section>
      ) : null}

      {features.length > 0 ? (
        <Section>
          <Reveal>
            <SectionHeader eyebrow="Escopo" title="O que foi construído" />
          </Reveal>
          <ol className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: any, index: number) => (
              <Reveal as="li" key={feature.title} delay={(index % 3) * 80}>
                <div className="border-t border-ink-100 py-8">
                  <p className="step-number">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-xl">{feature.title}</h3>
                  {feature.description ? (
                    <p className="mt-2 text-ink-500">{feature.description}</p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* Só existe quando o cliente confirmou o número. Sem métrica, some. */}
      {results.length > 0 ? (
        <Section tone="ink" bordered={false}>
          <Reveal>
            <h2 className="text-display-sm text-white">Resultados</h2>
          </Reveal>
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result: any, index: number) => (
              <Reveal key={result.label} delay={index * 90}>
                <div className="border-t border-ink-800 pt-6">
                  <dt className="text-[0.85rem] uppercase tracking-wider text-ink-500">
                    {result.label}
                  </dt>
                  <dd className="mt-3 font-display text-display-md font-bold text-white">
                    {result.value}
                  </dd>
                  {result.description ? (
                    <p className="mt-3 text-ink-400">{result.description}</p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>
      ) : null}

      {gallery.length > 0 ? (
        <Section>
          <Reveal>
            <SectionHeader eyebrow="Telas" title="O projeto por dentro" />
          </Reveal>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {gallery.map((shot: any, index: number) => (
              <Reveal as="li" key={shot.id ?? index} delay={(index % 2) * 90}>
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
                    <Image
                      src={shot.image.url}
                      alt={shot.image.alt ?? ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {shot.caption ? (
                    <figcaption className="mt-3 text-sm text-ink-500">{shot.caption}</figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {testimonial?.approvedForWebsite ? (
        <Section tone="muted" bordered={false}>
          <Reveal>
            <figure className="max-w-3xl">
              <blockquote>
                <p className="font-display text-2xl leading-snug text-ink-950 md:text-display-sm">
                  “{testimonial.testimonial}”
                </p>
              </blockquote>
              <figcaption className="mt-6 text-ink-500">
                <span className="font-semibold text-ink-900">{testimonial.name}</span>
                {testimonial.company ? ` · ${testimonial.company}` : ''}
              </figcaption>
            </figure>
          </Reveal>
        </Section>
      ) : null}

      {technologies.length > 0 || services.length > 0 ? (
        <Section>
          <div className="grid gap-14 lg:grid-cols-2">
            {technologies.length > 0 ? (
              <Reveal>
                <h2 className="text-display-sm">Tecnologias</h2>
                <ul className="mt-8 flex flex-wrap gap-3">
                  {technologies.map((tech: any) => (
                    <li
                      key={tech.id}
                      className="rounded-md border border-ink-200 px-4 py-2 text-[0.925rem] font-medium text-ink-700"
                    >
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {services.length > 0 ? (
              <Reveal delay={90}>
                <h2 className="text-display-sm">Serviços deste projeto</h2>
                <ul className="mt-8 flex flex-col gap-4">
                  {services.map((service: any) => (
                    <li key={service.id} className="border-t border-ink-100 pt-4">
                      <ArrowLink href={`/${service.slug}`}>
                        {service.shortTitle ?? service.title}
                      </ArrowLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 font-semibold text-accent-600 no-underline"
        >
          <span aria-hidden="true">&larr;</span>
          <span className="underline-grow">Ver todos os projetos</span>
        </Link>
      </Section>

      <CtaBand
        title="Quer um projeto assim para a sua empresa?"
        description="Conte o que você precisa. Respondemos com uma proposta de escopo — sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
