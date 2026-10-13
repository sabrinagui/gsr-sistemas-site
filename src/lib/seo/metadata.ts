import type { Metadata } from 'next'

import { absoluteUrl, generateCanonical } from './url'

/**
 * generateMetadata() centralizado. Nenhuma rota monta metadata sozinha.
 *
 * Cadeia de fallback (FASE 2, technical-seo.md seção 3):
 *   title       : seo.metaTitle → `${title} | GSR Sistemas`
 *   description : seo.metaDescription → excerpt → description → padrão
 *   og:image    : seo.ogImage → featuredImage → padrão
 *   canonical   : seo.canonicalUrl → absoluteUrl(path)
 */

export type SeoOverride = {
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  index?: boolean | null
  follow?: boolean | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: unknown
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: unknown
}

export type MetadataInput = {
  title: string
  description?: string | null
  path: string
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  noIndex?: boolean
  seo?: SeoOverride | null
  /** Sufixo alternativo. Padrão: " | GSR Sistemas". */
  titleTemplate?: string
  siteName?: string
  defaults?: {
    description?: string
    ogImage?: string
  }
}

const SITE_NAME = 'GSR Sistemas'
/** Imagem de compartilhamento padrão (public/og-gsr.jpg), 1200 × 630. */
const DEFAULT_OG_IMAGE = '/og-gsr.jpg'

/** Corta descrições longas no fim de uma palavra: o Google exibe ~160 caracteres. */
const clampDescription = (text?: string): string | undefined => {
  if (!text) return undefined
  const clean = text.replace(/s+/g, ' ').trim()
  if (clean.length <= 160) return clean
  const cut = clean.slice(0, 157)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '')}…`
}
const DEFAULT_TEMPLATE = '%s | GSR Sistemas'

const applyTemplate = (title: string, template: string): string =>
  template.includes('%s') ? template.replace('%s', title) : `${title}${template}`

/** Aceita string, objeto de Media do Payload ou id. Devolve URL absoluta ou null. */
const resolveImage = (input: unknown): string | null => {
  if (!input) return null
  if (typeof input === 'string') return input.startsWith('http') ? input : absoluteUrl(input)
  if (typeof input === 'object') {
    const media = input as { url?: string; sizes?: { og?: { url?: string } } }
    const url = media.sizes?.og?.url ?? media.url
    if (typeof url === 'string') return url.startsWith('http') ? url : absoluteUrl(url)
  }
  return null
}

export const buildMetadata = (input: MetadataInput): Metadata => {
  const {
    title,
    description,
    path,
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    noIndex = false,
    seo,
    titleTemplate = DEFAULT_TEMPLATE,
    siteName = SITE_NAME,
    defaults,
  } = input

  const resolvedTitle = seo?.metaTitle?.trim() || applyTemplate(title, titleTemplate)

  const resolvedDescription =
    seo?.metaDescription?.trim() || clampDescription(description ?? undefined) || defaults?.description || undefined

  const canonical = seo?.canonicalUrl?.trim() || generateCanonical(path)

  const ogImage =
    resolveImage(seo?.ogImage) ?? resolveImage(image) ?? resolveImage(defaults?.ogImage) ?? absoluteUrl(DEFAULT_OG_IMAGE)

  const twitterImage = resolveImage(seo?.twitterImage) ?? ogImage

  const index = noIndex ? false : seo?.index !== false
  const follow = seo?.follow !== false

  return {
    metadataBase: new URL(absoluteUrl('/')),
    /**
     * `absolute` é obrigatório aqui. O layout raiz define title.template com o
     * sufixo da marca, e o Next o aplica ao título de toda página filha — o que
     * produziria "Criação de Sites | GSR Sistemas | GSR Sistemas", já que o
     * sufixo também é aplicado por applyTemplate acima.
     */
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    alternates: { canonical },
    robots: {
      index,
      follow,
      googleBot: { index, follow },
    },
    openGraph: {
      type,
      title: seo?.ogTitle?.trim() || resolvedTitle,
      description: seo?.ogDescription?.trim() || resolvedDescription,
      url: canonical,
      siteName,
      locale: 'pt_BR',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle?.trim() || seo?.ogTitle?.trim() || resolvedTitle,
      description:
        seo?.twitterDescription?.trim() || seo?.ogDescription?.trim() || resolvedDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  }
}

/** Metadata para rotas que nunca devem ser indexadas. */
export const noIndexMetadata = (title: string): Metadata => ({
  title: applyTemplate(title, DEFAULT_TEMPLATE),
  robots: { index: false, follow: false },
})
