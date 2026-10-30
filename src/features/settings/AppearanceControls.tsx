import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { usePreferences, type MotionMode, type ThemeMode } from '@/app/preferences'
import { Segmented } from '@/components/ui/controls'
import { ACCENTS } from '@/design-system/accents'
import { cn } from '@/lib/cn'

/** Tema, cor de destaque e movimento — compartilhado entre onboarding e Configurações. */
export function AppearanceControls() {
  const { theme, accent, motion, resolvedTheme, setPreference } = usePreferences()
  return (
    <div className="grid gap-7">
      <div className="grid gap-2">
        <p id="theme-label" className="text-sm font-medium">
          Tema
        </p>
        <Segmented<ThemeMode>
          label="Tema"
          value={theme}
          onValueChange={(v) => setPreference('theme', v)}
          className="w-full max-w-sm"
          options={[
            { value: 'light', label: <><Sun aria-hidden /> Claro</> },
            { value: 'dark', label: <><Moon aria-hidden /> Escuro</> },
            { value: 'system', label: <><Monitor aria-hidden /> Sistema</> },
          ]}
        />
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Cor de destaque</legend>
        <div className="flex flex-wrap gap-2.5">
          {ACCENTS.map((a) => {
            const selected = accent === a.id
            return (
              <label
                key={a.id}
                className={cn(
                  'flex h-11 cursor-pointer items-center gap-2.5 rounded-full border bg-surface pl-1.5 pr-4 text-sm transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
                  selected ? 'border-text' : 'border-border hover:border-border-strong',
                )}
              >
                <input
                  type="radio"
                  name="accent"
                  value={a.id}
                  checked={selected}
                  onChange={() => setPreference('accent', a.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="inline-flex size-8 items-center justify-center rounded-full"
                  style={{ background: resolvedTheme === 'dark' ? a.dark : a.light }}
                >
                  {selected && <Check className="size-4" style={{ color: resolvedTheme === 'dark' ? '#10212F' : '#FFFFFF' }} />}
                </span>
                {a.label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <p className="text-sm font-medium">Movimento</p>
        <Segmented<MotionMode>
          label="Movimento"
          value={motion}
          onValueChange={(v) => setPreference('motion', v)}
          className="w-full max-w-sm"
          options={[
            { value: 'system', label: 'Seguir o sistema' },
            { value: 'reduce', label: 'Reduzir' },
          ]}
        />
        <p className="text-[0.8125rem] text-muted">"Reduzir" desliga transições e efeitos mesmo que o sistema permita.</p>
      </div>
    </div>
  )
}
