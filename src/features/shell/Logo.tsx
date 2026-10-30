import { cn } from '@/lib/cn'

/**
 * Os arquivos originais do wordmark "Minimal Essence 01" e do ícone compacto ainda
 * não estão no repositório. Enquanto isso, a marca aparece como texto neutro — sem
 * tentar reproduzir o desenho aprovado. Ao receber os SVGs em public/brand/
 * (ver public/brand/LEIA-ME.md), troque para `true`.
 */
export const BRAND_ASSETS_AVAILABLE = false

export function Wordmark({ className }: { className?: string }) {
  if (BRAND_ASSETS_AVAILABLE) {
    return (
      <span className={cn('inline-flex', className)}>
        <img src="/brand/or7works-wordmark.svg" alt="Or7 Works" className="h-6 w-auto dark:hidden" />
        <img src="/brand/or7works-wordmark-dark.svg" alt="Or7 Works" className="hidden h-6 w-auto dark:block" />
      </span>
    )
  }
  return <span className={cn('text-[0.9375rem] font-semibold tracking-[-0.01em] text-text', className)}>Or7 Works</span>
}

export function BrandMark({ className }: { className?: string }) {
  if (BRAND_ASSETS_AVAILABLE) {
    return <img src="/brand/or7works-icon.svg" alt="" aria-hidden className={cn('size-8', className)} />
  }
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-text text-[0.75rem] font-semibold tracking-tight text-bg',
        className,
      )}
    >
      O7
    </span>
  )
}
