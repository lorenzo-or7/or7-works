import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import type { AccentId } from '@/design-system/accents'
import { readLocal, writeLocal } from '@/services/local-store'

export type ThemeMode = 'light' | 'dark' | 'system'
export type MotionMode = 'system' | 'reduce'

export interface Preferences {
  theme: ThemeMode
  accent: AccentId
  motion: MotionMode
  sidebarPinned: boolean
  displayName: string
}

const DEFAULTS: Preferences = {
  theme: 'system',
  accent: 'glacier',
  motion: 'system',
  sidebarPinned: true,
  displayName: '',
}

const KEY = 'preferences'

interface PreferencesContextValue extends Preferences {
  resolvedTheme: 'light' | 'dark'
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

function systemDark() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() => ({ ...DEFAULTS, ...readLocal<Partial<Preferences>>(KEY, {}) }))
  const [osDark, setOsDark] = useState(systemDark)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setOsDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = prefs.theme === 'system' ? (osDark ? 'dark' : 'light') : prefs.theme

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.dataset.accent = prefs.accent
    if (prefs.motion === 'reduce') root.dataset.motion = 'reduce'
    else delete root.dataset.motion
  }, [resolvedTheme, prefs.accent, prefs.motion])

  const setPreference = useCallback<PreferencesContextValue['setPreference']>((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      writeLocal(KEY, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ ...prefs, resolvedTheme, setPreference }), [prefs, resolvedTheme, setPreference])

  return (
    <PreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={prefs.motion === 'reduce' ? 'always' : 'user'}>{children}</MotionConfig>
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences precisa de PreferencesProvider')
  return ctx
}
