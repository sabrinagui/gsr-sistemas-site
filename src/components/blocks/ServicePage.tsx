import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import {
  ArrowIcon,
  CtaBand,
  FaqList,
  NumberedList,
  Section,
  SectionHeader,
  WhatsAppIcon,
} from '@/components/ui'
import { LaptopFrame } from '@/components/ui/LaptopFrame'
import { PageHero } from '@/components/ui/PageHero'
import { whatsappLink } from '@/lib/contact'
import { getFeaturedCases } from '@/lib/payload/queries'
import { postPath } from '@/lib/posts'
import {
  buildGraph,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateServiceSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema'

/**
 * Template único das páginas de serviço.
 *
 * Estrutura fixa: o editor preenche conteúdo, não monta layout. Seção sem dado
 * não renderiza; nunca há placeholder visível no site.
 *
 * Projetos: usa os cases ligados ao serviço no CMS. Sem eles, mostra os cases
 * publicados do mesmo tipo (site, loja virtual, landing page, sistema).
 */

type ServicePageProps = {
  service: any
  site: any
  breadcrumbs: { name: string; path: string }[]
  path: string
  /** Preenchido nas páginas locais: muda o areaServed do schema. */
  areaServed?: string[]
}

/** Tipo de case que combina com cada serviço, para o fallback de projetos. */
const CASE_TYPES: Record<string, string[]> = {
  'criacao-de-sites': ['site'],
  'lojas-virtuais': ['loja-virtual'],
  'landing-pages': ['landing-page'],
  'desenvolvimento-de-sistemas': ['sistema', 'site'],
  'automacao-e-integracoes': ['automacao', 'sistema'],
}

/** Extrai o texto puro do Lexical, para o FAQPage refletir o que está na tela. */
const lexicalToText = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  const children = node.root?.children ?? node.children ?? []
  return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
}

const caseImage = (item: any) => (typeof item?.featuredImage === 'object' ? item.featuredImage : null)

