'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'

/**
 * Vitrine do hero: o notebook 3D com os projetos reais na tela.
 *
 * O 3D (three.js) só carrega no navegador e depois da página pronta. Até lá,
 * aparece a captura do projeto, então o hero nunca fica vazio, nem para quem
 * está sem JavaScript.
 */

const Laptop3D = dynamic(() => import('./Laptop3D').then((m) => m.Laptop3D), {
  ssr: false,
  loading: () => null,
})

export type ShowcaseProject = { name: string; image: string }

export const HeroShowcase = ({ projects }: { projects: ShowcaseProject[] }) => {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Chega fechado e abre sozinho, logo depois do título.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(t)
  }, [])

  const current = projects[index]
  if (!current) return null

  const select = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  return (
    <div className="relative">
      <div className="relative w-full" style={{ aspectRatio: "1.2 / 1" }}>
        {/* Captura estática até o 3D assumir. */}
        <div
          className={`absolute inset-x-[8%] top-[14%] aspect-[802/500] overflow-hidden rounded-xl border border-white/10 transition-opacity duration-700 ${
            ready ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden={ready}
        >
          <Image src={current.image} alt={`Site ${current.name}`} fill priority sizes="45vw" className="object-cover object-top" />
        </div>
        <div className="absolute inset-0">
          <Laptop3D
            screens={projects.map((p) => p.image)}
            index={index}
            open={open}
            onToggle={() => setOpen((v) => !v)}
            onReady={() => setReady(true)}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Escolha o projeto na tela">
          {projects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => select(i)}
              aria-pressed={i === index}
              className={`rounded-full border px-3.5 py-2 text-[0.85rem] transition-colors ${
                i === index
                  ? 'border-accent-500 bg-accent-500 text-[#04191c]'
                  : 'border-white/10 text-ink-300 hover:border-white/30 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 font-mono text-[0.78rem] text-ink-400 transition-colors hover:text-white"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          {open ? 'Clique ou arraste a tampa para fechar' : 'Clique para abrir o notebook'}
        </button>
      </div>
    </div>
  )
}
