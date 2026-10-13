import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo/url'

/**
 * Sem Disallow de CSS ou JS: bloqueá-los impede o Google de renderizar a página.
 *
 * O robots.txt não protege nada — admin, API e preview têm autenticação ou token
 * próprio. Isto aqui é higiene de crawl.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.SITE_ENV === 'production'

  if (!isProduction) {
    // Preview e desenvolvimento nunca devem ser rastreados.
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/preview', '/obrigado'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
