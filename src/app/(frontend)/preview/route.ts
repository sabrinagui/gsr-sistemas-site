import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/**
 * Preview de rascunho.
 *
 * Valida o token, ativa o draft mode e manda para a rota real. A resposta da
 * página em preview leva X-Robots-Tag: noindex (next.config.ts) e /preview está
 * no Disallow do robots.txt.
 */
const pathFor = (collection: string, slug: string): string => {
  switch (collection) {
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    case 'posts':
      return `/blog/${slug}`
    case 'case-studies':
      return `/portfolio/${slug}`
    case 'services':
      return `/${slug}`
    case 'locations':
      return `/${slug}`
    default:
      return '/'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')

  const expected = process.env.PREVIEW_SECRET
  if (!expected || secret !== expected) {
    return new Response('Token de preview inválido.', { status: 401 })
  }
  if (!collection || !slug) {
    return new Response('Informe collection e slug.', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(pathFor(collection, slug))
}
