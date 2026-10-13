'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavItem = {
  label: string
  url: string
  subItems?: { label: string; url: string }[] | null
}

/**
 * Único Client Component do cabeçalho, e só pelo comportamento de abrir e fechar.
 * O conteúdo do menu chega por props, já renderizado no servidor.
 */
export const MobileMenu = ({
  navItems,
  ctaLabel,
  ctaHref,
}: {
  navItems: NavItem[]
  ctaLabel: string
  ctaHref: string
}) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
      >
        <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" fill="none">
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <div
        id="menu-mobile"
        className={`fixed inset-x-0 top-[4.75rem] h-[calc(100dvh-4.75rem)] overflow-y-auto bg-ink-950 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? 'visible [clip-path:inset(0_0_0_0)]' : 'invisible [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <nav aria-label="Navegação principal" className="container-page py-8">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.url} className="border-b border-white/[0.08]">
                <Link
                  href={item.url}
                  className="block py-4 font-display text-[2rem] font-bold tracking-tight text-white no-underline"
                >
                  {item.label}
                </Link>
                {item.subItems && item.subItems.length > 0 ? (
                  <ul className="mb-4 flex flex-col">
                    {item.subItems.map((sub) => (
                      <li key={sub.url}>
                        <Link href={sub.url} className="block py-2 text-[1.05rem] text-ink-400 no-underline">
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href={ctaHref} className="btn btn-primary mt-8 w-full">
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </div>
  )
}
