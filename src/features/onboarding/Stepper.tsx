/**
 * Indicador de etapas do onboarding — mecânica do React Bits Stepper
 * (https://reactbits.dev/components/stepper, MIT + Commons Clause, © David Haz):
 * trilho ("well") com um "tile" que desliza até a etapa ativa usando a mesma curva de mola `linear()`,
 * selos numerados com estados ativo/concluído e check desenhado por stroke-dash em 360 ms.
 * Diferenças: tema Glacier no lugar do tema zinc; ícones Lucide no lugar de Hugeicons; estado
 * controlado pelo store de onboarding já existente (persistência preservada).
 */
import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useMotionReduced } from '@/components/motion'
import { ONBOARDING_STEPS, type OnboardingStepId } from './onboarding-store'

const SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function DrawnCheck({ animate }: { animate: boolean }) {
  const ref = useRef<SVGPathElement>(null)
  useLayoutEffect(() => {
    const path = ref.current
    if (!path || !animate || typeof path.animate !== 'function') return
    path.style.strokeDasharray = '24'
    path.animate([{ strokeDashoffset: 24 }, { strokeDashoffset: 0 }], { duration: 360, easing: SETTLE })
  }, [animate])
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path ref={ref} d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function Stepper({
  current,
  completed,
  onJump,
}: {
  current: number
  completed: OnboardingStepId[]
  onJump: (i: number) => void
}) {
  const reduced = useMotionReduced()
  const trackRef = useRef<HTMLOListElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [tile, setTile] = useState<{ x: number; w: number; ready: boolean }>({ x: 0, w: 0, ready: false })

  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[current]
      if (!el) return
      setTile((t) => ({ x: el.offsetLeft, w: el.offsetWidth, ready: t.ready || t.w > 0 }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [current])

  return (
    <ol
      ref={trackRef}
      aria-label="Etapas da configuração"
      className="relative flex gap-1 rounded-2xl bg-sunken p-1 shadow-[inset_0_0_0_1px_var(--border)]"
    >
      {/* Tile que desliza (glider) */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-xl bg-surface shadow-[inset_0_0_0_1px_var(--border),0_1px_0_rgb(255_255_255/0.6)_inset,0_6px_14px_-8px_rgb(16_23_32/0.3)]"
        style={{
          width: tile.w,
          transform: `translateX(${tile.x}px)`,
          opacity: tile.w ? 1 : 0,
          transition: tile.ready && !reduced ? 'transform 560ms var(--spring), width 560ms var(--spring), opacity 200ms ease' : 'none',
        }}
      />
      {ONBOARDING_STEPS.map((s, i) => {
        const done = completed.includes(s.id)
        const active = i === current
        const reachable = done || i <= current || completed.includes(ONBOARDING_STEPS[Math.max(0, i - 1)].id)
        const status = active ? 'active' : done ? 'complete' : 'idle'
        return (
          <li key={s.id} className={cn('min-w-0', active ? 'flex-[1_1_auto]' : 'flex-[0_1_auto] sm:flex-[1_1_auto]')}>
            <button
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              type="button"
              disabled={!reachable || active}
              onClick={() => onJump(i)}
              aria-current={active ? 'step' : undefined}
              aria-label={`${i + 1}. ${s.label}${done ? ', concluída' : ''}`}
              className="relative flex h-11 w-full min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 text-[0.8125rem] font-semibold text-muted transition-colors duration-200 enabled:hover:bg-text/[.035] disabled:cursor-default data-[status=active]:text-text"
              data-status={status}
            >
              <span
                data-status={status}
                className="grid size-[22px] flex-none place-items-center rounded-full text-[0.71875rem] leading-none font-semibold tabular text-muted shadow-[inset_0_0_0_1px_var(--border-strong)] transition-[background-color,box-shadow,color] duration-150 data-[status=active]:text-text data-[status=active]:shadow-[inset_0_0_0_1.5px_var(--text)] data-[status=complete]:bg-accent data-[status=complete]:text-on-accent data-[status=complete]:shadow-none"
              >
                {done && !active ? <DrawnCheck animate={!reduced} /> : i + 1}
              </span>
              <span className={cn('truncate', active ? 'max-sm:inline' : 'max-sm:hidden')}>{s.label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
