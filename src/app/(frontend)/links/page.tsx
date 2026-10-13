import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ArrowIcon, GoogleIcon, WhatsAppIcon } from '@/components/ui'
import { whatsappLink } from '@/lib/contact'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * /links/ — o "link na bio" do Instagram. Mesma URL do WordPress.
 * noindex, follow: serve a quem chega pelo Instagram, não à busca.
 */

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Links', path: '/links/', noIndex: true })
}

export default async function LinksPage() {
  const site = await getSiteSettings()
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const links = [
    ...(whatsapp ? [{ label: 'Pedir orçamento pelo WhatsApp', href: whatsapp, external: true, icon: <WhatsAppIcon /> }] : []),
    { label: 'Ver projetos', href: '/portfolio/' },
    { label: 'Serviços', href: '/servicos/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Avaliações no Google', href: 'https://www.google.com/search?q=GSR+Sistemas+S%C3%A3o+Lu%C3%ADs', external: true, icon: <GoogleIcon /> },
    { label: 'Portfólio de Sabrina Mesquita', href: 'https://sabrinamesquita.dev', external: true },
  ]

  return (
    <section data-hero className="min-h-[calc(100dvh-4.75rem)] bg-ink-950 py-16">
      <div className="mx-auto w-full max-w-md px-5 text-center">
        <span className="relative mx-auto block h-24 w-24 overflow-hidden rounded-full border border-accent-500/40 bg-ink-800">
          <Image src="/brand/gsr-icone.png" alt="GSR Sistemas" fill sizes="96px" className="object-cover" priority />
        </span>
        <h1 className="mt-6 text-[1.8rem] text-white">GSR Sistemas</h1>
        <p className="mt-2 text-ink-400">Sites e sistemas sob medida para todo o Brasil</p>
        <ul className="mt-10 grid gap-3" data-reveal-stagger>
          {links.map((link, i) => {
            const cls = `group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 font-medium no-underline transition-colors ${
              i === 0 ? 'border-accent-500 bg-accent-500 text-[#04191c]' : 'border-white/10 text-white hover:border-white/30'
            }`
            const inner = (
              <>
                <span className="flex items-center gap-3">
                  {link.icon}
                  {link.label}
                </span>
                <ArrowIcon className="arrow-slide h-4 w-4" />
              </>
            )
            return (
              <li key={link.label}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={link.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
