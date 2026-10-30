import { useCallback, useState } from 'react'
import { readLocal, writeLocal } from '@/services/local-store'

export const ONBOARDING_STEPS = [
  { id: 'boas-vindas', label: 'Boas-vindas' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'aparencia', label: 'Aparência' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'painel', label: 'Painel' },
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id']

export interface OnboardingProgress {
  current: number
  completed: OnboardingStepId[]
  finished: boolean
}

const KEY = 'onboarding'
const INITIAL: OnboardingProgress = { current: 0, completed: [], finished: false }

export function readOnboarding(): OnboardingProgress {
  const p = readLocal<OnboardingProgress>(KEY, INITIAL)
  return {
    current: Math.min(Math.max(0, Number(p.current) || 0), ONBOARDING_STEPS.length - 1),
    completed: Array.isArray(p.completed) ? p.completed : [],
    finished: !!p.finished,
  }
}

export function useOnboarding() {
  const [progress, setProgress] = useState<OnboardingProgress>(readOnboarding)
  const update = useCallback((patch: Partial<OnboardingProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...patch }
      writeLocal(KEY, next)
      return next
    })
  }, [])
  const reset = useCallback(() => {
    setProgress(INITIAL)
    writeLocal(KEY, INITIAL)
  }, [])
  return { progress, update, reset }
}
