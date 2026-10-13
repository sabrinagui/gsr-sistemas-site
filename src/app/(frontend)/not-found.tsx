import Link from 'next/link'
import type { Metadata } from 'next'

import { noIndexMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = noIndexMetadata('Página não encontrada')

/**
 * 404 útil, com HTTP 404 real.
 *
 * Sem redirect automático e sem tentar adivinhar "o conteúdo mais parecido" —
 * mandar quem procurava uma coisa para outra qualquer não ajuda ninguém, e
 * mascarar 404 com 200 é o erro que mais aparece em site feito como SPA.
 */
export default function NotFound() {
  const links = [
    { label: 'Início', href: '/' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <div className="container-page py-24 md:py-32">
      <p className="text-[0.85rem] font-semibold uppercase tracking-wider text-[--color-ink-500]">
        Erro 404
      </p>
      <h1 className="mt-3 text-3xl md:text-4xl">Esta página não existe</h1>
      <p className="mt-4 max-w-xl text-[--color-ink-500]">
        O endereço pode ter mudado ou o conteúdo pode ter sido removido. Abaixo estão os caminhos
        mais prováveis para o que você procurava.
      </p>

      <ul className="mt-8 flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block rounded-[--radius-md] border border-[--color-ink-200] px-4 py-2.5 text-[0.95rem] font-medium text-[--color-ink-800] no-underline hover:border-[--color-accent-600] hover:text-[--color-accent-600]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
