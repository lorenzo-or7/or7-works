import {
  Activity,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  ChartColumn,
  FileSignature,
  FolderKanban,
  FolderTree,
  LayoutDashboard,
  ScanSearch,
  Settings,
  SquareKanban,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type PreviewKind = 'table' | 'calendar' | 'parameters' | 'tree' | 'ledger' | 'list'

export interface ModuleDef {
  id: string
  path: string
  label: string
  icon: LucideIcon
  /** Fase do roadmap (docs/04_fases_futuras.md). */
  phase: string
  summary: string
  /** O que o módulo fará — extraído do roadmap aprovado, sem promessas adicionais. */
  plans: string[]
  /** Regras de produto já decididas que precisam ser preservadas. */
  rules?: string[]
  preview: { kind: PreviewKind; columns?: string[]; items?: { label: string; value: string }[]; emptyText: string }
}

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  phase?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const MODULES: ModuleDef[] = [
  {
    id: 'leads',
    path: '/leads',
    label: 'Leads',
    icon: Users,
    phase: 'Fase 02',
    summary: 'Descoberta de empresas com potencial de projeto, em todo o Brasil.',
    plans: [
      'Descoberta de até 10 empresas por dia no início, ampliada conforme resultado.',
      'Seis segmentos: barbearias e salões, restaurantes e cafés, clínicas e beleza, academias e estúdios, lojas e varejo, turismo e hotéis.',
      'Somente fontes legais ou licenciadas, além de importação por CSV e cadastro manual.',
    ],
    preview: {
      kind: 'table',
      columns: ['Empresa', 'Segmento', 'Cidade / UF', 'Origem', 'Descoberto em'],
      emptyText: 'Nenhum lead cadastrado. A descoberta e a importação por CSV chegam na Fase 02.',
    },
  },
  {
    id: 'crm',
    path: '/crm',
    label: 'CRM',
    icon: SquareKanban,
    phase: 'Fase 02',
    summary: 'Acompanhamento do relacionamento com cada empresa, do primeiro contato ao fechamento.',
    plans: [
      'Funil de relacionamento alimentado pelos leads descobertos.',
      'Histórico por empresa, com origem e próximas ações.',
      'As etapas do funil serão definidas junto com a Fase 02.',
    ],
    preview: { kind: 'list', emptyText: 'Nenhuma empresa no funil. O CRM depende dos leads da Fase 02.' },
  },
  {
    id: 'propostas',
    path: '/propostas',
    label: 'Propostas e contratos',
    icon: FileSignature,
    phase: 'Fase 04',
    summary: 'Propostas, negociação e contratos com assinatura externa.',
    plans: [
      'Geração de propostas em PDF a partir de modelos.',
      'Negociação e envio de contratos para assinatura por serviço externo.',
      'Contato por e-mail, WhatsApp e Instagram, com pesquisa automática prévia.',
    ],
    rules: ['Aprovação humana obrigatória antes de qualquer contato, contrato, preço ou ação relevante.'],
    preview: {
      kind: 'table',
      columns: ['Proposta', 'Empresa', 'Valor', 'Situação', 'Atualizada em'],
      emptyText: 'Nenhuma proposta ou contrato. Este módulo chega na Fase 04.',
    },
  },
  {
    id: 'auditorias',
    path: '/auditorias',
    label: 'Auditorias',
    icon: ScanSearch,
    phase: 'Fase 03',
    summary: 'Diagnóstico das páginas públicas de cada empresa, com evidências e pontuação revisável.',
    plans: [
      'Até cinco páginas públicas por empresa, com evidências em desktop e mobile.',
      'Verificações com Playwright e Lighthouse: acessibilidade, SEO e UX.',
      'Pontuações sempre revisáveis antes de qualquer uso comercial.',
    ],
    preview: {
      kind: 'table',
      columns: ['Empresa', 'Páginas', 'Acessibilidade', 'SEO', 'UX', 'Revisão'],
      emptyText: 'Nenhuma auditoria realizada. Auditorias e agentes chegam na Fase 03.',
    },
  },
  {
    id: 'agentes',
    path: '/agentes',
    label: 'Agentes',
    icon: Bot,
    phase: 'Fase 03',
    summary: 'Agentes supervisionados que executam pesquisas e auditorias em fila.',
    plans: [
      'Execução em fila com monitoramento de cada tarefa.',
      'Escolha de modelos apropriados por tarefa, com controle de custo.',
    ],
    rules: ['Nenhum agente opera na Fase 01. Assinaturas de chat (Claude, ChatGPT, Gemini, Copilot) não incluem créditos de API.'],
    preview: {
      kind: 'parameters',
      items: [
        { label: 'Supervisão humana', value: 'Obrigatória' },
        { label: 'Concorrência inicial', value: '2 tarefas' },
        { label: 'Tentativas por tarefa', value: 'Até 3, controladas' },
      ],
      emptyText: 'Nenhum agente configurado.',
    },
  },
  {
    id: 'clientes',
    path: '/clientes',
    label: 'Clientes',
    icon: Building2,
    phase: 'Fase 05',
    summary: 'Cadastro e histórico dos clientes ativos da Or7.',
    plans: ['Ficha de cliente com contratos, projetos e documentos relacionados.', 'Acompanhamento de manutenção contratada.'],
    preview: {
      kind: 'table',
      columns: ['Cliente', 'Segmento', 'Projetos', 'Desde'],
      emptyText: 'Nenhum cliente cadastrado. Este módulo chega na Fase 05.',
    },
  },
  {
    id: 'projetos',
    path: '/projetos',
    label: 'Projetos',
    icon: FolderKanban,
    phase: 'Fase 05',
    summary: 'Gestão dos projetos em andamento, em quadro Kanban.',
    plans: ['Quadro Kanban por projeto, com reorganização por arraste e por teclado.', 'Vínculo com cliente, proposta e documentos.'],
    preview: { kind: 'list', emptyText: 'Nenhum projeto. Este módulo chega na Fase 05.' },
  },
  {
    id: 'documentos',
    path: '/documentos',
    label: 'Documentos',
    icon: FolderTree,
    phase: 'Fase 05',
    summary: 'Arquivos de clientes, projetos e da própria Or7, organizados em pastas.',
    plans: ['Pastas por cliente e projeto.', 'Armazenamento privado com cobertura no backup externo.'],
    preview: { kind: 'tree', emptyText: 'Nenhum documento armazenado. Este módulo chega na Fase 05.' },
  },
  {
    id: 'financeiro',
    path: '/financeiro',
    label: 'Financeiro',
    icon: Wallet,
    phase: 'Fase 05',
    summary: 'Finanças internas da Or7: entradas, saídas e recorrências.',
    plans: ['Lançamentos de entradas e saídas.', 'Recorrências de manutenção por cliente.'],
    rules: ['Finanças internas da Or7 ficam separadas do NEXO.'],
    preview: {
      kind: 'ledger',
      items: [
        { label: 'Entradas', value: '—' },
        { label: 'Saídas', value: '—' },
        { label: 'Saldo', value: '—' },
      ],
      emptyText: 'Nenhum lançamento financeiro. Este módulo chega na Fase 05.',
    },
  },
  {
    id: 'calendario',
    path: '/calendario',
    label: 'Calendário',
    icon: CalendarDays,
    phase: 'Fase futura',
    summary: 'Compromissos, prazos de projetos e vencimentos em um só calendário.',
    plans: ['Prazos vindos de projetos, propostas e contratos.', 'A fase de implantação ainda será definida no roadmap.'],
    preview: { kind: 'calendar', emptyText: 'Nenhum compromisso registrado.' },
  },
  {
    id: 'relatorios',
    path: '/relatorios',
    label: 'Relatórios',
    icon: ChartColumn,
    phase: 'Fase 06',
    summary: 'Relatórios gerados a partir de dados reais da operação.',
    plans: ['Relatórios de leads, auditorias, propostas e finanças.', 'Exportação somente de dados existentes.'],
    rules: ['A exportação dos dados já existentes (CSV/PDF/XLSX) fica em Configurações › Dados, a partir da Etapa 03.'],
    preview: { kind: 'list', emptyText: 'Nenhum relatório disponível. Relatórios chegam na Fase 06.' },
  },
  {
    id: 'monitoramento',
    path: '/monitoramento',
    label: 'Monitoramento',
    icon: Activity,
    phase: 'Fase 06',
    summary: 'Saúde da operação: filas, agentes, modelos e custos.',
    plans: ['Monitoramento operacional de filas e agentes.', 'Acompanhamento de modelos e custos por provedor.'],
    preview: { kind: 'list', emptyText: 'Nada sendo monitorado. Este módulo chega na Fase 06.' },
  },
]

const moduleById = Object.fromEntries(MODULES.map((m) => [m.id, m]))
const nav = (id: string): NavItem => {
  const m = moduleById[id]
  return { path: m.path, label: m.label, icon: m.icon, phase: m.phase }
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Visão geral',
    items: [
      { path: '/', label: 'Painel', icon: LayoutDashboard },
      { path: '/notificacoes', label: 'Notificações', icon: Bell },
    ],
  },
  { label: 'Comercial', items: [nav('leads'), nav('crm'), nav('propostas')] },
  { label: 'Inteligência', items: [nav('auditorias'), nav('agentes')] },
  { label: 'Gestão', items: [nav('clientes'), nav('projetos'), nav('documentos'), nav('financeiro'), nav('calendario')] },
  { label: 'Operação', items: [nav('relatorios'), nav('monitoramento')] },
]

