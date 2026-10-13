/**
 * GERADO AUTOMATICAMENTE — não editar à mão.
 * Fonte: docs/migration-url-map.csv
 * Regerar: npx tsx scripts/generate-redirects.ts
 *
 * Camada 2 do sistema de redirects: o mapa de migração, resolvido na build.
 * Todo destino aponta para a URL final que responde 200 — sem cadeia.
 *
 * Fora daqui, por decisão da FASE 2:
 *  - regras de host e esquema (www, http): vhost e DNS
 *  - endpoints do WordPress: reavaliados após o desligamento do WP
 */
import type { Redirect } from 'next/dist/lib/load-custom-routes'

export const staticRedirects: Redirect[] = [
  {
    source: '/category/sem-categoria/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2024/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2024/09/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2024/12/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2024/12/23/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2025/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2025/08/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/2025/11/',
    destination: '/blog/',
    statusCode: 301,
  },
  {
    source: '/feed/',
    destination: '/blog/feed.xml',
    statusCode: 301,
  },
  {
    source: '/sitemap_index.xml',
    destination: '/sitemap.xml',
    statusCode: 301,
  },
  {
    source: '/post-sitemap.xml',
    destination: '/sitemap.xml',
    statusCode: 301,
  },
  {
    source: '/page-sitemap.xml',
    destination: '/sitemap.xml',
    statusCode: 301,
  },
  {
    source: '/category-sitemap.xml',
    destination: '/sitemap.xml',
    statusCode: 301,
  },
  {
    source: '/author-sitemap.xml',
    destination: '/sitemap.xml',
    statusCode: 301,
  },
]

/**
 * URLs não-canônicas do WordPress (/?p=121, /?page_id=20).
 *
 * Não podem virar entradas de next.config: o Next repassa a query string ao
 * destino, então /?page_id=20 -> / entraria em loop. O proxy resolve e
 * descarta a query explicitamente.
 */
export const queryRedirects = [
  { key: 'p', value: '121', destination: '/2024/09/04/criacao-de-sites-por-que-ter-um-site-profissional-e-essencial-para-o-sucesso-do-seu-negocio/', permanent: true },
  { key: 'p', value: '142', destination: '/2024/09/04/as-principais-tendencias-em-criacao-de-sites-para-2024/', permanent: true },
  { key: 'p', value: '152', destination: '/2024/09/04/por-que-investir-no-desenvolvimento-de-sistemas-personalizados-para-o-seu-negocio/', permanent: true },
  { key: 'p', value: '780', destination: '/2024/12/23/criacao-de-sites-em-sao-luis/', permanent: true },
  { key: 'p', value: '801', destination: '/2025/08/14/7-erros-que-estao-matando-as-vendas-do-seu-site-e-como-corrigir-hoje/', permanent: true },
  { key: 'p', value: '805', destination: '/2025/08/14/como-um-site-otimizado-para-seo-local-pode-triplicar-seus-clientes-em-90-dias/', permanent: true },
  { key: 'p', value: '810', destination: '/2025/11/19/otimize-sua-gestao-por-que-todo-sistema-web-precisa-de-um-dashboard-profissional/', permanent: true },
  { key: 'page_id', value: '20', destination: '/', permanent: true },
  { key: 'page_id', value: '211', destination: '/blog/', permanent: true },
]

/** Removidas de propósito, sem equivalente. Aplicadas como 410 pelo proxy. */
export const goneUrls: string[] = [
  '/pagina-exemplo',
  '/e-floating-buttons/floating-08',
  '/e-floating-buttons/floating-08-2',
]
