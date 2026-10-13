import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBand } from '@/components/ui'
import { LaptopFrame } from '@/components/ui/LaptopFrame'
import { PageHero } from '@/components/ui/PageHero'
import { whatsappLink } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Portfólio. Responde 404 enquanto não houver case publicado e autorizado.
 */

export const revalidate = 3600

const PATH = '/portfolio/'
const BREADCRUMBS = [
  { name: 'Início', path: '/' },
  { name: 'Projetos', path: PATH },
]
const TITLE = 'Projetos'
const DESCRIPTION =
  'Sites, lojas virtuais e sistemas desenvolvidos pela GSR Sistemas para empresas reais: o problema, a solução e o que foi construído.'

const TYPE_LABELS: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  app: 'Aplicativo',
}

const getCases = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: { and: [{ _status: { equals: 'published' } }, { clientApproved: { equals: true } }] },
    sort: ['order', '-publishedAt'],
    limit: 50,
    depth: 1,
  })
  return result.docs
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })
}

export default async function PortfolioPage() {
  const [cases, site] = await Promise.all([getCases(), getSiteSettings()])
  if (cases.length === 0) notFound()
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

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
        eyebrow="projetos"
        title="Projetos reais, de clientes reais."
        description="Cada um começou com um problema de negócio. Veja o que foi construído e como ficou no ar."
      />

      <section className="bg-ink-950 pb-28 pt-4 md:pb-36">
        <ul className="container-page grid gap-x-12 gap-y-20 md:grid-cols-2" data-reveal-stagger>
          {cases.map((item) => {
            const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
            return (
              <li key={item.id}>
                <Link href={`/portfolio/${item.slug}/`} className="group block no-underline">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
                    <LaptopFrame image={image?.url} alt={image?.alt ?? ''} kind={item.projectType as never} />
                  </div>
                  <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="text-[1.7rem] tracking-tight text-white md:text-[2rem]">
                      <span className="underline-grow">{item.title}</span>
                    </h2>
                    <span className="font-mono text-[0.78rem] uppercase tracking-[0.06em] text-accent-500">
                      {TYPE_LABELS[item.projectType as string] ?? item.projectType}
                      {item.industry ? ` · ${item.industry}` : ''}
                    </span>
                  </div>
                  {item.summary ? <p className="mt-3 max-w-[56ch] text-lg text-ink-400">{item.summary}</p> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <CtaBand
        title="O próximo projeto pode ser o seu."
        description="Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor."
        whatsappHref={whatsapp}
      />
    </>
  )
}
