import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { HeroShowcase } from '@/components/home/HeroShowcase'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, CtaBand, FaqList, GoogleIcon, Section, SectionHeader, WhatsAppIcon } from '@/components/ui'
import { LaptopFrame } from '@/components/ui/LaptopFrame'
import { PageHero } from '@/components/ui/PageHero'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
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
 * Estrutura fixa: o editor preenche conteúdo, não monta layout.
 *   1. abertura com o notebook 3D mostrando projetos daquele tipo
 *   2. primeira frase do texto em destaque editorial; o resto em duas colunas
 *   3. "o que está incluso" em grade com um cartão de destaque
 *   4. benefícios em cartões que se empilham na rolagem (sticky, só CSS)
 *   5. processo em etapas
 *   6. projetos, FAQ, relacionados e chamada final
 *
 * Seção sem dado não renderiza. FAQ: se o serviço não tiver perguntas no CMS,
 * entram as perguntas padrão abaixo, que valem para qualquer serviço.
 */

type ServicePageProps = {
  service: any
  site: any
  breadcrumbs: { name: string; path: string }[]
  path: string
  /** Preenchido nas páginas locais: muda o areaServed do schema. */
  areaServed?: string[]
}

const CASE_TYPES: Record<string, string[]> = {
  'criacao-de-sites': ['site'],
  'lojas-virtuais': ['loja-virtual'],
  'landing-pages': ['landing-page'],
  'desenvolvimento-de-sistemas': ['sistema'],
  'automacao-e-integracoes': ['automacao', 'sistema'],
}

const DEFAULT_FAQS = [
  {
    question: 'Quanto custa?',
    answer:
      'Depende do escopo. Depois de uma conversa rápida você recebe uma proposta por escrito com escopo, prazo e valor fechados, sem custo e sem compromisso.',
  },
  {
    question: 'Quanto tempo leva?',
    answer:
      'O prazo vem na proposta e depende do tamanho do projeto. Você aprova o design antes do desenvolvimento e acompanha cada entrega.',
  },
  {
    question: 'Vocês atendem empresas de qualquer cidade?',
    answer: 'Sim. A GSR atende empresas de todo o Brasil, com reuniões por videochamada e acompanhamento pelo WhatsApp.',
  },
  {
    question: 'E depois da entrega?',
    answer:
      'Você recebe todos os acessos e pode contar com manutenção e suporte contínuo, em horário comercial e também aos fins de semana.',
  },
]

/** Extrai o texto puro do Lexical. */
const lexicalToText = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  const children = node.root?.children ?? node.children ?? []
  return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
}

/** Separa o primeiro parágrafo (vira destaque) do resto do conteúdo. */
const splitContent = (content: any) => {
  const children: any[] = content?.root?.children ?? []
  const firstIndex = children.findIndex((c) => c.type === 'paragraph' && lexicalToText(c).length > 40)
  if (firstIndex === -1) return { lead: null, rest: content }
  const rest = { ...content, root: { ...content.root, children: children.filter((_, i) => i !== firstIndex) } }
  return { lead: lexicalToText(children[firstIndex]), rest: rest.root.children.length ? rest : null }
}

const caseImage = (item: any) => (typeof item?.featuredImage === 'object' ? item.featuredImage : null)

