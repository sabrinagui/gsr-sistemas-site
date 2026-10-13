import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import {
  ArrowLink,
  Breadcrumbs,
  Button,
  CtaBand,
  FaqList,
  NumberedList,
  Section,
  SectionHeader,
} from '@/components/ui'
import { whatsappLink } from '@/lib/contact'
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
 * Estrutura fixa: o editor preenche conteúdo, não monta layout. É o que mantém
 * as páginas de serviço coerentes entre si e impede que uma delas vire uma
 * colagem de blocos soltos.
 *
 * Seção sem dado não renderiza — nunca há placeholder visível no site.
 */

type ServicePageProps = {
  service: any
  site: any
  breadcrumbs: { name: string; path: string }[]
  path: string
  /** Preenchido nas páginas locais: muda o areaServed do schema. */
  areaServed?: string[]
}

/** Extrai o texto puro do Lexical, para o FAQPage refletir o que está na tela. */
const lexicalToText = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  const children = node.root?.children ?? node.children ?? []
  return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
}

export const ServicePage = ({
  service,
  site,
  breadcrumbs,
  path,
  areaServed,
}: ServicePageProps) => {
  const hero = service.hero ?? {}
  const faqs = (service.faqs ?? []).filter((f: any) => typeof f === 'object')
  const cases = (service.relatedCases ?? []).filter(
    (c: any) => typeof c === 'object' && c.clientApproved,
  )
  const posts = (service.relatedPosts ?? []).filter((p: any) => typeof p === 'object')
  const related = (service.relatedServices ?? []).filter((s: any) => typeof s === 'object')
  const technologies = (service.technologies ?? []).filter((t: any) => typeof t === 'object')

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const graph = buildGraph([
    generateWebPageSchema({
      path,
      name: service.title,
      description: service.description,
      dateModified: service.updatedAt,
    }),
    generateServiceSchema({
      name: service.title,
      description: service.description,
      path,
      areaServed,
    }),
    generateBreadcrumbSchema(breadcrumbs),
    // Opcional por página, e só quando o FAQ está de fato visível acima.
    service.emitFaqSchema && faqs.length > 0
      ? generateFaqSchema(
          faqs.map((f: any) => ({ question: f.question, answer: lexicalToText(f.answer) })),
        )
      : null,
  ])

  return (
    <>
      <JsonLd data={graph} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-page pb-16 pt-8 md:pb-24 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 max-w-4xl">
          <h1 className="text-display-md md:text-display-lg">{hero.headline ?? service.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">
            {hero.subheadline ?? service.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={hero.primaryCtaHref ?? '/orcamento'}>
              {hero.primaryCtaLabel ?? 'Solicitar orçamento'}
            </Button>
            {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
              <Button href={hero.secondaryCtaHref} variant="secondary">
                {hero.secondaryCtaLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Conteúdo principal ───────────────────────────────────────────── */}
      {service.content ? (
        <Section>
          <div className="prose-gsr text-ink-600">
            <RichText data={service.content} />
          </div>
        </Section>
      ) : null}

      {/* ── O que está incluso ───────────────────────────────────────────── */}
      {service.features?.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Escopo" title="O que está incluso" as="h2" />
          <NumberedList items={service.features} />
        </Section>
      ) : null}

      {/* ── Benefícios ───────────────────────────────────────────────────── */}
      {service.benefits?.length > 0 ? (
        <Section tone="muted" bordered={false}>
          <SectionHeader eyebrow="Por quê" title="O que isso muda para a sua empresa" as="h2" />
          <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit: any) => (
              <li key={benefit.title} className="border-t border-ink-200 pt-6">
                <h3 className="text-lg">{benefit.title}</h3>
                {benefit.description ? (
                  <p className="mt-2 text-ink-500">{benefit.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Processo ─────────────────────────────────────────────────────── */}
      {service.process?.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Como funciona" title="O processo" as="h2" />
          <NumberedList items={service.process} />
        </Section>
      ) : null}

      {/* ── Tecnologias ──────────────────────────────────────────────────── */}
      {technologies.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Tecnologia" title="Com o que construímos" as="h2" />
          <ul className="mt-10 flex flex-wrap gap-3">
            {technologies.map((tech: any) => (
              <li
                key={tech.id}
                className="rounded-md border border-ink-200 px-4 py-2 text-[0.925rem] font-medium text-ink-700"
              >
                {tech.name}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Projetos ─────────────────────────────────────────────────────── */}
      {cases.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Projetos" title="Trabalhos relacionados" as="h2" />
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {cases.map((item: any) => (
              <li key={item.id}>
                <h3 className="text-xl">
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="no-underline hover:text-accent-600 hover:underline"
                  >
                    {item.title}
                  </Link>
                </h3>
                {item.summary ? <p className="mt-3 text-ink-500">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Dúvidas" title="Perguntas frequentes" as="h2" />
          <div className="max-w-3xl">
            <FaqList
              items={faqs.map((faq: any) => ({
                question: faq.question,
                answer: <RichText data={faq.answer} />,
              }))}
            />
          </div>
        </Section>
      ) : null}

      {/* ── Conteúdo e serviços relacionados ─────────────────────────────── */}
      {posts.length > 0 || related.length > 0 ? (
        <Section>
          <div className="grid gap-14 lg:grid-cols-2">
            {posts.length > 0 ? (
              <div>
                <h2 className="text-display-sm">Conteúdo relacionado</h2>
                <ul className="mt-8 flex flex-col gap-5">
                  {posts.map((post: any) => (
                    <li key={post.id} className="border-t border-ink-100 pt-5">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-display font-semibold text-ink-950 no-underline hover:text-accent-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {related.length > 0 ? (
              <div>
                <h2 className="text-display-sm">Outros serviços</h2>
                <ul className="mt-8 flex flex-col gap-5">
                  {related.map((item: any) => (
                    <li key={item.id} className="border-t border-ink-100 pt-5">
                      <ArrowLink href={`/${item.slug}`}>
                        {item.shortTitle ?? item.title}
                      </ArrowLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title={service.cta?.title ?? 'Vamos conversar sobre o seu projeto?'}
        description={
          service.cta?.description ??
          'Conte o que sua empresa precisa. Respondemos com uma proposta de escopo — sem compromisso.'
        }
        buttonLabel={service.cta?.buttonLabel ?? 'Solicitar orçamento'}
        buttonHref={service.cta?.buttonHref ?? '/orcamento'}
        whatsappHref={whatsapp}
      />
    </>
  )
}
