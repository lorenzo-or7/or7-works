import { useCallback, useState } from 'react'
import { readLocal, writeLocal } from '@/services/local-store'

export type WidgetId =
  | 'primeiros-passos'
  | 'estado-sistema'
  | 'leads'
  | 'auditorias'
  | 'propostas'
  | 'orcamento'
  | 'atividade'
  | 'agenda'
  | 'receita'
  | 'seguranca'

export type WidgetSize = 'S' | 'M' | 'L' | 'XL'

export interface WidgetPlacement {
  id: WidgetId
  size: WidgetSize
}

/** Colunas ocupadas no grid de 12 (desktop). */
export const SIZE_SPAN: Record<WidgetSize, number> = { S: 4, M: 6, L: 8, XL: 12 }
export const SIZE_LABEL: Record<WidgetSize, string> = { S: 'Estreito', M: 'Médio', L: 'Largo', XL: 'Linha inteira' }

export interface LayoutPreset {
  id: string
  label: string
  description: string
  widgets: WidgetPlacement[]
}

export const PRESETS: LayoutPreset[] = [
  {
    id: 'padrao',
    label: 'Padrão',
    description: 'Configuração inicial, estado do sistema e indicadores das próximas fases.',
    widgets: [
      { id: 'primeiros-passos', size: 'L' },
      { id: 'estado-sistema', size: 'S' },
      { id: 'leads', size: 'S' },
      { id: 'auditorias', size: 'S' },
      { id: 'propostas', size: 'S' },
      { id: 'orcamento', size: 'M' },
      { id: 'atividade', size: 'M' },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    description: 'Prioriza leads, propostas e agenda.',
    widgets: [
      { id: 'leads', size: 'L' },
      { id: 'propostas', size: 'S' },
      { id: 'agenda', size: 'M' },
      { id: 'auditorias', size: 'M' },
      { id: 'atividade', size: 'XL' },
    ],
  },
  {
    id: 'operacao',
    label: 'Operação',
    description: 'Prioriza sistema, segurança e custos.',
    widgets: [
      { id: 'estado-sistema', size: 'M' },
      { id: 'seguranca', size: 'M' },
      { id: 'orcamento', size: 'L' },
      { id: 'receita', size: 'S' },
      { id: 'atividade', size: 'XL' },
    ],
  },
]

export const DEFAULT_LAYOUT = PRESETS[0].widgets

const KEY = 'dashboard-layout'

export function loadLayout(): WidgetPlacement[] {
  const stored = readLocal<WidgetPlacement[] | null>(KEY, null)
  if (!Array.isArray(stored)) return DEFAULT_LAYOUT
  const valid = stored.filter((w) => w && typeof w.id === 'string' && w.size in SIZE_SPAN)
  return valid.length ? valid : DEFAULT_LAYOUT
}

export function saveLayout(layout: WidgetPlacement[]) {
  writeLocal(KEY, layout)
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState<WidgetPlacement[]>(loadLayout)
  const commit = useCallback((next: WidgetPlacement[]) => {
    setLayout(next)
    saveLayout(next)
  }, [])
  return { layout, commit }
}

/* ───────── Período ───────── */

export type PeriodPreset = '7' | '30' | '90' | 'custom'
export interface Period {
  preset: PeriodPreset
  from?: string
  to?: string
}

const PERIOD_KEY = 'dashboard-period'

export function usePeriod() {
  const [period, setPeriodState] = useState<Period>(() => readLocal<Period>(PERIOD_KEY, { preset: '30' }))
  const setPeriod = useCallback((p: Period) => {
    setPeriodState(p)
    writeLocal(PERIOD_KEY, p)
  }, [])
  return { period, setPeriod }
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

export function describePeriod(p: Period): string {
  if (p.preset !== 'custom') return `Últimos ${p.preset} dias`
  if (p.from && p.to) {
    const f = new Date(`${p.from}T00:00:00`)
    const t = new Date(`${p.to}T00:00:00`)
    return `${dateFmt.format(f)} – ${dateFmt.format(t)}`
  }
  return 'Período personalizado'
}
