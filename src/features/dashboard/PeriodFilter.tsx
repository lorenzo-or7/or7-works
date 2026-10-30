import { useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/controls'
import { Field, Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlays'
import { cn } from '@/lib/cn'
import { describePeriod, type Period } from './layout-store'

const iso = (d: Date) => d.toISOString().slice(0, 10)

export function PeriodFilter({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false)
  const today = iso(new Date())
  const [from, setFrom] = useState(period.from ?? iso(new Date(Date.now() - 13 * 864e5)))
  const [to, setTo] = useState(period.to ?? today)
  const error = from && to && from > to ? 'A data inicial precisa ser anterior à final.' : undefined
  const isCustom = period.preset === 'custom'

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Período dos indicadores">
      <Segmented
        label="Período"
        size="sm"
        value={(isCustom ? '' : period.preset) as '7'}
        onValueChange={(v) => onChange({ preset: v })}
        options={[
          { value: '7', label: <span>7<span className="max-sm:hidden"> dias</span><span className="sm:hidden">d</span></span>, ariaLabel: 'Últimos 7 dias' },
          { value: '30', label: <span>30<span className="max-sm:hidden"> dias</span><span className="sm:hidden">d</span></span>, ariaLabel: 'Últimos 30 dias' },
          { value: '90', label: <span>90<span className="max-sm:hidden"> dias</span><span className="sm:hidden">d</span></span>, ariaLabel: 'Últimos 90 dias' },
        ]}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            aria-pressed={isCustom}
            aria-label={isCustom ? `Período personalizado: ${describePeriod(period)}` : 'Período personalizado'}
            className={cn('h-8 max-sm:w-8 max-sm:px-0', isCustom && 'border-accent bg-accent-soft text-text')}
          >
            <CalendarRange aria-hidden />
            <span className="max-sm:hidden">{isCustom ? describePeriod(period) : 'Personalizado'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (error) return
              onChange({ preset: 'custom', from, to })
              setOpen(false)
            }}
          >
            <p className="text-sm font-medium">Período personalizado</p>
            <div className="grid grid-cols-2 gap-3">
              <Field id="period-from" label="De">
                <Input id="period-from" type="date" value={from} max={today} onChange={(e) => setFrom(e.target.value)} className="h-10 px-2.5 text-sm" required />
              </Field>
              <Field id="period-to" label="Até">
                <Input
                  id="period-to"
                  type="date"
                  value={to}
                  max={today}
                  onChange={(e) => setTo(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'period-error' : undefined}
                  className="h-10 px-2.5 text-sm"
                  required
                />
              </Field>
            </div>
            {error ? (
              <p id="period-error" role="alert" className="-mt-1 text-[0.8125rem] text-error">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" variant="primary" type="submit" disabled={!!error}>
                Aplicar
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  )
}
