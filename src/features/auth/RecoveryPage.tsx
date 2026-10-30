import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlowInput, PrimaryAction } from '@/components/ui/actions'
import { Field } from '@/components/ui/input'
import { AuthLayout, PreviewNotice } from './AuthLayout'

const schema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido, como nome@dominio.com.'),
})

export function RecoveryPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onTouched' })

  if (sent) {
    return (
      <AuthLayout title="Verifique seu e-mail">
        <div className="grid gap-5">
          <span className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-sunken text-accent">
            <MailCheck className="size-5" aria-hidden />
          </span>
          <p className="text-[0.9375rem] leading-relaxed text-text">
            Se o endereço pertencer à conta administradora, chegará um link para criar uma nova senha. O link expira em pouco
            tempo e, depois da troca, a verificação em duas etapas continua obrigatória.
          </p>
          <PreviewNotice>Nenhum e-mail foi enviado. A recuperação real é conectada na Etapa 02.</PreviewNotice>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link to="/entrar">Voltar para a entrada</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar acesso" description="Informe o e-mail da conta. Enviaremos um link para criar uma nova senha.">
      <form noValidate onSubmit={handleSubmit(() => setSent(true))} className="grid gap-5">
        <Field id="email" label="E-mail" error={errors.email?.message}>
          <GlowInput
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>
        <PrimaryAction type="submit">
          Enviar link de recuperação
        </PrimaryAction>
        <Link to="/entrar" className="inline-flex items-center justify-center gap-1.5 text-[0.8125rem] text-muted hover:text-text">
          <ArrowLeft className="size-3.5" aria-hidden /> Voltar para a entrada
        </Link>
      </form>
    </AuthLayout>
  )
}
