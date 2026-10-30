# Etapa 01 — UI/UX completa · Relatório para o Checkpoint A

Data: 29/10/2026 · Versão `0.1.0` · Sem backend, sem deploy, sem push.

## 1. Rotas implementadas

| Rota | Tela | Comportamento nesta etapa |
|---|---|---|
| `/entrar` | Login | Validação real dos campos (Zod + React Hook Form). Sem autenticação: avança para a verificação. Nada é enviado ou salvo. Aviso de pré-visualização visível. |
| `/entrar/verificacao` | MFA | Código TOTP de 6 dígitos (colar, teclado numérico, `one-time-code`) e alternativa por código de backup. Validação de formato; nenhum código é conferido. |
| `/recuperar-acesso` | Recuperação | Formulário e tela de confirmação neutra; aviso de que nenhum e-mail foi enviado. |
| `/boas-vindas` | Onboarding | Stepper de 5 passos (boas-vindas, perfil, aparência, segurança, painel). Progresso, nome, aparência e layout escolhido persistem localmente. |
| `/` | Painel | Grid assimétrico de 12 colunas, filtros 7/30/90/personalizado (persistidos), widgets com "Sem dados" e travessão. |
| `/painel/editar` | Editor de widgets | Arrastar (dnd-kit, mouse/toque/teclado com anúncios em pt-BR), botões mover para cima/baixo, largura ⅓ ½ ⅔ inteira, adicionar, remover, 3 layouts prontos, restaurar padrão, salvar/cancelar. |
| `/notificacoes` | Notificações | Estado vazio honesto com filtro Todas/Não lidas. |
| `/configuracoes/:secao` | Configurações | Perfil, Aparência, Painel, Segurança, Notificações, Dados, Backup, Sistema, IA e custos. Funcionais localmente: nome, tema, cor de destaque, movimento, sidebar fixada, restaurar layout, refazer onboarding, apagar preferências locais. |
| `/leads` `/crm` `/propostas` `/auditorias` `/agentes` `/clientes` `/projetos` `/documentos` `/financeiro` `/calendario` `/relatorios` `/monitoramento` | Módulos futuros | Estrutura do módulo (tabela, calendário do mês real, parâmetros planejados, balanço com travessões ou lista), "o que este módulo fará" e regras preservadas, tudo retirado de `docs/04_fases_futuras.md`. Nenhum botão de ação. |
| `*` | 404 | Mensagem e retorno ao painel. |

Shell: sidebar com grupos e marcação de fase (F02…F06), fixável ou em trilho com expansão por hover/foco, preferência salva; header com breadcrumbs contextuais, busca, tema, notificações e menu da conta; menu global **Ctrl/⌘ + K** (páginas, seções de configurações e ações); barra inferior Android (Painel, Leads, Buscar, Avisos, Mais) com `safe-area` e menu "Mais" em drawer; link "Pular para o conteúdo"; foco movido para o conteúdo a cada troca de página.

## 2. Design system aplicado

- Tokens Glacier Original exatamente como congelados (claro e escuro), em `src/design-system/tokens.css`. Tons derivados (`sunken`, `raised`, `*-soft`, `faint`, `border-strong`) são misturas dos tokens aprovados; nenhuma cor de marca nova.
- Tipografia: **Fraunces** (títulos editoriais) + **Inter Tight** (interface e dados), escolhidas pelo usuário. Ambas SIL OFL 1.1, auto-hospedadas via Fontsource.
- Ícones: Lucide (ISC), traço único.
- Cores de destaque configuráveis: Glacier (padrão), Fiorde, Ameixa, Terra, Grafite.

Contrastes calculados (WCAG 2.x):

| Par | Claro | Escuro |
|---|---|---|
| muted × background / surface | 5,33 / 5,73 | 8,66 / 7,37 |
| success × bg | 5,29 | 8,88 |
| warning × bg | 4,97 | 10,82 |
| error × bg | 5,37 | 7,70 |
| Glacier: on-accent × accent / accent × bg | 5,88 / 5,48 | 8,57 / 9,42 |
| Fiorde | 6,17 / 5,74 | 8,94 / 9,83 |
| Ameixa | 6,94 / 6,46 | 8,39 / 9,22 |
| Terra | 6,14 / 5,71 | 8,70 / 9,56 |
| Grafite | 8,22 / 7,65 | 10,08 / 11,08 |

Todos ≥ 4,5:1. Estados nunca dependem só da cor (ícone + texto: "Ativa", "Etapa 02", "Não configurado").

## 3. Movimento

- Transição de página curta (220 ms, opacidade + 6 px).
- **Orb** (CSS, sem WebGL) apenas no painel editorial do login. **Blur Text** no título do login e das boas-vindas. **Shiny Text** uma vez, em um título curto do onboarding. **Stepper** autoral no onboarding. **Sonner** para confirmações.
- Tudo respeita `prefers-reduced-motion` e a opção "Reduzir movimento" das Configurações (que força o modo reduzido mesmo se o sistema permitir).
- Sparkles não foi usado: o login já tem o Orb e o kit pede efeitos só em áreas de destaque.

## 4. Mapeamento das referências aprovadas

Nenhum código foi copiado de 21st.dev, Aceternity, Magic UI, Animate UI, React Bits, Chakra ou React Aria. As URLs **não foram abertas nem tiveram licença verificada** nesta etapa; foram usadas apenas como direção conceitual, com implementação própria. Prioridade: A = aplicada nesta etapa, B = etapas seguintes, C = fases futuras.