export const ServicePage = async ({ service, site, breadcrumbs, path, areaServed }: ServicePageProps) => {
  const hero = service.hero ?? {}
  const faqs = (service.faqs ?? []).filter((f: any) => typeof f === 'object')
  const posts = (service.relatedPosts ?? []).filter((p: any) => typeof p === 'object')
  const related = (service.relatedServices ?? []).filter((s: any) => typeof s === 'object')
  const technologies = (service.technologies ?? []).filter((t: any) => typeof t === 'object')

  let cases = (service.relatedCases ?? []).filter((c: any) => typeof c === 'object' && c.clientApproved)
  if (cases.length === 0) {
    const types = CASE_TYPES[service.slug] ?? []
    const all = await getFeaturedCases(12)
    cases = all.filter((c: any) => types.includes(c.projectType))
    if (cases.length === 0) cases = all
  }
  cases = cases.slice(0, 3)
  const heroCase = cases.find((c: any) => caseImage(c)?.url)

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const graph = buildGraph([
    generateWebPageSchema({ path, name: service.title, description: service.description, dateModified: service.updatedAt }),
    generateServiceSchema({ name: service.title, description: service.description, path, areaServed }),
    generateBreadcrumbSchema(breadcrumbs),
    service.emitFaqSchema && faqs.length > 0
      ? generateFaqSchema(faqs.map((f: any) => ({ question: f.question, answer: lexicalToText(f.answer) })))
      : null,
  ])

  return (
    <>
      <JsonLd data={graph} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={service.shortTitle ?? 'serviço'}
        title={hero.headline ?? service.title}
        description={hero.subheadline ?? service.description}
        aside={
          heroCase ? (
            <div className="lg:pl-6">
              <LaptopFrame
                image={caseImage(heroCase)?.url}
                alt={caseImage(heroCase)?.alt ?? heroCase.title}
                priority
              />
              <p className="mt-5 text-center font-mono text-[0.78rem] text-ink-500">Projeto: {heroCase.title}</p>
            </div>
          ) : null
        }
      >
        <div className="flex flex-wrap gap-3">
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              Quero meu orçamento
            </a>
          ) : null}
          <Link href={hero.primaryCtaHref ?? '/orcamento/'} className="btn btn-outline text-white">
            {hero.primaryCtaLabel ?? 'Pedir proposta detalhada'}
            <ArrowIcon className="btn-arrow h-[18px] w-[18px]" />
          </Link>
        </div>
      </PageHero>

      {/* ── Conteúdo principal ───────────────────────────────────────────── */}
      {service.content ? (
        <Section>
          <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-24">
            <div>
              <p className="eyebrow" data-reveal>
                visão geral
              </p>
            </div>
            <div className="prose-gsr" data-reveal>
              <RichText data={service.content} />
            </div>
          </div>
        </Section>
      ) : null}

      {/* ── O que está incluso ───────────────────────────────────────────── */}
      {service.features?.length > 0 ? (
        <Section tone="white" className={service.content ? '' : ''}>
          <SectionHeader eyebrow="escopo" title="O que está incluso" />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {service.features.map((f: any) => (
              <li key={f.title} className="rounded-3xl border border-ink-200 bg-paper p-8">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-6 text-[1.3rem] tracking-tight">{f.title}</h3>
                {f.description ? <p className="mt-2 text-ink-500">{f.description}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Benefícios ───────────────────────────────────────────────────── */}
      {service.benefits?.length > 0 ? (
        <Section tone="ink">
          <SectionHeader dark eyebrow="por que vale" title="O que isso muda para a sua empresa" />
          <ul className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2" data-reveal-stagger>
            {service.benefits.map((b: any) => (
              <li key={b.title} className="border-t border-white/10 pt-8">
                <h3 className="text-[1.6rem] tracking-tight text-white md:text-[2rem]">{b.title}</h3>
                {b.description ? <p className="mt-3 max-w-[50ch] text-lg text-ink-400">{b.description}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Processo ─────────────────────────────────────────────────────── */}
      {service.process?.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="como funciona" title="Do primeiro contato ao projeto no ar" />
          <NumberedList items={service.process} />
        </Section>
      ) : null}

      {/* ── Projetos ─────────────────────────────────────────────────────── */}
      {cases.length > 0 ? (
        <Section tone="ink">
          <SectionHeader
            dark
            eyebrow="projetos"
            title="Trabalhos entregues"
            aside={
              <Link href="/portfolio/" className="group mt-6 inline-flex items-center gap-2 font-semibold text-accent-500 no-underline">
                <span className="underline-grow">Ver todos os projetos</span>
                <ArrowIcon className="arrow-slide h-4 w-4" />
              </Link>
            }
          />
          <ul className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {cases.map((item: any) => (
              <li key={item.id}>
                <Link href={`/portfolio/${item.slug}/`} className="group block no-underline">
                  <LaptopFrame image={caseImage(item)?.url} alt={caseImage(item)?.alt ?? ''} kind={item.projectType} />
                  <h3 className="mt-6 text-xl text-white">
                    <span className="underline-grow">{item.title}</span>
                  </h3>
                  {item.summary ? <p className="mt-2 line-clamp-2 text-ink-400">{item.summary}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Tecnologias ──────────────────────────────────────────────────── */}
      {technologies.length > 0 ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-24">
            <p className="eyebrow" data-reveal>
              tecnologia
            </p>
            <ul className="flex flex-wrap gap-2" data-reveal-stagger>
              {technologies.map((tech: any) => (
                <li key={tech.id} className="rounded-full border border-ink-200 bg-white px-4 py-2 font-mono text-[0.85rem] text-ink-700">
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs.length > 0 ? (
        <Section className={technologies.length > 0 ? '!pt-0' : ''}>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="eyebrow" data-reveal>
                dúvidas
              </p>
              <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] md:text-[2.75rem]">
                Perguntas frequentes
              </h2>
            </div>
            <FaqList
              items={faqs.map((faq: any) => ({ question: faq.question, answer: <RichText data={faq.answer} /> }))}
            />
          </div>
        </Section>
      ) : null}

      {/* ── Conteúdo e serviços relacionados ─────────────────────────────── */}
      {posts.length > 0 || related.length > 0 ? (
        <Section tone="white">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
            {posts.length > 0 ? (
              <div>
                <p className="eyebrow">leia também</p>
                <ul className="mt-8 border-t border-ink-200">
                  {posts.map((post: any) => (
                    <li key={post.id}>
                      <Link href={postPath(post)} className="group flex items-center justify-between gap-6 border-b border-ink-200 py-6 no-underline">
                        <span className="text-[1.15rem] font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-accent-600">
                          {post.title}
                        </span>
                        <ArrowIcon className="arrow-slide h-5 w-5 shrink-0 text-accent-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {related.length > 0 ? (
              <div>
                <p className="eyebrow">outros serviços</p>
                <ul className="mt-8 border-t border-ink-200">
                  {related.map((item: any) => (
                    <li key={item.id}>
                      <Link href={`/${item.slug}/`} className="group flex items-center justify-between gap-6 border-b border-ink-200 py-6 no-underline">
                        <span className="text-[1.15rem] font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-accent-600">
                          {item.shortTitle ?? item.title}
                        </span>
                        <ArrowIcon className="arrow-slide h-5 w-5 shrink-0 text-accent-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title={service.cta?.title ?? 'Pronto para tirar o projeto do papel?'}
        description={
          service.cta?.description ??
          'Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor fechados.'
        }
        buttonLabel={service.cta?.buttonLabel ?? 'Pedir proposta detalhada'}
        buttonHref={service.cta?.buttonHref ?? '/orcamento/'}
        whatsappHref={whatsapp}
      />
    </>
  )
}
