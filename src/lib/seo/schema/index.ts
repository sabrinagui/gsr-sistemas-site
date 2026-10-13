import { absoluteUrl } from '../url'

/**
 * JSON-LD alimentado por dado real do CMS.
 *
 * Regra que vale para todo este arquivo: dado ausente vira propriedade ausente.
 * Nada é preenchido com valor plausível para tentar completar um schema.
 *
 * Não implementados por decisão da FASE 2:
 *   - AggregateRating e Review para a própria GSR (technical-seo.md 7.3)
 *   - LocalBusiness enquanto isPhysicalLocation for false (7.1)
 */

type SiteSettingsLike = {
  companyName?: string | null
  legalName?: string | null
  description?: string | null
  email?: string | null
  whatsapp?: string | null
  phone?: string | null
  foundingYear?: number | null
  logo?: { url?: string } | null
  socialProfiles?: { platform?: string; url?: string }[] | null
  address?: {
    city?: string | null
    state?: string | null
    country?: string | null
    street?: string | null
    number?: string | null
    neighborhood?: string | null
    postalCode?: string | null
    latitude?: number | null
    longitude?: number | null
    isPhysicalLocation?: boolean | null
  } | null
}

/** Remove chaves nulas, vazias e arrays vazios, recursivamente. */
const clean = <T>(input: T): T => {
  if (Array.isArray(input)) {
    const arr = input.map(clean).filter((v) => v !== undefined && v !== null)
    return (arr.length > 0 ? arr : undefined) as T
  }
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const cleaned = clean(value)
      if (cleaned !== undefined && cleaned !== null && cleaned !== '') out[key] = cleaned
    }
    return (Object.keys(out).length > 0 ? out : undefined) as T
  }
  return input
}

export const ORGANIZATION_ID = `${absoluteUrl('/')}#organization`
export const WEBSITE_ID = `${absoluteUrl('/')}#website`

/**
 * A fundadora. É o elo entre gsrsistemas.com e sabrinamesquita.dev: com
 * founder + sameAs, o Google entende que as duas presenças são da mesma pessoa.
 */
export const FOUNDER_ID = `${absoluteUrl('/')}#sabrina-mesquita`

export const generateFounderSchema = () => ({
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: 'Sabrina Mesquita',
  jobTitle: 'Fundadora, designer de UI/UX e desenvolvedora web',
  url: 'https://sabrinamesquita.dev',
  image: absoluteUrl('/brand/sabrina-mesquita.webp'),
  sameAs: ['https://sabrinamesquita.dev'],
  worksFor: { '@id': ORGANIZATION_ID },
})

export const generateOrganizationSchema = (settings: SiteSettingsLike) => {
  const sameAs = (settings.socialProfiles ?? [])
    .map((p) => p?.url)
    .filter((url): url is string => Boolean(url))

  return clean({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: settings.companyName ?? undefined,
    legalName: settings.legalName ?? undefined,
    url: absoluteUrl('/'),
    description: settings.description ?? undefined,
    email: settings.email ?? undefined,
    telephone: settings.whatsapp ?? settings.phone ?? undefined,
    foundingDate: settings.foundingYear ? String(settings.foundingYear) : undefined,
    logo: settings.logo?.url
      ? { '@type': 'ImageObject', url: settings.logo.url }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    founder: { '@id': FOUNDER_ID },
    // Comunica atuação sem afirmar endereço físico.
    areaServed: { '@type': 'Country', name: 'Brasil' },
  })
}

/**
 * Só é emitido quando o endereço for confirmado como local de atendimento.
 * Enquanto isso, retorna null e o site fica só com Organization.
 */
export const generateLocalBusinessSchema = (settings: SiteSettingsLike) => {
  const address = settings.address
  if (!address?.isPhysicalLocation) return null
  if (!address.street || !address.city) return null

  return clean({
    '@type': 'ProfessionalService',
    '@id': `${absoluteUrl('/')}#localbusiness`,
    name: settings.companyName ?? undefined,
    url: absoluteUrl('/'),
    description: settings.description ?? undefined,
    telephone: settings.whatsapp ?? settings.phone ?? undefined,
    email: settings.email ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [address.street, address.number].filter(Boolean).join(', ') || undefined,
      addressLocality: address.city ?? undefined,
      addressRegion: address.state ?? undefined,
      postalCode: address.postalCode ?? undefined,
      addressCountry: address.country ?? 'BR',
    },
    geo:
      address.latitude && address.longitude
        ? { '@type': 'GeoCoordinates', latitude: address.latitude, longitude: address.longitude }
        : undefined,
    parentOrganization: { '@id': ORGANIZATION_ID },
  })
}

export const generateWebSiteSchema = (settings: SiteSettingsLike) =>
  clean({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: settings.companyName ?? undefined,
    description: settings.description ?? undefined,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORGANIZATION_ID },
  })

export const generateWebPageSchema = (input: {
  path: string
  name: string
  description?: string | null
  datePublished?: string | null
  dateModified?: string | null
}) =>
  clean({
    '@type': 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description ?? undefined,
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? undefined,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'pt-BR',
  })

export type BreadcrumbItem = { name: string; path: string }

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  if (items.length === 0) return null
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(items[items.length - 1].path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export const generateServiceSchema = (input: {
  name: string
  description?: string | null
  path: string
  areaServed?: string[]
}) =>
  clean({
    '@type': 'Service',
    '@id': `${absoluteUrl(input.path)}#service`,
    name: input.name,
    description: input.description ?? undefined,
    url: absoluteUrl(input.path),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: (input.areaServed ?? ['Brasil']).map((name) => ({ '@type': 'Place', name })),
  })

export const generateArticleSchema = (input: {
  title: string
  description?: string | null
  path: string
  image?: string | null
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string | null
}) =>
  clean({
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(input.path)}#article`,
    headline: input.title,
    description: input.description ?? undefined,
    url: absoluteUrl(input.path),
    image: input.image ?? undefined,
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? input.datePublished ?? undefined,
    author: { '@id': FOUNDER_ID },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'pt-BR',
  })

export const generateCreativeWorkSchema = (input: {
  name: string
  description?: string | null
  path: string
  image?: string | null
  datePublished?: string | null
}) =>
  clean({
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl(input.path)}#case`,
    name: input.name,
    description: input.description ?? undefined,
    url: absoluteUrl(input.path),
    image: input.image ?? undefined,
    datePublished: input.datePublished ?? undefined,
    creator: { '@id': ORGANIZATION_ID },
  })

/**
 * Opcional por página. O rich result de FAQ hoje é restrito a governo e saúde,
 * então isto é marcação por correção, não por expectativa de snippet.
 * Só chame quando o FAQ estiver visível e o texto for idêntico ao renderizado.
 */
export const generateFaqSchema = (faqs: { question: string; answer: string }[]) => {
  if (faqs.length === 0) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** Monta o @graph final, descartando o que veio nulo. */
export const buildGraph = (nodes: unknown[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})
