import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { unstable_OneTimePasswordField as OTP } from 'radix-ui'
import { GlowInput, PrimaryAction } from '@/components/ui/actions'
import { Field } from '@/components/ui/input'
import { readOnboarding } from '@/features/onboarding/onboarding-store'
import { AuthLayout, PreviewNotice } from './AuthLayout'

export function MfaPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'totp' | 'backup'>('totp')
  const [code, setCode] = useState('')
  const [backup, setBackup] = useState('')
  const [error, setError] = useState<string>()

  // Etapa 01: sem verificação real. Segue para o onboarding (primeiro acesso) ou para o painel.
  const proceed = () => navigate(readOnboarding().finished ? '/' : '/boas-vindas')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'totp' && !/^\d{6}$/.test(code)) return setError('Digite os 6 números exibidos no aplicativo autenticador.')
    if (mode === 'backup' && !/^[A-Za-z0-9]{4}-?[A-Za-z0-9]{4}$/.test(backup.trim()))
      return setError('O código de backup tem 8 caracteres, no formato XXXX-XXXX.')
    setError(undefined)
    proceed()
  }

  return (
    <AuthLayout
      title="Verificação em duas etapas"
      description={
        mode === 'totp'
          ? 'Digite o código de 6 dígitos do seu aplicativo autenticador.'
          : 'Use um dos códigos de backup gerados ao configurar a verificação. Cada código vale uma única vez.'
      }
    >
      <form onSubmit={submit} noValidate className="grid gap-5">
        <PreviewNotice>A verificação TOTP é conectada na Etapa 02. Nenhum código é conferido agora.</PreviewNotice>

        {mode === 'totp' ? (
          <div className="grid gap-1.5">
            <label id="otp-label" className="text-sm font-medium">
              Código de verificação
            </label>
            <OTP.Root
              value={code}
              onValueChange={(v) => {
                setCode(v)
                if (error) setError(undefined)
              }}
              validationType="numeric"
              autoComplete="one-time-code"
              aria-labelledby="otp-label"
              aria-describedby={error ? 'otp-error' : undefined}
              className="grid grid-cols-6 gap-2"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <OTP.Input
                  key={i}
                  aria-invalid={!!error}
                  className="tabular h-14 w-full min-w-0 rounded-[10px] border border-border bg-sunken text-center text-[1.375rem] font-medium text-text caret-accent transition-[border-color,box-shadow] duration-150 hover:border-border-strong focus:border-accent focus:bg-surface focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)] focus:outline-none aria-[invalid=true]:border-error"
                />
              ))}
              <OTP.HiddenInput name="code" />
            </OTP.Root>
            {error ? (
              <p id="otp-error" role="alert" className="text-[0.8125rem] text-error">
                {error}
              </p>
            ) : null}
          </div>
        ) : (
          <Field id="backup" label="Código de backup" error={error}>
            <GlowInput
              id="backup"
              value={backup}
              onChange={(e) => setBackup(e.target.value)}
              autoComplete="one-time-code"
              spellCheck={false}
              placeholder="XXXX-XXXX"
              aria-invalid={!!error}
              aria-describedby={error ? 'backup-error' : undefined}
              className="tabular tracking-[0.12em] uppercase"
            />
          </Field>
        )}

        <PrimaryAction type="submit">
          Verificar
        </PrimaryAction>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.8125rem]">
          <button
            type="button"
            className="font-medium text-accent hover:underline"
            onClick={() => {
              setMode(mode === 'totp' ? 'backup' : 'totp')
              setError(undefined)
            }}
          >
            {mode === 'totp' ? 'Usar código de backup' : 'Usar aplicativo autenticador'}
          </button>
          <Link to="/entrar" className="text-muted hover:text-text">
            Voltar
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
