import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { ServiceRows } from '@/components/services/ServiceRows'
import { CtaBand, GoogleIcon, Section, SectionHeader, WhatsAppIcon } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import { getFeaturedCases, getFeaturedTestimonials, getNavServices, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Hub de serviços. Navegacional: não disputa "criação de sites" nem
 * "desenvolvimento de sistemas"; distribui autoridade para essas páginas.
 */

export const revalidate = 3600

const PATH = '/servicos/'
const BREADCRUMBS = [
  { name: 'Início', path: '/' },
  { name: 'Serviços', path: PATH },
]
const TITLE = 'Serviços'
const DESCRIPTION =
  'Sites, lojas virtuais, landing pages, sistemas sob medida e automação para empresas de todo o Brasil. Veja o que a GSR Sistemas desenvolve.'

const TAGS: Record<string, string[]> = {
  'criacao-de-sites': ['SEO', 'Mobile first', 'Painel para editar'],
  'lojas-virtuais': ['Shopify', 'WooCommerce', 'Pix e frete'],
  'desenvolvimento-de-sistemas': ['Dashboards', 'Perfis de acesso', 'Integrações'],
  'landing-pages': ['Conversão', 'Medição', 'Campanhas'],
  'automacao-e-integracoes': ['APIs', 'Rotinas automáticas', 'Menos retrabalho'],
}

const PREVIEW_TYPES: Record<string, string[]> = {
  'criacao-de-sites': ['site'],
  'lojas-virtuais': ['loja-virtual'],
  'landing-pages': ['landing-page'],
  'desenvolvimento-de-sistemas': ['sistema', 'site'],
  'automacao-e-integracoes': ['automacao', 'sistema', 'site'],
}

const STEPS = [
  { title: 'Diagnóstico', text: 'Entendemos o negócio e o objetivo. Às vezes a solução certa é menor do que você imaginava.' },
  { title: 'Proposta', text: 'Escopo, prazo e valor por escrito, antes de qualquer compromisso.' },
  { title: 'Construção', text: 'Você aprova o design antes do código e acompanha cada entrega.' },
  { title: 'Lançamento', text: 'No ar, no Google e com suporte depois, inclusive no fim de semana.' },
]

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })
}

export default async function ServicosPage() {
  const [services, site, cases, testimonials] = await Promise.all([
    getNavServices(),
    getSiteSettings(),
    getFeaturedCases(12),
    getFeaturedTestimonials(1),
  ])
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null
  const review = testimonials[0]

  const previewFor = (slug: string) => {
    const types = PREVIEW_TYPES[slug] ?? []
    const match = cases.find((c) => types.includes(c.projectType as string)) ?? cases[0]
    const image = match && typeof match.featuredImage === 'object' ? match.featuredImage : null
    return image?.url ?? null
  }

  return (
    <>
      <JsonLd
        data={buildGraph([
          generateWebPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          generateBreadcrumbSchema(BREADCRUMBS),
        ])}
      />

      <PageHero
        breadcrumbs={BREADCRUMBS}
        eyebrow="serviços"
        title="Tudo o que sua empresa precisa para vender pela internet."
        description="Do site institucional ao sistema que organiza a operação. Você conta o objetivo; a gente indica o formato certo, inclusive quando ele é mais simples do que você veio pedir."
        aside={
          review ? (
            <figure className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-3">
                <GoogleIcon className="h-6 w-6" />
                <span className="font-display text-[2rem] font-extrabold leading-none text-white">{GOOGLE_REVIEWS.rating}</span>
                <span className="tracking-[2px] text-star">★★★★★</span>
              </div>
              <blockquote className="mt-5 line-clamp-4 text-[1.05rem] leading-relaxed text-ink-200">“{review.testimonial}”</blockquote>
              <figcaption className="mt-4 text-[0.88rem] text-ink-500">
                {review.name}, avaliação no Google · {GOOGLE_REVIEWS.count} avaliações
              </figcaption>
            </figure>
          ) : null
        }
      >
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon />
            Quero meu orçamento
          </a>
        ) : null}
      </PageHero>

      <Section>
        <ServiceRows
          rows={services.map((s) => ({
            slug: s.slug as string,
            title: s.shortTitle ?? s.title,
            description: s.description,
            tags: TAGS[s.slug as string] ?? [],
            preview: previewFor(s.slug as string),
          }))}
        />
      </Section>

      <Section tone="white">
        <SectionHeader eyebrow="como funciona" title="Um processo claro, sem surpresa no meio do caminho" />
        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-[28px] border border-ink-200 bg-paper p-8">
              <span className="font-display text-[3.2rem] font-extrabold leading-none tracking-tight text-accent-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-[1.35rem] tracking-tight">{step.title}</h3>
              <p className="mt-2 text-ink-500">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Não sabe qual serviço escolher?"
        description="Conte o que você quer resolver. A gente indica o caminho, sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
