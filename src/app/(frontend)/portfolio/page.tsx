import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProjectList } from '@/components/portfolio/ProjectList'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBand, GoogleIcon } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload/client'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/** Portfólio. Responde 404 enquanto não houver projeto publicado e autorizado. */

export const revalidate = 3600

const PATH = '/portfolio/'
const BREADCRUMBS = [
  { name: 'Início', path: '/' },
  { name: 'Projetos', path: PATH },
]
const TITLE = 'Projetos'
const DESCRIPTION =
  'Sites, landing pages e experiências 3D desenvolvidos pela GSR Sistemas: o desafio, a solução e o que foi construído.'

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
        title="Projetos feitos do zero, no ar."
        description="Sites para clientes e projetos autorais, cada um desenhado e desenvolvido do zero. Veja o que foi construído e como ficou no ar."
        aside={
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-7">
              <dt className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Projetos no ar</dt>
              <dd className="mt-3 font-display text-[3.4rem] font-extrabold leading-none tracking-tight text-white">
                {String(cases.length).padStart(2, '0')}
              </dd>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-7">
              <dt className="flex items-center gap-2 font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">
                <GoogleIcon className="h-4 w-4" /> Google
              </dt>
              <dd className="mt-3 font-display text-[3.4rem] font-extrabold leading-none tracking-tight text-white">
                {GOOGLE_REVIEWS.rating}
              </dd>
            </div>
          </dl>
        }
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <ProjectList
            projects={cases.map((item) => ({
              slug: item.slug as string,
              title: item.title,
              type: item.projectType as string,
              typeLabel: TYPE_LABELS[item.projectType as string] ?? 'Projeto',
              industry: item.industry,
              summary: item.summary,
              image: typeof item.featuredImage === 'object' ? (item.featuredImage?.url ?? null) : null,
              url: item.websiteUrl ? item.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : null,
            }))}
          />
        </div>
      </section>

      <CtaBand
        title="O próximo projeto pode ser o seu."
        description="Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor fechados."
        whatsappHref={whatsapp}
      />
    </>
  )
}
