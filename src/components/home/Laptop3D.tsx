'use client'

import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Notebook em 3D, interativo.
 *
 * Montado com primitivas (sem arquivo .glb): carrega rápido e a tela recebe a
 * captura real do projeto como textura. A tampa gira pela dobradiça:
 *
 *   - ao carregar, o notebook chega fechado e abre sozinho;
 *   - clique em qualquer parte abre ou fecha;
 *   - no mouse, dá para arrastar a tampa e soltar: ela encaixa aberta ou fechada;
 *   - o conjunto acompanha o ponteiro com uma inclinação leve.
 *
 * A tela "liga" conforme a tampa abre: o brilho acompanha o ângulo.
 */

const OPEN = -0.32 // levemente inclinada para trás
const CLOSED = Math.PI / 2 // deitada sobre a base

const W = 3.2 // largura
const D = 2.15 // profundidade da base
const BASE_H = 0.1
const LID_H = 2.05
const LID_T = 0.055

const SPACE_GRAY = '#4a5257'

/** Teclado desenhado num canvas: uma textura só, nada de centenas de malhas. */
const useKeyboardTexture = () =>
  useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 420
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#16191b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const rows = [14, 14, 13, 12, 11]
    const pad = 14
    const keyH = (canvas.height - pad * 7) / 6
    ctx.fillStyle = '#0b0d0e'
    // Fileira de funções, mais baixa.
    for (let i = 0; i < 14; i++) {
      const kw = (canvas.width - pad * 15) / 14
      ctx.beginPath()
      ctx.roundRect(pad + i * (kw + pad), pad, kw, keyH * 0.6, 6)
      ctx.fill()
    }
    rows.forEach((count, r) => {
      const y = pad * 2 + keyH * 0.6 + r * (keyH + pad)
      const kw = (canvas.width - pad * (count + 1)) / count
      for (let i = 0; i < count; i++) {
        ctx.beginPath()
        ctx.roundRect(pad + i * (kw + pad), y, kw, keyH, 7)
        ctx.fill()
      }
    })
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])

type LaptopProps = {
  screens: string[]
  index: number
  open: boolean
  onToggle: () => void
  reducedMotion: boolean
  onReady?: () => void
}