export const ServicePage = async ({ service, site, breadcrumbs, path, areaServed }: ServicePageProps) => {
  const hero = service.hero ?? {}
  const cmsFaqs = (service.faqs ?? []).filter((f: any) => typeof f === 'object')
  const posts = (service.relatedPosts ?? []).filter((p: any) => typeof p === 'object')
  const related = (service.relatedServices ?? []).filter((s: any) => typeof s === 'object')
  const technologies = (service.technologies ?? []).filter((t: any) => typeof t === 'object')
  const features: any[] = service.features ?? []
  const benefits: any[] = service.benefits ?? []
  const process: any[] = service.process ?? []
  const { lead, rest } = splitContent(service.content)

  // Projetos: os ligados no CMS; sem eles, os do mesmo tipo; sem esses, todos.
  const all = await getFeaturedCases(12)
  let cases = (service.relatedCases ?? []).filter((c: any) => typeof c === 'object' && c.clientApproved)
  if (cases.length === 0) cases = all.filter((c: any) => (CASE_TYPES[service.slug] ?? []).includes(c.projectType))
  if (cases.length === 0) cases = all
  const showcase = cases
    .map((c: any) => ({ name: c.title as string, image: caseImage(c)?.url as string }))
    .filter((p: { image?: string }) => p.image)

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const faqs =
    cmsFaqs.length > 0
      ? cmsFaqs.map((f: any) => ({ question: f.question, answer: <RichText data={f.answer} />, text: lexicalToText(f.answer) }))
      : DEFAULT_FAQS.map((f) => ({ ...f, text: f.answer }))

  const graph = buildGraph([
    generateWebPageSchema({ path, name: service.title, description: service.description, dateModified: service.updatedAt }),
    generateServiceSchema({ name: service.title, description: service.description, path, areaServed }),
    generateBreadcrumbSchema(breadcrumbs),
    generateFaqSchema(faqs.map((f: any) => ({ question: f.question, answer: f.text }))),
  ])

  const [featured, ...otherFeatures] = features
  // O destaque ocupa 2 células (2 linhas). Se a última linha da grade de 3
  // colunas ficar incompleta, o último cartão estica para fechar a linha.
  const leftover = (features.length + 1) % 3
  const lastFeatureSpan = leftover === 1 ? 'lg:col-span-3' : leftover === 2 ? 'lg:col-span-2' : ''

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Abertura ──────────────────────────────────────────────────── */}
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={(service.shortTitle ?? 'serviço').toLowerCase()}
        title={hero.headline ?? service.title}
        description={hero.subheadline ?? service.description}
        aside={showcase.length > 0 ? <HeroShowcase projects={showcase} /> : null}
      >
        <div className="flex flex-wrap gap-3">
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              Quero meu orçamento
            </a>
          ) : null}
          <Link href="/orcamento/" className="btn btn-outline text-white">
            Pedir proposta detalhada
            <ArrowIcon className="btn-arrow h-[18px] w-[18px]" />
          </Link>
        </div>
        <p className="mt-8 inline-flex items-center gap-2.5 text-[0.9rem] text-ink-400">
          <GoogleIcon className="h-[18px] w-[18px]" />
          <span className="tracking-[1px] text-star">★★★★★</span>
          Nota {GOOGLE_REVIEWS.rating} no Google · atendimento em todo o Brasil
        </p>
      </PageHero>

      {/* ── 2. Texto: destaque editorial + o resto em colunas ────────────── */}
      {lead || rest ? (
        <Section>
          {lead ? (
            <p
              data-split
              className="max-w-[30ch] font-display text-[1.9rem] font-semibold leading-[1.18] tracking-tight text-ink-950 md:text-[2.6rem] xl:text-[3.1rem]"
            >
              {lead}
            </p>
          ) : null}
          {rest ? (
            <div
              className="prose-gsr mt-16 max-w-none text-[1.15rem] lg:[&>div]:columns-2 lg:[&>div]:gap-20 [&>div>*]:break-inside-avoid [&_h2]:mt-0 [&_h2]:pt-8 [&_h2]:text-[1.5rem]"
              data-reveal
            >
              <RichText data={rest} />
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* ── 3. O que está incluso ────────────────────────────────────────── */}
      {features.length > 0 ? (
        <Section tone="white">
          <SectionHeader eyebrow="escopo" title="O que está incluso" description="Tudo o que entra no projeto, sem item escondido na letra miúda." />
          <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {featured ? (
              <li className="flex flex-col justify-between gap-10 rounded-[28px] bg-ink-950 p-9 text-ink-300 md:p-11 lg:row-span-2">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-500 text-[#04191c]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[2rem] leading-tight tracking-tight text-white md:text-[2.4rem]">{featured.title}</h3>
                  {featured.description ? <p className="mt-4 text-lg text-ink-400">{featured.description}</p> : null}
                </div>
              </li>
            ) : null}
            {otherFeatures.map((f, i) => (
              <li
                key={f.title}
                className={`rounded-[28px] border border-ink-200 bg-paper p-8 transition-colors hover:border-ink-950 ${
                  i === otherFeatures.length - 1 ? lastFeatureSpan : ''
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-6 text-[1.35rem] tracking-tight">{f.title}</h3>
                {f.description ? <p className="mt-2 text-ink-500">{f.description}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── 4. Benefícios: cartões que se empilham na rolagem ────────────── */}
      {benefits.length > 0 ? (
        <section className="bg-ink-950 py-24 md:py-32 lg:py-40">
          <div className="container-page grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow eyebrow-dark" data-reveal>
                por que vale
              </p>
              <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] text-white md:text-[2.75rem] xl:text-[3.4rem]">
                O que isso muda para a sua empresa
              </h2>
            </div>
            <ul className="grid gap-6">
              {benefits.map((b, i) => (
                <li
                  key={b.title}
                  className="rounded-[28px] border border-white/10 bg-ink-900 p-9 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.6)] md:p-12 lg:sticky"
                  style={{ top: `calc(8rem + ${i * 1.5}rem)` }}
                >
                  <p className="font-mono text-[0.82rem] text-accent-500">
                    {String(i + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
                  </p>
                  <h3 className="mt-6 text-[2rem] leading-tight tracking-tight text-white md:text-[2.6rem]">{b.title}</h3>
                  {b.description ? <p className="mt-4 max-w-[48ch] text-lg text-ink-400">{b.description}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── 5. Processo ──────────────────────────────────────────────────── */}
      {process.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="como funciona" title="Do primeiro contato ao projeto no ar" description="Etapas claras, com você aprovando cada uma antes da próxima." />
          <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {process.map((step, i) => (
              <li key={step.title} className="rounded-[28px] border border-ink-200 bg-white p-8">
                <span className="font-display text-[3.2rem] font-extrabold leading-none tracking-tight text-accent-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-[1.35rem] tracking-tight">{step.title}</h3>
                {step.description ? <p className="mt-2 text-ink-500">{step.description}</p> : null}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* ── 6. Projetos ──────────────────────────────────────────────────── */}
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
            {cases.slice(0, 3).map((item: any) => (
              <li key={item.id}>
                <Link href={`/portfolio/${item.slug}/`} className="group block no-underline">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
                    <LaptopFrame image={caseImage(item)?.url} alt={caseImage(item)?.alt ?? ''} kind={item.projectType} />
                  </div>
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

      {/* ── 7. Dúvidas ───────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow" data-reveal>
              dúvidas
            </p>
            <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] md:text-[2.75rem]">
              Perguntas frequentes
            </h2>
            {technologies.length > 0 ? (
              <div className="mt-12" data-reveal>
                <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Tecnologias que usamos</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((tech: any) => (
                    <li key={tech.id} className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 font-mono text-[0.8rem] text-ink-700">
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <FaqList items={faqs.map((f: any) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </Section>

      {/* ── 8. Relacionados ──────────────────────────────────────────────── */}
      {related.length > 0 || posts.length > 0 ? (
        <Section tone="white">
          <SectionHeader eyebrow="continue explorando" title="Outros serviços" />
          <ul className="mt-12 border-t border-ink-200">
            {related.map((item: any) => (
              <li key={item.id}>
                <Link
                  href={`/${item.slug}/`}
                  className="group grid items-center gap-x-10 gap-y-2 border-b border-ink-200 py-8 no-underline md:grid-cols-[1fr_1.2fr_auto]"
                >
                  <span className="font-display text-[1.7rem] font-bold tracking-tight text-ink-950 transition-transform duration-500 group-hover:translate-x-2 md:text-[2.2rem]">
                    {item.shortTitle ?? item.title}
                  </span>
                  <span className="text-ink-500">{item.description}</span>
                  <span className="go-circle max-md:hidden">
                    <ArrowIcon className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
            {posts.map((post: any) => (
              <li key={post.id}>
                <Link href={postPath(post)} className="group flex items-center justify-between gap-6 border-b border-ink-200 py-6 no-underline">
                  <span className="text-[1.15rem] font-semibold tracking-tight text-ink-950 group-hover:text-accent-600">Artigo: {post.title}</span>
                  <ArrowIcon className="arrow-slide h-5 w-5 shrink-0 text-accent-600" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand
        title={service.cta?.title ?? 'Pronto para tirar o projeto do papel?'}
        description={service.cta?.description ?? 'Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor fechados.'}
        buttonLabel="Pedir proposta detalhada"
        buttonHref="/orcamento/"
        whatsappHref={whatsapp}
      />
    </>
  )
}
