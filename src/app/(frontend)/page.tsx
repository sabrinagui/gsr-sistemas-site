import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { HeroShowcase } from '@/components/home/HeroShowcase'
import { ProjectsScroll } from '@/components/home/ProjectsScroll'
import { ProcessScroll } from '@/components/home/ProcessScroll'
import { QuickLeadForm } from '@/components/home/QuickLeadForm'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  ArrowIcon,
  Button,
  FaqList,
  GoogleIcon,
  Section,
  SectionHeader,
  WhatsAppIcon,
} from '@/components/ui'
import { formatBrazilianPhone, GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import {
  getFeaturedCases,
  getFeaturedTestimonials,
  getNavServices,
  getRecentPosts,
  getSEOSettings,
  getSiteSettings,
} from '@/lib/payload/queries'
import { formatPostDate, postPath } from '@/lib/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateFaqSchema, generateWebPageSchema } from '@/lib/seo/schema'

/**
 * Home.
 *
 * O H1 começa com "Criação de sites e sistemas", o mesmo início do H1 do site
 * antigo: é o termo com histórico no Google, então a copy nova mantém as
 * palavras-chave e muda só a promessa.
 *
 * Posicionamento nacional: a GSR não se apresenta como empresa local. São Luís
 * continua no artigo /2024/12/23/criacao-de-sites-em-sao-luis/, que já ranqueia.
 *
 * Nenhuma seção inventa dado. Cases, depoimentos e artigos vêm do CMS e só
 * aparecem quando existem.
 */

export const revalidate = 3600

const GOOGLE = GOOGLE_REVIEWS

const CASE_TYPE_LABELS: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  app: 'Aplicativo',
}

const FAQ = [
  {
    question: 'Quanto custa um site?',
    answer:
      'Depende do que o site precisa fazer: um site institucional custa bem menos que uma loja virtual ou um sistema. Depois de uma conversa rápida você recebe a proposta por escrito, com escopo, prazo e valor fechados.',
  },
  {
    question: 'Em quanto tempo o site fica pronto?',
    answer:
      'O prazo vem na proposta e depende do tamanho do projeto. Como você aprova o layout antes da programação, sabe exatamente o que vai receber e quando.',
  },
  {
    question: 'O domínio e o site ficam no meu nome?',
    answer: 'Sim. O domínio é registrado no seu nome e você recebe todos os acessos ao final do projeto.',
  },
  {
    question: 'Vocês atendem a minha cidade?',
    answer:
      'Sim. A GSR atende empresas de todo o Brasil, com reuniões por videochamada e acompanhamento pelo WhatsApp em cada etapa.',
  },
  {
    question: 'E depois que o site estiver no ar?',
    answer:
      'A GSR oferece manutenção e suporte contínuo, em horário comercial e também aos fins de semana.',
  },
]

const SERVICE_TAGS: Record<string, string[]> = {
  'criacao-de-sites': ['SEO local', 'Mobile first', 'Domínio no seu nome'],
  'lojas-virtuais': ['Pix e cartão', 'Frete', 'Painel de pedidos'],
  'desenvolvimento-de-sistemas': ['Dashboards', 'Acesso por usuário', 'Integrações'],
  'landing-pages': ['Foco em conversão', 'Medição', 'Carrega rápido'],
  'automacao-e-integracoes': ['Menos retrabalho', 'APIs', 'Planilhas e ERPs'],
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo] = await Promise.all([getSiteSettings(), getSEOSettings()])

  return buildMetadata({
    title: seo?.defaultTitle ?? 'Criação de Sites e Sistemas Sob Medida | GSR Sistemas',
    description: seo?.defaultDescription ?? site?.description,
    path: '/',
    titleTemplate: '%s',
  })
}

