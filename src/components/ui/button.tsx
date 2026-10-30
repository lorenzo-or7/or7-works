import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-[color-mix(in_oklab,var(--accent)_86%,var(--text))]',
        secondary: 'border border-border bg-surface text-text hover:border-border-strong hover:bg-sunken',
        ghost: 'text-muted hover:bg-sunken hover:text-text',
        danger: 'border border-border bg-surface text-error hover:border-error hover:bg-error-soft',
        link: 'h-auto px-0 text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-[0.8125rem]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-[0.9375rem]',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
