import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { Bell, Ellipsis, LayoutDashboard, Search, Users } from 'lucide-react'
import { NAV_GROUPS, SETTINGS_NAV } from '@/app/navigation'
import { useMotionReduced, useRipple } from '@/components/motion'
import { Sheet } from '@/components/ui/overlays'
import { cn } from '@/lib/cn'
import { useCommandMenu } from './command-menu'
import { PreviewBadge } from './Header'

/**
 * Barra inferior Android: destinos fixos + menu "Mais".
 * Adaptação do Dock (Magic UI) ao toque: em vez de ampliar por proximidade do mouse, o item ativo
 * ganha a ampliação com a mesma mola do original (mass 0.1, stiffness 150, damping 12) e um
 * indicador que desliza entre os itens. Toque com Ripple (Magic UI).
 */
const DOCK_SPRING = { type: 'spring', mass: 0.1, stiffness: 150, damping: 12 } as const

function DockItem({ active, icon, label, reduced }: { active: boolean; icon: ReactNode; label: string; reduced: boolean }) {
  return (
    <>
      <span className="relative inline-flex h-8 w-14 items-center justify-center">
        {active && (
          <motion.span
            layoutId="dock-active"
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
            className="absolute inset-0 rounded-full bg-accent-soft"
          />
        )}
        <motion.span
          className="relative inline-flex"
          initial={false}
          animate={{ scale: active && !reduced ? 1.14 : 1, y: active && !reduced ? -1 : 0 }}
          transition={DOCK_SPRING}
        >
          {icon}
        </motion.span>
      </span>
      <span className={cn('relative transition-colors duration-150', active ? 'font-semibold' : 'font-medium')}>{label}</span>
    </>
  )
}

const itemClass = (active: boolean) =>
  cn(
    'relative flex min-h-[60px] flex-1 select-none flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl text-[0.6875rem] transition-colors duration-150 active:scale-[0.96]',
    active ? 'text-accent' : 'text-muted',
  )

function DockLink({ to, end, active, icon, label, reduced }: { to: string; end?: boolean; active: boolean; icon: ReactNode; label: string; reduced: boolean }) {
  const ripple = useRipple()
  return (
    <NavLink to={to} end={end} onPointerDown={ripple.onPointerDown} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
      <DockItem active={active} icon={icon} label={label} reduced={reduced} />
      {ripple.layer}
    </NavLink>
  )
}

function DockButton({ onClick, active, icon, label, reduced, ...aria }: { onClick: () => void; active: boolean; icon: ReactNode; label: string; reduced: boolean; 'aria-haspopup'?: 'dialog'; 'aria-expanded'?: boolean }) {
  const ripple = useRipple()
  return (
    <button type="button" onClick={onClick} onPointerDown={ripple.onPointerDown} className={itemClass(active)} {...aria}>
      <DockItem active={active} icon={icon} label={label} reduced={reduced} />
      {ripple.layer}
    </button>
  )
}

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const { setOpen } = useCommandMenu()
  const { pathname } = useLocation()
  const reduced = useMotionReduced()
  const painelActive = pathname === '/' || pathname.startsWith('/painel')
  const leadsActive = pathname === '/leads'
  const avisosActive = pathname === '/notificacoes'
  const moreActive = !painelActive && !leadsActive && !avisosActive

  return (
    <>
      <nav aria-label="Navegação principal" className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch gap-1 px-2 py-1">
          <DockLink to="/" end active={painelActive} icon={<LayoutDashboard className="size-5" aria-hidden />} label="Painel" reduced={reduced} />
          <DockLink to="/leads" active={leadsActive} icon={<Users className="size-5" aria-hidden />} label="Leads" reduced={reduced} />
          <DockButton onClick={() => setOpen(true)} active={false} icon={<Search className="size-5" aria-hidden />} label="Buscar" reduced={reduced} />
          <DockLink to="/notificacoes" active={avisosActive} icon={<Bell className="size-5" aria-hidden />} label="Avisos" reduced={reduced} />
          <DockButton
            onClick={() => setMoreOpen(true)}
            active={moreActive}
            icon={<Ellipsis className="size-5" aria-hidden />}
            label="Mais"
            reduced={reduced}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
          />
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} title="Todos os módulos">
        <div className="px-2 pb-2">
          <PreviewBadge />
        </div>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-3">
            <p className="px-3 pb-1 text-xs font-medium text-muted">{group.label}</p>
            <ul>
              {[...group.items].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-12 items-center gap-3 rounded-md px-3 text-[0.9375rem]',
                        isActive ? 'bg-accent-soft font-medium text-text' : 'text-text hover:bg-sunken',
                      )
                    }
                  >
                    <item.icon className="size-5 text-muted" aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    {item.phase ? <span className="text-xs text-muted">{item.phase}</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-3 border-t border-border pt-3">
          <NavLink
            to={SETTINGS_NAV.path}
            onClick={() => setMoreOpen(false)}
            className="flex min-h-12 items-center gap-3 rounded-md px-3 text-[0.9375rem] text-text hover:bg-sunken"
          >
            <SETTINGS_NAV.icon className="size-5 text-muted" aria-hidden />
            {SETTINGS_NAV.label}
          </NavLink>
        </div>
      </Sheet>
    </>
  )
}
