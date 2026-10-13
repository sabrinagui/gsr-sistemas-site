/**
 * Fonte única de URL absoluta do projeto.
 *
 * Regra verificável em revisão: buscar por "gsrsistemas.com" fora deste arquivo
 * e do .env não deve retornar nada. Canonical, sitemap, og:url, JSON-LD e links
 * internos passam todos por aqui — é o que garante a consistência exigida na
 * FASE 2.
 */

const FALLBACK_URL = 'https://gsrsistemas.com'

/** Origem sem barra final, sem www, sempre https. Paths levam barra final. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/+$/, '')

/**
 * Normaliza um path para a forma canônica: barra inicial e barra final, como no
 * WordPress. Arquivos (sitemap.xml, feed.xml) ficam sem barra.
 */
export const normalizePath = (path: string): string => {
  if (!path || path === '/') return '/'
  let result = path.trim().split('?')[0].split('#')[0]
  if (!result.startsWith('/')) result = `/${result}`
  if (!result.endsWith('/') && !/\.[a-z0-9]+$/i.test(result)) result = `${result}/`
  return result
}

export const absoluteUrl = (path = '/'): string => {
  const normalized = normalizePath(path)
  return normalized === '/' ? SITE_URL : `${SITE_URL}${normalized}`
}

/** Alias explícito para uso em canonical, para que a intenção fique legível no código. */
export const generateCanonical = (path: string): string => absoluteUrl(path)
