import { useEffect, useState, type ReactNode } from 'react'
import { Info, KeyRound, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { usePreferences } from '@/app/preferences'
import { BlurText, OrbBackground, ShinyText } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { BrandMark, Wordmark } from '@/features/shell/Logo'

const EDITORIAL_BG = '#0B1118'

function useIsDesktop() {
  const query = '(min-width: 1024px)'
  const [match, setMatch] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return match
}

/** Aviso de pré-visualização: sempre visível, mas sem competir com o formulário. */
export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <p role="note" className="flex items-start gap-2 border-l border-warning pl-3 text-[0.8125rem] leading-relaxed text-muted">
      <Info className="mt-[3px] size-3.5 shrink-0 text-warning" aria-hidden />
      <span>
        <span className="font-medium text-warning">Pré-visualização.</span> {children}
      </span>
    </p>
  )
}

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setPreference } = usePreferences()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={resolvedTheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
      onClick={() => setPreference('theme', resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

export function AuthLayout({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  // Um único contexto WebGL por vez: o Orb grande no desktop ou a faixa compacta no celular.
  const desktop = useIsDesktop()
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
      {/* Painel editorial — sempre escuro; o Orb é o protagonista */}
      <aside
        data-theme="dark"
        style={{ background: EDITORIAL_BG }}
        className="relative hidden overflow-hidden text-text lg:flex lg:flex-col lg:p-12 xl:p-16"
      >
                <div className="relative flex items-center gap-3">
          <BrandMark className="bg-text text-bg" />
          <ShinyText onDark trigger="loop" delay={7} className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
            Or7 Works
          </ShinyText>
        </div>

        {/* Área do Orb: ocupa o espaço livre entre a marca e o texto, sem cruzar o título */}
        <div className="relative -mx-6 my-4 min-h-0 flex-1">
          {desktop && <OrbBackground background={EDITORIAL_BG} className="absolute inset-0" />}
        </div>

        <div className="relative">
          <h2 className="max-w-[14ch] font-display text-[3rem] leading-[1.02] font-[360] tracking-[-0.03em] xl:text-[3.5rem]">
            <BlurText text="O trabalho da Or7, num só lugar." />
          </h2>
          <p className="mt-5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted">
            Centro operacional privado: comercial, clientes, projetos, documentos e finanças da Or7.
          </p>
          <div className="mt-8 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted">
            <li className="inline-flex items-center gap-2">
              <UserRound className="size-3.5" aria-hidden /> Conta única
            </li>
            <li className="inline-flex items-center gap-2">
              <KeyRound className="size-3.5" aria-hidden /> Verificação em duas etapas
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5" aria-hidden /> Sem cadastro público
            </li>
          </ul>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-col">
        {/* Faixa editorial compacta no celular/tablet: mesma identidade, sem roubar a tela do formulário */}
        <div
          data-theme="dark"
          style={{ background: EDITORIAL_BG }}
          className="pt-safe relative h-[188px] shrink-0 overflow-hidden text-text sm:h-[220px] lg:hidden"
        >
          {!desktop && <OrbBackground background={EDITORIAL_BG} className="absolute right-[-150px] top-1/2 aspect-square w-[330px] -translate-y-1/2 sm:right-[2%] sm:w-[400px]" />}
          <div className="relative flex h-full flex-col justify-between px-5 pb-5 pt-4 sm:px-10">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-7 bg-text text-bg" />
              <Wordmark />
            </div>
            <p className="max-w-[11ch] font-display text-[1.625rem] sm:max-w-[14ch] sm:text-[1.875rem] leading-[1.05] font-[380] tracking-[-0.02em]">
              <BlurText text="O trabalho da Or7, num só lugar." />
            </p>
          </div>
        </div>

        <ThemeToggle className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] z-10 max-lg:text-[#A5B6C5] max-lg:hover:bg-white/10 max-lg:hover:text-white lg:right-6 lg:top-6" />

        <div className="flex flex-1 flex-col px-5 pb-[max(24px,env(safe-area-inset-bottom))] sm:px-10">
          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col pb-8 pt-7 lg:justify-center lg:py-12">
            <div className="lg:rounded-2xl lg:border lg:border-border lg:bg-surface lg:p-9 lg:shadow-[0_1px_2px_rgb(16_23_32/0.04),0_24px_48px_-28px_rgb(16_23_32/0.28)]">
              <h1 className="font-display text-[2rem] leading-[1.08] font-[420] tracking-[-0.022em]">{title}</h1>
              {description ? <div className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{description}</div> : null}
              <div className="mt-7">{children}</div>
            </div>
          </div>
          <p className="text-center text-[0.75rem] text-muted">Or7 Works · uso interno da Or7</p>
        </div>
      </main>
    </div>
  )
}
