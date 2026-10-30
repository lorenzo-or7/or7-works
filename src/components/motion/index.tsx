/**
 * Camada de integração dos efeitos aprovados no catálogo.
 * Os componentes originais ficam em ./vendor (código obtido das fontes oficiais, com licença no topo);
 * aqui eles recebem a paleta Glacier, a preferência "Reduzir movimento" e os fallbacks.
 */
import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { animate, useMotionValue, useReducedMotion, useTransform, motion } from 'motion/react'
import { usePreferences } from '@/app/preferences'
import { ACCENTS } from '@/design-system/accents'
import { cn } from '@/lib/cn'
import VendorBlurText from './vendor/BlurText'
import { GlowingEffect as VendorGlowingEffect } from './vendor/GlowingEffect'
import { MovingBorder } from './vendor/MovingBorder'
import VendorOrb from './vendor/Orb'
import VendorShinyText from './vendor/ShinyText'

const SparklesCore = lazy(() => import('./vendor/Sparkles').then((m) => ({ default: m.SparklesCore })))

export function useMotionReduced() {
  const os = useReducedMotion()
  const { motion: pref } = usePreferences()
  return pref === 'reduce' || !!os
}

/** Cores reais (hex) do tema atual — necessárias para efeitos que pintam em canvas/gradiente. */
export function useThemeColors() {
  const { resolvedTheme, accent } = usePreferences()
  const a = ACCENTS.find((x) => x.id === accent) ?? ACCENTS[0]
  return resolvedTheme === 'dark'
    ? { text: '#EDF3F7', muted: '#A5B6C5', accent: a.dark, surface: '#1B2632', bg: '#101720' }
    : { text: '#202C39', muted: '#586878', accent: a.light, surface: '#FFFFFF', bg: '#F5F7F8' }
}

function usePointerFine() {
  const [fine, setFine] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches)
  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)')
    const on = () => setFine(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return fine
}

const webgl2 = (() => {
  let cached: boolean | null = null
  return () => {
    if (cached !== null) return cached
    try {
      cached = !!document.createElement('canvas').getContext('webgl2')
    } catch {
      cached = false
    }
    return cached
  }
})()

/* ───────── Orb (React Bits) ───────── */

/**
 * Orb original em WebGL2 com a paleta Glacier. Com movimento reduzido, fica parado
 * (um quadro renderizado). Sem WebGL2, cai para um anel estático em CSS.
 */
export function OrbBackground({ className, background = '#0B1118' }: { className?: string; background?: string }) {
  const reduced = useMotionReduced()
  const supported = useMemo(webgl2, [])
  if (!supported) {
    return (
      <div aria-hidden data-orb="fallback" className={cn('pointer-events-none', className)}>
        <div className="absolute inset-[18%] rounded-full shadow-[inset_0_0_60px_10px_rgba(145,194,222,0.45),0_0_80px_-10px_rgba(53,106,136,0.6)]" />
      </div>
    )
  }
  return (
    <div aria-hidden data-orb="webgl" className={className}>
      <VendorOrb
        colors={['#91C2DE', '#4C8FB3', '#16324A']}
        backgroundColor={background}
        glow={1.15}
        hoverIntensity={0.8}
        speed={0.75}
        paused={reduced}
        intro={!reduced}
      />
    </div>
  )
}

/* ───────── Sparkles (Aceternity / Manu Arora) ───────── */

export function Sparkles({ className, density = 70, color }: { className?: string; density?: number; color?: string }) {
  const reduced = useMotionReduced()
  const theme = useThemeColors()
  if (reduced) return null
  return (
    <div aria-hidden data-sparkles className={cn('pointer-events-none', className)}>
      <Suspense fallback={null}>
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.6}
          speed={2.4}
          particleDensity={density}
          particleColor={color ?? theme.accent}
          className="h-full w-full"
        />
      </Suspense>
    </div>
  )
}

/* ───────── Blur Text / Shiny Text (React Bits) ───────── */

export function BlurText({ text, className, delay = 110 }: { text: string; className?: string; delay?: number }) {
  const reduced = useMotionReduced()
  if (reduced) return <span className={className}>{text}</span>
  return <VendorBlurText text={text} className={className} delay={delay} animateBy="words" direction="top" trigger="load" />
}

