import { useState, type ReactNode } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { SETTINGS_SECTIONS, type SettingsSectionId } from '@/app/navigation'
import { usePreferences } from '@/app/preferences'
import { Badge, PhaseBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, Switch } from '@/components/ui/controls'
import { Field, Input } from '@/components/ui/input'
import { DEFAULT_LAYOUT, saveLayout } from '@/features/dashboard/layout-store'
import { useOnboarding } from '@/features/onboarding/onboarding-store'
import { cn } from '@/lib/cn'
import { AppearanceControls } from './AppearanceControls'

function Row({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description ? <div className="mt-0.5 max-w-[60ch] text-[0.8125rem] text-muted">{description}</div> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  )
}

function Group({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="grid gap-3" aria-label={title}>
      <div>
        <h2 className="text-[0.9375rem] font-semibold">{title}</h2>
        {description ? <p className="mt-0.5 max-w-[64ch] text-[0.8125rem] text-muted">{description}</p> : null}
      </div>
      <Panel className="divide-y divide-border">{children}</Panel>
    </section>
  )
}

const Pending = ({ children }: { children: ReactNode }) => <span className="text-[0.8125rem] text-muted">{children}</span>

function ProfileSection() {
  const { displayName, setPreference } = usePreferences()
  const [name, setName] = useState(displayName)
  return (
    <Group title="Perfil" description="Conta única da Or7. Não há outros usuários nesta fase.">
      <form
        className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,22rem)_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          setPreference('displayName', name.trim())
          toast.success('Nome de exibição salvo', { description: 'Salvo neste navegador até a Etapa 03.' })
        }}
      >
        <Field id="profile-name" label="Nome de exibição" hint="Usado na saudação do painel e no menu da conta.">
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" aria-describedby="profile-name-hint" />
        </Field>
        <Button type="submit" variant="primary" disabled={name.trim() === displayName} className="sm:mb-6">
          Salvar
        </Button>
      </form>
      <Row title="E-mail da conta" description="Definido na criação segura da conta administradora.">
        <PhaseBadge phase="Etapa 02" />
      </Row>
    </Group>
  )
}

function AppearanceSection() {
  const { sidebarPinned, setPreference } = usePreferences()
  return (
    <>
      <Group title="Aparência" description="Preferências salvas neste navegador; passam para o banco na Etapa 03.">
        <div className="px-5 py-5">
          <AppearanceControls />
        </div>
      </Group>
      <Group title="Navegação">
        <Row title="Manter barra lateral fixada" description="Desligado, a barra vira um trilho de ícones que abre ao passar o mouse ou focar com o teclado.">
          <Switch checked={sidebarPinned} onCheckedChange={(v) => setPreference('sidebarPinned', v)} aria-label="Manter barra lateral fixada" />
        </Row>
      </Group>
    </>
  )
}

function DashboardSection() {
  return (
    <Group title="Painel" description="Organização dos widgets da página inicial.">
      <Row title="Widgets e ordem" description="Reordene por arraste ou por botões, ajuste larguras, adicione ou remova widgets.">
        <Button asChild size="sm">
          <Link to="/painel/editar">Abrir editor</Link>
        </Button>
      </Row>
      <Row title="Restaurar layout padrão" description="Volta aos widgets e larguras iniciais.">
        <Button
          size="sm"
          onClick={() => {
            saveLayout(DEFAULT_LAYOUT)
            toast.success('Layout padrão restaurado')
          }}
        >
          Restaurar
        </Button>
      </Row>
    </Group>
  )
}

function SecuritySection() {
  return (
    <Group title="Segurança" description="Tudo nesta seção é conectado na Etapa 02, com verificação feita no servidor e no banco (RLS com aal2).">
      <Row title="Senha" description="Troca de senha com confirmação por verificação em duas etapas.">
        <PhaseBadge phase="Etapa 02" />
      </Row>
      <Row title="Verificação em duas etapas (TOTP)" description="Obrigatória para acessar dados protegidos.">
        <Badge tone="accent">Obrigatória</Badge>
        <PhaseBadge phase="Etapa 02" />
      </Row>
      <Row title="Códigos de backup" description="Uso único, guardados com hash e com limite de tentativas.">
        <PhaseBadge phase="Etapa 02" />
      </Row>
      <Row title="Sessões ativas" description="Dispositivos conectados, com opção de encerrar sessões.">
        <PhaseBadge phase="Etapa 02" />
      </Row>
    </Group>
  )
}

