import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'

import { HeroShowcase } from '@/components/home/HeroShowcase'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, Breadcrumbs, GoogleIcon, Section, SectionHeader, WhatsAppIcon } from '@/components/ui'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { applyRedirect, lookupRedirect } from '@/lib/redirects/resolve'
import { videoEmbedUrl } from '@/lib/video'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  buildGraph,
  generateBreadcrumbSchema,
  generateCreativeWorkSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema'

/**
 * Página de projeto.
 *
 *   1. abertura escura: título grande, resumo, ficha técnica e o notebook 3D
 *      abrindo com a tela do projeto
 *   2. a tela do site em tamanho grande, numa janela de navegador
 *   3. desafio e solução, funcionalidades e resultados (quando preenchidos)
 *   4. galeria, depoimento, tecnologia e serviços
 *   5. chamada e próximo projeto
 *
 * Nada aqui inventa conteúdo: seção sem dado no CMS não aparece.
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
  const result = await payload.find({ collection: 'case-studies', where: published, sort: ['order', '-publishedAt'], limit: 100, depth: 1 })
  return result.docs
}

const hostOf = (url?: string | null) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null)

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
  const typeLabel = TYPE_LABELS[item.projectType as string] ?? 'Projeto'
  const video = videoEmbedUrl((item as { videoUrl?: string | null }).videoUrl)

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
    { label: 'Entrega', value: typeLabel },
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

      {/* ── 1. Abertura ──────────────────────────────────────────────────── */}
      <section data-hero className="bg-ink-950 text-ink-300">
        <div className="container-page pb-10 pt-12 md:pt-16">
          <div data-reveal="0">
            <Breadcrumbs items={breadcrumbs} dark />
          </div>
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="min-w-0">
              <p className="eyebrow eyebrow-dark" data-reveal="0">
                {typeLabel.toLowerCase()}
                {item.industry ? ` · ${item.industry.toLowerCase()}` : ''}
              </p>
              <h1 data-split className="mt-6 text-[3rem] font-bold leading-[0.98] tracking-[-0.045em] text-white md:text-[4.4rem] xl:text-[5.4rem]">
                {item.title}
              </h1>
              {item.summary ? (
                <p data-reveal="0.1" className="mt-7 max-w-[46ch] text-lg text-ink-400 md:text-[1.2rem]">
                  {item.summary}
                </p>
              ) : null}
              <div data-reveal="0.2" className="mt-10 flex flex-wrap gap-3">
                {item.websiteUrl ? (
                  <a href={item.websiteUrl} target="_blank" rel="noopener" className="btn btn-primary">
                    Visitar o site
                    <ArrowIcon className="btn-arrow h-[18px] w-[18px] -rotate-45" />
                  </a>
                ) : null}
                {whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={item.websiteUrl ? 'btn btn-outline text-white' : 'btn btn-primary'}>
                    <WhatsAppIcon />
                    Quero um projeto assim
                  </a>
                ) : null}
              </div>
            </div>
            <div className="min-w-0">
              {image?.url ? <HeroShowcase projects={[{ name: item.title, image: image.url }]} /> : null}
            </div>
          </div>

          {/* Ficha técnica */}
          {facts.length > 0 ? (
            <dl
              data-reveal
              className={`mt-14 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 ${
                ['', 'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4'][facts.length]
              }`}
            >
              {facts.map((fact) => (
                <div key={fact.label} className="bg-ink-950 p-6">
                  <dt className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-500">{fact.label}</dt>
                  <dd className="mt-2 text-[1.1rem] font-medium text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      {/* ── 2. A tela em tamanho grande ──────────────────────────────────── */}
      {image?.url ? (
        <section className="relative bg-paper">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-ink-950" />
          <div className="container-page relative pt-10">
            <div data-reveal className="mx-auto max-w-[1280px]">
              <BrowserFrame
                image={image.url}
                alt={image.alt ?? `Página inicial do site ${item.title}`}
                url={hostOf(item.websiteUrl) ?? `${item.slug}`}
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Vídeo ────────────────────────────────────────────────────────── */}
      {video ? (
        <section className="bg-paper pt-24 md:pt-32">
          <div className="container-page">
            <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow" data-reveal>
                  em movimento
                </p>
                <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] md:text-[2.75rem]">
                  Veja o projeto funcionando
                </h2>
              </div>
            </div>
            <div className="relative mt-12 aspect-video overflow-hidden rounded-[22px] bg-ink-950 shadow-[0_40px_80px_-40px_rgba(7,16,18,0.45)]" data-reveal>
              <iframe
                src={video}
                title={`Vídeo do projeto ${item.title}`}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 3. Desafio e solução ─────────────────────────────────────────── */}
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
      ) : (
        <div className="bg-paper pb-8 pt-24 md:pt-32" />
      )}

      {features.length > 0 ? (
        <Section tone="white">
          <SectionHeader eyebrow="o que foi construído" title="Funcionalidades" />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {features.map((f: any) => (
              <li key={f.title} className="rounded-[28px] border border-ink-200 bg-paper p-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-6 text-[1.3rem] tracking-tight">{f.title}</h3>
                {f.description ? <p className="mt-2 text-ink-500">{f.description}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {results.length > 0 ? (
        <Section tone="ink">
          <SectionHeader dark eyebrow="resultado" title="O que mudou" />
          <dl className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {results.map((r: any) => (
              <div key={r.label} className="rounded-[28px] border border-white/10 bg-ink-900 p-9">
                <dd className="font-display text-[3.6rem] font-extrabold leading-none tracking-tight text-accent-500">{r.value}</dd>
                <dt className="mt-4 text-lg font-medium text-white">{r.label}</dt>
                {r.description ? <p className="mt-2 text-ink-400">{r.description}</p> : null}
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {gallery.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="por dentro" title="Telas do projeto" />
          <ul className="mt-16 columns-1 gap-6 md:columns-2 [&>li]:mb-6 [&>li]:break-inside-avoid">
            {gallery.map((g: any) => (
              <li key={g.image.id} data-reveal>
                <figure>
                  <div className="overflow-hidden rounded-[22px] border border-ink-200 bg-ink-100">
                    <Image
                      src={g.image.url}
                      alt={g.image.alt ?? ''}
                      width={g.image.width ?? 1600}
                      height={g.image.height ?? 1000}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-auto w-full"
                    />
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
            <p className="flex items-center justify-center gap-3">
              <GoogleIcon className="h-5 w-5" />
              <span className="tracking-[3px] text-star">{'★'.repeat(testimonial.rating ?? 5)}</span>
            </p>
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
        <section className="bg-paper pb-24">
          <div className="container-page grid gap-10 border-t border-ink-200 pt-14 md:grid-cols-2">
            {technologies.length > 0 ? (
              <div>
                <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Tecnologia</p>
                <ul className="mt-5 flex flex-wrap gap-2">
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
                <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Serviços</p>
                <ul className="mt-5 flex flex-wrap gap-2">
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
        </section>
      ) : null}

      {/* ── 5. Chamada + próximo projeto ─────────────────────────────────── */}
      <section className="bg-paper pb-24 md:pb-32">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-[32px] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(7,16,18,0.35)] md:grid-cols-[1fr_auto] md:p-14" data-reveal>
            <div>
              <p className="font-display text-[2rem] font-bold leading-tight tracking-tight md:text-[2.8rem]">
                Quer um projeto assim para a sua empresa?
              </p>
              <p className="mt-3 flex items-center gap-2 text-ink-500">
                <GoogleIcon className="h-4 w-4" /> Nota {GOOGLE_REVIEWS.rating} no Google · proposta com escopo, prazo e valor
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-on-light">
                  <WhatsAppIcon />
                  Falar no WhatsApp
                </a>
              ) : null}
              <Link href="/orcamento/" className="btn btn-outline text-ink-950">
                Pedir orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {next ? (
        <section className="bg-ink-950">
          <Link href={`/portfolio/${next.slug}/`} className="group container-page grid items-center gap-12 py-24 no-underline lg:grid-cols-[1fr_1.1fr] md:py-32">
            <div>
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink-500">Próximo projeto</p>
              <p className="mt-5 font-display text-[3rem] font-bold leading-[0.98] tracking-[-0.045em] text-white transition-colors group-hover:text-accent-500 md:text-[4.6rem]">
                {next.title}
              </p>
              <span className="mt-8 inline-flex items-center gap-4 font-medium text-white">
                <span className="go-circle border-white/15">
                  <ArrowIcon className="h-5 w-5" />
                </span>
                Ver o projeto
              </span>
            </div>
            <BrowserFrame image={nextImage?.url} alt="" url={hostOf(next.websiteUrl) ?? next.slug} dark />
          </Link>
        </section>
      ) : null}
    </>
  )
}