export function ShinyText({
  children,
  className,
  trigger = 'view',
  delay = 4,
  tone = 'text',
  onDark = false,
}: {
  children: ReactNode
  className?: string
  trigger?: 'loop' | 'view' | 'hover'
  delay?: number
  tone?: 'text' | 'muted'
  /** Força a paleta escura (ex.: painel editorial do login, sempre escuro). */
  onDark?: boolean
}) {
  const reduced = useMotionReduced()
  const { resolvedTheme } = usePreferences()
  const themed = useThemeColors()
  const c = onDark ? { text: '#EDF3F7', muted: '#A5B6C5', accent: '#91C2DE' } : themed
  const dark = onDark || resolvedTheme === 'dark'
  return (
    <VendorShinyText
      color={tone === 'muted' ? c.muted : c.text}
      shineColor={dark ? '#91C2DE' : c.accent}
      speed={2.4}
      delay={delay}
      shineWidth={36}
      trigger={trigger}
      disabled={reduced}
      className={className}
    >
      {children}
    </VendorShinyText>
  )
}

/* ───────── Glowing Effect (Aceternity) ───────── */

/** Só com ponteiro fino (mouse) e sem movimento reduzido; o pai precisa de `relative`. */
export function GlowingEffect() {
  const reduced = useMotionReduced()
  const fine = usePointerFine()
  return (
    <VendorGlowingEffect
      disabled={reduced || !fine}
      spread={42}
      glow={false}
      proximity={48}
      inactiveZone={0.05}
      borderWidth={2}
      movementDuration={1.4}
    />
  )
}

/* ───────── Moving Border (Aceternity) ───────── */

export function MovingBorderFrame({ children, className, duration = 3200 }: { children: ReactNode; className?: string; duration?: number }) {
  const reduced = useMotionReduced()
  return (
    <span className={cn('relative inline-flex overflow-hidden rounded-[11px] p-[1.5px]', className)}>
      {!reduced && (
        <span className="absolute inset-0" style={{ borderRadius: 'inherit' }} aria-hidden>
          <MovingBorder duration={duration} rx="12%" ry="40%">
            <span className="block size-16 bg-[radial-gradient(var(--accent)_40%,transparent_60%)] opacity-90" />
          </MovingBorder>
        </span>
      )}
      <span className={cn('relative inline-flex rounded-[10px]', reduced && 'ring-1 ring-accent')}>{children}</span>
    </span>
  )
}

/* ───────── Ripple (Magic UI) ───────── */

type Ripple = { x: number; y: number; size: number; key: number }

/** Mesma geometria do Ripple Button original: círculo do tamanho do maior lado, centrado no toque. */
export function useRipple(duration = 600) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const reduced = useMotionReduced()
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const key = performance.now()
    setRipples((r) => [...r, { x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size, key }])
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.key !== key)), duration)
  }
  const layer = (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {ripples.map((r) => (
        <span
          key={r.key}
          className="absolute rounded-full bg-current opacity-30"
          style={{
            width: r.size,
            height: r.size,
            top: r.y,
            left: r.x,
            transform: 'scale(0)',
            animation: `rippling ${duration}ms ease-out`,
          }}
        />
      ))}
    </span>
  )
  return { onPointerDown, layer }
}

/* ───────── Counting Number (Animate UI) ───────── */

/** Anima até um número REAL. Nunca usar para indicadores sem dados. */
export function CountingNumber({ value, className }: { value: number; className?: string }) {
  const reduced = useMotionReduced()
  const mv = useMotionValue(reduced ? value : 0)
  const rounded = useTransform(mv, (v) => Math.round(v).toString())
  useEffect(() => {
    if (reduced) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { type: 'spring', stiffness: 90, damping: 22 })
    return () => controls.stop()
  }, [value, reduced, mv])
  return <motion.span className={cn('tabular', className)}>{rounded}</motion.span>
}

/* ───────── Progress (Animate UI) ───────── */

export function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  const reduced = useMotionReduced()
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 overflow-hidden rounded-full bg-sunken', className)}
    >
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: reduced ? `${value}%` : '0%' }}
        animate={{ width: `${value}%` }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  )
}
