import type { Metadata } from 'next'
import Image from 'next/image'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, CtaBand, GoogleIcon, Section, SectionHeader } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import { getFeaturedTestimonials, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sobre a GSR Sistemas',
    description:
      'A GSR Sistemas é o estúdio de Sabrina Mesquita: sites, lojas virtuais e sistemas sob medida para empresas de todo o Brasil.',
    path: '/sobre/',
  })
}

const PRINCIPLES = [
  {
    title: 'Resultado antes de enfeite',
    text: 'Cada tela existe para levar o visitante a uma ação: pedir orçamento, comprar, agendar. Se não ajuda a vender, não entra.',
  },
  {
    title: 'Quem desenha, programa',
    text: 'Sem telefone sem fio entre atendimento, designer e desenvolvedor. A mesma pessoa entende o seu negócio e constrói a solução.',
  },
  {
    title: 'Seu, de verdade',
    text: 'Domínio no seu nome, acessos entregues e código sob medida. Você não fica preso a ninguém, nem à GSR.',
  },
  {
    title: 'Perto depois da entrega',
    text: 'O projeto não termina no lançamento. Manutenção e suporte em horário comercial e também aos fins de semana.',
  },
]

export default async function SobrePage() {
  const [site, testimonials] = await Promise.all([getSiteSettings(), getFeaturedTestimonials(3)])
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/sobre/' },
  ]

  return (
    <>
      <JsonLd
        data={buildGraph([
          generateWebPageSchema({ path: '/sobre/', name: 'Sobre a GSR Sistemas' }),
          generateBreadcrumbSchema(breadcrumbs),
        ])}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="sobre"
        title="Uma empresa com nome, sobrenome e padrão internacional."
        description="A GSR Sistemas é o estúdio de Sabrina Mesquita. Design e desenvolvimento sob medida para empresas de todo o Brasil, com a mesma régua que ela usa para clientes nos Estados Unidos e na Europa."
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-[400px]">
            <span className="absolute -inset-[7%] rounded-full border border-accent-500/15" />
            <span className="absolute inset-0 rounded-full border border-accent-500/40" />
            <div className="absolute inset-[7%] grid place-items-end overflow-hidden rounded-full bg-ink-800">
              <Image
                src="/brand/sabrina-mesquita.webp"
                alt="Ilustração de Sabrina Mesquita, fundadora da GSR"
                width={384}
                height={453}
                priority
                className="w-[86%]"
              />
            </div>
            <span className="absolute right-0 top-[12%] rotate-3 rounded-xl bg-accent-500 px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#04191c]">
              Fundadora da GSR
            </span>
          </div>
        }
      />

      <Section>
        <SectionHeader
          eyebrow="como pensamos"
          title="Quatro regras que guiam cada projeto"
          description="Não é discurso de página institucional. É o que você vai perceber trabalhando com a gente."
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ink-200 bg-ink-200 md:grid-cols-2" data-reveal-stagger>
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="bg-white p-8 md:p-12">
              <h3 className="text-[1.6rem] tracking-tight md:text-[2rem]">{p.title}</h3>
              <p className="mt-4 max-w-[48ch] text-lg text-ink-500">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-dark" data-reveal>
              a fundadora
            </p>
            <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] text-white md:text-[2.75rem] xl:text-[3.2rem]">
              Sabrina Mesquita
            </h2>
            <div className="mt-8 grid max-w-[60ch] gap-4 text-[1.12rem] text-ink-400" data-reveal>
              <p>
                Designer de UI/UX e desenvolvedora web. Desenha interfaces, programa sites e sistemas e cuida da
                entrega do começo ao fim, para clientes no Brasil, nos Estados Unidos e na Europa.
              </p>
              <p>
                Criou a GSR para que empresas brasileiras de qualquer tamanho tenham acesso ao mesmo nível de projeto,
                <strong className="font-medium text-white"> sem intermediários e com alguém responsável pelo resultado</strong>.
              </p>
            </div>
            <p className="mt-7 font-sign text-[3.6rem] leading-none text-white" aria-hidden="true" data-reveal>
              Sabrina Mesquita
            </p>
          </div>

          <a
            href="https://sabrinamesquita.dev"
            target="_blank"
            rel="noopener"
            data-reveal
            className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] no-underline transition-colors hover:border-accent-500/50"
          >
            <Image
              src="/brand/sabrinamesquita-dev.webp"
              alt="Prévia do site sabrinamesquita.dev"
              width={900}
              height={473}
              className="aspect-[1200/630] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            />
            <span className="flex items-center justify-between gap-4 p-6">
              <span>
                <span className="block font-mono text-[0.74rem] uppercase tracking-[0.06em] text-accent-500">
                  Portfólio pessoal
                </span>
                <span className="mt-1 block text-lg font-semibold text-white">sabrinamesquita.dev</span>
              </span>
              <span className="go-circle h-11 w-11 border-white/10 text-white">
                <ArrowIcon className="h-[18px] w-[18px]" />
              </span>
            </span>
          </a>
        </div>
      </Section>

      {testimonials.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="avaliações no google"
            title={`Nota ${GOOGLE_REVIEWS.rating} no Google`}
            description={`Com base em ${GOOGLE_REVIEWS.count} avaliações de clientes reais, publicadas no perfil da empresa.`}
          />
          <div className="mt-16 grid gap-4 md:grid-cols-3" data-reveal-stagger>
            {testimonials.map((t) => (
              <figure key={t.id} className="flex flex-col rounded-3xl border border-ink-200 bg-white p-7">
                <div className="flex items-center justify-between">
                  <span className="tracking-[2px] text-star">{'★'.repeat(t.rating ?? 5)}</span>
                  <GoogleIcon className="h-5 w-5" />
                </div>
                <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-ink-700">“{t.testimonial}”</blockquote>
                <figcaption className="mt-6 font-semibold text-ink-950">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title="Vamos construir o próximo projeto juntos?"
        description="Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor."
        whatsappHref={whatsapp}
      />
    </>
  )
}
