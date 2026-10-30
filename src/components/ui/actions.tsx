/**
 * Padrões de ação do Or7 Works:
 * - PrimaryAction: ação principal de formulário (Signup Form da Aceternity: degradê + BottomGradient) com Ripple (Magic UI).
 * - StatefulButton: ação que muda de estado (Stateful Button da Aceternity: carregando → concluído).
 * - GlowInput: campo com a borda radial que segue o ponteiro (Input do Signup Form da Aceternity).
 */
import { forwardRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { Check, LoaderCircle } from 'lucide-react'
import { useMotionReduced, useRipple } from '@/components/motion'
import { cn } from '@/lib/cn'

/* ───────── PrimaryAction ───────── */

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-[#91C2DE] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-white to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

export const PrimaryAction = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }>(
  function PrimaryAction({ className, children, onPointerDown, type = 'button', ...props }, ref) {
    const ripple = useRipple()
    return (
      <button
        ref={ref}
        type={type}
        onPointerDown={(e) => {
          ripple.onPointerDown(e)
          onPointerDown?.(e)
        }}
        className={cn(
          'group/btn relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] px-5 text-[0.9375rem] font-medium text-on-accent transition-[filter,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
          'bg-linear-to-br from-[color-mix(in_oklab,var(--accent)_82%,#000)] to-accent',
          'shadow-[0_1px_0_0_rgb(255_255_255/0.22)_inset,0_-1px_0_0_rgb(255_255_255/0.08)_inset,0_8px_20px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)]',
          'hover:brightness-[1.06]',
          className,
        )}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        <BottomGradient />
        {ripple.layer}
      </button>
    )
  },
)

/* ───────── StatefulButton ───────── */

type Phase = 'idle' | 'loading' | 'done'

/**
 * Mesma sequência do Stateful Button original: ao clicar mostra o carregamento, executa a ação,
 * mostra o check e volta ao rótulo. A ação real decide a duração; nenhum atraso artificial é somado,
 * exceto os 1,2 s de confirmação visual.
 */
export function StatefulButton({
  onAction,
  onDone,
  children,
  doneLabel = 'Salvo',
  className,
  disabled,
}: {
  onAction: () => void | Promise<void>
  /** Chamado depois da confirmação visual. */
  onDone?: () => void
  children: ReactNode
  doneLabel?: string
  className?: string
  disabled?: boolean
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const reduced = useMotionReduced()
  const run = async () => {
    if (phase !== 'idle') return
    setPhase('loading')
    await onAction()
    setPhase('done')
    window.setTimeout(() => {
      setPhase('idle')
      onDone?.()
    }, reduced ? 600 : 1200)
  }
  return (
    <motion.button
      type="button"
      layout={!reduced}
      onClick={run}
      disabled={disabled || phase !== 'idle'}
      aria-live="polite"
      className={cn(
        'inline-flex h-8 min-w-[132px] items-center justify-center gap-2 rounded-md bg-accent px-3.5 text-[0.8125rem] font-medium text-on-accent ring-offset-2 ring-offset-raised transition-[box-shadow,opacity] duration-200 hover:ring-2 hover:ring-accent disabled:cursor-default',
        phase === 'idle' && disabled && 'opacity-45',
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === 'loading' && (
          <motion.span key="l" initial={{ scale: 0, width: 0 }} animate={{ scale: 1, width: 16 }} exit={{ scale: 0, width: 0 }} transition={{ duration: 0.2 }}>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
          </motion.span>
        )}
        {phase === 'done' && (
          <motion.span key="c" initial={{ scale: 0, width: 0 }} animate={{ scale: 1, width: 16 }} exit={{ scale: 0, width: 0 }} transition={{ duration: 0.2 }}>
            <Check className="size-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span layout={!reduced}>{phase === 'done' ? doneLabel : children}</motion.span>
    </motion.button>
  )
}

/* ───────── GlowInput ───────── */

export const GlowInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { trailing?: ReactNode }>(
  function GlowInput({ className, trailing, ...props }, ref) {
    const radius = 100
    const [visible, setVisible] = useState(false)
    const reduced = useMotionReduced()
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const background = useMotionTemplate`radial-gradient(${visible && !reduced ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px, var(--accent), transparent 80%)`
    return (
      <motion.div
        style={{ background }}
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          const { left, top } = currentTarget.getBoundingClientRect()
          mouseX.set(clientX - left)
          mouseY.set(clientY - top)
        }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input relative rounded-[11px] p-[1.5px] transition duration-300"
      >
        <input
          ref={ref}
          className={cn(
            'h-11 w-full min-w-0 rounded-[10px] border-none bg-sunken px-3.5 text-[0.9375rem] text-text shadow-[0_0_0_1px_var(--border)] transition-[box-shadow,background-color] duration-300 placeholder:text-muted group-hover/input:shadow-none focus-visible:bg-surface focus-visible:shadow-[0_0_0_2px_var(--accent)] focus-visible:outline-none aria-[invalid=true]:shadow-[0_0_0_1.5px_var(--error)] disabled:cursor-not-allowed disabled:opacity-55',
            trailing ? 'pr-12' : undefined,
            className,
          )}
          {...props}
        />
        {trailing ? <div className="absolute inset-y-[1.5px] right-[1.5px] flex items-center">{trailing}</div> : null}
      </motion.div>
    )
  },
)
