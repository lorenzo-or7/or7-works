import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { PreferencesProvider } from '@/app/preferences'
import { TooltipProvider } from '@/components/ui/overlays'
import { CommandMenuProvider } from '@/features/shell/command-menu'

/** Renderiza uma tela com os providers reais, em rota de memória. */
export function renderRoute(element: ReactNode, path = '/') {
  const router = createMemoryRouter(
    [{ path: '*', element: <CommandMenuProvider>{element}</CommandMenuProvider> }],
    { initialEntries: [path] },
  )
  return render(
    <PreferencesProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </PreferencesProvider>,
  )
}
