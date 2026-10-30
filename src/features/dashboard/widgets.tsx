import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDashed,
  FileSignature,
  History,
  ScanSearch,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { CountingNumber, GlowingEffect, MovingBorderFrame, Progress } from '@/components/motion'
import { PhaseBadge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { ONBOARDING_STEPS, readOnboarding } from '@/features/onboarding/onboarding-store'
import { describePeriod, type Period, type WidgetId } from './layout-store'

/**
 * Tipos de cartão do Bento (hierarquia visual):
 * - hero: cartão principal, com Glowing Effect (Aceternity)
 * - metric: indicador; comportamento do Magic UI Bento Grid no hover (conteúdo sobe, ícone reduz, CTA surge)
 * - info: superfície informativa com lista de estados
 * - feed: fluxo de eventos (vazio e honesto até a Etapa 03)
 */
export type WidgetKind = 'hero' | 'metric' | 'info' | 'feed'

export interface WidgetDef {
  id: WidgetId
  title: string
  description: string
  kind: WidgetKind
  usesPeriod?: boolean
  render: (ctx: { period: Period }) => ReactNode
}

/* ───────── Molduras ───────── */

function InfoFrame({ title, meta, aside, children, className }: { title: string; meta?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={cn('flex h-full flex-col rounded-2xl border border-border bg-surface', className)}>
      <header className="flex items-start justify-between gap-3 px-5 pt-[18px]">
        <div className="min-w-0">
          <h2 className="text-[0.9375rem] font-semibold leading-6 tracking-[-0.005em]">{title}</h2>
          {meta ? <p className="text-[0.8125rem] text-muted">{meta}</p> : null}
        </div>
        {aside}
      </header>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">{children}</div>
    </section>
  )
}

function StatusRow({ label, status, done }: { label: string; status: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2">
      {done ? <Check className="size-4 shrink-0 text-success" aria-hidden /> : <CircleDashed className="size-4 shrink-0 text-faint" aria-hidden />}
      <span className="min-w-0 flex-1 truncate text-sm text-text">{label}</span>
      <span className={cn('shrink-0 text-[0.8125rem] tabular', done ? 'font-medium text-success' : 'text-muted')}>{status}</span>
    </li>
  )
}

/** Indicador sem dados: travessão, nunca zero. Comportamento de hover do Magic UI Bento Grid. */
function MetricCard({ title, period, phase, note, to, icon: Icon }: { title: string; period: Period; phase: string; note: string; to: string; icon: LucideIcon }) {
  return (
    <section
      aria-label={title}
      className="group relative flex h-full min-h-[172px] flex-col overflow-hidden rounded-2xl bg-sunken ring-1 ring-border/60 ring-inset sm:min-h-[196px]"
    >
      <div className="pointer-events-none z-10 flex flex-1 transform-gpu flex-col p-4 transition-all duration-300 sm:p-5 lg:group-hover:-translate-y-8">
        <div className="flex items-start justify-between gap-2">
          <Icon className="size-[22px] origin-left transform-gpu text-muted transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:text-accent" aria-hidden />
          <PhaseBadge phase={phase} className="max-sm:hidden" />
        </div>
        <h2 className="mt-auto pt-5 text-[0.8125rem] font-medium leading-snug text-muted sm:text-sm">{title}</h2>
        <p className="mt-1 text-[2.25rem] font-light leading-none tracking-[-0.02em] text-faint tabular sm:text-[2.75rem]" aria-label="Sem dados">
          —
        </p>
        <p className="mt-2 text-[0.75rem] text-muted sm:text-[0.8125rem]">
          <span className="font-medium text-text">Sem dados</span>
          <span className="max-sm:hidden"> · {describePeriod(period)}</span>
        </p>
        <p className="mt-0.5 text-[0.75rem] text-muted max-sm:hidden">{note}</p>
      </div>

      {/* CTA: sempre visível no toque; surge de baixo no hover em telas grandes (como o original) */}
      <div className="flex px-4 pb-3 sm:px-5 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-8 lg:pb-4 lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
        <Link to={to} className="pointer-events-auto inline-flex items-center gap-1.5 rounded text-[0.8125rem] font-medium text-accent hover:underline">
          <span className="max-sm:sr-only">Ver módulo</span>
          <span className="sm:hidden">{phase}</span>
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-text/[.03]" />
    </section>
  )
}

/* ───────── Cartão principal: configuração inicial ───────── */

function OnboardingHero() {
  const progress = readOnboarding()
  const done = progress.completed.length
  const total = ONBOARDING_STEPS.length
  const pct = Math.round((done / total) * 100)
  const [open, setOpen] = useState(false)
  const listId = useId()
  const cta = progress.finished ? 'Revisar configuração' : done ? 'Continuar configuração' : 'Começar configuração'

  const checklist = (
    <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
      {ONBOARDING_STEPS.map((s, i) => {
        const ok = progress.completed.includes(s.id)
        return (
          <li key={s.id} className="flex items-center gap-3 border-b border-border/70 py-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(2)]:border-b">
            <span
              className={cn(
                'inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold tabular',
                ok ? 'bg-accent text-on-accent' : 'text-muted shadow-[inset_0_0_0_1px_var(--border-strong)]',
              )}
              aria-hidden
            >
              {ok ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={cn('flex-1 text-sm', ok ? 'text-muted line-through decoration-border-strong' : 'text-text')}>{s.label}</span>
            <span className="sr-only">{ok ? 'concluída' : 'pendente'}</span>
          </li>
        )
      })}
    </ol>
  )

  return (
    <section aria-label="Configuração inicial" className="relative h-full rounded-2xl border border-border bg-surface">
      <GlowingEffect />
      <div className="relative grid h-full gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:p-7">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[0.9375rem] font-semibold">Configuração inicial</h2>
            <p className="text-[0.8125rem] text-muted lg:hidden">
              <CountingNumber value={done} className="font-semibold text-text" /> de {total}
            </p>
          </div>
          <p className="mt-3 max-w-[22ch] font-display text-[1.625rem] leading-[1.08] font-[400] tracking-[-0.02em] text-text sm:text-[2rem]">
            {progress.finished ? 'Tudo pronto para começar.' : 'Deixe o Or7 Works do seu jeito.'}
          </p>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted max-sm:hidden">
            Perfil, aparência, segurança da conta e organização do painel. O progresso fica salvo neste navegador até a conexão
            com o banco, na Etapa 03.
          </p>
          <Progress value={pct} label="Progresso da configuração inicial" className="mt-5 lg:hidden" />
          <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-6">
            <MovingBorderFrame>
              <Link
                to="/boas-vindas"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-text px-4 text-sm font-medium text-bg transition-[filter] hover:brightness-110"
              >
                {cta} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </MovingBorderFrame>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={listId}
              className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:text-text lg:hidden"
            >
              {open ? 'Ocultar etapas' : 'Ver etapas'}
              <ChevronDown className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
            </button>
          </div>
          <div id={listId} hidden={!open} className="mt-4 lg:hidden">
            {checklist}
          </div>
        </div>

        <div className="flex min-w-0 flex-col max-lg:hidden">
          <div className="flex items-end justify-between gap-3">
            <p className="font-display text-[3rem] leading-none font-[360] tracking-[-0.03em] text-text">
              <CountingNumber value={done} />
              <span className="text-[1.5rem] text-faint">/{total}</span>
            </p>
            <p className="pb-1 text-[0.8125rem] text-muted">{progress.finished ? 'Concluída' : 'etapas concluídas'}</p>
          </div>
          <Progress value={pct} label="Progresso da configuração inicial" className="mt-4" />
          <div className="mt-3">{checklist}</div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Orçamento ───────── */

function BudgetWidget() {
  const LIMIT = 50
  const ALERT = 30
  return (
    <InfoFrame title="Orçamento mensal" meta="Custos de operação em provedores" aside={<PhaseBadge phase="Etapa 03" />}>
      <div className="flex items-baseline gap-2">
        <span className="text-[2.25rem] font-light leading-none tracking-[-0.02em] text-faint tabular" aria-label="Consumo sem dados">
          —
        </span>
        <span className="text-sm text-muted">de R$ 50,00</span>
      </div>
      <p className="mt-1.5 text-sm text-muted">Sem dados de consumo. A medição começa na Etapa 03.</p>
      <div className="mt-6" aria-hidden>
        <div className="relative h-2 rounded-full bg-sunken shadow-[inset_0_0_0_1px_var(--border)]">
          <span className="absolute inset-y-[-5px] w-px bg-warning" style={{ left: `${(ALERT / LIMIT) * 100}%` }} />
        </div>
        <div className="relative mt-2 h-4 text-[0.75rem] tabular text-muted">
          <span className="absolute left-0">R$ 0</span>
          <span className="absolute -translate-x-1/2 text-warning" style={{ left: `${(ALERT / LIMIT) * 100}%` }}>
            Alerta R$ 30
          </span>
          <span className="absolute right-0">Limite R$ 50</span>
        </div>
      </div>
      <p className="mt-auto pt-5 text-[0.8125rem] text-muted">O limite bloqueia novas operações pagas controladas pelo Or7 Works. Provedores podem cobrar à parte.</p>
    </InfoFrame>
  )
}

/* ───────── Feed vazio (atividade / agenda) ───────── */

function EmptyFeed({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="grid flex-1 grid-cols-[20px_minmax(0,1fr)] gap-4">
      <div className="flex flex-col items-center pt-1" aria-hidden>
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-sunken text-muted ring-1 ring-border">
          <Icon className="size-3" />
        </span>
        <span className="mt-1.5 w-px flex-1 bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_8px)]" />
      </div>
      <div className="pb-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 max-w-[48ch] text-[0.8125rem] leading-relaxed text-muted">{children}</p>
      </div>
    </div>
  )
}

export const WIDGETS: Record<WidgetId, WidgetDef> = {
  'primeiros-passos': {
    id: 'primeiros-passos',
    title: 'Configuração inicial',
    description: 'Progresso do onboarding e atalho para continuar.',
    kind: 'hero',
    render: () => <OnboardingHero />,
  },
  'estado-sistema': {
    id: 'estado-sistema',
    title: 'Estado do sistema',
    description: 'O que já está ativo e o que entra em cada etapa.',
    kind: 'info',
    render: () => (
      <InfoFrame title="Estado do sistema" meta="Fase 01 · Etapa 01 de 04">
        <ul className="-my-1 divide-y divide-border/70">
          <StatusRow label="Interface" status="Ativa" done />
          <StatusRow label="Login e MFA" status="Etapa 02" />
          <StatusRow label="Banco de dados" status="Etapa 02" />
          <StatusRow label="Notificações" status="Etapa 03" />
          <StatusRow label="Backup externo" status="Etapa 03" />
        </ul>
      </InfoFrame>
    ),
  },
  leads: {
    id: 'leads',
    title: 'Leads descobertos',
    description: 'Empresas encontradas no período.',
    kind: 'metric',
    usesPeriod: true,
    render: ({ period }) => <MetricCard icon={Users} title="Leads descobertos" period={period} phase="Fase 02" note="A descoberta de leads começa na Fase 02." to="/leads" />,
  },
  auditorias: {
    id: 'auditorias',
    title: 'Auditorias concluídas',
    description: 'Auditorias revisadas no período.',
    kind: 'metric',
    usesPeriod: true,
    render: ({ period }) => (
      <MetricCard icon={ScanSearch} title="Auditorias concluídas" period={period} phase="Fase 03" note="Auditorias com agentes chegam na Fase 03." to="/auditorias" />
    ),
  },
  propostas: {
    id: 'propostas',
    title: 'Propostas em aberto',
    description: 'Propostas enviadas aguardando resposta.',
    kind: 'metric',
    usesPeriod: true,
    render: ({ period }) => (
      <MetricCard icon={FileSignature} title="Propostas em aberto" period={period} phase="Fase 04" note="Propostas e contratos chegam na Fase 04." to="/propostas" />
    ),
  },
  receita: {
    id: 'receita',
    title: 'Receita',
    description: 'Entradas registradas no período.',
    kind: 'metric',
    usesPeriod: true,
    render: ({ period }) => <MetricCard icon={Wallet} title="Receita" period={period} phase="Fase 05" note="O módulo financeiro chega na Fase 05." to="/financeiro" />,
  },
  orcamento: {
    id: 'orcamento',
    title: 'Orçamento mensal',
    description: 'Consumo de provedores frente ao teto de R$ 50.',
    kind: 'info',
    render: () => <BudgetWidget />,
  },
  atividade: {
    id: 'atividade',
    title: 'Atividade recente',
    description: 'Eventos de segurança e do sistema.',
    kind: 'feed',
    usesPeriod: true,
    render: ({ period }) => (
      <InfoFrame title="Atividade recente" meta={describePeriod(period)}>
        <EmptyFeed icon={History} title="Nenhuma atividade registrada">
          Entradas, alterações de segurança e execuções de backup aparecerão aqui quando o registro de eventos for conectado, na
          Etapa 03.
        </EmptyFeed>
      </InfoFrame>
    ),
  },
  agenda: {
    id: 'agenda',
    title: 'Próximos compromissos',
    description: 'Prazos e compromissos dos próximos dias.',
    kind: 'feed',
    render: () => (
      <InfoFrame title="Próximos compromissos" meta="Próximos 7 dias" aside={<PhaseBadge phase="Fase futura" />}>
        <EmptyFeed icon={CalendarDays} title="Nenhum compromisso">
          O calendário vai reunir prazos de projetos, propostas e contratos quando esses módulos existirem.
        </EmptyFeed>
      </InfoFrame>
    ),
  },
  seguranca: {
    id: 'seguranca',
    title: 'Segurança da conta',
    description: 'MFA, códigos de backup e sessões.',
    kind: 'info',
    render: () => (
      <InfoFrame title="Segurança da conta" meta="Conta única, sem cadastro público" aside={<ShieldCheck className="size-4 text-muted" aria-hidden />}>
        <ul className="-my-1 divide-y divide-border/70">
          <StatusRow label="Verificação em duas etapas" status="Etapa 02" />
          <StatusRow label="Códigos de backup" status="Etapa 02" />
          <StatusRow label="Sessões ativas" status="Etapa 02" />
        </ul>
        <Link to="/configuracoes/seguranca" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.8125rem] font-medium text-accent hover:underline">
          Ver segurança <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </InfoFrame>
    ),
  },
}