const LaptopModel = ({ screens, index, open, onToggle, reducedMotion, onReady }: LaptopProps) => {
  const group = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshBasicMaterial>(null)
  const angle = useRef(reducedMotion ? OPEN : CLOSED)
  const drag = useRef<{ y: number; start: number } | null>(null)
  const target = useRef(open ? OPEN : CLOSED)

  // Todas as capturas carregam juntas: trocar de projeto não pisca.
  const textures = useTexture([...screens, '/brand/gsr-logo-branca.png'])
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  const logoTex = textures[textures.length - 1]
  const keyboard = useKeyboardTexture()

  // Só avisa que está pronto depois que as texturas chegaram e o primeiro
  // quadro foi desenhado: antes disso o canvas ainda está vazio.
  useEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => onReady?.())
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Troca de projeto: a tampa fecha até a metade, a tela apaga, a captura
  // troca e a tampa reabre. O índice exibido segue o pedido com atraso.
  const [shown, setShown] = useState(index)
  const screenTex = textures[Math.min(shown, screens.length - 1)]
  const openRef = useRef(open)
  openRef.current = open

  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (!openRef.current || reducedMotion) {
      setShown(index)
      return
    }
    target.current = 0.95
    const swap = setTimeout(() => setShown(index), 260)
    const reopen = setTimeout(() => {
      if (!drag.current && openRef.current) target.current = OPEN
    }, 330)
    return () => {
      clearTimeout(swap)
      clearTimeout(reopen)
    }
    // Só reage a um novo pedido de projeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (!drag.current) target.current = open ? OPEN : CLOSED
  }, [open])

  useFrame((state, delta) => {
    if (!lid.current || !group.current) return

    if (!drag.current) {
      angle.current = THREE.MathUtils.damp(angle.current, target.current, reducedMotion ? 100 : 3.2, delta)
    }
    lid.current.rotation.x = angle.current

    // A tela acende conforme abre (0 fechada, 1 aberta).
    const lit = THREE.MathUtils.clamp((CLOSED - angle.current) / (CLOSED - OPEN), 0, 1)
    if (screenMat.current) screenMat.current.color.setScalar(Math.pow(lit, 1.6))

    if (!reducedMotion) {
      const { x, y } = state.pointer
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.38 + x * 0.22, 2.5, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.06 - y * 0.06, 2.5, delta)
    }
  })

  const onLidDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType !== 'mouse') return
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = { y: e.clientY, start: angle.current }
    document.body.style.cursor = 'grabbing'
  }
  const onLidMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    const next = drag.current.start + (e.clientY - drag.current.y) * 0.008
    angle.current = THREE.MathUtils.clamp(next, OPEN - 0.05, CLOSED)
  }
  const onLidUp = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    const moved = Math.abs(e.clientY - drag.current.y) > 4
    drag.current = null
    document.body.style.cursor = 'grab'
    if (!moved) {
      onToggle()
      return
    }
    const shouldOpen = angle.current < (OPEN + CLOSED) / 2
    target.current = shouldOpen ? OPEN : CLOSED
    if (shouldOpen !== open) onToggle()
  }

  const aluminum = (
    <meshStandardMaterial color={SPACE_GRAY} metalness={0.75} roughness={0.32} envMapIntensity={1.1} />
  )

  return (
    <group ref={group} position={[0, -0.55, 0]} rotation={[0.06, -0.38, 0]}>
      {/* Base */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <RoundedBox args={[W, BASE_H, D]} radius={0.045} smoothness={4} position={[0, BASE_H / 2, 0]}>
          {aluminum}
        </RoundedBox>
        {/* Teclado */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASE_H + 0.002, -0.28]}>
          <planeGeometry args={[W * 0.86, 0.98]} />
          <meshStandardMaterial map={keyboard} roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Trackpad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASE_H + 0.002, 0.6]}>
          <planeGeometry args={[1.25, 0.72]} />
          <meshStandardMaterial color="#353b40" metalness={0.5} roughness={0.25} />
        </mesh>
      </group>

      {/* Tampa: o grupo fica na dobradiça (fundo da base) e gira em X. */}
      <group ref={lid} position={[0, BASE_H, -D / 2 + 0.02]}>
        <group
          onClick={(e) => {
            // No toque não há arraste: um toque na tampa abre ou fecha.
            if ((e.nativeEvent as PointerEvent).pointerType === 'mouse') return
            e.stopPropagation()
            onToggle()
          }}
          onPointerDown={onLidDown}
          onPointerMove={onLidMove}
          onPointerUp={onLidUp}
          onPointerOver={() => (document.body.style.cursor = 'grab')}
          onPointerOut={() => !drag.current && (document.body.style.cursor = '')}
        >
          <RoundedBox args={[W, LID_H, LID_T]} radius={0.03} smoothness={4} position={[0, LID_H / 2, 0]}>
            {aluminum}
          </RoundedBox>
          {/* Moldura preta */}
          <mesh position={[0, LID_H / 2, LID_T / 2 + 0.001]}>
            <planeGeometry args={[W - 0.08, LID_H - 0.08]} />
            <meshBasicMaterial color="#050607" />
          </mesh>
          {/* Tela com o projeto */}
          <mesh position={[0, LID_H / 2 + 0.02, LID_T / 2 + 0.002]}>
            <planeGeometry args={[W - 0.24, (W - 0.24) / 1.604]} />
            <meshBasicMaterial ref={screenMat} map={screenTex} toneMapped={false} />
          </mesh>
          {/* Logo GSR na parte de trás da tampa, girada para ler direito com o notebook fechado */}
          <mesh position={[0, LID_H / 2, -LID_T / 2 - 0.002]} rotation={[0, Math.PI, Math.PI]}>
            <planeGeometry args={[1.1, 1.1 * (139 / 665)]} />
            <meshBasicMaterial map={logoTex} transparent opacity={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export const Laptop3D = ({
  screens,
  index,
  open,
  onToggle,
  onReady,
}: {
  screens: string[]
  index: number
  open: boolean
  onToggle: () => void
  onReady?: () => void
}) => {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Fora da tela, o canvas para de desenhar: a rolagem do resto da página não paga o 3D.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.2, 6.3], fov: 28 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.45, 0)
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        {/* Contraluz teal: recorta a silhueta do notebook no fundo escuro. */}
        <directionalLight position={[-2, 3, -5]} intensity={1.1} color="#1aa6ba" />
        <Suspense fallback={null}>
          <LaptopModel
            screens={screens}
            index={index}
            open={open}
            onToggle={onToggle}
            reducedMotion={reducedMotion}
            onReady={onReady}
          />
        </Suspense>
        <ContactShadows position={[0, -0.56, 0]} opacity={0.55} scale={9} blur={2.6} far={2} />
        {/* Luz de estúdio gerada localmente: nenhum HDR baixado de CDN. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, -2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={1.4} position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer intensity={1.2} color="#1aa6ba" position={[5, 1, 0]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
        </Environment>
      </Canvas>
    </div>
  )
}
