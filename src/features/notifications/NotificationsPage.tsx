import { useState } from 'react'
import { BellOff } from 'lucide-react'
import { PhaseBadge } from '@/components/ui/badge'
import { EmptyState, PageHeader, Panel, Segmented } from '@/components/ui/controls'

type Filter = 'todas' | 'nao-lidas'

export function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>('todas')
  return (
    <>
      <PageHeader
        title="Notificações"
        description="Eventos reais do sistema: segurança, backup e orçamento. Nada é gerado para preencher a lista."
        meta={<PhaseBadge phase="Central ativa na Etapa 03" />}
        actions={
          <Segmented<Filter>
            label="Filtrar notificações"
            size="sm"
            value={filter}
            onValueChange={setFilter}
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'nao-lidas', label: 'Não lidas' },
            ]}
          />
        }
      />
      <Panel className="px-5 py-10 sm:px-8">
        <EmptyState icon={BellOff} title={filter === 'todas' ? 'Nenhuma notificação' : 'Nenhuma notificação não lida'}>
          Quando o registro de eventos for conectado, avisos como um novo acesso à conta, uma falha no backup diário ou o
          alerta de orçamento em R$ 30 vão aparecer aqui, com marcação de lido e não lido.
        </EmptyState>
      </Panel>
    </>
  )
}
