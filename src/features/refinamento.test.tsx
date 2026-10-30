import { describe, expect, it, vi } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PreferencesProvider } from '@/app/preferences'
import { StatefulButton } from '@/components/ui/actions'
import { Segmented } from '@/components/ui/controls'
import { renderRoute } from '@/test/render'
import { mobileSpans, DashboardPage } from './dashboard/DashboardPage'
import { OnboardingPage } from './onboarding/OnboardingPage'

describe('Bento no celular', () => {
  it('indicadores em pares; o último de uma sequência ímpar ocupa a linha inteira', () => {
    const spans = mobileSpans([
      { id: 'primeiros-passos', size: 'L' },
      { id: 'leads', size: 'S' },
      { id: 'auditorias', size: 'S' },
      { id: 'propostas', size: 'S' },
      { id: 'orcamento', size: 'M' },
      { id: 'receita', size: 'S' },
      { id: 'agenda', size: 'S' },
    ])
    expect(spans).toEqual(['col-span-2', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2'])
  })

  it('cartão principal usa contagem real do onboarding e indicadores continuam sem número', () => {
    localStorage.setItem('or7works:onboarding', JSON.stringify({ current: 2, completed: ['boas-vindas', 'perfil'], finished: false }))
    renderRoute(<DashboardPage />)
    const hero = screen.getByRole('region', { name: 'Configuração inicial' })
    expect(within(hero).getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '40')
    for (const name of ['Leads descobertos', 'Auditorias concluídas', 'Propostas em aberto']) {
      const card = screen.getByRole('region', { name })
      expect(within(card).getByLabelText('Sem dados')).toHaveTextContent('—')
      expect(within(card).queryByText(/^\d+$/)).toBeNull()
    }
  })

  it('etapas do cartão principal podem ser expandidas no celular', async () => {
    const user = userEvent.setup()
    renderRoute(<DashboardPage />)
    const toggle = screen.getByRole('button', { name: 'Ver etapas' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Ocultar etapas' })).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Stateful Button', () => {
  it('executa a ação, confirma e só então chama onDone', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const action = vi.fn()
    const done = vi.fn()
    render(
      <PreferencesProvider>
        <StatefulButton onAction={action} onDone={done} doneLabel="Layout salvo">
          Salvar layout
        </StatefulButton>
      </PreferencesProvider>,
    )
    await act(async () => {
      screen.getByRole('button', { name: 'Salvar layout' }).click()
    })
    expect(action).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Layout salvo' })).toBeDisabled()
    expect(done).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(1300)
    })
    expect(done).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})

describe('Controle segmentado (Animate UI Tabs)', () => {
  it('mantém seleção única acessível ao trocar de opção', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <PreferencesProvider>
        <Segmented
          label="Período"
          value="30"
          onValueChange={onChange}
          options={[
            { value: '7', label: '7 dias' },
            { value: '30', label: '30 dias' },
          ]}
        />
      </PreferencesProvider>,
    )
    expect(screen.getByRole('radio', { name: '30 dias' })).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('radio', { name: '7 dias' }))
    expect(onChange).toHaveBeenCalledWith('7')
  })
})

describe('Onboarding com Stepper', () => {
  it('avança, marca a etapa como concluída e persiste o progresso', async () => {
    const user = userEvent.setup()
    renderRoute(<OnboardingPage />, '/boas-vindas')
    expect(screen.getByRole('button', { name: '1. Boas-vindas' })).toHaveAttribute('aria-current', 'step')
    await user.click(screen.getByRole('button', { name: /Começar/ }))
    expect(await screen.findByRole('heading', { name: 'Como devemos chamar você?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1. Boas-vindas, concluída' })).toBeEnabled()
    const saved = JSON.parse(localStorage.getItem('or7works:onboarding')!)
    expect(saved).toMatchObject({ current: 1, completed: ['boas-vindas'] })
  })
})
