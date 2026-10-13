'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Animação de entrada no scroll.
 *
 * Implementada com IntersectionObserver em vez de biblioteca de animação. Uma
 * dependência como Framer Motion custaria dezenas de KB no cliente para fazer
 * o que aqui são ~40 linhas — e o briefing pede performance antes de efeito.
 *
 * Três cuidados que fazem diferença:
 *
 *  1. `prefers-reduced-motion` desliga tudo. Não é detalhe de acessibilidade:
 *     para quem tem sensibilidade vestibular, movimento involuntário causa
 *     mal-estar real.
 *  2. O elemento começa visível no HTML e só é escondido depois que o
 *     JavaScript assume. Sem JS, o conteúdo continua lá — nada de página em
 *     branco para o crawler ou para quem teve um erro de script.
 *  3. O observer é desconectado depois que dispara. Animação de entrada
 *     acontece uma vez; manter o observer vivo é custo à toa em scroll.
 */

type RevealProps = {
  children: React.ReactNode
  /** Atraso em ms, para escalonar itens de uma lista. */
  delay?: number
  /** Distância inicial. 'none' faz só o fade. */
  from?: 'bottom' | 'left' | 'none'
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

export const Reveal = ({
  children,
  delay = 0,
  from = 'bottom',
  className = '',
  as: Tag = 'div',
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }

    // Só a partir daqui o elemento passa a poder ficar escondido.
    setEnabled(true)

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      // Dispara um pouco antes de entrar na tela, para o movimento não parecer atrasado.
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const state = !enabled || visible ? 'is-visible' : 'is-hidden'

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${from} ${state} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
