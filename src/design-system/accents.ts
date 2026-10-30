export type AccentId = 'glacier' | 'fiorde' | 'ameixa' | 'terra' | 'grafite'

/** Espelha tokens.css — usado apenas para amostras na interface. */
export const ACCENTS: { id: AccentId; label: string; light: string; dark: string }[] = [
  { id: 'glacier', label: 'Glacier (padrão)', light: '#356A88', dark: '#91C2DE' },
  { id: 'fiorde', label: 'Fiorde', light: '#2E6B64', dark: '#8DCBC2' },
  { id: 'ameixa', label: 'Ameixa', light: '#6B4E80', dark: '#C7B1DC' },
  { id: 'terra', label: 'Terra', light: '#8A5530', dark: '#E2B48C' },
  { id: 'grafite', label: 'Grafite', light: '#44505E', dark: '#C2CCD7' },
]
