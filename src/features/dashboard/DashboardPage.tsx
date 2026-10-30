import { Link } from 'react-router'
import { LayoutGrid } from 'lucide-react'
import { motion } from 'motion/react'
import { usePreferences } from '@/app/preferences'
import { useMotionReduced } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/controls'
import { Tooltip } from '@/components/ui/overlays'
import { cn } from '@/lib/cn'
import { useDashboardLayout, usePeriod, type WidgetPlacement, type WidgetSize } from './layout-store'
import { PeriodFilter } from './PeriodFilter'
import { WIDGETS } from './widgets'

/** Classes estáticas para o Tailwind detectar. Tablet: 12 colunas em pares · desktop: Bento de 12 colunas. */
export const SPAN_CLASS: Record<WidgetSize, string> = {
  S: 'md:col-span-6 xl:col-span-4',
  M: 'md:col-span-6 xl:col-span-6',
  L: 'md:col-span-12 xl:col-span-8',
  XL: 'md:col-span-12 xl:col-span-12',
}

/**
 * Celular (2 colunas): indicadores ocupam meia largura para mostrar mais informação na primeira tela.
 * Em uma sequência ímpar de indicadores, o último ocupa a linha inteira (sem buraco no grid).
 */
export function mobileSpans(layout: WidgetPlacement[]): string[] {
  const spans = layout.map(() => 'col-span-2')
  let i = 0
  while (i < layout.length) {
    if (WIDGETS[layout[i].id]?.kind !== 'metric') {
      i++
      continue
    }
    let j = i
    while (j < layout.length && WIDGETS[layout[j].id]?.kind === 'metric') j++
    for (let k = i; k < j; k++) spans[k] = (j - i) % 2 === 1 && k === j - 1 ? 'col-span-2' : 'col-span-1'
    i = j
  }
  return spans
}

function greeting(d: Date) {
  const h = d.getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export function DashboardPage() {
  const { layout } = useDashboardLayout()
  const { period, setPeriod } = usePeriod()
  const { displayName } = usePreferences()
  const reduced = useMotionReduced()
  const now = new Date()
  const raw = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now)
  const today = raw.charAt(0).toUpperCase() + raw.slice(1)
  const first = displayName.trim().split(/\s+/)[0]
  const spans = mobileSpans(layout)

  return (
    <>
      <header className="flex flex-col gap-4 pb-5 sm:pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[1.875rem] leading-[1.05] font-[420] tracking-[-0.025em] sm:text-[2.5rem]">Painel</h1>
          <p className="mt-1.5 text-sm text-muted sm:text-[0.9375rem]">
            {today} · {greeting(now)}
            {first ? `, ${first}` : ''}
            <span className="max-md:hidden">. Os indicadores mostram dados reais à medida que cada módulo for ativado.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodFilter period={period} onChange={setPeriod} />
          <Tooltip content="Editar widgets">
            <Button asChild size="sm" variant="secondary" className="ml-auto h-8 max-sm:w-8 max-sm:px-0 lg:ml-0">
              <Link to="/painel/editar" aria-label="Editar widgets">
                <LayoutGrid aria-hidden /> <span className="max-sm:hidden">Editar widgets</span>
              </Link>
            </Button>
          </Tooltip>
        </div>
      </header>

      {layout.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong p-8">
          <EmptyState
            icon={LayoutGrid}
            title="Nenhum widget no painel"
            action={
              <Button asChild variant="primary">
                <Link to="/painel/editar">Adicionar widgets</Link>
              </Button>
            }
          >
            Você removeu todos os widgets. Adicione os que quiser acompanhar ou restaure o layout padrão no editor.
          </EmptyState>
        </div>
      ) : (
        <div className="grid grid-flow-row-dense grid-cols-2 gap-3 sm:gap-4 md:grid-cols-12 lg:gap-5">
          {layout.map((w, i) => {
            const def = WIDGETS[w.id]
            if (!def) return null
            return (
              <motion.div
                key={w.id}
                layout={!reduced}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className={cn('min-w-0', spans[i], SPAN_CLASS[w.size])}
              >
                {def.render({ period })}
              </motion.div>
            )
          })}
        </div>
      )}
    </>
  )
}
