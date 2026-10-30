import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { GlowInput, PrimaryAction } from '@/components/ui/actions'
import { Field } from '@/components/ui/input'
import { AuthLayout, PreviewNotice } from './AuthLayout'

const schema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido, como nome@dominio.com.'),
  password: z.string().min(1, 'Informe a senha.'),
})
type Values = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' })

  // Etapa 01: sem autenticação. Os valores digitados não são enviados nem guardados.
  const onSubmit = () => navigate('/entrar/verificacao')

  return (
    <AuthLayout title="Entrar" description="Use o e-mail e a senha da conta administradora.">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <PreviewNotice>O login ainda não está conectado. Nada do que for digitado é enviado ou salvo.</PreviewNotice>

        <Field id="email" label="E-mail" error={errors.email?.message}>
          <GlowInput
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            spellCheck={false}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>

        <Field
          id="password"
          label="Senha"
          error={errors.password?.message}
          action={
            <Link to="/recuperar-acesso" className="text-[0.8125rem] font-medium text-accent hover:underline">
              Esqueci a senha
            </Link>
          }
        >
          <GlowInput
            id="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
            trailing={
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={show}
                className="inline-flex h-full w-11 items-center justify-center rounded-r-[10px] text-muted transition-transform hover:text-text active:scale-90"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
        </Field>

        <PrimaryAction type="submit" className="mt-1">
          Entrar
        </PrimaryAction>
        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        <p className="text-center text-[0.8125rem] text-muted">Não há cadastro público. A conta é criada pela própria Or7.</p>
      </form>
    </AuthLayout>
  )
}
