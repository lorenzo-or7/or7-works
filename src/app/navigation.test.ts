import { describe, expect, it } from 'vitest'
import { crumbsFor, MODULES, NAV_GROUPS, SETTINGS_SECTIONS } from './navigation'

describe('navegação', () => {
  it('inclui todos os módulos planejados no escopo da Fase 01', () => {
    const expected = ['leads', 'crm', 'auditorias', 'agentes', 'clientes', 'projetos', 'propostas', 'documentos', 'financeiro', 'calendario', 'relatorios', 'monitoramento']
    expect(MODULES.map((m) => m.id).sort()).toEqual(expected.sort())
  })

  it('não repete caminhos no menu', () => {
    const paths = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.path))
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('todo módulo futuro declara fase e texto de estado vazio', () => {
    for (const m of MODULES) {
      expect(m.phase).toMatch(/^Fase (0\d|futura)$/)
      expect(m.preview.emptyText.length).toBeGreaterThan(10)
    }
  })

  it('cobre as categorias de configurações pedidas', () => {
    expect(SETTINGS_SECTIONS.map((s) => s.id)).toEqual(['perfil', 'aparencia', 'painel', 'seguranca', 'notificacoes', 'dados', 'backup', 'sistema', 'ia-custos'])
  })

  it('gera breadcrumbs contextuais', () => {
    expect(crumbsFor('/')).toEqual([{ label: 'Painel' }])
    expect(crumbsFor('/leads')).toEqual([{ label: 'Comercial' }, { label: 'Leads' }])
    expect(crumbsFor('/configuracoes/backup')).toEqual([{ label: 'Configurações', to: '/configuracoes' }, { label: 'Backup' }])
    expect(crumbsFor('/painel/editar')[1]).toEqual({ label: 'Editar widgets' })
  })
})
