/**
 * Conteúdo real do lançamento.
 *
 *   npm run seed:real
 *
 * Idempotente: pode rodar de novo, atualiza em vez de duplicar.
 *
 *  1. SiteSettings: WhatsApp único (+55 98 99167-1028) e portfólio no menu.
 *  2. Depoimentos: as três avaliações do Google exibidas no site antigo,
 *     com o texto original, sem edição.
 *  3. Projetos: só apaga os cases de exemplo ("exemplo-*"). Os projetos reais
 *     ficam em scripts/seed-projects.ts.
 *  4. Artigos: os sete posts do WordPress, importados pela REST API pública,
 *     com slug e data originais. A URL continua /AAAA/MM/DD/slug/.
 *     As imagens destacadas são copiadas para public/wp-content/uploads/ no
 *     mesmo caminho do WordPress, para não quebrar o Google Imagens.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WP = 'https://gsrsistemas.com/wp-json/wp/v2'
const ctx = { disableRevalidate: true }

const TESTIMONIALS = [
  {
    name: 'Carlos Adriano',
    testimonial:
      'A GSR Sites e Sistemas é uma empresa excepcional no desenvolvimento de sistemas. Desde o primeiro contato, fiquei impressionado com a profissionalismo e dedicação da equipe. Estou extremamente satisfeito com o serviço prestado pela GSR e não hesitaria em recomendá-los a qualquer pessoa que precise de desenvolvimento de sistemas. Cinco estrelas sem dúvida!',
  },
  {
    name: 'Marcio Andson',
    testimonial:
      'Atendimento excelente! Ótimo pós-venda, tive e estou tendo todo suporte na adaptação do sistema que foi feito.',
  },
  { name: 'Renato Mesquita', testimonial: 'Muito bom!' },
]

// Os projetos do portfólio ficam em scripts/seed-projects.ts (npm run seed:projects).
const CASES: { slug: string; title: string; image: string }[] = []

/** Categoria de cada post migrado, pelo id do WordPress. */
const POST_CATEGORY: Record<number, string> = {
  810: 'desenvolvimento-de-sistemas',
  805: 'seo-e-performance',
  801: 'seo-e-performance',
  780: 'criacao-de-sites',
  152: 'desenvolvimento-de-sistemas',
  142: 'criacao-de-sites',
  121: 'criacao-de-sites',
}

type WpPost = {
  id: number
  date: string
  slug: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  featured_media: number
  yoast_head_json?: { title?: string; description?: string }
}

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;|\[&hellip;\]|&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

/** Títulos de seção do WordPress vinham como H4; no artigo viram H2/H3. */
const normalizeHtml = (html: string) =>
  html
    .replace(/<h4/g, '<h2')
    .replace(/<\/h4>/g, '</h2>')
    .replace(/<h5/g, '<h3')
    .replace(/<\/h5>/g, '</h3>')
    .replace(/<figure[\s\S]*?<\/figure>/g, '')
    .replace(/<img[^>]*>/g, '')

const getJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} em ${url}`)
  return (await res.json()) as T
}

const run = async () => {
  const { getPayload } = await import('payload')
  const { convertHTMLToLexical, editorConfigFactory } = await import('@payloadcms/richtext-lexical')
  const { Window } = await import('happy-dom')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // ── 1. Configurações ────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { whatsapp: '+5598991671028', display: { showPortfolioInNav: true } } as never,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'seo-settings',
    data: {
      defaultTitle: 'Criação de Sites e Sistemas Sob Medida | GSR Sistemas',
      titleTemplate: '%s | GSR Sistemas',
      // Mesmas tags do site antigo (ver src/components/analytics/Analytics.tsx).
      ga4MeasurementId: 'G-FVHZ0NLLXC',
      googleTagId: 'GT-TNPWVZW4',
      googleAdsId: 'AW-16761105005',
      gtmContainerId: 'GTM-539GQMP8',
      defaultDescription:
        'Criação de sites, lojas virtuais e sistemas sob medida para empresas de todo o Brasil. Feitos para aparecer no Google e vender mais.',
    } as never,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      description:
        'Criação de sites, lojas virtuais e sistemas sob medida para empresas de todo o Brasil.',
    } as never,
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: { ctaLabel: 'Pedir orçamento', ctaHref: '/orcamento/' } as never,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description: 'Criação de sites, lojas virtuais e sistemas sob medida para empresas de todo o Brasil.',
    } as never,
    context: ctx,
  })

  // Posicionamento nacional: as páginas locais (/sao-luis-ma/...) saem do ar.
  // Voltam a qualquer momento publicando de novo pelo painel.
  const locations = await payload.find({ collection: 'locations', limit: 50, draft: true })
  for (const doc of locations.docs) {
    await payload.update({
      collection: 'locations',
      id: doc.id,
      // Sem draft: true: assim o documento publicado vira rascunho de fato.
      data: { _status: 'draft' } as never,
      context: ctx,
    })
  }
  console.log(`✓ ${locations.docs.length} páginas locais despublicadas`)
  console.log('✓ WhatsApp, menu e título da home')

  // ── 2. Depoimentos ──────────────────────────────────────────────────────
  for (const [index, item] of TESTIMONIALS.entries()) {
    const data = {
      ...item,
      rating: 5,
      source: 'google',
      date: '2024-04-10T12:00:00.000Z',
      approvedForWebsite: true,
      featured: index === 0,
    }
    const existing = await payload.find({
      collection: 'testimonials',
      where: { name: { equals: item.name } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'testimonials', id: existing.docs[0].id, data: data as never, context: ctx })
    } else {
      await payload.create({ collection: 'testimonials', data: data as never, context: ctx })
    }
  }
  console.log('✓ 3 avaliações do Google')

  // ── 3. Projetos ─────────────────────────────────────────────────────────
  const examples = await payload.find({
    collection: 'case-studies',
    where: { slug: { like: 'exemplo-' } },
    limit: 50,
    draft: true,
  })
  for (const doc of examples.docs) {
    await payload.delete({ collection: 'case-studies', id: doc.id, context: ctx })
  }
  console.log(`✓ ${examples.docs.length} cases de exemplo removidos`)

  const uploadMedia = async (filePath: string, alt: string) => {
    const filename = filePath.split(/[\\/]/).pop() as string
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
    if (existing.docs[0]) return existing.docs[0].id
    const created = await payload.create({ collection: 'media', data: { alt } as never, filePath, context: ctx })
    return created.id
  }

  for (const [index, item] of CASES.entries()) {
    const { image, ...fields } = item
    const mediaId = await uploadMedia(resolve(root, 'public/projetos', image), `Site ${item.title}, criado pela GSR`)
    const data = {
      ...fields,
      featuredImage: mediaId,
      clientApproved: true,
      featured: index < 3,
      _status: 'published',
    }
    const existing = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: item.slug } },
      limit: 1,
      draft: true,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data: data as never, context: ctx })
    } else {
      await payload.create({ collection: 'case-studies', data: data as never, context: ctx })
    }
  }
  console.log('✓ 4 projetos reais')

  // ── 4. Artigos do WordPress ─────────────────────────────────────────────
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  class DOM {
    window: InstanceType<typeof Window>
    constructor(html: string) {
      this.window = new Window()
      this.window.document.body.innerHTML = html
    }
  }

  const users = await payload.find({ collection: 'users', limit: 1 })
  const authorId = users.docs[0]?.id
  if (!authorId) throw new Error('Nenhum usuário no Payload para ser autor dos artigos.')

  const posts = await getJson<WpPost[]>(
    `${WP}/posts?per_page=50&_fields=id,date,slug,link,title,excerpt,content,featured_media,yoast_head_json`,
  )

  for (const post of posts) {
    let featuredImage: number | string | undefined
    if (post.featured_media) {
      const media = await getJson<{ source_url: string; alt_text?: string }>(
        `${WP}/media/${post.featured_media}?_fields=source_url,alt_text`,
      )
      const relative = new URL(media.source_url).pathname
      const local = resolve(root, 'public', relative.replace(/^\//, ''))
      mkdirSync(dirname(local), { recursive: true })
      writeFileSync(local, Buffer.from(await (await fetch(media.source_url)).arrayBuffer()))
      featuredImage = await uploadMedia(local, media.alt_text || decode(post.title.rendered))
    }

    const content = convertHTMLToLexical({
      editorConfig,
      html: normalizeHtml(post.content.rendered),
      JSDOM: DOM as never,
    })

    const title = decode(post.title.rendered)
    const seoTitle = post.yoast_head_json?.title?.replace(/ - GSR Criação de Sites e Sistemas$/, '')
    const data = {
      title,
      slug: post.slug,
      excerpt: decode(post.excerpt.rendered),
      content,
      featuredImage,
      author: authorId,
      category: POST_CATEGORY[post.id],
      publishedAt: `${post.date}-03:00`,
      legacyUrl: post.link,
      needsReview: false,
      seo: {
        metaTitle: seoTitle && seoTitle !== title ? seoTitle : undefined,
        metaDescription: post.yoast_head_json?.description || undefined,
      },
      _status: 'published',
    }

    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
      draft: true,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, data: data as never, context: ctx })
    } else {
      await payload.create({ collection: 'posts', data: data as never, context: ctx })
    }
    console.log(`✓ ${post.link}`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
