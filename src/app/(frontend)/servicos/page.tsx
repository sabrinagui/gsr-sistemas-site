import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, CtaBand, NumberedList, Section, SectionHeader, WhatsAppIcon } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { whatsappLink } from '@/lib/contact'
import { getNavServices, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Hub de serviços.
 *
 * Navegacional: não disputa "criação de sites" nem "desenvolvimento de
 * sistemas". Existe para o usuário e para distribuir autoridade às páginas
 * que de fato disputam esses termos.
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

const PROCESS = [
  { title: 'Diagnóstico', description: 'Entendemos o negócio, o cliente e o que precisa mudar. Às vezes a resposta é menor do que você imaginava.' },
  { title: 'Proposta', description: 'Escopo, prazo e valor por escrito, antes de qualquer compromisso.' },
  { title: 'Construção', description: 'Você aprova o design antes do código e acompanha cada entrega.' },
  { title: 'Lançamento e suporte', description: 'No ar, no Google e com alguém cuidando depois, inclusive no fim de semana.' },
]

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })
}

export default async function ServicosPage() {
  const [services, site] = await Promise.all([getNavServices(), getSiteSettings()])
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
        eyebrow="serviços"
        title="Tudo o que sua empresa precisa para vender pela internet."
        description="Do site institucional ao sistema que organiza a operação. Você conta o objetivo; a gente indica o formato certo, inclusive quando ele é mais simples do que você veio pedir."
      >
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon />
            Quero meu orçamento
          </a>
        ) : null}
      </PageHero>

      <Section>
        <ul className="grid gap-4 md:grid-cols-2" data-reveal-stagger>
          {services.map((service, index) => (
            <li key={service.id} className={index === 0 && services.length % 2 === 1 ? 'md:col-span-2' : ''}>
              <Link
                href={`/${service.slug}/`}
                className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-ink-200 bg-white p-8 no-underline transition-colors hover:border-ink-950 md:p-10"
              >
                <div>
                  <h2 className="text-[1.8rem] leading-tight tracking-tight md:text-[2.3rem]">
                    {service.shortTitle ?? service.title}
                  </h2>
                  {service.description ? (
                    <p className="mt-4 max-w-[52ch] text-lg text-ink-500">{service.description}</p>
                  ) : null}
                </div>
                <span className="flex items-center justify-between">
                  <span className="font-medium text-ink-950">Ver detalhes</span>
                  <span className="go-circle">
                    <ArrowIcon className="h-5 w-5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <SectionHeader eyebrow="como funciona" title="Um processo claro, sem surpresa no meio do caminho" />
        <NumberedList items={PROCESS} columns={2} />
      </Section>

      <CtaBand
        title="Não sabe qual serviço escolher?"
        description="Conte o que você quer resolver. A gente indica o caminho, sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
