'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Como trabalhamos": a seção fica fixa enquanto a pessoa rola e, na moldura do
 * navegador, um site é construído em quatro etapas: estrutura, design, código
 * e publicado, com o resultado aparecendo no Google.
 *
 * No celular e com prefers-reduced-motion não há fixação: as etapas aparecem
 * todas abertas e a moldura mostra o resultado final.
 */

const STEPS = [
  {
    title: 'Estrutura',
    text: 'Entendemos o negócio e desenhamos o esqueleto: páginas, seções e o caminho até o contato.',
    url: 'rascunho · estrutura',
  },
  {
    title: 'Design',
    text: 'Você aprova o visual antes de uma linha de código. Nada de surpresa no final.',
    url: 'rascunho · design',
  },
  {
    title: 'Desenvolvimento',
    text: 'Código próprio, rápido e preparado para o Google, com entregas que você acompanha.',
    url: 'localhost:3000',
  },
  {
    title: 'No ar e no Google',
    text: 'Publicação, configuração do Google e suporte contínuo depois da entrega.',
    url: 'mcmfinanciamentos.com.br',
  },
]

const Sk = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`rounded ${className}`} style={style} />
)

const Wire = ({ design = false }: { design?: boolean }) => {
  const base = design ? 'bg-[#e8eef0]' : 'bg-[#dfe5e5]'
  const head = design ? 'bg-accent-600' : base
  const cta = design ? 'bg-accent-500' : base
  return (
    <div className={`grid h-full grid-rows-[auto_1fr_auto] gap-[8%] px-[7%] py-[5%] ${design ? 'bg-white' : 'bg-[#f4f6f6]'}`}>
      <div className="flex items-center justify-between">
        <Sk className={design ? 'bg-accent-800' : base} style={{ width: '16%', height: 14 }} />
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <Sk key={i} className={base} style={{ width: 46, height: 8 }} />
          ))}
        </div>
        <Sk className={cta} style={{ width: '12%', height: 20, borderRadius: 99 }} />
      </div>
      <div className="grid grid-cols-[1fr_0.8fr] items-center gap-[8%]">
        <div className="grid gap-2.5">
          <Sk className={head} style={{ height: 22, width: '90%' }} />
          <Sk className={head} style={{ height: 22, width: '70%' }} />
          <Sk className={base} style={{ height: 8, width: '85%', marginTop: 6 }} />
          <Sk className={base} style={{ height: 8, width: '65%' }} />
          <Sk className={cta} style={{ height: 26, width: '38%', marginTop: 10, borderRadius: 99 }} />
        </div>
        <Sk className={design ? 'rounded-xl bg-[#bfe3e8]' : base} style={{ aspectRatio: '4/3' }} />
      </div>
      <div className="grid grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((i) => (
          <Sk
            key={i}
            className={design ? 'bg-[#f1f5f6] shadow-[inset_0_0_0_1px_#dfe7e8]' : base}
            style={{ height: 44 }}
          />
        ))}
      </div>
    </div>
  )
}

