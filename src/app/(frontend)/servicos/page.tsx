import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLink, Breadcrumbs, CtaBand, Section, SectionHeader } from '@/components/ui'
import { whatsappLink } from '@/lib/contact'
import { getNavServices, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Hub de serviços.
 *
 * Navegacional, sem termo comercial primário: NÃO compete por "criação de sites"
 * nem por "desenvolvimento de sistemas". Existe para o usuário e para distribuir
 * autoridade às páginas que de fato disputam esses termos.
 *
 * É também onde manutenção e UI/UX aparecem — os dois ficaram fora do lançamento
 * como página própria, por não terem escopo definido ainda.
 */

export const revalidate = 3600

const PATH = '/servicos'

const BREADCRUMBS = [
  { name: 'Início', path: '/' },
  { name: 'Serviços', path: PATH },
]

const TITLE = 'Serviços'
const DESCRIPTION =
  'Sites, sistemas sob medida, landing pages, lojas virtuais e automação. Veja o que a GSR Sistemas desenvolve e como cada projeto funciona.'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })
}

export default async function ServicosPage() {
  const [services, site] = await Promise.all([getNavServices(), getSiteSettings()])

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const graph = buildGraph([
    generateWebPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
    generateBreadcrumbSchema(BREADCRUMBS),
  ])

  return (
    <>
      <JsonLd data={graph} />

      <section className="container-page pb-16 pt-8 md:pb-20 md:pt-10">
        <Breadcrumbs items={BREADCRUMBS} />
        <div className="mt-8 max-w-3xl">
          <h1 className="text-display-md md:text-display-lg">Serviços</h1>
          <p className="mt-6 text-lg text-ink-500 md:text-xl">
            Todo projeto começa pela mesma pergunta: o que precisa ser resolvido. A resposta é que
            define o formato — e às vezes ela é que você não precisa do que veio pedir.
          </p>
        </div>
      </section>

      {services.length > 0 ? (
        <Section>
          <ul className="grid gap-x-12 md:grid-cols-2">
            {services.map((service, index) => (
              <li key={service.id} className="border-t border-ink-100 py-10">
                <p className="step-number">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-display-sm">
                  <Link
                    href={`/${service.slug}`}
                    className="no-underline hover:text-accent-600 hover:underline"
                  >
                    {service.shortTitle ?? service.title}
                  </Link>
                </h2>
                {service.description ? (
                  <p className="mt-3 max-w-md text-ink-500">{service.description}</p>
                ) : null}
                <div className="mt-6">
                  <ArrowLink href={`/${service.slug}`}>Ver detalhes</ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/*
        Manutenção e UI/UX aparecem aqui como capacidade, sem página própria.
        Viram página quando o escopo vendido estiver definido (IA, seção 3.4).
      */}
      <Section tone="muted" bordered={false}>
        <SectionHeader
          eyebrow="Também faz parte"
          title="O que acompanha todo projeto"
          description="Não são serviços vendidos separadamente hoje — são etapas do trabalho."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="border-t border-ink-200 pt-6">
            <h3 className="text-xl">Interface e experiência</h3>
            <p className="mt-3 text-ink-500">
              O desenho das telas faz parte da entrega, não é um extra. Layout pensado para leitura,
              hierarquia clara e comportamento correto em tela pequena desde o começo.
            </p>
          </div>
          <div className="border-t border-ink-200 pt-6">
            <h3 className="text-xl">Manutenção e suporte</h3>
            <p className="mt-3 text-ink-500">
              Depois da entrega, o projeto continua existindo. Atualizações, correções e ajustes são
              combinados caso a caso, conforme o que cada projeto precisa.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <h2 className="text-display-sm">Não tem certeza do que precisa?</h2>
          <p className="mt-4 text-lg text-ink-500">
            Descreva a situação e nós indicamos o formato mais adequado — inclusive quando a
            resposta é um projeto menor do que você imaginava.
          </p>
          <div className="mt-8">
            <ArrowLink href="/contato">Falar com a gente</ArrowLink>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Vamos conversar sobre o seu projeto?"
        description="Conte o que sua empresa precisa. Respondemos com uma proposta de escopo — sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
