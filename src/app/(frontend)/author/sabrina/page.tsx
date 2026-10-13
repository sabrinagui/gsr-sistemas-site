import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowIcon, Button } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { getAllPosts } from '@/lib/payload/queries'
import { formatPostDate, postPath } from '@/lib/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildGraph, generateBreadcrumbSchema, generateFounderSchema } from '@/lib/seo/schema'
import { absoluteUrl } from '@/lib/seo/url'

/**
 * /author/sabrina/ — mesma URL do arquivo de autor do WordPress, agora como
 * página de autora de verdade (E-E-A-T) e ponte para sabrinamesquita.dev.
 */

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sabrina Mesquita, fundadora da GSR Sistemas',
    description:
      'Designer de UI/UX e desenvolvedora web, fundadora da GSR Sistemas. Artigos sobre criação de sites, SEO e sistemas.',
    path: '/author/sabrina/',
  })
}

export default async function AuthorPage() {
  const posts = await getAllPosts()
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: 'Sabrina Mesquita', path: '/author/sabrina/' },
  ]

  return (
    <>
      <JsonLd
        data={buildGraph([
          {
            '@type': 'ProfilePage',
            '@id': `${absoluteUrl('/author/sabrina/')}#webpage`,
            url: absoluteUrl('/author/sabrina/'),
            mainEntity: generateFounderSchema(),
          },
          generateBreadcrumbSchema(breadcrumbs),
        ])}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="autora"
        title="Sabrina Mesquita"
        description="Fundadora da GSR Sistemas, designer de UI/UX e desenvolvedora web. Desenha e programa sites e sistemas para empresas no Brasil, nos Estados Unidos e na Europa."
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-[340px]">
            <span className="absolute inset-0 rounded-full border border-accent-500/40" />
            <div className="absolute inset-[7%] grid place-items-end overflow-hidden rounded-full bg-ink-800">
              <Image src="/brand/sabrina-mesquita.webp" alt="Ilustração de Sabrina Mesquita" width={384} height={453} className="w-[86%]" priority />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="https://sabrinamesquita.dev" external arrow>
            sabrinamesquita.dev
          </Button>
          <Button href="/sobre/" variant="secondary" className="text-white">
            Sobre a GSR
          </Button>
        </div>
      </PageHero>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <h2 data-split className="text-[2rem] leading-tight md:text-[2.6rem]">
            Artigos de Sabrina
          </h2>
          <ul className="mt-12 border-t border-ink-200" data-reveal-stagger>
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={postPath(post)}
                  className="group grid items-center gap-2 border-b border-ink-200 py-7 no-underline md:grid-cols-[160px_1fr_auto] md:gap-8"
                >
                  <span className="font-mono text-[0.82rem] text-ink-500">{formatPostDate(post.publishedAt)}</span>
                  <span className="text-[1.25rem] font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-accent-600 md:text-[1.45rem]">
                    {post.title}
                  </span>
                  <ArrowIcon className="arrow-slide hidden h-5 w-5 text-accent-600 md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
