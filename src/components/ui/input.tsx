import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full min-w-0 rounded-md border border-border bg-surface px-3.5 text-[0.9375rem] text-text transition-[border-color,box-shadow] duration-150 placeholder:text-muted hover:border-border-strong focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 aria-[invalid=true]:border-error',
        className,
      )}
      {...props}
    />
  )
})

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium text-text', className)} {...props} />
}

interface FieldProps {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  action?: ReactNode
  children: ReactNode
}

/** Rótulo + controle + dica/erro. O controle usa aria-describedby `${id}-hint` / `${id}-error`. */
export function Field({ id, label, hint, error, action, children }: FieldProps) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.8125rem] text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
