'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Movimento do site inteiro, num lugar só.
 *
 * As páginas são Server Components e só marcam o que anima, por atributo:
 *
 *   data-split          título revelado linha a linha
 *   data-reveal         bloco que sobe e aparece ao entrar na tela
 *   data-reveal-stagger filhos diretos entram em sequência
 *   data-parallax="-8"  deslocamento vertical (yPercent) ligado à rolagem
 *
 * O HTML do servidor já vem com tudo visível. O estado inicial das animações
 * só é aplicado aqui, depois que o JavaScript assume: sem JS, ou com
 * prefers-reduced-motion, a página aparece inteira e parada.
 */
export const MotionProvider = () => {
  const pathname = usePathname()

  // Rolagem suave: uma instância para a vida da aba.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      anchors: { offset: -96 },
      // Deixa a vitrine de projetos (rolagem horizontal) receber o gesto lateral.
      allowNestedScroll: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  // Animações de entrada: refeitas a cada navegação.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ;(window as unknown as { __lenis?: Lenis }).__lenis?.scrollTo(0, { immediate: true })

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        const inHero = el.closest('[data-hero]')
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          delay: inHero ? 0.1 : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const inHero = el.closest('[data-hero]')
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          delay: inHero ? 0.3 + Number(el.dataset.reveal || 0) : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((el) => {
        gsap.from(el.children, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax) || -8,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [pathname])

  return null
}
