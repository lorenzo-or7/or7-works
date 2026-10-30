import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Command } from 'cmdk'
import { Dialog } from 'radix-ui'
import { CornerDownLeft, LayoutGrid, Moon, PanelLeft, Search, Settings, Sun } from 'lucide-react'
import { MODULES, NAV_GROUPS, SETTINGS_SECTIONS } from '@/app/navigation'
import { usePreferences } from '@/app/preferences'
import { Kbd } from '@/components/ui/controls'

const CommandMenuContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null)

export function useCommandMenu() {
  const ctx = useContext(CommandMenuContext)
  if (!ctx) throw new Error('useCommandMenu precisa de CommandMenuProvider')
  return ctx
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])
  return (
    <CommandMenuContext.Provider value={value}>
      {children}
      <CommandMenu open={open} onOpenChange={setOpen} />
    </CommandMenuContext.Provider>
  )
}

const itemClass =
  'flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 text-sm text-text outline-none data-[selected=true]:bg-sunken [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted'
const groupClass =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted'

function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate()
  const { resolvedTheme, sidebarPinned, setPreference } = usePreferences()

  const run = useCallback(
    (fn: () => void) => {
      onOpenChange(false)
      fn()
    },
    [onOpenChange],
  )

  const phaseOf = (path: string) => MODULES.find((m) => m.path === path)?.phase

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgb(16_23_32/0.4)] data-[state=open]:animate-[fade-in_160ms_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-3 top-[max(12px,env(safe-area-inset-top))] z-50 mx-auto max-w-[620px] overflow-hidden rounded-xl border border-border bg-raised shadow-pop outline-none data-[state=open]:animate-[pop-in_180ms_var(--ease-out)] sm:top-[14vh]"
        >
          <Dialog.Title className="sr-only">Menu global</Dialog.Title>
          <Command label="Menu global" loop className="flex max-h-[min(560px,80dvh)] flex-col">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-[18px] shrink-0 text-muted" aria-hidden />
              <Command.Input
                autoFocus
                placeholder="Ir para página, seção ou ação…"
                className="h-13 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-text outline-none placeholder:text-muted"
              />
              <Kbd className="hidden sm:inline-flex">Esc</Kbd>
            </div>
            <Command.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-muted">Nada encontrado entre as páginas e ações.</Command.Empty>

              <Command.Group heading="Páginas" className={groupClass}>
                {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
                  <Command.Item
                    key={item.path}
                    value={`${item.label} ${item.path}`}
                    onSelect={() => run(() => navigate(item.path))}
                    className={itemClass}
                  >
                    <item.icon aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    {phaseOf(item.path) ? <span className="text-xs text-muted">{phaseOf(item.path)}</span> : null}
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Configurações" className={groupClass}>
                {SETTINGS_SECTIONS.map((s) => (
                  <Command.Item
                    key={s.id}
                    value={`Configurações ${s.label}`}
                    onSelect={() => run(() => navigate(`/configuracoes/${s.id}`))}
                    className={itemClass}
                  >
                    <Settings aria-hidden />
                    <span className="flex-1">
                      <span className="text-muted">Configurações › </span>
                      {s.label}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Ações" className={groupClass}>
                <Command.Item value="Editar widgets do painel" onSelect={() => run(() => navigate('/painel/editar'))} className={itemClass}>
                  <LayoutGrid aria-hidden />
                  Editar widgets do painel
                </Command.Item>
                <Command.Item
                  value="Alternar tema claro escuro"
                  onSelect={() => run(() => setPreference('theme', resolvedTheme === 'dark' ? 'light' : 'dark'))}
                  className={itemClass}
                >
                  {resolvedTheme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
                  {resolvedTheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
                </Command.Item>
                <Command.Item
                  value="Fixar soltar barra lateral sidebar"
                  onSelect={() => run(() => setPreference('sidebarPinned', !sidebarPinned))}
                  className={itemClass}
                >
                  <PanelLeft aria-hidden />
                  {sidebarPinned ? 'Recolher barra lateral' : 'Fixar barra lateral aberta'}
                </Command.Item>
              </Command.Group>
            </Command.List>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-sunken px-4 py-2.5 text-xs text-muted">
              <span>Busca de registros chega na Etapa 03, quando houver dados reais.</span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Kbd>
                  <CornerDownLeft className="size-3" aria-label="Enter" />
                </Kbd>
                abrir
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
