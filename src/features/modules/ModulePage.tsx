import { Link } from 'react-router'
import { ChevronRight, Folder, Inbox, ShieldCheck } from 'lucide-react'
import type { ModuleDef } from '@/app/navigation'
import { PhaseBadge } from '@/components/ui/badge'
import { EmptyState, PageHeader, Panel } from '@/components/ui/controls'

function TablePreview({ columns, emptyText }: { columns: string[]; emptyText: string }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sunken">
              {columns.map((c) => (
                <th key={c} scope="col" className="whitespace-nowrap px-5 py-3 text-[0.8125rem] font-medium text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-5 py-10">
                <EmptyState icon={Inbox} title="Nenhum registro">
                  {emptyText}
                </EmptyState>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function CalendarPreview({ emptyText }: { emptyText: string }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // semana começa na segunda
  const days = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(now)
  const weekdays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-4">
        <h2 className="font-display text-xl font-[440] capitalize">{monthLabel}</h2>
        <p className="text-[0.8125rem] text-muted">{emptyText}</p>
      </div>
      <div className="grid grid-cols-7 border-t border-border text-[0.75rem]" role="grid" aria-label={`Calendário de ${monthLabel}, sem compromissos`}>
        {weekdays.map((d) => (
          <div key={d} role="columnheader" className="border-b border-border bg-sunken px-2 py-2 text-center font-medium text-muted">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          const valid = d >= 1 && d <= days
          const isToday = valid && d === now.getDate()
          return (
            <div
              key={i}
              role="gridcell"
              aria-label={valid ? `${d}${isToday ? ', hoje' : ''}, sem compromissos` : undefined}
              className="min-h-14 border-b border-r border-border px-2 py-1.5 sm:min-h-20 [&:nth-child(7n)]:border-r-0"
            >
              {valid ? (
                <span
                  className={
                    isToday
                      ? 'inline-flex size-6 items-center justify-center rounded-full bg-accent font-medium tabular text-on-accent'
                      : 'tabular text-muted'
                  }
                >
                  {d}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function ParametersPreview({ items, emptyText }: { items: { label: string; value: string }[]; emptyText: string }) {
  return (
    <Panel>
      <div className="px-5 pt-4">
        <h2 className="text-[0.9375rem] font-semibold">Regras de operação já definidas</h2>
        <p className="text-[0.8125rem] text-muted">Valores do plano aprovado, aplicados quando os agentes existirem.</p>
      </div>
      <dl className="mt-3 divide-y divide-border border-t border-border">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between gap-4 px-5 py-3">
            <dt className="text-sm text-muted">{it.label}</dt>
            <dd className="text-sm font-medium">{it.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border px-5 py-8">
        <EmptyState icon={Inbox} title={emptyText}>
          Nenhum agente está ativo nesta fase.
        </EmptyState>
      </div>
    </Panel>
  )
}

function LedgerPreview({ items, emptyText }: { items: { label: string; value: string }[]; emptyText: string }) {
  return (
    <Panel>
      <dl className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((it) => (
          <div key={it.label} className="px-5 py-4">
            <dt className="text-[0.8125rem] text-muted">{it.label}</dt>
            <dd className="mt-1 text-2xl font-medium tabular text-faint" aria-label="Sem dados">
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border px-5 py-8">
        <EmptyState icon={Inbox} title="Sem lançamentos">
          {emptyText}
        </EmptyState>
      </div>
    </Panel>
  )
}

function TreePreview({ emptyText }: { emptyText: string }) {
  return (
    <Panel className="px-5 py-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Folder className="size-4" aria-hidden />
        <span>Documentos</span>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-faint">vazio</span>
      </div>
      <div className="mt-6">
        <EmptyState icon={Inbox} title="Nenhum arquivo">
          {emptyText}
        </EmptyState>
      </div>
    </Panel>
  )
}

export function ModulePage({ module: m }: { module: ModuleDef }) {
  const p = m.preview
  return (
    <>
      <PageHeader title={m.label} description={m.summary} meta={<PhaseBadge phase={`Disponível na ${m.phase}`.replace('na Fase futura', 'em fase futura')} />} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {p.kind === 'table' && p.columns && <TablePreview columns={p.columns} emptyText={p.emptyText} />}
          {p.kind === 'calendar' && <CalendarPreview emptyText={p.emptyText} />}
          {p.kind === 'parameters' && p.items && <ParametersPreview items={p.items} emptyText={p.emptyText} />}
          {p.kind === 'ledger' && p.items && <LedgerPreview items={p.items} emptyText={p.emptyText} />}
          {p.kind === 'tree' && <TreePreview emptyText={p.emptyText} />}
          {p.kind === 'list' && (
            <Panel className="px-5 py-10 sm:px-8">
              <EmptyState icon={Inbox} title="Nada por aqui ainda">
                {p.emptyText}
              </EmptyState>
            </Panel>
          )}
        </div>

        <aside className="grid content-start gap-6" aria-label={`Sobre o módulo ${m.label}`}>
          <section>
            <h2 className="text-[0.9375rem] font-semibold">O que este módulo fará</h2>
            <ul className="mt-3 grid gap-2.5">
              {m.plans.map((t) => (
                <li key={t} className="grid grid-cols-[6px_minmax(0,1fr)] gap-3 text-sm text-muted">
                  <span className="mt-[0.55em] size-1.5 rounded-full bg-border-strong" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </section>
          {m.rules?.length ? (
            <section className="rounded-lg border border-border bg-surface p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-accent" aria-hidden /> Regra preservada
              </h2>
              {m.rules.map((r) => (
                <p key={r} className="mt-1.5 text-[0.8125rem] text-muted">
                  {r}
                </p>
              ))}
            </section>
          ) : null}
          <p className="text-[0.8125rem] text-muted">
            Esta tela mostra a estrutura do módulo. Não há dados de exemplo nem ações disponíveis antes da{' '}
            {m.phase === 'Fase futura' ? 'fase de implantação' : m.phase}.{' '}
            <Link to="/" className="font-medium text-accent hover:underline">
              Voltar ao painel
            </Link>
          </p>
        </aside>
      </div>
    </>
  )
}