export default async function HomePage() {
  const [site, services, cases, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    getNavServices(),
    getFeaturedCases(8, true),
    getFeaturedTestimonials(3),
    getRecentPosts(3),
  ])

  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const graph = buildGraph([
    generateWebPageSchema({
      path: '/',
      name: site?.companyName ?? 'GSR Sistemas',
      description: site?.description,
    }),
    generateFaqSchema(FAQ.map((f) => ({ question: f.question, answer: f.answer }))),
  ])

  const marquee = [
    ...cases.map((c) => c.client).filter((c): c is string => Boolean(c) && !c.startsWith('[')),
    ...services.map((s) => s.shortTitle ?? s.title),
  ]

  const [lead, ...otherTestimonials] = testimonials

  return (
    <>
      <JsonLd data={graph} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section data-hero className="relative overflow-hidden bg-ink-950 text-ink-300">
        <div className="container-page grid items-center gap-10 pb-20 pt-14 md:pt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 lg:pb-28">
          <div className="min-w-0">
            <a
              href="#avaliacoes"
              data-reveal="0"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-2.5 pr-4 text-[0.88rem] text-white no-underline"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              <span className="text-[0.8rem] tracking-[1px] text-star">★★★★★</span>
              Nota máxima no Google
            </a>

            <h1
              data-split
              className="mt-7 max-w-[21ch] text-[2.3rem] font-bold leading-[1.08] text-white md:text-[3rem] xl:text-[3.5rem]"
            >
              Criação de sites e sistemas que fazem sua empresa{' '}
              <span className="text-accent-500">vender mais.</span>
            </h1>

            <p data-reveal="0.1" className="mt-7 max-w-[52ch] text-lg text-ink-400 md:text-[1.15rem]">
              Sites, lojas virtuais e sistemas sob medida, feitos para aparecer no Google e transformar visita em
              cliente.
            </p>

            <div data-reveal="0.2" className="mt-10 flex flex-wrap gap-3">
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon />
                  Quero meu orçamento
                </a>
              ) : null}
              <Button href="/portfolio/" variant="secondary" arrow className="text-white">
                Ver projetos
              </Button>
            </div>

            <ul data-reveal="0.3" className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[0.92rem] text-ink-400">
              {['Sob medida', 'Todo o Brasil', 'Suporte 7 dias por semana'].map(
                (item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent-500" fill="none" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="min-w-0">
            <HeroShowcase
              projects={
                cases
                  .map((c) => ({
                    name: c.title,
                    image: typeof c.featuredImage === 'object' ? (c.featuredImage?.url ?? '') : '',
                  }))
                  .filter((p) => p.image)
              }
            />
          </div>
        </div>
      </section>

      {/* ── Faixa de clientes e serviços ─────────────────────────────────── */}
      {marquee.length > 0 ? (
        <div className="marquee-mask overflow-hidden border-y border-white/[0.08] bg-ink-950 py-7">
          <div className="marquee gap-14" aria-hidden="true">
            {[...marquee, ...marquee].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex shrink-0 items-center gap-14 whitespace-nowrap font-display text-[1.4rem] font-semibold tracking-tight text-ink-400"
              >
                {item}
                <span className="font-normal text-accent-500">/</span>
              </span>
            ))}
          </div>
          <p className="sr-only">Clientes e serviços: {marquee.join(', ')}.</p>
        </div>
      ) : null}

      {/* ── Serviços ─────────────────────────────────────────────────────── */}
      {services.length > 0 ? (
        <Section id="servicos">
          <SectionHeader
            eyebrow="serviços"
            title="Tudo o que sua empresa precisa para vender online"
            description="Você não precisa entender de tecnologia. Precisa de alguém que entenda o seu negócio. Começamos pelo seu objetivo e só depois escolhemos a solução certa."
          />
          <ul className="mt-16 border-t border-ink-200 md:mt-20" data-reveal-stagger>
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/${service.slug}/`}
                  className="group relative isolate grid items-center gap-x-8 gap-y-3 border-b border-ink-200 px-2 py-9 no-underline md:grid-cols-[1.1fr_1.3fr_auto] md:py-11"
                >
                  <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded bg-white transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
                  <h3 className="text-[1.75rem] tracking-tight transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 md:text-[2.4rem]">
                    {service.shortTitle ?? service.title}
                  </h3>
                  <div className="min-w-0">
                    {service.description ? <p className="text-ink-500">{service.description}</p> : null}
                    {SERVICE_TAGS[service.slug as string] ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {SERVICE_TAGS[service.slug as string].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent-50 px-2.5 py-1.5 font-mono text-[0.74rem] leading-none text-accent-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <span className="go-circle max-md:absolute max-md:right-2 max-md:top-9 max-md:h-11 max-md:w-11">
                    <ArrowIcon className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Como trabalhamos (fixa durante a rolagem) ────────────────────── */}
      <ProcessScroll />

      {/* ── Projetos: guiados pela rolagem, com o notebook 3D ─────────── */}
      <ProjectsScroll
        projects={cases.map((item) => ({
          slug: item.slug as string,
          title: item.title,
          type: CASE_TYPE_LABELS[item.projectType as string] ?? 'Projeto',
          summary: item.summary,
          image: typeof item.featuredImage === 'object' ? (item.featuredImage?.url ?? null) : null,
        }))}
      />

      {/* ── Avaliações do Google ─────────────────────────────────────────── */}
      {testimonials.length > 0 ? (
        <Section id="avaliacoes">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow" data-reveal>
                avaliações no google
              </p>
              <p
                className="mt-6 font-display text-[5rem] font-extrabold leading-[0.9] tracking-[-0.06em] text-ink-950 md:text-[7.5rem]"
                data-reveal
              >
                {GOOGLE.rating}
              </p>
              <p className="mt-3 text-2xl tracking-[4px] text-star" aria-label="5 de 5 estrelas">
                ★★★★★
              </p>
              <p className="mt-4 flex items-center gap-2.5 text-ink-500">
                <GoogleIcon className="h-[22px] w-[22px]" />
                Com base em {GOOGLE.count} avaliações verificadas
              </p>
              <Button href={GOOGLE.url} external variant="secondary" arrow className="mt-8">
                Ver no Google
              </Button>
            </div>

            <div className="grid gap-4" data-reveal-stagger>
              {[lead, ...otherTestimonials].filter(Boolean).map((item, index) => (
                <figure key={item.id} className="rounded-3xl border border-ink-200 bg-white p-7 md:p-9">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-700 font-semibold text-white">
                      {initials(item.name)}
                    </span>
                    <figcaption>
                      <span className="block font-semibold text-ink-950">{item.name}</span>
                      <span className="text-[0.88rem] text-ink-500">
                        Avaliação no Google
                        {item.date ? ` · ${formatPostDate(item.date)}` : ''}
                      </span>
                    </figcaption>
                    <GoogleIcon className="ml-auto h-[22px] w-[22px]" />
                  </div>
                  <p className="mt-5 tracking-[2px] text-star" aria-label={`${item.rating ?? 5} estrelas`}>
                    {'★'.repeat(item.rating ?? 5)}
                  </p>
                  <blockquote
                    className={
                      index === 0
                        ? 'mt-3 text-[1.25rem] font-medium leading-[1.45] tracking-tight text-ink-950 md:text-[1.5rem]'
                        : 'mt-3 text-[1.1rem] leading-relaxed text-ink-700'
                    }
                  >
                    “{item.testimonial}”
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* ── Fundadora ────────────────────────────────────────────────────── */}
      <Section tone="ink" id="sobrenos">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-28">
          <div className="relative mx-auto aspect-square w-full max-w-[460px]" data-reveal>
            <span className="absolute -inset-[4%] rounded-full sm:-inset-[7%] border border-accent-500/15" />
            <span className="absolute inset-0 rounded-full border border-accent-500/40" />
            <div className="absolute inset-[7%] grid place-items-end overflow-hidden rounded-full bg-ink-800">
              <Image
                src="/brand/sabrina-mesquita.webp"
                alt="Ilustração de Sabrina Mesquita, fundadora da GSR"
                width={384}
                height={453}
                className="w-[86%]"
                data-parallax="-6"
              />
            </div>
            <span className="absolute right-0 top-[12%] rotate-3 rounded-xl bg-accent-500 px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#04191c]">
              Fundadora da GSR
            </span>
          </div>

          <div className="min-w-0">
            <p className="eyebrow eyebrow-dark" data-reveal>
              quem está por trás
            </p>
            <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] text-white md:text-[2.75rem] xl:text-[3.4rem]">
              Por trás da GSR tem nome e sobrenome: <span className="text-accent-500">Sabrina Mesquita.</span>
            </h2>
            <div className="mt-8 grid max-w-[56ch] gap-4 text-[1.12rem] text-ink-400" data-reveal>
              <p>
                Sou designer de UI/UX e desenvolvedora web. Atendo clientes no Brasil, nos Estados Unidos e na Europa,
                e criei a GSR para levar esse mesmo padrão para empresas brasileiras de qualquer tamanho.
              </p>
              <p>
                <strong className="font-medium text-white">
                  Na GSR, você não passa por atendente, gerente e programador.
                </strong>{' '}
                Fala direto com quem desenha e constrói o seu projeto, e isso aparece no resultado.
              </p>
            </div>
            <p className="mt-7 font-sign text-[3.6rem] leading-none text-white md:text-[4.2rem]" aria-hidden="true" data-reveal>
              Sabrina Mesquita
            </p>
            <a
              href="https://sabrinamesquita.dev"
              target="_blank"
              rel="noopener"
              data-reveal
              className="group mt-10 grid grid-cols-[1fr_auto] items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 pr-5 no-underline transition-colors hover:border-accent-500/50 hover:bg-white/[0.06] sm:grid-cols-[150px_1fr_auto]"
            >
              <Image
                src="/brand/sabrinamesquita-dev.webp"
                alt="Prévia do site sabrinamesquita.dev"
                width={900}
                height={473}
                className="col-span-2 aspect-[1200/630] w-full rounded-xl object-cover sm:col-span-1"
              />
              <span>
                <span className="block font-mono text-[0.74rem] uppercase tracking-[0.06em] text-accent-500">
                  Portfólio pessoal
                </span>
                <span className="mt-1 block font-semibold text-white">sabrinamesquita.dev</span>
                <span className="block text-[0.9rem] text-ink-400">Projetos, cases e produtos da Sabrina</span>
              </span>
              <span className="go-circle h-11 w-11 border-white/10 text-white">
                <ArrowIcon className="h-[18px] w-[18px]" />
              </span>
            </a>
          </div>
        </div>
      </Section>

      {/* ── Blog ─────────────────────────────────────────────────────────── */}
      {posts.length > 0 ? (
        <Section id="blog">
          <SectionHeader
            eyebrow="blog"
            title="Conteúdo para vender mais pela internet"
            aside={
              <Button href="/blog/" variant="secondary" arrow>
                Ver todos os artigos
              </Button>
            }
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]" data-reveal-stagger>
            {posts.map((post, index) => {
              const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
              return (
                <Link
                  key={post.id}
                  href={postPath(post)}
                  className={`group grid content-start gap-4 no-underline ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-900">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="font-mono text-[0.78rem] text-ink-500">
                    {formatPostDate(post.publishedAt)} · Sabrina Mesquita
                  </p>
                  <h3
                    className={`leading-[1.2] tracking-tight transition-colors group-hover:text-accent-600 ${
                      index === 0 ? 'text-[1.6rem] md:text-[2rem]' : 'text-[1.3rem] md:text-[1.5rem]'
                    }`}
                  >
                    {post.title}
                  </h3>
                </Link>
              )
            })}
          </div>
        </Section>
      ) : null}

      {/* ── Dúvidas ──────────────────────────────────────────────────────── */}
      <Section className={posts.length > 0 ? '!pt-0' : ''}>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow" data-reveal>
              dúvidas
            </p>
            <h2 data-split className="mt-6 text-[2.1rem] leading-[1.08] md:text-[2.75rem] xl:text-[3.4rem]">
              Perguntas frequentes
            </h2>
            <p className="mt-6 max-w-[36ch] text-lg text-ink-500" data-reveal>
              Não achou a sua? Mande no WhatsApp e respondemos no mesmo dia útil.
            </p>
          </div>
          <FaqList items={FAQ} />
        </div>
      </Section>

      {/* ── Contato ──────────────────────────────────────────────────────── */}
      <Section tone="ink" id="contato">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-dark" data-reveal>
              orçamento
            </p>
            <h2 data-split className="mt-6 text-[2.4rem] leading-[1.04] text-white md:text-[3.4rem] xl:text-[4.2rem]">
              Seu próximo cliente está no Google agora.{' '}
              <span className="text-accent-500">Ele vai encontrar você?</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg text-ink-400" data-reveal>
              Conte em três perguntas o que você precisa. A mensagem chega pronta no nosso WhatsApp e a resposta
              sai no mesmo dia útil. Prefere um formulário completo?{' '}
              <Link href="/orcamento/" className="text-accent-500">
                Peça o orçamento detalhado
              </Link>
              .
            </p>
            <dl className="mt-12 grid gap-x-6 gap-y-7 sm:grid-cols-2" data-reveal>
              {[
                ['WhatsApp', site?.whatsapp ? formatBrazilianPhone(site.whatsapp) : null],
                ['E-mail', site?.email],
                ['Atendimento', 'Todo o Brasil, 100% online'],
                ['Suporte', 'Horário comercial e fins de semana'],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">{label}</dt>
                    <dd className="mt-1.5 select-all break-words font-medium text-white">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
          {site?.whatsapp ? <QuickLeadForm whatsapp={site.whatsapp} /> : null}
        </div>
      </Section>
    </>
  )
}
