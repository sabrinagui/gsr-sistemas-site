import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, CtaBand, Section, SectionHeader } from '@/components/ui'
import { LaptopFrame } from '@/components/ui/LaptopFrame'
import { PageHero } from '@/components/ui/PageHero'
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
 * Página de case: desafio, solução, o que foi construído, tecnologia e, quando
 * existir, resultado. `results` é opcional: melhor sem métrica do que com
 * métrica inventada.
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

const published: Where = { and: [{ _status: { equals: 'published' } }, { clientApproved: { equals: true } }] }

const getCase = async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: { and: [{ slug: { equals: slug } }, published] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

const getAllCases = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'case-studies', where: published, sort: '-featured', limit: 100, depth: 1 })
  return result.docs
}

export async function generateStaticParams() {
  const cases = await getAllCases()
  return cases.map((doc) => ({ slug: doc.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getCase(slug)
  if (!item) return {}
  const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
  return buildMetadata({
    title: `${item.title}: ${TYPE_LABELS[item.projectType as string] ?? 'projeto'} da GSR`,
    description: item.summary,
    path: `/portfolio/${slug}/`,
    image: image?.url,
    seo: item.seo,
    modifiedTime: item.updatedAt,
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const path = `/portfolio/${slug}/`
  const [item, site, all] = await Promise.all([getCase(slug), getSiteSettings(), getAllCases()])

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

  const position = all.findIndex((c) => c.id === item.id)
  const next = all.length > 1 ? all[(position + 1) % all.length] : null
  const nextImage = next && typeof next.featuredImage === 'object' ? next.featuredImage : null

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Projetos', path: '/portfolio/' },
    { name: item.title, path },
  ]

  const facts = [
    { label: 'Cliente', value: item.client },
    { label: 'Segmento', value: item.industry },
    { label: 'Tipo', value: TYPE_LABELS[item.projectType as string] ?? item.projectType },
    { label: 'Ano', value: item.year ? String(item.year) : null },
  ].filter((f) => Boolean(f.value))

  return (
    <>
      <JsonLd
        data={buildGraph([
          generateWebPageSchema({ path, name: item.title, description: item.summary, dateModified: item.updatedAt }),
          generateCreativeWorkSchema({ name: item.title, description: item.summary, path, image: image?.url, datePublished: item.publishedAt }),
          generateBreadcrumbSchema(breadcrumbs),
        ])}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={TYPE_LABELS[item.projectType as string] ?? 'projeto'}
        title={item.title}
        description={item.summary}
      >
        {facts.length > 0 ? (
          <dl className="flex flex-wrap gap-x-12 gap-y-5 border-t border-white/10 pt-7">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">{fact.label}</dt>
                <dd className="mt-1 font-medium text-white">{fact.value}</dd>
              </div>
            ))}
            {item.websiteUrl ? (
              <div>
                <dt className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">No ar</dt>
                <dd className="mt-1">
                  <a href={item.websiteUrl} target="_blank" rel="noopener" className="font-medium text-accent-500">
                    Visitar site ↗
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </PageHero>

      {/* Notebook grande com o projeto, saindo do palco escuro para o papel. */}
      <section className="relative bg-paper">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[55%] bg-ink-950" />
        <div className="container-page relative">
          <div className="mx-auto max-w-[1100px]" data-reveal>
            <LaptopFrame image={image?.url} alt={image?.alt ?? item.title} kind={item.projectType as never} priority />
          </div>
        </div>
      </section>

      {item.challenge || item.solution ? (
        <Section>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {item.challenge ? (
              <div data-reveal>
                <p className="eyebrow">o desafio</p>
                <div className="prose-gsr mt-8">
                  <RichText data={item.challenge} />
                </div>
              </div>
            ) : null}
            {item.solution ? (
              <div data-reveal>
                <p className="eyebrow">a solução</p>
                <div className="prose-gsr mt-8">
                  <RichText data={item.solution} />
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {features.length > 0 ? (
        <Section tone="white">
          <SectionHeader eyebrow="o que foi construído" title="Funcionalidades" />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {features.map((f: any) => (
              <li key={f.title} className="rounded-3xl border border-ink-200 bg-paper p-8">
                <h3 className="text-[1.3rem] tracking-tight">{f.title}</h3>
                {f.description ? <p className="mt-2 text-ink-500">{f.description}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {results.length > 0 ? (
        <Section tone="ink">
          <SectionHeader dark eyebrow="resultado" title="O que mudou" />
          <dl className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {results.map((r: any) => (
              <div key={r.label} className="border-t border-white/10 pt-8">
                <dd className="font-display text-[3.2rem] font-extrabold leading-none tracking-tight text-accent-500">{r.value}</dd>
                <dt className="mt-3 text-lg font-medium text-white">{r.label}</dt>
                {r.description ? <p className="mt-2 text-ink-400">{r.description}</p> : null}
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {gallery.length > 0 ? (
        <Section>
          <ul className="grid gap-6 md:grid-cols-2" data-reveal-stagger>
            {gallery.map((g: any) => (
              <li key={g.image.id}>
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink-200 bg-ink-100">
                    <Image src={g.image.url} alt={g.image.alt ?? ''} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
                  </div>
                  {g.caption ? <figcaption className="mt-3 text-[0.92rem] text-ink-500">{g.caption}</figcaption> : null}
                </figure>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {testimonial ? (
        <Section tone="white">
          <figure className="mx-auto max-w-4xl text-center" data-reveal>
            <p className="tracking-[3px] text-star">{'★'.repeat(testimonial.rating ?? 5)}</p>
            <blockquote className="mt-6 text-[1.6rem] font-medium leading-snug tracking-tight text-ink-950 md:text-[2.2rem]">
              “{testimonial.testimonial}”
            </blockquote>
            <figcaption className="mt-6 text-ink-500">
              {testimonial.name}
              {testimonial.company ? `, ${testimonial.company}` : ''}
            </figcaption>
          </figure>
        </Section>
      ) : null}

      {technologies.length > 0 || services.length > 0 ? (
        <Section className="!py-20">
          <div className="grid gap-10 md:grid-cols-2">
            {technologies.length > 0 ? (
              <div>
                <p className="eyebrow">tecnologia</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {technologies.map((t: any) => (
                    <li key={t.id} className="rounded-full border border-ink-200 bg-white px-4 py-2 font-mono text-[0.85rem] text-ink-700">
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {services.length > 0 ? (
              <div>
                <p className="eyebrow">serviços</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {services.map((s: any) => (
                    <li key={s.id}>
                      <Link href={`/${s.slug}/`} className="inline-block rounded-full bg-ink-950 px-4 py-2 text-[0.9rem] font-medium text-white no-underline hover:bg-accent-700">
                        {s.shortTitle ?? s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {next ? (
        <section className="bg-ink-950">
          <Link href={`/portfolio/${next.slug}/`} className="group container-page grid items-center gap-10 py-20 no-underline md:grid-cols-[1fr_0.8fr] md:py-28">
            <div>
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink-500">Próximo projeto</p>
              <p className="mt-4 flex items-center gap-4 font-display text-[2.4rem] font-bold leading-tight tracking-tight text-white md:text-[3.6rem]">
                {next.title}
                <ArrowIcon className="arrow-slide h-10 w-10 text-accent-500" />
              </p>
            </div>
            <div className="transition-transform duration-700 group-hover:-translate-y-2">
              <LaptopFrame image={nextImage?.url} alt="" kind={next.projectType as never} />
            </div>
          </Link>
        </section>
      ) : null}

      <CtaBand
        title="Quer um projeto assim para a sua empresa?"
        description="Conte o que você precisa e receba uma proposta com escopo, prazo e valor."
        whatsappHref={whatsapp}
      />
    </>
  )
}