function NotificationsSection() {
  return (
    <Group title="Notificações" description="Somente eventos reais do sistema. Preferências por tipo chegam com a central, na Etapa 03.">
      <Row title="Segurança" description="Novo acesso, alteração de senha ou de verificação em duas etapas.">
        <PhaseBadge phase="Etapa 03" />
      </Row>
      <Row title="Backup" description="Falha ou atraso na cópia diária.">
        <PhaseBadge phase="Etapa 03" />
      </Row>
      <Row title="Orçamento" description="Aviso ao atingir R$ 30 no mês e bloqueio de novas operações pagas em R$ 50.">
        <PhaseBadge phase="Etapa 03" />
      </Row>
      <Row title="Agentes e prospecção" description="Avisos de agentes só existirão quando eles existirem.">
        <PhaseBadge phase="Fase 03" />
      </Row>
    </Group>
  )
}

function DataSection() {
  return (
    <>
      <Group title="Exportação e importação">
        <Row title="Exportar dados existentes" description="CSV, PDF ou XLSX, apenas com dados que de fato existirem.">
          <PhaseBadge phase="Etapa 03" />
        </Row>
        <Row title="Importar leads por CSV" description="Junto com o módulo de leads.">
          <PhaseBadge phase="Fase 02" />
        </Row>
      </Group>
      <Group title="Dados neste navegador" description="Enquanto não há banco, tema, cor de destaque, barra lateral, layout do painel e progresso do onboarding ficam no armazenamento local. Nenhuma senha ou dado sensível é guardado.">
        <Row title="Apagar preferências locais" description="Volta tudo ao padrão neste navegador.">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (!window.confirm('Apagar tema, layout do painel e progresso do onboarding guardados neste navegador?')) return
              Object.keys(localStorage)
                .filter((k) => k.startsWith('or7works:'))
                .forEach((k) => localStorage.removeItem(k))
              window.location.assign('/')
            }}
          >
            Apagar
          </Button>
        </Row>
      </Group>
    </>
  )
}

function BackupSection() {
  return (
    <Group title="Backup" description="Planejado para a Etapa 03. Até lá, não existe cópia de segurança configurada.">
      <Row title="Situação">
        <Badge tone="warning">Não configurado</Badge>
      </Row>
      <Row title="Frequência e destino" description="Cópia diária automática, fora da conta do banco, cifrada e com verificação de integridade. O destino ainda depende de definição e credenciais.">
        <PhaseBadge phase="Etapa 03" />
      </Row>
      <Row title="Restauração" description="Procedimento documentado e testado em ambiente isolado.">
        <PhaseBadge phase="Etapa 03" />
      </Row>
      <Row title="Execuções" description="Histórico com data, tamanho, verificação e falhas.">
        <Pending>Nenhuma execução</Pending>
      </Row>
    </Group>
  )
}

function SystemSection() {
  const navigate = useNavigate()
  const { reset } = useOnboarding()
  return (
    <>
      <Group title="Sistema">
        <Row title="Versão">
          <span className="text-sm tabular">{__APP_VERSION__}</span>
        </Row>
        <Row title="Ambiente" description="Interface sem backend. Autenticação na Etapa 02, dados reais na Etapa 03.">
          <Badge tone="warning">Pré-visualização local</Badge>
        </Row>
        <Row title="Progresso da Fase 01">
          <span className="text-sm">Etapa 01 de 04 · UI/UX</span>
        </Row>
        <Row title="Idioma">
          <span className="text-sm">Português (Brasil)</span>
        </Row>
        <Row title="App instalável (PWA)" description="Funciona apenas online; sem cache de dados privados.">
          <PhaseBadge phase="Etapa 02" />
        </Row>
      </Group>
      <Group title="Configuração inicial">
        <Row title="Refazer configuração inicial" description="Abre de novo o passo a passo do primeiro acesso.">
          <Button
            size="sm"
            onClick={() => {
              reset()
              navigate('/boas-vindas')
            }}
          >
            Refazer
          </Button>
        </Row>
      </Group>
    </>
  )
}

