import { useEffect, useRef, type CSSProperties } from 'react'
import { Outlet, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { usePreferences } from '@/app/preferences'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { SIDEBAR_EXPANDED, SIDEBAR_RAIL, Sidebar } from './Sidebar'

export function AppShell() {
  const { pathname } = useLocation()
  const { sidebarPinned } = usePreferences()
  const mainRef = useRef<HTMLElement>(null)

  // Ao trocar de página: volta ao topo e move o foco para o conteúdo (leitores de tela).
  // Compara com o caminho anterior (e não com "primeira execução") para não roubar o foco
  // no carregamento inicial — inclusive com o efeito duplicado do StrictMode.
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div
      className="min-h-dvh md:pl-(--sidebar-w) md:transition-[padding] md:duration-200 md:ease-(--ease-out)"
      style={{ '--sidebar-w': `${sidebarPinned ? SIDEBAR_EXPANDED : SIDEBAR_RAIL}px` } as CSSProperties}
    >
      <a
        href="#conteudo"
        className="fixed left-3 top-3 z-50 -translate-y-20 rounded-md bg-text px-3 py-2 text-sm text-bg focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Sidebar />
      <Header />
      <main
        id="conteudo"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-[1440px] px-4 pb-[calc(88px+env(safe-area-inset-bottom))] pt-6 outline-none sm:px-6 md:pb-16 lg:px-8 lg:pt-8"
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}