export const SETTINGS_NAV: NavItem = { path: '/configuracoes', label: 'Configurações', icon: Settings }

export const SETTINGS_SECTIONS = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'aparencia', label: 'Aparência' },
  { id: 'painel', label: 'Painel' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'notificacoes', label: 'Notificações' },
  { id: 'dados', label: 'Dados' },
  { id: 'backup', label: 'Backup' },
  { id: 'sistema', label: 'Sistema' },
  { id: 'ia-custos', label: 'IA e custos' },
] as const

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]['id']

/** Rótulos para breadcrumbs, por caminho. */
export function crumbsFor(pathname: string): { label: string; to?: string }[] {
  if (pathname === '/') return [{ label: 'Painel' }]
  if (pathname === '/painel/editar') return [{ label: 'Painel', to: '/' }, { label: 'Editar widgets' }]
  if (pathname === '/notificacoes') return [{ label: 'Notificações' }]
  if (pathname.startsWith('/configuracoes')) {
    const id = pathname.split('/')[2]
    const section = SETTINGS_SECTIONS.find((s) => s.id === id)
    return section ? [{ label: 'Configurações', to: '/configuracoes' }, { label: section.label }] : [{ label: 'Configurações' }]
  }
  const mod = MODULES.find((m) => m.path === pathname)
  if (mod) {
    const group = NAV_GROUPS.find((g) => g.items.some((i) => i.path === mod.path))
    return [{ label: group?.label ?? 'Módulos' }, { label: mod.label }]
  }
  return [{ label: 'Página não encontrada' }]
}
