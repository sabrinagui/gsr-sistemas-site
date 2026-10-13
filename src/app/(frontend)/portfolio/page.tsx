import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs, CtaBand, Section, SectionHeader } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { whatsappLink } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Índice do portfólio.
 *
 * Responde 200 a partir de UM case publicado. Com zero, retorna 404 e fica fora
 * do sitemap — página de listagem vazia não é conteúdo, e um "em breve" no lugar
 * de projetos comunica o contrário do que o portfólio existe para comunicar.
 *
 * A entrada no menu é decisão editorial separada (SiteSettings.showPortfolioInNav).
 */

export const revalidate = 3600

const PATH = '/portfolio'
const BREADCRUMBS = [
  { name: 'Início', path: '/' },
  { name: 'Portfólio', path: PATH },
]

const TITLE = 'Portfólio'
const DESCRIPTION =
  'Projetos de sites e sistemas desenvolvidos pela GSR Sistemas: o problema, a solução e o que foi construído.'

const getCases = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [{ _status: { equals: 'published' } }, { clientApproved: { equals: true } }],
    },
    sort: '-featured',
    limit: 50,
    depth: 1,
  })
  return result.docs
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })
}

const TYPE_LABELS: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  app: 'Aplicativo',
}

export default async function PortfolioPage() {
  const [cases, site] = await Promise.all([getCases(), getSiteSettings()])

  if (cases.length === 0) {
    const { notFound } = await import('next/navigation')
    notFound()
  }

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const graph = buildGraph([
    generateWebPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
    generateBreadcrumbSchema(BREADCRUMBS),
  ])

  return (
    <>
      <JsonLd data={graph} />

      <section className="container-page pb-14 pt-8 md:pb-20 md:pt-10">
        <Breadcrumbs items={BREADCRUMBS} />
        {/* Sem Reveal: animar o H1 atrasa o LCP e produz um flash no carregamento.
            O movimento fica para o conteudo abaixo da dobra. */}
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow">Projetos</p>
          <h1 className="mt-5 text-display-md md:text-display-lg">Portfólio</h1>
          <p className="mt-6 text-lg text-ink-500 md:text-xl">
            Cada projeto aqui tem o contexto completo: qual era o problema, o que foi construído e
            com o quê. Não é uma galeria de telas bonitas.
          </p>
          <div className="rule-grow mt-10 h-px w-full bg-ink-200" />
        </div>
      </section>

      <section className="container-page pb-8">
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {cases.map((item, index) => {
            const image = typeof item.featuredImage === 'object' ? item.featuredImage : null

            return (
              <Reveal as="li" key={item.id} delay={(index % 2) * 90}>
                <Link href={`/portfolio/${item.slug}`} className="group block no-underline">
                  <div className="zoom-frame relative aspect-[16/10] overflow-hidden rounded-lg border border-ink-200 bg-ink-50 card-hover">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      /* Sem imagem, o cartão mostra o nome do projeto em vez de
                         um ícone de "imagem ausente". */
                      <div className="zoom-target flex h-full items-end p-8">
                        <span className="font-display text-2xl font-semibold text-ink-300">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem]">
                    <span className="step-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-ink-400">
                      {TYPE_LABELS[item.projectType as string] ?? item.projectType}
                    </span>
                    {item.industry ? (
                      <>
                        <span aria-hidden="true" className="text-ink-300">
                          ·
                        </span>
                        <span className="text-ink-400">{item.industry}</span>
                      </>
                    ) : null}
                  </div>

                  <h2 className="mt-2 text-display-sm">
                    <span className="underline-grow">{item.title}</span>
                  </h2>

                  {item.summary ? (
                    <p className="mt-3 max-w-xl text-ink-500">{item.summary}</p>
                  ) : null}

                  <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent-600">
                    Ver projeto
                    <span aria-hidden="true" className="arrow-slide">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </section>

      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Seu projeto"
            title="O próximo pode ser o seu"
            description="Conte o que sua empresa precisa e nós montamos uma proposta de escopo."
          />
        </Reveal>
      </Section>

      <CtaBand
        title="Vamos conversar sobre o seu projeto?"
        description="Sem compromisso: descreva a situação e nós indicamos o caminho."
        whatsappHref={whatsapp}
      />
    </>
  )
}
