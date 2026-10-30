import { useId, type ComponentProps, type HTMLAttributes, type ReactNode } from 'react'
import { Switch as S, ToggleGroup } from 'radix-ui'
import { motion, MotionConfig } from 'motion/react'
import { usePreferences } from '@/app/preferences'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/* ───────── Switch ───────── */

export function Switch({ className, ...props }: ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-border-strong transition-[background-color,transform] duration-150 active:scale-90 data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
      {...props}
    >
      <S.Thumb className="block size-5 translate-x-0.5 rounded-full bg-surface shadow-lift transition-transform duration-200 ease-(--ease-out) data-[state=checked]:translate-x-[18px]" />
    </S.Root>
  )
}

/* ───────── Controle segmentado ───────── */

interface SegmentedProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: { value: T; label: ReactNode; ariaLabel?: string }[]
  label: string
  className?: string
  size?: 'sm' | 'md'
}

/** Controle segmentado com o destaque deslizante do Animate UI Tabs (mola stiffness 200 / damping 25). */
export function Segmented<T extends string>({ value, onValueChange, options, label, className, size = 'md' }: SegmentedProps<T>) {
  const id = useId()
  const { motion: pref } = usePreferences()
  return (
    <MotionConfig reducedMotion={pref === 'reduce' ? 'always' : 'user'}>
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange(v as T)}
      aria-label={label}
      className={cn('inline-flex max-w-full rounded-lg border border-border bg-sunken p-0.5', className)}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          aria-label={o.ariaLabel}
          className={cn(
            'relative inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 font-medium text-muted transition-colors duration-150 hover:text-text data-[state=on]:text-text [&_svg]:size-4',
            size === 'sm' ? 'h-7 text-[0.8125rem]' : 'h-9 text-sm',
          )}
        >
          {o.value === value && (
            <motion.span
              layoutId={id}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="absolute inset-0 rounded-[7px] bg-surface shadow-lift"
            />
          )}
          <span className="relative inline-flex items-center gap-1.5">{o.label}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
    </MotionConfig>
  )
}

/* ───────── Kbd ───────── */

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-sans text-[0.6875rem] font-medium text-muted',
        className,
      )}
      {...props}
    />
  )
}

/* ───────── Painel ───────── */

export function Panel({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn('rounded-lg border border-border bg-surface', className)} {...props} />
}

/* ───────── Estado vazio ───────── */

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

/** Estado vazio honesto: diz o que falta e quando/como passa a existir. */
export function EmptyState({ icon: Icon, title, children, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-start gap-3', className)}>
      {Icon ? (
        /* Mídia em ícone empilhado (padrão shadcn Empty) */
        <span className="relative inline-flex size-10" aria-hidden>
          <span className="absolute inset-0 translate-x-1.5 -translate-y-1 rotate-6 rounded-[10px] border border-border bg-surface" />
          <span className="relative inline-flex size-10 items-center justify-center rounded-[10px] border border-border bg-sunken text-muted shadow-lift">
            <Icon className="size-[18px]" />
          </span>
        </span>
      ) : null}
      <div className="grid gap-1">
        <p className="text-[0.9375rem] font-medium text-text">{title}</p>
        {children ? <div className="max-w-[56ch] text-sm text-muted">{children}</div> : null}
      </div>
      {action}
    </div>
  )
}

/* ───────── Cabeçalho de página ───────── */

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[2rem] leading-[1.1] font-[440] text-text sm:text-[2.375rem]">{title}</h1>
        {description ? <div className="mt-2 max-w-[62ch] text-[0.9375rem] text-muted">{description}</div> : null}
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
