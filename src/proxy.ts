import { NextResponse, type NextRequest } from 'next/server'

import { goneUrls, queryRedirects } from '@/lib/redirects/static-redirects'

/**
 * Camada 3 do sistema de redirects.
 *
 * No Next 16 esta convenção passou a se chamar "proxy" — antes era "middleware".
 *
 * A camada 2 (next.config.ts) já resolveu o mapa de migração na build. Aqui
 * ficam duas coisas que ela não consegue fazer, ambas sem tocar o banco:
 *
 *  1. URLs não-canônicas do WordPress (/?p=121). Em next.config, a query string
 *     seria repassada ao destino e /?page_id=20 -> / entraria em loop.
 *  2. Respostas 410, que redirects() não sabe emitir.
 *
 * Os redirects criados no CMS NÃO são resolvidos aqui: o proxy roda em edge
 * runtime e não alcança o Postgres, e consultar por fetch a cada requisição
 * cobraria o custo no caminho feliz. Eles são resolvidos em src/lib/redirects/
 * resolve.ts, chamado pelo catch-all — ou seja, só quando a rota não corresponde
 * a nenhuma página existente.
 */

const GONE = new Set(goneUrls)

const normalize = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const path = normalize(pathname)

  // 1. URLs não-canônicas do WordPress. A query é descartada explicitamente.
  if (path === '/' && searchParams.size > 0) {
    for (const entry of queryRedirects) {
      if (searchParams.get(entry.key) === entry.value) {
        const url = new URL(entry.destination, request.url)
        url.search = ''
        return NextResponse.redirect(url, entry.permanent ? 301 : 302)
      }
    }
    // Busca interna do WP: nunca existiu no site novo, e não tem equivalente.
    if (searchParams.has('s')) {
      return NextResponse.rewrite(new URL('/404', request.url), { status: 404 })
    }
    // Páginas de anexo do WP.
    if (searchParams.has('attachment_id')) {
      return NextResponse.rewrite(new URL('/404', request.url), { status: 404 })
    }
  }

  // 2. Conteúdo removido de propósito. 410 sai do índice mais rápido que 404.
  if (GONE.has(path)) {
    return new NextResponse(null, { status: 410 })
  }

  // 3. Barra final, como no WordPress. O matcher já deixa de fora admin, API e
  //    arquivos (qualquer path com ponto), que não levam barra.
  if (!pathname.endsWith('/')) {
    // URL comum, não nextUrl.clone(): o NextURL reformata o path e removeria a barra.
    const url = new URL(request.url)
    url.pathname = `${pathname}/`
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  /**
   * O proxy não roda no admin, na API, em assets nem no sitemap. O caminho
   * feliz do site nunca paga o custo desta camada.
   */
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.).*)'],
}
