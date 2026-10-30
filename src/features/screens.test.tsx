import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MODULES } from '@/app/navigation'
import { renderRoute } from '@/test/render'
import { LoginPage } from './auth/LoginPage'
import { DashboardPage } from './dashboard/DashboardPage'
import { WidgetEditorPage } from './dashboard/WidgetEditorPage'
import { ModulePage } from './modules/ModulePage'
import { NotificationsPage } from './notifications/NotificationsPage'

describe('estados honestos', () => {
  it('painel mostra "Sem dados" e nunca um zero inventado', () => {
    renderRoute(<DashboardPage />)
    expect(screen.getAllByText('Sem dados').length).toBeGreaterThanOrEqual(3)
    const leads = screen.getByRole('region', { name: 'Leads descobertos' })
    expect(within(leads).queryByText(/^0$/)).toBeNull()
    expect(within(leads).getByLabelText('Sem dados')).toHaveTextContent('—')
  })

  it('módulos futuros não exibem botões de ação', () => {
    for (const m of MODULES) {
      const { unmount } = renderRoute(<ModulePage module={m} />)
      expect(screen.getByRole('heading', { level: 1, name: m.label })).toBeInTheDocument()
      expect(screen.queryAllByRole('button')).toHaveLength(0)
      unmount()
    }
  })

  it('central de notificações começa vazia', () => {
    renderRoute(<NotificationsPage />)
    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument()
  })
})

describe('editor de widgets', () => {
  it('reordena pelos botões, sem depender de arraste', async () => {
    const user = userEvent.setup()
    renderRoute(<WidgetEditorPage />)
    const firstTitle = () => within(screen.getAllByRole('listitem')[0]).getAllByText(/\w+/)[0].textContent
    expect(firstTitle()).toBe('Configuração inicial')
    await user.click(screen.getByRole('button', { name: 'Mover Configuração inicial para baixo' }))
    expect(firstTitle()).toBe('Estado do sistema')
    expect(screen.getByText('Alterações não salvas')).toBeInTheDocument()
  })

  it('remove, adiciona e salva no armazenamento local', async () => {
    const user = userEvent.setup()
    renderRoute(<WidgetEditorPage />)
    await user.click(screen.getByRole('button', { name: 'Remover Leads descobertos do painel' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Receita' }))
    await user.click(screen.getByRole('button', { name: 'Salvar layout' }))
    const saved = JSON.parse(localStorage.getItem('or7works:dashboard-layout')!)
    expect(saved.some((w: { id: string }) => w.id === 'leads')).toBe(false)
    expect(saved.at(-1)).toEqual({ id: 'receita', size: 'S' })
  })
})

describe('login', () => {
  it('valida campos com mensagens que explicam a correção', async () => {
    const user = userEvent.setup()
    renderRoute(<LoginPage />, '/entrar')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Informe o e-mail.')).toBeInTheDocument()
    expect(screen.getByText('Informe a senha.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('E-mail'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText(/e-mail válido/)).toBeInTheDocument()
  })

  it('não guarda a senha digitada', async () => {
    const user = userEvent.setup()
    renderRoute(<LoginPage />, '/entrar')
    await user.type(screen.getByLabelText('Senha'), 'segredo-teste')
    expect(JSON.stringify({ ...localStorage })).not.toContain('segredo-teste')
  })
})
