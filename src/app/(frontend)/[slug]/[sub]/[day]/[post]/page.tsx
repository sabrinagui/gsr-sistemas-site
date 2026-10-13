import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, CtaBand } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { whatsappLink } from '@/lib/contact'
import { getAllPosts, getPostBySlug, getSiteSettings } from '@/lib/payload/queries'
import { formatPostDate, postPath } from '@/lib/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  buildGraph,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema'

/**
 * Artigo do blog, no formato de URL do WordPress: /2024/12/23/criacao-de-sites-em-sao-luis/
 *
 * Os segmentos se chamam [slug]/[sub] porque o Next exige o mesmo nome de
 * parâmetro em cada nível; aqui eles são ano e mês. Se a data da URL não bater
 * com a data do artigo, redireciona (301) para a URL certa em vez de duplicar.
 */

export const revalidate = 3600

type Props = { params: Promise<{ slug: string; sub: string; day: string; post: string }> }

const CATEGORY_LABELS: Record<string, string> = {
  'criacao-de-sites': 'Criação de sites',
  'desenvolvimento-de-sistemas': 'Sistemas',
  'seo-e-performance': 'SEO e performance',
  'negocios-digitais': 'Negócios digitais',
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => {
    const [, slug, sub, day, slugPost] = postPath(post).split('/')
    return { slug, sub, day, post: slugPost }
  })
}

const load = async (params: Props['params']) => {
  const { slug: year, sub: month, day, post: slug } = await params
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) return null
  const post = await getPostBySlug(slug)
  if (!post) return null
  return { post, requested: `/${year}/${month}/${day}/${slug}/` }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await load(params)
  if (!result) return {}
  const { post } = result
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: postPath(post),
    seo: post.seo,
    type: 'article',
    image: image?.url ?? null,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function PostPage({ params }: Props) {
  const result = await load(params)
  if (!result) notFound()

  const { post, requested } = result
  const path = postPath(post)
  if (requested !== path) permanentRedirect(path)

  const [site, all] = await Promise.all([getSiteSettings(), getAllPosts()])
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const related = all.filter((p) => p.id !== post.id).slice(0, 3)
  const services = (post.relatedServices ?? []).filter(
    (s): s is Exclude<typeof s, number | string> => typeof s === 'object',
  )
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.title, path },
  ]

  const graph = buildGraph([
    generateWebPageSchema({ path, name: post.title, description: post.excerpt }),
    generateBreadcrumbSchema(breadcrumbs),
    generateArticleSchema({
      title: post.title,
      description: post.excerpt,
      path,
      image: image?.url ?? null,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    }),
  ])

  return (
    <>
      <JsonLd data={graph} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={post.category ? CATEGORY_LABELS[post.category] ?? 'blog' : 'blog'}
        title={post.title}
        description={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.85rem] text-ink-400">
            <span>{formatPostDate(post.publishedAt)}</span>
            {post.readingTime ? <span>· {post.readingTime} min de leitura</span> : null}
            <span>
              · por{' '}
              <Link href="/author/sabrina/" className="text-white underline-offset-4 hover:underline">
                Sabrina Mesquita
              </Link>
            </span>
          </p>
        }
      />

      <article className="bg-paper">
        <div className="container-page grid gap-14 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-24">
          <div className="min-w-0">
            {image?.url ? (
              <div className="relative mb-14 aspect-[16/9] overflow-hidden rounded-3xl bg-ink-100" data-reveal>
                <Image
                  src={image.url}
                  alt={image.alt ?? ''}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="prose-gsr">
              <RichText data={post.content} />
            </div>

            {/* Autora: E-E-A-T e o elo com sabrinamesquita.dev. */}
            <aside className="mt-20 flex flex-col gap-6 rounded-3xl border border-ink-200 bg-white p-7 sm:flex-row sm:items-center md:p-9">
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ink-900">
                <Image src="/brand/sabrina-mesquita.webp" alt="" fill sizes="80px" className="object-cover object-top" />
              </span>
              <div>
                <p className="font-mono text-[0.78rem] uppercase tracking-[0.06em] text-accent-600">Sobre a autora</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-ink-950">Sabrina Mesquita</p>
                <p className="mt-2 text-ink-500">
                  Fundadora da GSR Sistemas, designer de UI/UX e desenvolvedora web.{' '}
                  <a href="https://sabrinamesquita.dev" target="_blank" rel="noopener" className="font-medium text-accent-600">
                    Conheça o portfólio dela
                  </a>
                  .
                </p>
              </div>
            </aside>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-ink-950 p-7 text-ink-300">
              <p className="font-display text-[1.5rem] font-bold leading-tight tracking-tight text-white">
                Quer colocar isso em prática?
              </p>
              <p className="mt-3 text-[0.95rem] text-ink-400">
                Conte o que a sua empresa precisa e receba uma proposta com escopo, prazo e valor.
              </p>
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-6 w-full">
                  Falar no WhatsApp
                </a>
              ) : null}
            </div>
            {services.length > 0 ? (
              <nav aria-label="Serviços relacionados" className="mt-8">
                <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Serviços relacionados</p>
                <ul className="mt-4 grid gap-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link href={`/${s.slug}/`} className="group flex items-center justify-between gap-3 border-b border-ink-200 py-3 font-medium text-ink-900 no-underline">
                        {s.shortTitle ?? s.title}
                        <ArrowIcon className="arrow-slide h-4 w-4 text-accent-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-ink-200 bg-paper py-24">
          <div className="container-page">
            <h2 data-split className="text-[2rem] leading-tight md:text-[2.6rem]">
              Continue lendo
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3" data-reveal-stagger>
              {related.map((item) => {
                const img = typeof item.featuredImage === 'object' ? item.featuredImage : null
                return (
                  <Link key={item.id} href={postPath(item)} className="group grid content-start gap-4 no-underline">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-900">
                      {img?.url ? (
                        <Image
                          src={img.url}
                          alt={img.alt ?? ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <p className="font-mono text-[0.78rem] text-ink-500">{formatPostDate(item.publishedAt)}</p>
                    <h3 className="text-[1.3rem] leading-snug tracking-tight transition-colors group-hover:text-accent-600">
                      {item.title}
                    </h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Vamos conversar sobre o seu projeto?"
        description="Conte o que sua empresa precisa. Respondemos com uma proposta de escopo, sem compromisso."
        whatsappHref={whatsapp}
      />
    </>
  )
}
