import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.75rem] font-medium leading-5 [&_svg]:size-3.5',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-sunken text-muted',
        accent: 'border-transparent bg-accent-soft text-accent',
        success: 'border-transparent bg-success-soft text-success',
        warning: 'border-transparent bg-warning-soft text-warning',
        error: 'border-transparent bg-error-soft text-error',
        outline: 'border-border bg-transparent text-muted',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export function Badge({ className, tone, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}

/** Marca de fase futura do roadmap (docs/04_fases_futuras.md). */
export function PhaseBadge({ phase, className }: { phase: string; className?: string }) {
  return (
    <Badge tone="outline" className={cn('tabular', className)}>
      {phase}
    </Badge>
  )
}
