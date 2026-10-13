import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import {
  ArrowLink,
  Breadcrumbs,
  Button,
  CtaBand,
  FaqList,
  Section,
  SectionHeader,
} from '@/components/ui'
import { whatsappLink } from '@/lib/contact'
import {
  buildGraph,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema'

/**
 * Hub local (/sao-luis-ma).
 *
 * Deixa explícito que a GSR fica em São Luís E atende o Brasil inteiro — é
 * assim que o alcance nacional é comunicado, em vez de uma página por capital.
 *
 * Não emite LocalBusiness: enquanto o endereço não for confirmado como local de
 * atendimento presencial, só existe Organization com areaServed (FASE 2, 7.1).
 */
export const LocationHub = ({ location, site }: { location: any; site: any }) => {
  const hero = location.hero ?? {}
  const path = `/${location.locationSlug}`
  const services = (location.relatedServices ?? []).filter((s: any) => typeof s === 'object')
  const faqs = (location.faqs ?? []).filter((f: any) => typeof f === 'object')
  const testimonials = (location.testimonials ?? []).filter(
    (t: any) => typeof t === 'object' && t.approvedForWebsite,
  )
  const areas = location.serviceAreas ?? []

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: `${location.city}, ${location.stateCode}`, path },
  ]

  const graph = buildGraph([
    generateWebPageSchema({
      path,
      name: location.title,
      description: location.description,
      dateModified: location.updatedAt,
    }),
    generateBreadcrumbSchema(breadcrumbs),
  ])

  return (
    <>
      <JsonLd data={graph} />

      <section className="container-page pb-16 pt-8 md:pb-24 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 max-w-4xl">
          <p className="eyebrow">
            {location.city}, {location.state}
          </p>
          <h1 className="mt-5 text-display-md md:text-display-lg">
            {hero.headline ?? location.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">
            {hero.subheadline ?? location.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/orcamento">Solicitar orçamento</Button>
            {whatsapp ? (
              <Button href={whatsapp} variant="secondary" external>
                Falar no WhatsApp
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {location.localContent ? (
        <Section>
          <div className="prose-gsr text-ink-600">
            <RichText data={location.localContent} />
          </div>
        </Section>
      ) : null}

      {services.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="Serviços"
            title={`O que fazemos em ${location.city}`}
            description="Cada serviço tem uma página com o detalhe do que está incluso."
          />
          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => (
              <li key={service.id} className="border-t border-ink-100 py-8">
                <h3 className="text-xl">
                  <Link
                    href={`/${location.locationSlug}/${service.slug}`}
                    className="no-underline hover:text-accent-600 hover:underline"
                  >
                    {service.shortTitle ?? service.title}
                  </Link>
                </h3>
                {service.description ? (
                  <p className="mt-2 text-ink-500">{service.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {areas.length > 0 ? (
        <Section tone="muted" bordered={false}>
          <SectionHeader eyebrow="Cobertura" title="Onde atendemos" />
          <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
            {areas.map((area: any) => (
              <li
                key={area.name}
                className="rounded-md border border-ink-200 bg-paper px-4 py-2 text-[0.925rem] text-ink-700"
              >
                {area.name}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Clientes" title="O que dizem sobre o trabalho" />
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {testimonials.map((item: any) => (
              <li key={item.id} className="border-t border-ink-100 pt-6">
                <blockquote className="text-ink-700">
                  <p>{item.testimonial}</p>
                </blockquote>
                <p className="mt-4 font-display text-[0.95rem] font-semibold text-ink-950">
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {faqs.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="Dúvidas" title="Perguntas frequentes" />
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

      <Section>
        <div className="max-w-2xl">
          <h2 className="text-display-sm">Atendimento em todo o Brasil</h2>
          <p className="mt-4 text-lg text-ink-500">
            A GSR fica em {location.city}, mas o trabalho não para no Maranhão. Boa parte dos
            projetos é conduzida a distância, com o mesmo acompanhamento.
          </p>
          <div className="mt-8">
            <ArrowLink href="/servicos">Ver todos os serviços</ArrowLink>
          </div>
        </div>
      </Section>

      <CtaBand
        title={`Vamos conversar sobre o seu projeto em ${location.city}?`}
        description="Conte o que sua empresa precisa. Respondemos com uma proposta de escopo — sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
