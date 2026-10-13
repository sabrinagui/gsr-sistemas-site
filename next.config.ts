import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

import { staticRedirects } from './src/lib/redirects/static-redirects'

/** Domínio público do bucket R2. Sem ele, o next/image não otimiza a mídia do CMS. */
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
  : undefined

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  // Forma canônica com barra final, a mesma do WordPress. Mantém idênticas as
  // URLs que o Google já indexou (decisão de 13/10/2026, revisando a FASE 2).
  trailingSlash: true,
  // A barra final é aplicada pelo proxy só nas páginas do site. Sem isto, o
  // Next redirecionaria também /api e /admin do Payload, somando um salto a
  // cada chamada do painel.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: mediaHost ? [{ protocol: 'https', hostname: mediaHost }] : [],
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // O admin do Payload nunca deve ser indexado.
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/preview/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },

  // Camada 2 do sistema de redirects: o mapa de migração, resolvido na build.
  // A camada 3 (redirects criados no CMS) vive no proxy.
  async redirects() {
    return staticRedirects
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