function AiCostsSection() {
  return (
    <>
      <Group title="Orçamento" description="Limites definidos no plano da Fase 01. A medição de consumo começa na Etapa 03.">
        <Row title="Teto mensal" description="Novas operações pagas controladas pelo Or7 Works são bloqueadas ao atingir o teto.">
          <span className="text-sm font-medium tabular">R$ 50,00</span>
        </Row>
        <Row title="Alerta" description="Aviso ao atingir este valor no mês.">
          <span className="text-sm font-medium tabular">R$ 30,00</span>
        </Row>
        <Row title="Consumo no mês">
          <Pending>Sem dados</Pending>
        </Row>
        <Row
          title="Limites dos provedores"
          description="O bloqueio vale para o que o Or7 Works controla. Provedores podem cobrar à parte; não há teto universal garantido."
        />
      </Group>
      <Group title="Inteligência artificial">
        <Row title="Agentes" description="Nenhum agente opera nesta fase.">
          <PhaseBadge phase="Fase 03" />
        </Row>
        <Row title="Provedores de modelo" description="Nenhuma chave de API conectada.">
          <Pending>Nenhum</Pending>
        </Row>
        <Row
          title="Assinaturas e APIs"
          description="Assinaturas de chat (Claude Pro, ChatGPT Pro, Gemini Pro, Copilot) não incluem créditos de API. Uso por API é cobrado à parte."
        />
      </Group>
    </>
  )
}

const SECTIONS: Record<SettingsSectionId, () => ReactNode> = {
  perfil: ProfileSection,
  aparencia: AppearanceSection,
  painel: DashboardSection,
  seguranca: SecuritySection,
  notificacoes: NotificationsSection,
  dados: DataSection,
  backup: BackupSection,
  sistema: SystemSection,
  'ia-custos': AiCostsSection,
}

export function SettingsPage() {
  const { secao } = useParams()
  if (secao && !(secao in SECTIONS)) return <Navigate to="/configuracoes" replace />
  const active = (secao ?? 'perfil') as SettingsSectionId
  const Section = SECTIONS[active]

  return (
    <>
      <div className={cn(secao && 'hidden md:block')}>
        <PageHeader title="Configurações" description="Perfil, aparência, painel, segurança e sistema, em um só lugar." />
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Navegação de seções: lista no celular (sem seção aberta), coluna fixa no desktop */}
        <nav aria-label="Seções de configurações" className={cn(secao ? 'hidden md:block' : 'block')}>
          <ul className="grid gap-0.5 md:sticky md:top-20">
            {SETTINGS_SECTIONS.map((s) => (
              <li key={s.id}>
                <NavLink
                  to={`/configuracoes/${s.id}`}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-11 items-center justify-between rounded-md px-3 text-sm transition-colors duration-150 md:min-h-9',
                      isActive || (!secao && s.id === 'perfil')
                        ? 'md:bg-accent-soft md:font-medium md:text-text'
                        : 'text-muted hover:bg-sunken hover:text-text',
                      'max-md:border-b max-md:border-border max-md:text-[0.9375rem] max-md:text-text',
                    )
                  }
                >
                  {s.label}
                  <ChevronRight className="size-4 text-faint md:hidden" aria-hidden />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cn('grid min-w-0 content-start gap-8', !secao && 'hidden md:grid')}>
          {secao ? (
            <div className="md:hidden">
              <Link to="/configuracoes" className="mb-2 inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-text">
                <ArrowLeft className="size-4" aria-hidden /> Configurações
              </Link>
              <h1 className="font-display text-[2rem] leading-tight font-[440]">{SETTINGS_SECTIONS.find((s) => s.id === active)?.label}</h1>
            </div>
          ) : null}
          <Section />
        </div>
      </div>
    </>
  )
}
