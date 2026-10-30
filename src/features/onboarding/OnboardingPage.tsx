import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, KeyRound, LifeBuoy, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { usePreferences } from '@/app/preferences'
import { BlurText, CountingNumber, Progress, ShinyText, Sparkles, useMotionReduced } from '@/components/motion'
import { PrimaryAction } from '@/components/ui/actions'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { BrandMark, Wordmark } from '@/features/shell/Logo'
import { saveLayout, PRESETS } from '@/features/dashboard/layout-store'
import { cn } from '@/lib/cn'
import { AppearanceControls } from '@/features/settings/AppearanceControls'
import { ONBOARDING_STEPS, useOnboarding } from './onboarding-store'
import { Stepper } from './Stepper'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { progress, update } = useOnboarding()
  const { displayName, setPreference } = usePreferences()
  const [name, setName] = useState(displayName)
  const [preset, setPreset] = useState(PRESETS[0].id)
  const [direction, setDirection] = useState(1)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useMotionReduced()
  const step = ONBOARDING_STEPS[progress.current]
  const pct = Math.round((progress.completed.length / ONBOARDING_STEPS.length) * 100)

  useEffect(() => {
    headingRef.current?.focus()
  }, [progress.current])

  const go = (i: number) => {
    setDirection(i > progress.current ? 1 : -1)
    update({ current: i })
  }

  const complete = () => {
    if (step.id === 'perfil') setPreference('displayName', name.trim())
    if (step.id === 'painel') saveLayout(PRESETS.find((p) => p.id === preset)!.widgets)
    const completed = Array.from(new Set([...progress.completed, step.id]))
    if (progress.current === ONBOARDING_STEPS.length - 1) {
      update({ completed, finished: true })
      toast.success('Configuração inicial concluída', { description: 'Você pode revisar tudo em Configurações.' })
      navigate('/')
      return
    }
    setDirection(1)
    update({ completed, current: progress.current + 1 })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="pt-safe border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-7" />
            <Wordmark />
          </div>
          <Link to="/" className="rounded-md px-2 py-1.5 text-sm text-muted hover:text-text">
            Continuar depois
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-8 sm:pt-12">
        {/* Progress tracker: contador real + barra com mola (Animate UI Progress) */}
        <div className="mb-4 flex items-baseline justify-between gap-3 text-[0.8125rem] text-muted">
          <p aria-live="polite">
            Etapa <span className="tabular font-medium text-text">{progress.current + 1}</span> de {ONBOARDING_STEPS.length} · {step.label}
          </p>
          <p>
            <CountingNumber value={pct} className="font-medium text-text" />% concluído
          </p>
        </div>
        <Progress value={pct} label="Progresso da configuração inicial" className="mb-5 h-1" />
        <Stepper current={progress.current} completed={progress.completed} onJump={go} />

        {/* Painel com a transição do Stepper original: entra deslizando 36 px com mola; o anterior sai em 200 ms */}
        <motion.div layout={!reduced} transition={{ type: 'spring', visualDuration: 0.56, bounce: 0.2 }} className="relative mt-9 overflow-x-clip">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.section
              key={step.id}
              custom={direction}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, x: direction * -36, transition: { opacity: { duration: 0.14, ease: [0.2, 0, 0.4, 1] }, x: { duration: 0.2, ease: [0.4, 0, 1, 1] } } }}
              transition={{ x: { type: 'spring', visualDuration: 0.56, bounce: 0.25 }, opacity: { duration: 0.42, times: [0, 0.25, 1], ease: 'easeOut' } }}
              aria-labelledby="step-title"
            >
              {step.id === 'boas-vindas' && (
                <div className="relative">
                  {/* Sparkles: área de destaque da boas-vindas, discreto e só aqui */}
                  <Sparkles density={260} className="absolute -left-4 -top-8 z-0 h-36 w-[min(100%,640px)] [mask-image:radial-gradient(50%_60%_at_45%_50%,#000_30%,transparent)]" />
                  <h1 id="step-title" ref={headingRef} tabIndex={-1} className="relative font-display text-[2.5rem] leading-[1.06] font-[400] tracking-[-0.025em] outline-none sm:text-[3.25rem]">
                    <BlurText text="Boas-vindas ao Or7 Works." />
                  </h1>
                  <p className="relative mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted">
                    Este é o espaço de trabalho privado da Or7. Em quatro passos curtos você define seu nome, a aparência, entende
                    como a conta é protegida e escolhe como o painel começa.
                  </p>
                  <p className="relative mt-4 max-w-[56ch] text-sm text-muted">
                    Nesta primeira fase, leads, auditorias e agentes ainda não estão ativos. Os módulos já aparecem no menu, com
                    a indicação da fase em que entram.
                  </p>
                </div>
              )}

              {step.id === 'perfil' && (
                <>
                  <h1 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-[2rem] leading-[1.1] font-[440] tracking-[-0.02em] outline-none">
                    Como devemos chamar você?
                  </h1>
                  <p className="mt-3 max-w-[56ch] text-muted">O nome aparece na saudação do painel e no menu da conta.</p>
                  <div className="mt-8 max-w-sm">
                    <Field id="display-name" label="Nome de exibição" hint="Pode deixar em branco e definir depois.">
                      <Input
                        id="display-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        maxLength={60}
                        aria-describedby="display-name-hint"
                      />
                    </Field>
                  </div>
                </>
              )}

              {step.id === 'aparencia' && (
                <>
                  <h1 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-[2rem] leading-[1.1] font-[440] tracking-[-0.02em] outline-none">
                    Aparência
                  </h1>
                  <p className="mt-3 max-w-[56ch] text-muted">As mudanças valem na hora. Dá para trocar depois em Configurações.</p>
                  <div className="mt-8">
                    <AppearanceControls />
                  </div>
                </>
              )}

              {step.id === 'seguranca' && (
                <>
                  <h1 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-[2rem] leading-[1.1] font-[440] tracking-[-0.02em] outline-none">
                    Como a conta é protegida
                  </h1>
                  <p className="mt-3 max-w-[56ch] text-muted">
                    A configuração real acontece na Etapa 02. Este é o caminho que você vai seguir no primeiro acesso.
                  </p>
                  <ol className="mt-8 grid gap-5">
                    {[
                      { icon: KeyRound, t: 'E-mail e senha', d: 'Conta única, criada pela Or7. Não existe cadastro público.' },
                      { icon: Smartphone, t: 'Aplicativo autenticador (TOTP)', d: 'Obrigatório. Sem ele, os dados protegidos não são liberados — a regra vale no banco, não só na tela.' },
                      { icon: LifeBuoy, t: 'Códigos de backup', d: 'Gerados uma vez, guardados por você e válidos para um único uso cada.' },
                    ].map(({ icon: Icon, t, d }, i) => (
                      <li key={t} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                        <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-accent">
                          <Icon className="size-[18px]" aria-hidden />
                        </span>
                        <div>
                          <p className="font-medium">
                            <span className="sr-only">Passo {i + 1}: </span>
                            {t}
                          </p>
                          <p className="mt-0.5 max-w-[54ch] text-sm text-muted">{d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {step.id === 'painel' && (
                <>
                  <h1 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-[2rem] leading-[1.1] font-[440] tracking-[-0.02em] outline-none">
                    <ShinyText>Escolha o ponto de partida</ShinyText>
                  </h1>
                  <p className="mt-3 max-w-[56ch] text-muted">Um layout inicial para o painel. Widgets podem ser movidos, adicionados ou removidos depois.</p>
                  <fieldset className="mt-8 grid gap-3 sm:grid-cols-3">
                    <legend className="sr-only">Layout inicial do painel</legend>
                    {PRESETS.map((p) => (
                      <label
                        key={p.id}
                        className={cn(
                          'relative flex cursor-pointer flex-col gap-1 rounded-lg border bg-surface p-4 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-accent',
                          preset === p.id ? 'border-accent bg-accent-soft' : 'border-border hover:border-border-strong',
                        )}
                      >
                        <input type="radio" name="preset" value={p.id} checked={preset === p.id} onChange={() => setPreset(p.id)} className="sr-only" />
                        <span className="flex items-center justify-between font-medium">
                          {p.label}
                          {preset === p.id && <Check className="size-4 text-accent" aria-hidden />}
                        </span>
                        <span className="text-[0.8125rem] text-muted">{p.description}</span>
                      </label>
                    ))}
                  </fieldset>
                </>
              )}
            </motion.section>
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button
            variant="secondary"
            onClick={() => go(progress.current - 1)}
            className={cn('h-11', progress.current === 0 && 'invisible')}
            aria-hidden={progress.current === 0}
            tabIndex={progress.current === 0 ? -1 : undefined}
          >
            <ArrowLeft aria-hidden /> Voltar
          </Button>
          <PrimaryAction onClick={complete} className="w-auto min-w-40">
            {progress.current === ONBOARDING_STEPS.length - 1 ? 'Concluir e abrir o painel' : progress.current === 0 ? 'Começar' : 'Continuar'}
            <ArrowRight aria-hidden />
          </PrimaryAction>
        </div>
      </main>
    </div>
  )
}
