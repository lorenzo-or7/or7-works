# Or7 Works

Software privado da Or7. Este repositório está na **Fase 01 · Etapa 01 (UI/UX)**: interface completa e navegável, **sem backend**. Autenticação entra na Etapa 02; dados reais, na Etapa 03.

O kit de planejamento original está em [`or7works_fase01/`](or7works_fase01/README.md) e não deve ser editado.

## Rodar localmente

Requisitos: Node 24+ e npm 11+.

```bash
npm install
```

```bash
npm run dev
```

Abra `http://localhost:5173`. Rotas principais: `/entrar`, `/boas-vindas`, `/` (painel).

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build |
| `npm run lint` | oxlint em `src/` |
| `npm run typecheck` | `tsc -b` |
| `npm test` | Vitest + Testing Library |
| `npm run screenshots -- http://localhost:5173` | Screenshots reais (Chrome instalado) de todas as rotas, desktop e Android, claro e escuro; acusa overflow horizontal e erros de console |
| `node scripts/check-interactions.mjs http://localhost:5173` | Verifica Ctrl+K, sidebar, ordem de Tab, menu "Mais" e alvos de toque |

Os scripts de screenshot usam `playwright-core` com o canal `chrome` (Chrome instalado na máquina); nenhum navegador é baixado.

## Estrutura

```
src/
  app/               rotas, navegação, preferências (tema, destaque, movimento, sidebar)
  components/ui/     componentes base (estilo shadcn sobre Radix)
  components/motion/ BlurText, ShinyText, Orb (autorais)
  design-system/     tokens Glacier Original e cores de destaque
  features/          auth, onboarding, dashboard, settings, notifications, modules, shell
  services/          persistência local provisória (migra para Supabase na Etapa 03)
  test/              setup e utilitários de teste
docs/etapa-01/       relatório da etapa, decisões, mapeamento de referências, screenshots
public/brand/        lugar dos arquivos originais da marca (pendente)
```

## Variáveis de ambiente

Nenhuma nesta etapa. Credenciais nunca vão para o frontend.
