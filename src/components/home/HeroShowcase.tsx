'use client'

import dynamic from 'next/dynamic'
import { preload } from 'react-dom'
import { useEffect, useState } from 'react'

import { LaptopFrame } from '@/components/ui/LaptopFrame'

/**
 * Vitrine do hero: o notebook 3D com os projetos reais na tela.
 *
 * O 3D (three.js) só roda no navegador. Ele entra com fade quando o primeiro
 * quadro já foi desenhado, chega fechado e abre sozinho. Sem mockup
 * intermediário: o notebook em CSS fica só para quem está sem JavaScript.
 */

const loadLaptop3D = () => import('./Laptop3D').then((m) => m.Laptop3D)

// Começa a baixar o three.js assim que este módulo roda, sem esperar a
// hidratação da página terminar.
if (typeof window !== 'undefined') void loadLaptop3D()

const Laptop3D = dynamic(loadLaptop3D, { ssr: false, loading: () => null })

const LOGO = '/brand/gsr-logo-branca.png'

export type ShowcaseProject = { name: string; image: string }

export const HeroShowcase = ({ projects }: { projects: ShowcaseProject[] }) => {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Abre sozinho logo depois de aparecer, para a abertura ser vista.
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setOpen(true), 350)
    return () => clearTimeout(t)
  }, [ready])

  // As texturas entram no <head> como preload e baixam junto com a página,
  // em paralelo ao three.js. crossOrigin igual ao do TextureLoader, senão o
  // navegador baixa de novo.
  for (const src of [...projects.map((p) => p.image), LOGO]) {
    preload(src, { as: 'image', crossOrigin: 'anonymous' })
  }

  const current = projects[index]
  if (!current) return null

  const select = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  return (
    <div className="relative">
      <div className="relative w-full" style={{ aspectRatio: "1.2 / 1" }}>
        <noscript>
          <div className="absolute inset-x-[12%] top-[18%]">
            <LaptopFrame image={current.image} alt={`Site ${current.name}`} />
          </div>
        </noscript>
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Laptop3D
            screens={projects.map((p) => p.image)}
            index={index}
            open={open}
            onToggle={() => setOpen((v) => !v)}
            onReady={() => setReady(true)}
          />
        </div>
      </div>

      {/* Controles discretos: abrir e fechar à esquerda, projeto na tela à direita. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2.5 font-mono text-[0.78rem] text-ink-400 transition-colors hover:text-white"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          {open ? 'Clique ou arraste a tampa para fechar' : 'Clique para abrir o notebook'}
        </button>
        {projects.length > 1 ? (
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Escolha o projeto na tela">
          {projects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => select(i)}
              aria-pressed={i === index}
              className={`rounded-full px-3 py-1.5 text-[0.8rem] transition-colors ${
                i === index ? 'bg-white/10 text-white' : 'text-ink-500 hover:text-ink-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        ) : null}
      </div>
    </div>
  )
}
