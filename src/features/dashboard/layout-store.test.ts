import { describe, expect, it } from 'vitest'
import { DEFAULT_LAYOUT, describePeriod, loadLayout, moveItem, saveLayout } from './layout-store'

describe('layout do painel', () => {
  it('usa o layout padrão sem dados salvos', () => {
    expect(loadLayout()).toEqual(DEFAULT_LAYOUT)
  })

  it('volta ao padrão se o armazenamento estiver corrompido', () => {
    localStorage.setItem('or7works:dashboard-layout', '{nao é json')
    expect(loadLayout()).toEqual(DEFAULT_LAYOUT)
  })

  it('descarta entradas inválidas e preserva as válidas', () => {
    localStorage.setItem('or7works:dashboard-layout', JSON.stringify([{ id: 'leads', size: 'L' }, { id: 'x', size: 'Z' }, null]))
    expect(loadLayout()).toEqual([{ id: 'leads', size: 'L' }])
  })

  it('persiste e recarrega', () => {
    saveLayout([{ id: 'agenda', size: 'XL' }])
    expect(loadLayout()).toEqual([{ id: 'agenda', size: 'XL' }])
  })

  it('move itens e ignora movimentos fora dos limites', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(moveItem(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b'])
    const same = ['a', 'b']
    expect(moveItem(same, 0, -1)).toBe(same)
    expect(moveItem(same, 1, 2)).toBe(same)
  })

  it('descreve os períodos', () => {
    expect(describePeriod({ preset: '7' })).toBe('Últimos 7 dias')
    expect(describePeriod({ preset: 'custom' })).toBe('Período personalizado')
    expect(describePeriod({ preset: 'custom', from: '2026-10-01', to: '2026-10-15' })).toMatch(/01 de out.*15 de out/)
  })
})
