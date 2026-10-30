import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { PreferencesProvider, usePreferences } from '@/app/preferences'
import { TooltipProvider } from '@/components/ui/overlays'
import './index.css'

function ThemedToaster() {
  const { resolvedTheme } = usePreferences()
  return (
    <Toaster
      theme={resolvedTheme}
      position="bottom-right"
      offset={{ bottom: 24, right: 24 }}
      mobileOffset={{ bottom: 'calc(84px + env(safe-area-inset-bottom))' }}
      toastOptions={{
        classNames: {
          toast: '!bg-raised !border-border !text-text !shadow-pop !rounded-lg !font-sans',
          description: '!text-muted',
        },
      }}
    />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <TooltipProvider delayDuration={400}>
        <RouterProvider router={router} />
        <ThemedToaster />
      </TooltipProvider>
    </PreferencesProvider>
  </StrictMode>,
)
