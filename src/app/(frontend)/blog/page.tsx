import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBand } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { whatsappLink } from '@/lib/contact'
import { getAllPosts, getSiteSettings } from '@/lib/payload/queries'
import { formatPostDate, postPath } from '@/lib/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo/schema'

/** /blog/ — mesma URL do WordPress. */

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Blog: sites, sistemas e vendas pela internet',
    description:
      'Artigos da GSR Sistemas sobre criação de sites, SEO local, sistemas web e como vender mais pela internet.',
    path: '/blog/',
  })
}

export default async function BlogPage() {
  const [posts, site] = await Promise.all([getAllPosts(), getSiteSettings()])
  const [first, ...rest] = posts
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Blog', path: '/blog/' },
  ]

  const image = (post: (typeof posts)[number]) =>
    typeof post.featuredImage === 'object' ? post.featuredImage : null

  return (
    <>
      <JsonLd
        data={buildGraph([
          generateWebPageSchema({ path: '/blog/', name: 'Blog da GSR Sistemas' }),
          generateBreadcrumbSchema(breadcrumbs),
        ])}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="blog"
        title="Conteúdo para vender mais pela internet"
        description="Sites, SEO local, sistemas e o que funciona na prática para pequenas e médias empresas. Escrito por Sabrina Mesquita."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          {first ? (
            <Link
              href={postPath(first)}
              className="group grid items-center gap-10 no-underline lg:grid-cols-[1.2fr_1fr] lg:gap-16"
              data-reveal
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-ink-900">
                {image(first)?.url ? (
                  <Image
                    src={image(first)!.url!}
                    alt={image(first)!.alt ?? ''}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div>
                <p className="font-mono text-[0.82rem] text-ink-500">
                  Mais recente · {formatPostDate(first.publishedAt)}
                </p>
                <h2 className="mt-4 text-[2rem] leading-[1.1] tracking-tight transition-colors group-hover:text-accent-600 md:text-[2.7rem]">
                  {first.title}
                </h2>
                {first.excerpt ? <p className="mt-5 line-clamp-3 text-lg text-ink-500">{first.excerpt}</p> : null}
                <span className="btn btn-primary btn-on-light mt-8">Ler artigo</span>
              </div>
            </Link>
          ) : (
            <p className="text-lg text-ink-500">Nenhum artigo publicado ainda.</p>
          )}

          {rest.length > 0 ? (
            <ul className="mt-24 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
              {rest.map((post) => (
                <li key={post.id}>
                  <Link href={postPath(post)} className="group grid content-start gap-4 no-underline">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-900">
                      {image(post)?.url ? (
                        <Image
                          src={image(post)!.url!}
                          alt={image(post)!.alt ?? ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <p className="font-mono text-[0.78rem] text-ink-500">{formatPostDate(post.publishedAt)}</p>
                    <h3 className="text-[1.35rem] leading-snug tracking-tight transition-colors group-hover:text-accent-600">
                      {post.title}
                    </h3>
                    {post.excerpt ? <p className="line-clamp-2 text-ink-500">{post.excerpt}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <CtaBand
        title="Prefere que a gente faça por você?"
        description="Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor."
        whatsappHref={whatsapp}
      />
    </>
  )
}
