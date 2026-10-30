/**
 * Persistência local provisória (Etapa 01).
 * Na Etapa 03 estas chaves migram para as tabelas user_preferences,
 * dashboard_layouts e onboarding_progress no Supabase.
 * Nunca guardar aqui dados sensíveis, tokens ou credenciais.
 */
const PREFIX = 'or7works:'

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Armazenamento indisponível (modo privado/cota): a interface segue com o estado em memória.
  }
}

export function removeLocal(key: string) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignorado */
  }
}
