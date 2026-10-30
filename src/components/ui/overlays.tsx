import type { ComponentProps, ReactNode } from 'react'
import { Dialog as D, DropdownMenu as M, Popover as P, Tooltip as T } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/* ───────── Tooltip ───────── */

export const TooltipProvider = T.Provider

export function Tooltip({
  content,
  children,
  side = 'top',
}: {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={8}
          collisionPadding={12}
          className="z-50 max-w-64 rounded-md bg-text px-2.5 py-1.5 text-[0.8125rem] leading-snug text-bg shadow-pop origin-(--radix-tooltip-content-transform-origin) data-[state=delayed-open]:animate-[spring-in_380ms_var(--spring)] data-[state=instant-open]:animate-[spring-in_380ms_var(--spring)]"
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}

/* ───────── Menu suspenso ───────── */

export const Menu = M.Root
export const MenuTrigger = M.Trigger

export function MenuContent({ className, sideOffset = 8, ...props }: ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          'z-50 min-w-56 origin-(--radix-dropdown-menu-content-transform-origin) rounded-lg border border-border bg-raised p-1.5 shadow-pop data-[state=open]:animate-[spring-in-soft_420ms_var(--spring)]',
          className,
        )}
        {...props}
      />
    </M.Portal>
  )
}

export function MenuItem({ className, ...props }: ComponentProps<typeof M.Item>) {
  return (
    <M.Item
      className={cn(
        'flex h-9 cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 text-sm text-text outline-none data-disabled:pointer-events-none data-highlighted:bg-sunken data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:text-muted',
        className,
      )}
      {...props}
    />
  )
}

export function MenuLabel({ className, ...props }: ComponentProps<typeof M.Label>) {
  return <M.Label className={cn('px-2.5 pb-1 pt-1.5 text-xs text-muted', className)} {...props} />
}

export function MenuSeparator({ className, ...props }: ComponentProps<typeof M.Separator>) {
  return <M.Separator className={cn('-mx-1.5 my-1.5 h-px bg-border', className)} {...props} />
}

/* ───────── Popover ───────── */

export const Popover = P.Root
export const PopoverTrigger = P.Trigger
export const PopoverClose = P.Close

export function PopoverContent({ className, sideOffset = 8, align = 'end', ...props }: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={16}
        className={cn(
          'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border border-border bg-raised p-4 shadow-pop outline-none data-[state=open]:animate-[spring-in-soft_420ms_var(--spring)]',
          className,
        )}
        {...props}
      />
    </P.Portal>
  )
}

/* ───────── Sheet (drawer) ───────── */

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

/** Painel inferior deslizante — menu "Mais" no Android. */
export function Sheet({ open, onOpenChange, title, description, children }: SheetProps) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 bg-[rgb(16_23_32/0.45)] data-[state=open]:animate-[fade-in_180ms_ease-out]" />
        <D.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-border bg-raised pb-safe shadow-pop outline-none data-[state=open]:animate-[sheet-up_280ms_var(--ease-out)]">
          <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border-strong" />
          <div className="flex items-start justify-between gap-4 px-5 pb-1 pt-3">
            <div>
              <D.Title className="text-base font-semibold">{title}</D.Title>
              <D.Description className={description ? 'mt-0.5 text-sm text-muted' : 'sr-only'}>
                {description ?? title}
              </D.Description>
            </div>
            <D.Close
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-sunken hover:text-text"
              aria-label="Fechar"
            >
              <X className="size-5" />
            </D.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">{children}</div>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
