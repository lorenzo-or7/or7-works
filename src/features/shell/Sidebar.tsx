import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { Pin, PinOff } from 'lucide-react'
import { NAV_GROUPS, SETTINGS_NAV, type NavItem } from '@/app/navigation'
import { usePreferences } from '@/app/preferences'
import { useMotionReduced } from '@/components/motion'
import { Tooltip } from '@/components/ui/overlays'
import { cn } from '@/lib/cn'
import { BrandMark, Wordmark } from './Logo'

export const SIDEBAR_EXPANDED = 256
export const SIDEBAR_RAIL = 68

/** Mola da largura (Aceternity Sidebar anima 300↔60 px) e do indicador (Animate UI Highlight: 200/25). */
const WIDTH_SPRING = { type: 'spring', stiffness: 320, damping: 34 } as const
const HIGHLIGHT_SPRING = { type: 'spring', stiffness: 200, damping: 25 } as const

function shortPhase(phase?: string) {
  if (!phase) return null
  const n = phase.match(/\d+/)?.[0]
  return n ? `F${n}` : 'Futura'
}

function isActivePath(pathname: string, path: string) {
  if (path === '/') return pathname === '/' || pathname.startsWith('/painel')
  return pathname === path || pathname.startsWith(path + '/')
}

function SidebarLink({ item, expanded, active, reduced }: { item: NavItem; expanded: boolean; active: boolean; reduced: boolean }) {
  const short = shortPhase(item.phase)
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group/sidebar relative flex h-10 items-center gap-3 rounded-[9px] px-[13px] text-sm transition-colors duration-150',
        active ? 'font-medium text-text' : 'text-muted hover:text-text',
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          transition={reduced ? { duration: 0 } : HIGHLIGHT_SPRING}
          className="absolute inset-0 rounded-[9px] bg-accent-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_16%,transparent)]"
        />
      )}
      {!active && <span className="absolute inset-0 rounded-[9px] bg-sunken opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100" />}
      <item.icon
        className={cn('relative size-[18px] shrink-0 transition-[color,transform] duration-200', active && 'text-accent', !active && 'group-hover/sidebar:scale-110')}
        aria-hidden
      />
      <motion.span
        initial={false}
        animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -6 }}
        transition={{ duration: reduced ? 0 : 0.18 }}
        className={cn(
          'relative min-w-0 flex-1 truncate transition-transform duration-150 group-hover/sidebar:translate-x-1',
          !expanded && 'pointer-events-none',
        )}
      >
        {item.label}
      </motion.span>
      {short ? (
        <motion.span
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          className="relative rounded-[5px] px-1 text-[0.6875rem] tabular text-faint"
          aria-label={item.phase ? `, ${item.phase}` : undefined}
        >
          {short}
        </motion.span>
      ) : null}
    </NavLink>
  )
}

/**
 * Barra lateral desktop/tablet.
 * Fixada: ocupa espaço no layout. Solta: trilho de ícones que se expande sobre o
 * conteúdo ao passar o mouse ou receber foco do teclado (padrão Aceternity Sidebar).
 */
export function Sidebar() {
  const { sidebarPinned, setPreference } = usePreferences()
  const { pathname } = useLocation()
  const reduced = useMotionReduced()
  const [peek, setPeek] = useState(false)
  const expanded = sidebarPinned || peek

  return (
    <motion.aside
      aria-label="Navegação principal"
      onMouseEnter={() => setPeek(true)}
      onMouseLeave={() => setPeek(false)}
      onFocus={() => setPeek(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPeek(false)
      }}
      initial={false}
      animate={{ width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_RAIL }}
      transition={reduced ? { duration: 0 } : WIDTH_SPRING}
      data-expanded={expanded}
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden flex-col overflow-hidden border-r border-border bg-surface transition-shadow duration-200 md:flex',
        !sidebarPinned && peek && 'shadow-[0_0_0_1px_var(--border),0_24px_48px_-12px_rgb(16_23_32/0.28)]',
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-3 px-[18px]">
        <BrandMark />
        <motion.span
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          className="min-w-0 flex-1 truncate"
        >
          <Wordmark />
        </motion.span>
        <Tooltip content={sidebarPinned ? 'Recolher barra lateral' : 'Fixar barra lateral aberta'} side="right">
          <motion.button
            type="button"
            whileTap={reduced ? undefined : { scale: 0.88 }}
            onClick={() => setPreference('sidebarPinned', !sidebarPinned)}
            aria-pressed={sidebarPinned}
            aria-label={sidebarPinned ? 'Recolher barra lateral' : 'Fixar barra lateral aberta'}
            className={cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted transition-[opacity,background-color] duration-150 hover:bg-sunken hover:text-text',
              expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            {sidebarPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          </motion.button>
        </Tooltip>
      </div>

      <nav className="scrollbar-none min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-4 pt-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && 'mt-5')}>
            <div className="relative mb-1 flex h-5 items-center px-[13px]">
              <motion.p
                initial={false}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.18 }}
                className="truncate text-[0.75rem] font-medium text-faint"
              >
                {group.label}
              </motion.p>
              <motion.span
                initial={false}
                animate={{ opacity: expanded ? 0 : 1 }}
                aria-hidden
                className="absolute left-[22px] h-px w-4 bg-border"
              />
            </div>
            <ul className="grid gap-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <SidebarLink item={item} expanded={expanded} active={isActivePath(pathname, item.path)} reduced={reduced} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border px-2.5 py-2.5">
        <SidebarLink item={SETTINGS_NAV} expanded={expanded} active={isActivePath(pathname, SETTINGS_NAV.path)} reduced={reduced} />
      </div>
    </motion.aside>
  )
}