export const ProcessScroll = () => {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(3)
      return
    }
    const mm = gsap.matchMedia(root)
    mm.add('(min-width: 1024px)', () => {
      gsap.set(['[data-pane="2"]', '[data-pane="3"]', '[data-pane="4"]'], { clipPath: 'inset(0 0 100% 0)' })
      gsap.set('[data-serp]', { y: 40, autoAlpha: 0 })
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=2600',
            pin: true,
            scrub: 1,
            onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4 * 0.999))),
          },
        })
        .to('[data-progress]', { scaleX: 1, ease: 'none', duration: 4 }, 0)
        .to('[data-pane="2"]', { clipPath: 'inset(0 0 0% 0)', ease: 'power2.inOut', duration: 0.8 }, 0.6)
        .to('[data-pane="3"]', { clipPath: 'inset(0 0 0% 0)', ease: 'power2.inOut', duration: 0.8 }, 1.6)
        .to('[data-pane="4"]', { clipPath: 'inset(0 0 0% 0)', ease: 'power2.inOut', duration: 0.8 }, 2.6)
        .to('[data-serp]', { y: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.6 }, 3.2)
    })
    mm.add('(max-width: 1023px)', () => setActive(-1))
    return () => mm.revert()
  }, [])

  const isOn = (i: number) => active === -1 || active === i

  return (
    <section id="processo" className="overflow-hidden bg-ink-950 text-ink-300">
      <div
        ref={root}
        className="container-page grid min-h-screen items-center gap-14 py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24"
      >
        <div className="min-w-0">
          <p className="eyebrow eyebrow-dark">como trabalhamos</p>
          <h2 className="mt-6 text-[2.1rem] leading-[1.08] text-white md:text-[2.75rem] xl:text-[3.4rem]">
            Um processo claro, sem surpresa no meio do caminho.
          </h2>
          <ol className="mt-12">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`grid grid-cols-[44px_1fr] gap-x-3 border-t border-white/10 py-5 transition-opacity duration-500 ${
                  isOn(i) ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <span className="font-mono text-[0.82rem] leading-[1.9] text-accent-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[1.35rem] font-semibold tracking-tight text-white">{step.title}</h3>
                <p
                  className={`col-start-2 overflow-hidden text-ink-400 transition-[max-height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                    isOn(i) ? 'max-h-32' : 'max-h-0'
                  }`}
                >
                  <span className="block pt-1.5">{step.text}</span>
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-5 hidden h-0.5 overflow-hidden rounded bg-white/10 lg:block">
            <i data-progress className="block h-full w-full origin-left scale-x-0 bg-accent-500" />
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1d21] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex h-9 items-center gap-[7px] border-b border-white/[0.06] px-3.5">
              {[0, 1, 2].map((i) => (
                <i key={i} className="h-[9px] w-[9px] rounded-full bg-white/20" />
              ))}
              <span className="ml-2.5 rounded-md bg-white/5 px-3 py-1 font-mono text-[0.74rem] text-ink-400">
                {STEPS[Math.max(0, active === -1 ? 3 : active)].url}
              </span>
            </div>
            <div className="relative aspect-[802/500] overflow-hidden bg-white">
              <div data-pane="1" className="absolute inset-0 max-lg:hidden">
                <Wire />
              </div>
              <div data-pane="2" className="absolute inset-0 max-lg:hidden">
                <Wire design />
              </div>
              <div
                data-pane="3"
                className="absolute inset-0 overflow-hidden whitespace-pre bg-[#0b1416] px-[6%] py-[5%] font-mono text-[clamp(0.6rem,1vw,0.85rem)] leading-[1.75] text-[#9fb3b6] max-lg:hidden"
              >
                <span className="text-[#536a6e]">{'// app/page.tsx'}</span>
                {'\n'}
                <span className="text-[#56c7d6]">export default async function</span>{' '}
                <span className="text-[#c7d5d6]">Home</span>() {'{'}
                {'\n  '}
                <span className="text-[#56c7d6]">const</span> taxas = <span className="text-[#56c7d6]">await</span>{' '}
                getTaxas()
                {'\n  '}
                <span className="text-[#56c7d6]">return</span> (
                {'\n    '}&lt;<span className="text-[#c7d5d6]">Hero</span>
                {'\n      '}titulo=<span className="text-[#e5c07b]">&quot;Financiamento Veicular Rápido e Fácil&quot;</span>
                {'\n      '}cta=<span className="text-[#e5c07b]">&quot;Fazer simulação&quot;</span>
                {'\n    '}/&gt;
                {'\n    '}&lt;<span className="text-[#c7d5d6]">Simulador</span> taxas={'{taxas}'} /&gt;
                {'\n    '}&lt;<span className="text-[#c7d5d6]">Depoimentos</span> origem=
                <span className="text-[#e5c07b]">&quot;google&quot;</span> /&gt;
                {'\n  '})
                {'\n}'}
              </div>
              <div data-pane="4" className="absolute inset-0">
                <Image
                  src="/projetos/mcm-financiamentos.webp"
                  alt="Site da MCM Financiamentos publicado"
                  fill
                  sizes="(max-width: 1024px) 90vw, 55vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
          <div
            data-serp
            aria-hidden="true"
            className="absolute -bottom-[8%] right-[-4%] z-10 w-[62%] rounded-xl bg-white px-4 py-3.5 font-[Arial,sans-serif] text-[#202124] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] max-lg:bottom-[4%] max-lg:right-[4%] max-lg:w-[80%]"
          >
            <small className="block text-[0.72rem] text-[#4d5156]">mcmfinanciamentos.com.br</small>
            <b className="my-1 block text-base font-normal text-[#1a0dab]">
              Financiamento Veicular Rápido e Fácil | MCM
            </b>
            <p className="text-[0.78rem] leading-[1.45] text-[#4d5156]">
              Realize o sonho do carro novo com as melhores taxas e condições de financiamento. Faça
              sua simulação…
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
