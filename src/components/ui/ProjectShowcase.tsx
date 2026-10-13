'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { LaptopFrame } from './LaptopFrame'

/**
 * Vitrine de projetos em perspectiva.
 *
 * Os projetos aparecem dentro de laptops numa esteira horizontal: o do centro
 * fica de frente, os laterais giram em profundidade. A rotação é calculada a
 * partir da distância de cada item até o centro da esteira, então acompanha o
 * scroll de forma contínua — não é um carrossel de três estados.
 *
 * Decisões que sustentam isso:
 *
 *  - Rolagem nativa com scroll-snap, não uma esteira controlada por JavaScript.
 *    Ganha inércia no trackpad, arrasto no toque e navegação por teclado de
 *    graça, e continua funcionando se o script falhar.
 *  - O cálculo roda dentro de requestAnimationFrame. Ler layout a cada evento
 *    de scroll causa reflow síncrono e trava a rolagem no celular.
 *  - Com prefers-reduced-motion, nada gira: vira uma lista horizontal comum.
 *  - Sem JavaScript, os itens aparecem lado a lado, sem transformação. O
 *    conteúdo e os links estão no HTML inicial de qualquer forma.
 */

type Project = {
  id: string | number
  slug: string
  title: string
  summary?: string | null
  industry?: string | null
  projectType?: string | null
  image?: string | null
  imageAlt?: string | null
}

const TYPE_LABELS: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  app: 'Aplicativo',
}

/** Quanto o item lateral gira e encolhe no extremo do cálculo. */
const MAX_ROTATION = 34
const MIN_SCALE = 0.82
const MIN_OPACITY = 0.38

export const ProjectShowcase = ({ projects }: { projects: Project[] }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])
  const frameRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [motion, setMotion] = useState(false)

  /** Aplica rotação, escala e opacidade conforme a distância até o centro. */
  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const trackRect = track.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2

    let closest = 0
    let closestDistance = Infinity

    itemsRef.current.forEach((item, index) => {
      if (!item) return

      const rect = item.getBoundingClientRect()
      const itemCenter = rect.left + rect.width / 2

      // -1 na borda esquerda, 0 no centro, 1 na borda direita.
      const offset = (itemCenter - center) / (trackRect.width / 2)
      const clamped = Math.max(-1, Math.min(1, offset))
      const distance = Math.abs(clamped)

      if (distance < closestDistance) {
        closestDistance = distance
        closest = index
      }

      // O sinal inverte para que o item da esquerda gire "para dentro".
      const rotation = -clamped * MAX_ROTATION
      const scale = 1 - distance * (1 - MIN_SCALE)
      const opacity = 1 - distance * (1 - MIN_OPACITY)

      item.style.transform = `perspective(1600px) rotateY(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`
      item.style.opacity = opacity.toFixed(3)
      item.style.zIndex = String(100 - Math.round(distance * 100))
    })

    setActive(closest)
    frameRef.current = null
  }, [])

  const onScroll = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(update)
  }, [update])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    setMotion(true)
    update()

    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onScroll)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [onScroll, update])

  const scrollToIndex = (index: number) => {
    const item = itemsRef.current[index]
    if (!item) return
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const go = (direction: -1 | 1) => {
    const next = Math.max(0, Math.min(projects.length - 1, active + direction))
    scrollToIndex(next)
  }

  if (projects.length === 0) return null

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={motion ? onScroll : undefined}
        /**
         * O recuo lateral é metade do espaço que sobra ao lado de um item, para
         * que o primeiro e o último também consigam chegar ao centro da esteira:
         * (100vw - largura do item) / 2, em cada breakpoint.
         */
        className="hide-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain px-[11vw] pb-6 pt-4 sm:px-[19vw] md:gap-14 md:px-[28vw] lg:px-[33vw]"
        style={motion ? { transformStyle: 'preserve-3d' } : undefined}
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            ref={(node) => {
              itemsRef.current[index] = node
            }}
            className="w-[78vw] shrink-0 snap-center [backface-visibility:hidden] [will-change:transform,opacity] sm:w-[62vw] md:w-[44vw] lg:w-[34vw]"
          >
            <Link href={`/portfolio/${project.slug}`} className="group block no-underline">
              <LaptopFrame
                kind={(project.projectType as never) ?? 'site'}
                image={project.image}
                alt={project.imageAlt ?? ''}
                priority={index === 0}
              />

              <div className="mt-7 px-1">
                <p className="text-[0.78rem] uppercase tracking-wider text-ink-500">
                  {TYPE_LABELS[project.projectType ?? ''] ?? project.projectType}
                  {project.industry ? ` · ${project.industry}` : ''}
                </p>
                <h3 className="mt-2 text-xl text-white">
                  <span className="underline-grow">{project.title}</span>
                </h3>
                {project.summary ? (
                  <p className="mt-2 line-clamp-2 text-ink-400">{project.summary}</p>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.925rem] font-semibold text-accent-500">
                  Ver projeto
                  <span aria-hidden="true" className="arrow-slide">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Controles. Existem para quem não vai arrastar — e dão foco por teclado. */}
      {projects.length > 1 ? (
        <div className="container-page mt-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2" aria-hidden="true">
            {projects.map((project, index) => (
              <span
                key={project.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === active ? 'w-8 bg-accent-500' : 'w-3 bg-ink-700'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={active === 0}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-ink-700 text-white transition-colors hover:border-ink-500 hover:bg-ink-900 disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:bg-transparent"
            >
              <span className="sr-only">Projeto anterior</span>
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={active === projects.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-ink-700 text-white transition-colors hover:border-ink-500 hover:bg-ink-900 disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:bg-transparent"
            >
              <span className="sr-only">Próximo projeto</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
