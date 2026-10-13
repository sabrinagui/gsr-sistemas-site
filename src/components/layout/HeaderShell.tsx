'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Comportamento do cabeçalho: ganha borda depois do topo, some ao descer e
 * volta ao subir. Sem backdrop-filter de propósito: o desfoque recalcula a
 * área inteira por trás a cada quadro e fazia a vitrine 3D tremer na rolagem.
 * O conteúdo é renderizado no servidor e chega por children.
 */
export const HeaderShell = ({ children }: { children: React.ReactNode }) => {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 24)
      setHidden(y > 480 && y > last.current && !document.documentElement.classList.contains('menu-open'))
      last.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        solid
          ? 'border-white/[0.08] bg-ink-950/[0.97]'
          : 'border-transparent bg-ink-950'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {children}
    </header>
  )
}
