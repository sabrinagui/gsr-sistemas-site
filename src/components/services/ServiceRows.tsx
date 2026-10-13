'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ArrowIcon } from '@/components/ui'

export type ServiceRow = {
  slug: string
  title: string
  description?: string | null
  tags: string[]
  preview?: string | null
}

/**
 * Lista de serviços em linhas grandes. No mouse, uma prévia de projeto
 * daquele tipo segue o cursor sobre a lista. No toque, só as linhas.
 */
export const ServiceRows = ({ rows }: { rows: ServiceRow[] }) => {
  const list = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = list.current
    const preview = card.current
    if (!el || !preview) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(preview, { xPercent: -50, yPercent: -50 })
    const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' })
    const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      x(e.clientX - r.left)
      y(e.clientY - r.top)
    }
    el.addEventListener('mousemove', move)
    return () => el.removeEventListener('mousemove', move)
  }, [])

  const current = hovered !== null ? rows[hovered] : null

  return (
    <div ref={list} className="relative" onMouseLeave={() => setHovered(null)}>
      <ul className="border-t border-ink-200">
        {rows.map((row, i) => (
          <li key={row.slug} onMouseEnter={() => setHovered(i)}>
            <Link
              href={`/${row.slug}/`}
              className="group grid items-center gap-x-10 gap-y-4 border-b border-ink-200 py-10 no-underline md:grid-cols-[1.2fr_1fr_auto] md:py-14"
            >
              <span className="font-display text-[2.2rem] font-bold leading-[1.02] tracking-[-0.04em] text-ink-950 transition-[transform,color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 group-hover:text-accent-700 md:text-[3.4rem] xl:text-[4.2rem]">
                {row.title}
              </span>
              <span className="min-w-0">
                {row.description ? <span className="block text-lg text-ink-500">{row.description}</span> : null}
                {row.tags.length > 0 ? (
                  <span className="mt-4 flex flex-wrap gap-1.5">
                    {row.tags.map((t) => (
                      <span key={t} className="rounded-full bg-accent-50 px-2.5 py-1.5 font-mono text-[0.74rem] leading-none text-accent-700">
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
              <span className="go-circle max-md:hidden">
                <ArrowIcon className="h-5 w-5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Prévia que segue o cursor. Fica por cima, sem capturar o mouse. */}
        <div
          ref={card}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 z-10 hidden w-[340px] overflow-hidden rounded-2xl border-[6px] border-ink-950 bg-ink-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] transition-[opacity,scale] duration-300 lg:block ${
            current?.preview ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="relative aspect-[16/10]">
            {rows.map((row, i) =>
              row.preview ? (
                <Image
                  key={row.slug}
                  src={row.preview}
                  alt=""
                  fill
                  sizes="340px"
                  className={`object-cover object-top transition-opacity duration-300 ${hovered === i ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : null,
            )}
          </div>
        </div>
    </div>
  )
}