| Categoria | Onde | Como foi resolvido | Prior. |
|---|---|---|---|
| Dashboard / Bento / Stats | Painel | Grid assimétrico próprio de 12 colunas; indicadores sem número inventado (sem contador animado: não há dado para contar) | A |
| Sidebar / Navbar / Dock | Shell | Sidebar própria (trilho + fixar); barra inferior Android própria em vez de dock | A |
| Menus / Dropdowns | Menu da conta | Radix DropdownMenu, estilo próprio | A |
| Tabs / Toggles | Filtros, notificações, aparência | Radix ToggleGroup como controle segmentado | A |
| Cards | Widgets, painéis | Painéis com borda fina; sem glowing effect | A |
| Buttons | Global | Variantes próprias (primário, secundário, ghost, perigo, link). Moving border, ripple e stateful não usados | A |
| Dialogs / Drawer | Ctrl+K, menu "Mais" | Radix Dialog | A |
| Popovers / Tooltips | Período personalizado, dicas | Radix Popover / Tooltip | A |
| Inputs / Forms / Login / Sign ins | Login, MFA, recuperação | Campos próprios + Radix OneTimePasswordField; gooey input não usado | A |
| Search | Ctrl+K | cmdk (MIT) dentro de Radix Dialog | A |
| Selects | — | Não necessário nesta etapa; React Aria não instalado para não misturar primitives | B |
| Date pickers / Calendars | Período personalizado, Calendário | Campos de data nativos; grade de mês própria. Day Picker fica para quando houver eventos | B |
| Charts | — | Nenhum gráfico: não há dados reais | B |
| Tables | Módulos futuros | Tabela HTML semântica com estado vazio | A |
| Empty states | Todas as telas vazias | Componente próprio `EmptyState` | A |
| Toasts | Salvar layout, perfil, onboarding | Sonner (MIT) | A |
| Badges | Fases e estados | Componente próprio (Chakra não instalado) | A |
| Progress | Onboarding no painel | Barra própria com `role="progressbar"` | A |
| Steppers / Onboarding | `/boas-vindas` | Stepper autoral | A |
| Backgrounds / Texts | Login, onboarding | Orb, BlurText, ShinyText autorais | A |
| Notifications | `/notificacoes` | Estrutura vazia; lista animada fica para a Etapa 03 | B |
| Lists / Timeline | — | Para atividade real (Etapa 03) | B |
| Upload / File trees | Documentos | Apenas estado vazio | C |
| AI Chat | — | Fora do escopo da Fase 01 | C |
| Landing | — | Não há página pública | — |

## 5. Dependências (todas instaladas nesta etapa)

| Pacote | Versão | Licença | Uso |
|---|---|---|---|
| react / react-dom | 19.3.1 | MIT | UI |
| react-router | 8.5.1 | MIT | Rotas (lazy nas páginas secundárias) |
| radix-ui | 1.8.1 | MIT | Única biblioteca de primitives |
| tailwindcss / @tailwindcss/vite | 4.3.3 | MIT | Estilos |
| class-variance-authority | 0.7.1 | Apache-2.0 | Variantes |
| clsx / tailwind-merge | 2.1.1 / 3.7.0 | MIT | Classes |
| lucide-react | 1.64.0 | ISC | Ícones |
| motion | 14.8.0 | MIT | Animações |
| sonner | 2.0.8 | MIT | Toasts |
| cmdk | 1.1.1 | MIT | Ctrl+K |
| @dnd-kit/core · sortable · utilities | 6.3.1 · 10.0.0 · 3.2.2 | MIT | Editor de widgets |
| react-hook-form / zod / @hookform/resolvers | 7.91.0 / 4.6.7 / 6.0.2 | MIT | Formulários |
| @fontsource-variable/fraunces · inter-tight | 5.3.0 | OFL-1.1 | Fontes |
| vitest · @testing-library/* · jsdom | 5.0.5 · 16.3.3 · 30.1.3 | MIT | Testes |
| playwright-core | 1.64.1 | Apache-2.0 | Screenshots com o Chrome instalado |
| vite · typescript · oxlint | 8.3.5 · 7.0.2 · 1.90.0 | MIT / Apache-2.0 / MIT | Build e lint |

Custo: zero. `npm install` reportou 0 vulnerabilidades. Ainda não instalados por pertencerem a etapas seguintes: TanStack Query, Supabase, Vite PWA, Playwright Test.

## 6. Persistência provisória

`localStorage`, prefixo `or7works:` — `preferences`, `dashboard-layout`, `dashboard-period`, `onboarding`. Nada sensível é guardado (há teste garantindo que a senha digitada não vai para o armazenamento). Migra para `user_preferences`, `dashboard_layouts` e `onboarding_progress` na Etapa 03.

## 7. Verificação

Ver seção de resultados no relatório entregue no chat e as imagens em `docs/etapa-01/screenshots/` (`desktop-*` 1440×900, `android-*` 412×915 @2x com emulação de toque, claro e escuro, mais `interacao-*`).

## 8. Pendências e bloqueadores

| Item | Situação |
|---|---|
| Wordmark e ícone originais | **Pendente** — usuário vai enviar. Placeholder textual neutro "Or7 Works" e monograma "O7" em uso; nada redesenhado. Trocar em `src/features/shell/Logo.tsx` (`BRAND_ASSETS_AVAILABLE`) e `public/brand/`. O `favicon.svg` também é provisório. |
| Licença e disponibilidade das URLs do catálogo | Não verificadas (nada foi copiado). |
| Rotas protegidas | Abertas por definição nesta etapa; guarda de sessão + aal2 na Etapa 02. |
| Testes em aparelho Android real | Não feitos; apenas emulação de viewport/toque no Chrome. |
| Testes E2E (Playwright Test) e auditoria Lighthouse | Etapa 04. |
| Fase de implantação do Calendário | Não definida no roadmap; marcado como "Fase futura". |
