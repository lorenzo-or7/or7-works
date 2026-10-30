import { createBrowserRouter, Link, Outlet, type RouteObject } from 'react-router'
import { MODULES } from '@/app/navigation'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/controls'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ModulePage } from '@/features/modules/ModulePage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import { AppShell } from '@/features/shell/AppShell'
import { CommandMenuProvider } from '@/features/shell/command-menu'
import { Compass } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="py-10">
      <EmptyState
        icon={Compass}
        title="Página não encontrada"
        action={
          <Button asChild variant="primary">
            <Link to="/">Ir para o painel</Link>
          </Button>
        }
      >
        O endereço não corresponde a nenhuma página do Or7 Works. Use o menu ou a busca (Ctrl K) para navegar.
      </EmptyState>
    </div>
  )
}

/**
 * Páginas menos frequentes são carregadas sob demanda (lazy).
 * Etapa 01: rotas sem proteção — não há autenticação ainda.
 * A Etapa 02 adiciona a guarda de sessão + aal2 em torno de <AppShell />.
 */
export const routes: RouteObject[] = [
  { path: '/entrar', lazy: () => import('@/features/auth/LoginPage').then((m) => ({ Component: m.LoginPage })) },
  { path: '/entrar/verificacao', lazy: () => import('@/features/auth/MfaPage').then((m) => ({ Component: m.MfaPage })) },
  { path: '/recuperar-acesso', lazy: () => import('@/features/auth/RecoveryPage').then((m) => ({ Component: m.RecoveryPage })) },
  { path: '/boas-vindas', lazy: () => import('@/features/onboarding/OnboardingPage').then((m) => ({ Component: m.OnboardingPage })) },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'painel/editar', lazy: () => import('@/features/dashboard/WidgetEditorPage').then((m) => ({ Component: m.WidgetEditorPage })) },
      { path: 'notificacoes', element: <NotificationsPage /> },
      { path: 'configuracoes/:secao?', lazy: () => import('@/features/settings/SettingsPage').then((m) => ({ Component: m.SettingsPage })) },
      ...MODULES.map((m) => ({ path: m.path.slice(1), element: <ModulePage module={m} /> })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

// O menu global (Ctrl+K) navega, então fica dentro do roteador.
function Root() {
  return (
    <CommandMenuProvider>
      <Outlet />
    </CommandMenuProvider>
  )
}

export const router = createBrowserRouter([{ element: <Root />, HydrateFallback: () => null, children: routes }])
