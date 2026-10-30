import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, GripVertical, Plus, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { StatefulButton } from '@/components/ui/actions'
import { Button } from '@/components/ui/button'
import { EmptyState, PageHeader, Panel, Segmented } from '@/components/ui/controls'
import { Tooltip } from '@/components/ui/overlays'
import { cn } from '@/lib/cn'
import {
  DEFAULT_LAYOUT,
  PRESETS,
  SIZE_LABEL,
  moveItem,
  useDashboardLayout,
  type WidgetId,
  type WidgetPlacement,
  type WidgetSize,
} from './layout-store'
import { SPAN_CLASS } from './DashboardPage'
import { WIDGETS } from './widgets'

const SIZE_OPTIONS: { value: WidgetSize; label: string; ariaLabel: string }[] = [
  { value: 'S', label: '⅓', ariaLabel: SIZE_LABEL.S },
  { value: 'M', label: '½', ariaLabel: SIZE_LABEL.M },
  { value: 'L', label: '⅔', ariaLabel: SIZE_LABEL.L },
  { value: 'XL', label: 'Inteira', ariaLabel: SIZE_LABEL.XL },
]

const title = (id: string | number) => WIDGETS[id as WidgetId]?.title ?? String(id)

const announcements: Announcements = {
  onDragStart: ({ active }) => `Widget ${title(active.id)} selecionado.`,
  onDragOver: ({ active, over }) => (over ? `${title(active.id)} sobre a posição de ${title(over.id)}.` : `${title(active.id)} fora da lista.`),
  onDragEnd: ({ active, over }) => (over ? `${title(active.id)} movido para a posição de ${title(over.id)}.` : `${title(active.id)} solto.`),
  onDragCancel: ({ active }) => `Movimento de ${title(active.id)} cancelado.`,
}

interface RowProps {
  item: WidgetPlacement
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onSize: (size: WidgetSize) => void
  onRemove: () => void
}

function EditorRow({ item, index, count, onMove, onSize, onRemove }: RowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const def = WIDGETS[item.id]
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'relative flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 sm:flex-row sm:items-center',
        isDragging && 'z-10 border-accent shadow-pop',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Arrastar ${def.title}. Espaço para pegar, setas para mover.`}
          aria-roledescription="item reordenável"
          className="inline-flex size-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted hover:bg-sunken hover:text-text active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{def.title}</p>
          <p className="truncate text-[0.8125rem] text-muted">{def.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pl-12 sm:pl-0">
        <Segmented
          label={`Largura de ${def.title}`}
          size="sm"
          value={item.size}
          onValueChange={onSize}
          options={SIZE_OPTIONS}
          className="mr-1"
        />
        <Tooltip content="Mover para cima">
          <Button size="icon-sm" variant="ghost" aria-label={`Mover ${def.title} para cima`} disabled={index === 0} onClick={() => onMove(index, index - 1)}>
            <ArrowUp />
          </Button>
        </Tooltip>
        <Tooltip content="Mover para baixo">
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Mover ${def.title} para baixo`}
            disabled={index === count - 1}
            onClick={() => onMove(index, index + 1)}
          >
            <ArrowDown />
          </Button>
        </Tooltip>
        <Tooltip content="Remover do painel">
          <Button size="icon-sm" variant="ghost" aria-label={`Remover ${def.title} do painel`} onClick={onRemove}>
            <X />
          </Button>
        </Tooltip>
      </div>
    </li>
  )
}

export function WidgetEditorPage() {
  const navigate = useNavigate()
  const { layout, commit } = useDashboardLayout()
  const [draft, setDraft] = useState<WidgetPlacement[]>(layout)
  const dirty = JSON.stringify(draft) !== JSON.stringify(layout)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const available = useMemo(
    () => (Object.keys(WIDGETS) as WidgetId[]).filter((id) => !draft.some((w) => w.id === id)),
    [draft],
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = draft.findIndex((w) => w.id === active.id)
    const to = draft.findIndex((w) => w.id === over.id)
    setDraft(moveItem(draft, from, to))
  }

  const save = () => {
    commit(draft)
    toast.success('Layout do painel salvo', { description: 'Salvo neste navegador até a conexão com o banco (Etapa 03).' })
  }

  return (
    <>
      <PageHeader
        title="Editar widgets"
        description="Arraste pela alça ou use as setas para reordenar. Ajuste a largura, adicione ou remova widgets e salve."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-[0.9375rem] font-semibold">No painel</h2>
            <span className="text-[0.8125rem] tabular text-muted">{draft.length} widgets</span>
          </div>
          {draft.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-strong p-6">
              <EmptyState title="O painel ficará vazio">Adicione widgets ao lado ou aplique um layout pronto.</EmptyState>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} accessibility={{ announcements }}>
              <SortableContext items={draft.map((w) => w.id)} strategy={verticalListSortingStrategy}>
                <ul className="grid gap-2">
                  {draft.map((item, i) => (
                    <EditorRow
                      key={item.id}
                      item={item}
                      index={i}
                      count={draft.length}
                      onMove={(from, to) => setDraft(moveItem(draft, from, to))}
                      onSize={(size) => setDraft(draft.map((w) => (w.id === item.id ? { ...w, size } : w)))}
                      onRemove={() => setDraft(draft.filter((w) => w.id !== item.id))}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          <h2 className="mb-3 mt-8 text-[0.9375rem] font-semibold">Prévia da disposição</h2>
          <div className="rounded-lg border border-border bg-sunken p-3" aria-hidden>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
              {draft.map((w) => (
                <div
                  key={w.id}
                  className={cn('flex h-14 items-end rounded-md border border-border bg-surface px-3 pb-2 text-[0.75rem] text-muted', SPAN_CLASS[w.size])}
                >
                  <span className="truncate">{WIDGETS[w.id].title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-6">
          <Panel className="p-4">
            <h2 className="text-[0.9375rem] font-semibold">Layouts prontos</h2>
            <ul className="mt-3 grid gap-2">
              {PRESETS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setDraft(p.widgets)}
                    className="w-full rounded-md border border-border px-3 py-2.5 text-left transition-colors duration-150 hover:border-border-strong hover:bg-sunken"
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="block text-[0.8125rem] text-muted">{p.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-4">
            <h2 className="text-[0.9375rem] font-semibold">Disponíveis</h2>
            {available.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Todos os widgets já estão no painel.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border">
                {available.map((id) => (
                  <li key={id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{WIDGETS[id].title}</p>
                      <p className="text-[0.8125rem] text-muted">{WIDGETS[id].description}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => setDraft([...draft, { id, size: 'S' }])} aria-label={`Adicionar ${WIDGETS[id].title}`}>
                      <Plus aria-hidden /> Adicionar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-10 mt-8 md:bottom-4">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-raised p-2.5 shadow-pop">
          <p className="mr-auto px-1.5 text-[0.8125rem] text-muted max-sm:sr-only" aria-live="polite">
            {dirty ? 'Alterações não salvas' : 'Sem alterações'}
          </p>
          <Button size="sm" variant="ghost" onClick={() => setDraft(DEFAULT_LAYOUT)} aria-label="Restaurar padrão" className="max-sm:mr-auto max-sm:px-2">
            <RotateCcw aria-hidden /> <span className="max-sm:hidden">Restaurar padrão</span>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link to="/">Cancelar</Link>
          </Button>
          <StatefulButton onAction={save} onDone={() => navigate('/')} disabled={!dirty} doneLabel="Layout salvo">
            Salvar layout
          </StatefulButton>
        </div>
      </div>
    </>
  )
}
