'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ArrowIcon } from '@/components/ui'
import { LaptopFrame } from '@/components/ui/LaptopFrame'

gsap.registerPlugin(ScrollTrigger)

/**
 * Projetos da home, guiados pela rolagem da página.
 *
 * No desktop a seção fica fixa: cada trecho de rolagem corresponde a um
 * projeto. À esquerda, nome, tipo, resumo e o link para a página do projeto;
 * à direita, o mesmo notebook 3D do hero, que fecha até a metade e reabre com
 * a captura do próximo projeto.
 *
 * No celular (e com prefers-reduced-motion) não há fixação: os projetos ficam
 * empilhados, cada um com o notebook em CSS e o link.
 */

const Laptop3D = dynamic(() => import('./Laptop3D').then((m) => m.Laptop3D), { ssr: false })

export type ScrollProject = {
  slug: string
  title: string
  type: string
  summary?: string | null
  image?: string | null
}

export const ProjectsScroll = ({ projects }: { projects: ScrollProject[] }) => {
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      setPinned(true)
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.9 * projects.length}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => setActive(Math.min(projects.length - 1, Math.floor(self.progress * projects.length))),
      })
      return () => {
        trigger.current = null
        setPinned(false)
      }
    })
    return () => mm.revert()
  }, [projects.length])

  /** Clique na lista: rola até o trecho daquele projeto. */
  const goTo = (i: number) => {
    const st = trigger.current
    if (!st) return
    const y = st.start + ((st.end - st.start) * (i + 0.5)) / projects.length
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  if (projects.length === 0) return null
  const current = projects[active]

  return (
    <section id="portfolio" className="bg-ink-950 text-ink-300">
      {/* Desktop: palco fixo */}
      <div ref={root} className="hidden min-h-screen lg:block">
        <div className="container-page grid min-h-screen items-center gap-16 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-dark">projetos</p>
            <h2 className="mt-6 text-[2.75rem] leading-[1.06] text-white xl:text-[3.4rem]">Projetos reais, de clientes reais.</h2>

            {/* Projeto atual. A key força a animação de entrada a cada troca. */}
            <div key={current.slug} className="mt-14 animate-[fade-up_.6s_cubic-bezier(.22,1,.36,1)_both]">
              <p className="font-mono text-[0.82rem] text-accent-500">
                {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {current.type}
              </p>
              <h3 className="mt-3 text-[2.2rem] leading-tight tracking-tight text-white">{current.title}</h3>
              {current.summary ? <p className="mt-4 max-w-[46ch] text-lg text-ink-400">{current.summary}</p> : null}
              <Link href={`/portfolio/${current.slug}/`} className="btn btn-primary mt-8">
                Ver o projeto
                <ArrowIcon className="btn-arrow h-[18px] w-[18px]" />
              </Link>
            </div>

            {/* Índice: mostra onde a pessoa está e permite pular. */}
            <ol className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={`text-[0.92rem] transition-colors ${i === active ? 'text-white' : 'text-ink-500 hover:text-ink-200'}`}
                  >
                    <span className="mr-2 font-mono text-[0.75rem] text-accent-500">{String(i + 1).padStart(2, '0')}</span>
                    {p.title}
                  </button>
                </li>
              ))}
            </ol>
            <Link href="/portfolio/" className="group mt-8 inline-flex items-center gap-2 font-semibold text-accent-500 no-underline">
              <span className="underline-grow">Ver todos os projetos</span>
              <ArrowIcon className="arrow-slide h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-w-0" style={{ aspectRatio: '1.2 / 1' }}>
            {pinned ? (
              <div className="absolute inset-0">
              <Laptop3D
                screens={projects.map((p) => p.image ?? '/projetos/mcm-financiamentos.webp')}
                index={active}
                open
                onToggle={() => goTo(Math.min(projects.length - 1, active + 1))}
              />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Celular e tablet: lista empilhada */}
      <div className="container-page py-24 lg:hidden">
        <p className="eyebrow eyebrow-dark">projetos</p>
        <h2 className="mt-6 text-[2.1rem] leading-[1.08] text-white">Projetos reais, de clientes reais.</h2>
        <ul className="mt-14 grid gap-16">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/portfolio/${p.slug}/`} className="block no-underline">
                <LaptopFrame image={p.image} alt={`Site ${p.title}`} />
                <p className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.06em] text-accent-500">{p.type}</p>
                <h3 className="mt-2 text-[1.6rem] text-white">{p.title}</h3>
                {p.summary ? <p className="mt-2 text-ink-400">{p.summary}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/portfolio/" className="btn btn-outline mt-12 text-white">
          Ver todos os projetos
        </Link>
      </div>
    </section>
  )
}
