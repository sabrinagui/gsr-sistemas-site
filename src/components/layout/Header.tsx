import Image from 'next/image'
import Link from 'next/link'

import { HeaderShell } from './HeaderShell'
import { MobileMenu } from './MobileMenu'
import {
  getHeader,
  getNavServices,
  getPublishedCaseCount,
  getSiteSettings,
} from '@/lib/payload/queries'

/**
 * Server Component. O menu inteiro existe no HTML inicial: o crawler o vê sem
 * executar JavaScript, e quem está sem JS também navega.
 *
 * O cabeçalho é sempre escuro, para a logo branca original funcionar sem
 * versão alternativa. O painel de serviços mostra nome e uma linha do que é.
 */
export const Header = async () => {
  const [header, site, services, caseCount] = await Promise.all([
    getHeader(),
    getSiteSettings(),
    getNavServices(),
    getPublishedCaseCount(),
  ])

  const serviceItems = services.map((service) => ({
    label: service.shortTitle ?? service.title,
    url: `/${service.slug}/`,
    description: service.description ?? null,
  }))

  const showPortfolio = Boolean(site?.display?.showPortfolioInNav) && caseCount > 0

  const navItems = header?.navItems?.length
    ? header.navItems.map((item) => ({
        label: item.label,
        url: item.url,
        subItems: (item.subItems ?? []).map((sub) => ({
          label: sub.label,
          url: sub.url,
          description: sub.description ?? null,
        })),
      }))
    : [
        { label: 'Serviços', url: '/servicos/', subItems: serviceItems },
        ...(showPortfolio || caseCount > 0
          ? [{ label: 'Projetos', url: '/portfolio/', subItems: [] }]
          : []),
        { label: 'Sobre', url: '/sobre/', subItems: [] },
        { label: 'Blog', url: '/blog/', subItems: [] },
        { label: 'Contato', url: '/contato/', subItems: [] },
      ]

  const ctaLabel = header?.ctaLabel ?? 'Pedir orçamento'
  const ctaHref = header?.ctaHref ?? '/orcamento/'
  const companyName = site?.companyName ?? 'GSR Sistemas'

  return (
    <HeaderShell>
      <div className="container-page flex h-[4.75rem] items-center justify-between gap-8">
        <Link href="/" className="shrink-0" aria-label={`${companyName}, página inicial`}>
          <Image
            src="/brand/gsr-logo-branca.png"
            alt={companyName}
            width={665}
            height={139}
            priority
            className="h-[30px] w-auto"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.url} className="group relative">
                <Link
                  href={item.url}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.95rem] text-ink-400 no-underline transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                  {item.subItems.length > 0 ? (
                    <svg
                      aria-hidden="true"
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="mt-0.5 transition-transform duration-300 group-hover:rotate-180"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  ) : null}
                </Link>

                {item.subItems.length > 0 ? (
                  <div className="invisible absolute left-0 top-full z-20 translate-y-1.5 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="w-[26rem] rounded-2xl border border-white/[0.08] bg-ink-900 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
                      <ul>
                        {item.subItems.map((sub) => (
                          <li key={sub.url}>
                            <Link
                              href={sub.url}
                              className="block rounded-xl px-4 py-3 no-underline transition-colors hover:bg-white/[0.05]"
                            >
                              <span className="block font-medium text-white">{sub.label}</span>
                              {sub.description ? (
                                <span className="mt-0.5 line-clamp-1 block text-[0.85rem] text-ink-400">
                                  {sub.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-1 border-t border-white/[0.08] px-4 pb-2 pt-3">
                        <Link
                          href={item.url}
                          className="text-[0.9rem] font-medium text-accent-500 no-underline hover:text-accent-400"
                        >
                          Ver todos os serviços →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href={ctaHref} className="btn btn-primary btn-sm hidden sm:inline-flex">
            {ctaLabel}
            <svg aria-hidden="true" className="btn-arrow h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <MobileMenu navItems={navItems} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        </div>
      </div>
    </HeaderShell>
  )
}
