import Image from 'next/image'
import Link from 'next/link'

import { formatBrazilianPhone, whatsappLink } from '@/lib/contact'
import { getFooter, getNavServices, getSiteSettings } from '@/lib/payload/queries'

/**
 * Rodapé escuro, com a assinatura "Uma empresa de Sabrina Mesquita" ligando a
 * GSR ao site pessoal da fundadora.
 *
 * Endereço completo só aparece quando confirmado como local de atendimento.
 */
export const Footer = async () => {
  const [footer, site, services] = await Promise.all([
    getFooter(),
    getSiteSettings(),
    getNavServices(),
  ])

  const year = new Date().getFullYear()
  const address = site?.address
  const showAddress = Boolean(address?.isPhysicalLocation && address?.showAddressOnSite)
  const companyName = site?.companyName ?? 'GSR Sistemas'
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null

  const columns = footer?.columns?.length
    ? footer.columns.map((c) => ({ title: c.title, links: c.links ?? [] }))
    : [
        {
          title: 'Serviços',
          links: services.map((s) => ({ label: s.shortTitle ?? s.title, url: `/${s.slug}/` })),
        },
        {
          title: 'Empresa',
          links: [
            { label: 'Projetos', url: '/portfolio/' },
            { label: 'Sobre', url: '/sobre/' },
            { label: 'Blog', url: '/blog/' },
            { label: 'Contato', url: '/contato/' },
            { label: 'Pedir orçamento', url: '/orcamento/' },
          ],
        },
      ]

  const linkClass = 'text-[0.95rem] text-ink-300 no-underline transition-colors hover:text-accent-500'

  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="container-page grid gap-12 border-t border-white/[0.08] py-20 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/gsr-logo-branca.png"
            alt={companyName}
            width={665}
            height={139}
            className="h-[34px] w-auto"
          />
          <p className="mt-6 max-w-xs text-[0.95rem] text-ink-400">
            {footer?.description ??
              'Criação de sites, lojas virtuais e sistemas sob medida para empresas de todo o Brasil.'}
          </p>
          <a
            href="https://sabrinamesquita.dev"
            target="_blank"
            rel="noopener"
            className="group mt-8 inline-flex items-center gap-3 no-underline"
          >
            <span className="relative h-11 w-11 overflow-hidden rounded-full bg-ink-800">
              <Image
                src="/brand/sabrina-mesquita.webp"
                alt=""
                fill
                sizes="44px"
                className="object-cover object-top"
              />
            </span>
            <span className="text-[0.92rem] text-ink-400">
              Uma empresa de{' '}
              <span className="border-b border-accent-500 font-medium text-white transition-colors group-hover:text-accent-500">
                Sabrina Mesquita
              </span>
            </span>
          </a>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-mono text-[0.74rem] font-medium uppercase tracking-[0.08em] text-ink-500">
              {column.title}
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="font-mono text-[0.74rem] font-medium uppercase tracking-[0.08em] text-ink-500">
            Contato
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {whatsapp && site?.whatsapp ? (
              <li>
                <a href={whatsapp} rel="noopener noreferrer" target="_blank" className={linkClass}>
                  WhatsApp {formatBrazilianPhone(site.whatsapp)}
                </a>
              </li>
            ) : null}
            {site?.email ? (
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            ) : null}
            <li className="text-[0.95rem] text-ink-400">
              {showAddress
                ? [address?.street, address?.number, address?.neighborhood, address?.city]
                    .filter(Boolean)
                    .join(', ')
                : 'Atendimento em todo o Brasil'}
            </li>
            {(site?.socialProfiles ?? []).map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={`${linkClass} capitalize`}
                >
                  {profile.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-white/[0.08] py-7 text-[0.85rem] text-ink-500 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {footer?.copyrightText ?? 'GSR Sistemas. Todos os direitos reservados.'}
          {footer?.showCnpj && site?.cnpj ? ` · CNPJ ${site.cnpj}` : ''}
        </p>
        <p>Design e desenvolvimento por Sabrina Mesquita</p>
      </div>

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm4.5 11.96c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.04 4.8 4.8 0 0 0 1 2.53 11 11 0 0 0 4.2 3.7c1.57.68 2.18.74 2.96.62.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.29Z" />
          </svg>
        </a>
      ) : null}
    </footer>
  )
}
