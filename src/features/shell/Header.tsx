import { Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Bell, ChevronRight, LogOut, Moon, Search, Settings, Sun, UserRound } from 'lucide-react'
import { crumbsFor } from '@/app/navigation'
import { usePreferences } from '@/app/preferences'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/controls'
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger, Tooltip } from '@/components/ui/overlays'
import { useCommandMenu } from './command-menu'
import { BrandMark, Wordmark } from './Logo'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return null
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function PreviewBadge({ className }: { className?: string }) {
  return (
    <Tooltip content="Etapa 01: a interface ainda não tem backend. Autenticação entra na Etapa 02; dados reais, na Etapa 03.">
      <Badge tone="warning" className={className} tabIndex={0}>
        Pré-visualização
      </Badge>
    </Tooltip>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { setOpen } = useCommandMenu()
  const { resolvedTheme, setPreference, displayName } = usePreferences()
  const crumbs = crumbsFor(pathname)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  const ini = initials(displayName)

  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-border bg-bg">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-md md:hidden" aria-label="Or7 Works — Painel">
          <BrandMark className="size-7" />
          <Wordmark />
        </Link>

        <nav aria-label="Trilha de navegação" className="hidden min-w-0 md:block">
          <ol className="flex items-center gap-1.5 text-sm">
            {crumbs.map((c, i) => (
              <Fragment key={i}>
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-faint" aria-hidden />}
                <li className="min-w-0 truncate">
                  {c.to ? (
                    <Link to={c.to} className="text-muted hover:text-text">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={i === crumbs.length - 1 ? 'font-medium text-text' : 'text-muted'} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                      {c.label}
                    </span>
                  )}
                </li>
              </Fragment>
            ))}
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <PreviewBadge className="mr-1.5 hidden lg:inline-flex" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden h-9 w-60 items-center gap-2.5 rounded-md border border-border bg-surface px-3 text-sm text-muted transition-colors duration-150 hover:border-border-strong hover:text-text md:inline-flex"
          >
            <Search className="size-4" aria-hidden />
            <span className="flex-1 text-left">Buscar páginas…</span>
            <span className="flex gap-1">
              <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>

          <Tooltip content={resolvedTheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={resolvedTheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
              onClick={() => setPreference('theme', resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          </Tooltip>

          <Tooltip content="Notificações">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link to="/notificacoes" aria-label="Notificações, nenhuma não lida">
                <Bell />
              </Link>
            </Button>
          </Tooltip>

          <Menu>
            <MenuTrigger asChild>
              <button
                type="button"
                aria-label="Menu da conta"
                className="ml-1 inline-flex size-9 items-center justify-center rounded-full border border-border bg-sunken text-[0.75rem] font-semibold text-text transition-colors hover:border-border-strong"
              >
                {ini ?? <UserRound className="size-4 text-muted" aria-hidden />}
              </button>
            </MenuTrigger>
            <MenuContent align="end">
              <MenuLabel>
                <span className="block text-sm font-medium text-text">{displayName || 'Conta administradora'}</span>
                <span className="block">Conta única · sem login conectado</span>
              </MenuLabel>
              <MenuSeparator />
              <MenuItem onSelect={() => navigate('/configuracoes/perfil')}>
                <UserRound /> Perfil
              </MenuItem>
              <MenuItem onSelect={() => navigate('/configuracoes')}>
                <Settings /> Configurações
              </MenuItem>
              <MenuSeparator />
              <MenuItem onSelect={() => navigate('/entrar')}>
                <LogOut /> Ir para a tela de entrada
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </div>
    </header>
  )
}
