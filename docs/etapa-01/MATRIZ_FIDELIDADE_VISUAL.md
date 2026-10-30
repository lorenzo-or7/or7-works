# Matriz de fidelidade visual — Etapa 01 (refinamento)

Data: 29/10/2026. Fonte das URLs: `or7works_fase01/referencias/catalogo_aprovado.csv` (67 linhas, 40 categorias).

## Como o código-fonte foi obtido

| Fonte | Acesso | Licença verificada |
|---|---|---|
| React Bits (`reactbits.dev/r/<Nome>-TS-TW.json`) | **Acessível** — código completo lido | MIT + Commons Clause (`LICENSE.md` do repositório): uso livre dentro de aplicação; proibido vender ou redistribuir os componentes. Aviso de copyright mantido em cada arquivo. |
| Aceternity UI (`ui.aceternity.com/registry/<nome>.json`) | **Acessível**, exceto `signup-form` (401). O código da demo do Signup Form está público na própria página do componente e foi lido de lá | Licença Aceternity (`/licence`): permite produtos finais para uso próprio ou de clientes; proíbe redistribuir/vender o código. |
| Magic UI (`magicui.design/r/<nome>.json`) | **Acessível** | MIT |
| Animate UI (`animate-ui.com/r/<nome>.json`) | **Acessível** (Tabs, Tooltip, Popover, Toggle, Progress). Counting Number: 404 no registro | MIT |
| 21st.dev (`21st.dev/r/<autor>/<nome>`) | **Bloqueado** — todas as 22 consultas retornaram `403 Authentication required`. A página pública só mostra a demo renderizada e o nome das dependências | Licença por autor, não verificável sem acesso |
| shadcn/ui, React Aria, DayPicker, Chakra | Documentação pública conhecida; nada instalado além do Radix já usado | MIT / Apache-2.0 |

Regra aplicada: onde o código foi lido, a implementação segue o comportamento original (vendorizado quando a licença permite). Onde o código está bloqueado, **não se declara fidelidade**: o item fica marcado como "Adaptado a partir de referência equivalente acessível" ou "Bloqueado".

Legenda de status: **Implementado (fiel)** · **Adaptado** · **Reservado** (sem uso real na Etapa 01) · **Bloqueado** (sem acesso ao código).

## Matriz

| # | Nome | URL | Categoria | Onde | Status | Comportamento original identificado | Implementação | Diferenças de adaptação | Licença / deps | Evidência |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Financial Dashboard | 21st.dev/@ravikatiyar162/components/financial-dashboard | Dashboard | Painel | Bloqueado → Adaptado | Descrição pública: visão financeira com ações rápidas e transações | Composição Bento própria (ver #3/#14) | Sem transações nem ações rápidas: não existem dados | 403 | `depois/*painel*` |
| 2 | Dashboard with Collapsible Sidebar | 21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar | Dashboard | Shell | Bloqueado → Adaptado | Sidebar recolhível + painel | Sidebar segue #5/#6 (Aceternity, acessível) | — | 403 | `animacoes/sidebar-*` |
| 3 | Bento Dashboard | 21st.dev/@daiwiikharihar/components/bento-dashboard | Dashboard | Painel | Bloqueado → Adaptado | Bento assimétrico | Bento com Magic UI Bento Grid (#14) como fonte acessível | — | 403 | `depois/*painel*` |
| 4 | Dashboard Overview | 21st.dev/@uniquesonu/components/dashboard-overview | Dashboard | Painel | Bloqueado | — | — | — | 403 | — |
| 5 | Sidebar Demo (Andrew Lu) | 21st.dev/@andrewlu0/components/sidebar/sidebar-demo | Sidebar | Shell | Bloqueado → estrutura mantida | — | Estrutura de grupos já existente | — | 403 | — |
| 6 | Aceternity Sidebar | ui.aceternity.com/components/sidebar | Sidebar | Shell desktop | Implementado (adaptado) | Largura animada 300↔60 px ao passar o mouse; rótulos somem/aparecem com opacidade; item desloca 4 px no hover (`group-hover/sidebar:translate-x-1`) | Largura com mola (Motion), rótulos com fade + deslocamento, hover com translate-x-1 | Mantida a preferência "fixar" já existente; indicador ativo deslizante (#12) | Aceternity; motion | `animacoes/sidebar-*` |
| 7 | Navbar Menu | ui.aceternity.com/components/navbar-menu | Navbar | Header | Reservado | Menu com painel animado por hover | — | Header atual não tem menus de hover; sem uso real | Aceternity | — |
| 8 | Magic UI Dock | magicui.design/docs/components/dock | Dock | Barra inferior Android | Adaptado | Ampliação de ícones por proximidade do mouse (mola mass 0.1, stiffness 150, damping 12) | Ícone ativo ampliado com a mesma mola; pressão por toque com escala | Toque não tem hover: ampliação passa a ser do item ativo/pressionado | MIT; motion | `animacoes/bottomnav-*` |
| 9 | Dock (ibelick) | mcp.21st.dev/@ibelick/components/dock | Dock | — | Bloqueado | — | — | — | 403 | — |
| 10 | Shifting Dropdown | 21st.dev/@hurerag24/components/shifting-dropdown | Menus | — | Bloqueado | — | — | — | 403 | — |
| 11 | Animated Dropdown | 21st.dev/@Shatlyk1011/components/animated-dropdown | Menus | Menu da conta | Bloqueado → Adaptado | — | Entrada com mola (padrão Animate UI) | — | 403 | — |
| 12 | Animate UI Tabs | animate-ui.com/docs/primitives/radix-ui/tabs | Tabs | Controles segmentados, filtros | Implementado (fiel) | `Highlight` que desliza entre abas, mola stiffness 200 / damping 25 | `layoutId` com a mesma mola em todos os controles segmentados | Sobre Radix ToggleGroup (mesmo primitive) | MIT; motion, radix-ui | `animacoes/segmentado-*` |
| 13 | Tabs (kuratlielia) | 21st.dev/@kuratlielia/components/tabs | Tabs | — | Bloqueado | — | — | — | 403 | — |
| 14 | Magic UI Bento Grid | magicui.design/docs/components/bento-grid | Bento | Painel | Implementado (adaptado) | No hover: conteúdo sobe, ícone reduz 75%, CTA surge de baixo, véu escuro de 3% | Mesmo comportamento nos cartões de indicador | CTA leva ao módulo real; no toque o CTA fica sempre visível (como o original abaixo de `lg`) | MIT | `animacoes/bento-hover-*` |
| 15 | shadcn Card | ui.shadcn.com/docs/components/radix/card | Cards | Todos | Implementado | Estrutura header/content/footer | Painéis por tipo (destaque, indicador, informativo, feed) | — | MIT | `depois/*` |
| 16 | Glowing Effect | ui.aceternity.com/components/glowing-effect | Cards | Cartão principal do painel e editor | Implementado (fiel) | Borda cônica que segue o ângulo do ponteiro, zona inativa no centro, animação 2 s ease `[0.16,1,0.3,1]` | Código original vendorizado | Gradiente recolorido com os tons Glacier; desligado em toque e com movimento reduzido | Aceternity; motion | `animacoes/glowing-*` |
| 17 | shadcn Button | ui.shadcn.com/docs/components/radix/button | Buttons | Global | Implementado | Variantes cva | Primário, secundário, ghost, perigo, link | — | MIT | — |
| 18 | Stateful Button | ui.aceternity.com/components/stateful-button | Buttons | "Salvar layout" | Implementado (fiel) | Clique → loader girando → check → volta ao normal (`useAnimate`) | Mesma sequência, com `aria-live` | Cores Glacier | Aceternity; motion | `animacoes/stateful-*` |
| 19 | Moving Border | ui.aceternity.com/components/moving-border | Buttons | "Começar configuração" (ação especial) | Implementado (fiel) | Brilho percorre o contorno via `getPointAtLength`, 3 s por volta | Código original vendorizado | Brilho em accent; parado com movimento reduzido | Aceternity; motion | `animacoes/moving-border-*` |
| 20 | Ripple Button | magicui.design/docs/components/ripple-button | Buttons | Barra inferior Android, "Entrar" | Implementado (fiel) | Onda circular a partir do ponto de toque, 600 ms | Mesmo cálculo de tamanho/posição | — | MIT | `animacoes/ripple-*` |
| 21 | shadcn Dropdown Menu | ui.shadcn.com/docs/components/radix/dropdown-menu | Dropdowns | Menu da conta | Implementado | Radix DropdownMenu | Mantido | — | MIT | — |
| 22 | shadcn Context Menu | ui.shadcn.com/docs/components/radix/context-menu | Dropdowns | — | Reservado | — | — | Sem uso real | MIT | — |
| 23 | shadcn Drawer (Radix) | ui.shadcn.com/docs/components/radix/drawer | Dialogs | Menu "Mais" | Implementado | Painel inferior com alça | Radix Dialog como drawer | Sem arrastar para fechar (Vaul não instalado) | MIT | `depois/interacao-android-menu-mais` |
| 24 | shadcn Drawer (Base) | ui.shadcn.com/docs/components/base/drawer | Dialogs | — | Reservado | — | — | Evita misturar Base UI com Radix | MIT | — |
| 25 | Animate UI Popover | animate-ui.com/docs/primitives/radix-ui/popover | Popovers | Período personalizado | Implementado (fiel) | Entrada com mola stiffness 300 / damping 25, escala 0.5→1 | Mesma mola | — | MIT | — |
| 26 | Animate UI Tooltip | animate-ui.com/docs/primitives/radix-ui/tooltip | Tooltips | Global | Implementado (fiel) | Escala 0.5→1 com mola 300/25 | Mesma mola | Seguir o cursor não usado | MIT | — |
| 27 | Animate UI Toggle | animate-ui.com/docs/primitives/radix-ui/toggle | Toggles | Switch de sidebar, mostrar senha | Adaptado | Pressão com escala e mola | `whileTap` escala 0.9 no switch | — | MIT | — |
| 28 | Gooey Input | ui.aceternity.com/components/gooey-input | Inputs | — | Reservado | Busca expansível com efeito "gosma" | — | Campos de login seguem o Signup Form (#34), que é a referência específica do login | Aceternity | — |
| 29 | Gooey Input | (mesma) | Search | Ctrl+K | Reservado | — | Ctrl+K continua com cmdk | Efeito gooey em um diálogo modal prejudica a leitura | — | — |
| 30 | React Aria Select | react-aria.adobe.com/Select | Selects | — | Reservado | — | — | Não há select na Etapa 01; instalar React Aria misturaria primitives | Apache-2.0 | — |
| 31 | shadcn Date Picker (Base) | ui.shadcn.com/docs/components/base/date-picker | Date pickers | Período personalizado | Reservado | — | Campos nativos mantidos | Depende de DayPicker; entra com dados reais | MIT | — |
| 32 | Signup Form | ui.aceternity.com/components/signup-form | Forms | Login, MFA, recuperação | Implementado (fiel à demo pública) | Input com borda radial de 100 px que segue o mouse; botão com degradê e `BottomGradient` (duas linhas de luz no hover); divisor degradê | Mesmo mecanismo em `GlowInput` e `PrimaryAction` | Cores Glacier; sem botões sociais (não há login social); registro JSON 401, código lido da página | Aceternity; motion | `animacoes/login-input-*` |
| 33 | Hero Sections (free) | ui.aceternity.com/components/hero-sections-free | Landing | — | Reservado | — | — | Não há página pública | — | — |
| 34 | Startup template | magicui.design/docs/templates/startup | Landing | — | Reservado | — | — | Não há página pública | — | — |
| 35 | Signup Form | (mesma de #32) | Login | Login | Implementado | ver #32 | ver #32 | — | — | — |
| 36 | shadcn Area Chart | ui.shadcn.com/charts/area | Charts | — | Reservado | — | — | Nenhum dado real para plotar | MIT | — |
| 37 | shadcn Pie Chart | ui.shadcn.com/charts/pie | Charts | — | Reservado | — | — | idem | MIT | — |
| 38 | shadcn Radar Chart | ui.shadcn.com/charts/radar | Charts | — | Reservado | — | — | Previsto para scores de auditoria (Fase 03) | MIT | — |
| 39 | Stats Card | 21st.dev/@ravikatiyar162/components/stats-card | Stats | Indicadores | Bloqueado → Adaptado | — | Cartão de indicador com travessão | — | 403 | — |
| 40 | Counting Number | animate-ui.com/docs/primitives/animate-ui/counting-number | Stats | Progresso do onboarding | Adaptado | Registro 404; comportamento documentado: número anima até o valor com mola | `CountingNumber` com `animate()` do Motion, usado **só** no número real de etapas concluídas | Nunca aplicado a indicadores sem dados | MIT | `animacoes/contador-*` |
| 41 | shadcn Table | ui.shadcn.com/docs/components/radix/table | Tables | Módulos futuros | Implementado | Tabela semântica | Mantida | — | MIT | — |
| 42 | Project Data Table | 21st.dev/@ravikatiyar162/components/project-data-table | Tables | — | Bloqueado | — | — | — | 403 | — |
| 43 | Task List | mcp.21st.dev/@ravikatiyar162/components/task-list | Lists | — | Bloqueado | — | — | — | 403 | — |
| 44 | Pin List | v1.animate-ui.com/docs/components/community/pin-list | Lists | — | Reservado | — | — | Sem itens reais | MIT | — |
| 45 | Release Timeline | 21st.dev/@ruixen.ui/components/release-time-line | Timeline | — | Bloqueado | — | — | Atividade real só na Etapa 03 | 403 | — |
| 46 | Animate UI Progress | animate-ui.com/docs/primitives/base-ui/progress | Progress | Onboarding, painel | Implementado (fiel) | Barra com largura animada por mola stiffness 100 / damping 30 | Mesma mola, sobre `role="progressbar"` | Sem Base UI (evita segundo primitive) | MIT; motion | `animacoes/contador-*` |
| 47 | Notification List | v1.animate-ui.com/docs/components/community/notification-list | Notifications | — | Reservado | — | — | Sem notificações reais até a Etapa 03 | MIT | — |
| 48 | Halo Notification | 21st.dev/@cult-ui/components/halo-notification | Notifications | — | Bloqueado | — | — | — | 403 | — |
| 49 | shadcn Sonner | ui.shadcn.com/docs/components/radix/sonner | Toasts | Confirmações | Implementado | Toasts | Mantido | — | MIT | — |
| 50 | Chakra Badge | chakra-ui.com/docs/components/badge | Badges | Fases e estados | Adaptado | Variantes subtle/outline | Componente próprio com variantes equivalentes | Chakra não instalado (regra do kit) | MIT | — |
| 51 | Empty (products) | 21st.dev/@j1zuz/components/empty/products | Empty states | — | Bloqueado | — | — | — | 403 | — |
| 52 | shadcn Empty | ui.shadcn.com/docs/components/radix/empty | Empty states | Telas vazias | Implementado | Mídia + título + descrição + ação | Mídia em ícone empilhado | — | MIT | — |
| 53 | AI Chat Input | 21st.dev/@preetsuthar17/components/ai-chat-input | AI Chat | — | Bloqueado / Reservado | — | — | Agentes só na Fase 03 | 403 | — |
| 54 | File Upload | 21st.dev/@extend-hq/components/file-upload | Upload | — | Bloqueado / Reservado | — | — | Sem armazenamento até a Fase 05 | 403 | — |
| 55 | Tree View | 21st.dev/@preetsuthar17/components/tree-view | File trees | — | Bloqueado | — | — | — | 403 | — |
| 56 | File Tree | 21st.dev/@jatin-yadav05/components/file-tree | File trees | — | Bloqueado | — | — | — | 403 | — |
| 57 | DayPicker | daypicker.dev | Calendars | — | Reservado | — | Grade de mês própria mantida | Sem eventos reais | MIT | — |
| 58 | shadcn Calendar (Aria) | ui.shadcn.com/docs/components/aria/calendar | Calendars | — | Reservado | — | — | — | MIT | — |
| 59 | Fullscreen Calendar (Ahmed Mayara) | preview.21st.dev/@ahmedmayara | Calendars | Calendário | Bloqueado | — | — | — | 403 | — |
| 60 | React Bits Stepper | reactbits.dev/components/stepper | Steppers | Onboarding | Implementado (fiel) | Trilho com "tile" que desliza até a etapa ativa; selos com estados; check desenhado (stroke-dash 360 ms); painel desliza 36 px com mola `linear()` e altura animada; rodapé Voltar/Continuar | Mecanismo reimplementado sobre as 5 etapas existentes (estado/persistência preservados) | Tema Glacier no lugar do tema zinc; ícones Lucide no lugar de Hugeicons (evita dependência nova) | MIT + Commons Clause | `animacoes/stepper-*` |
| 61 | Multistep Form | 21st.dev/@arihantcodes_1f7b8c4d/components/multistep-form | Onboarding | — | Bloqueado | — | Coberto pelo Stepper | — | 403 | — |
| 62 | Progress Tracker | preview.21st.dev/@flohoeller/components/progress-tracker | Onboarding | Onboarding | Bloqueado → Adaptado | — | Barra de progresso (#46) + contador (#40) acima do trilho | — | 403 | — |
| 63 | Signup Form | (mesma de #32) | Sign ins | — | — | — | — | — | — | — |
| 64 | React Bits Orb | reactbits.dev/backgrounds/orb | Backgrounds | Login (painel editorial) | Implementado (fiel) | Shader WebGL2: anel com ruído simplex, brilho orbitando, reação ao ponteiro, pulso no clique, intro de 1,1 s | Código original vendorizado sem alteração do shader | Paleta Glacier; pausa com movimento reduzido; fallback CSS estático sem WebGL2 | MIT + Commons Clause; sem deps | `animacoes/orb-*` |
| 65 | Sparkles | 21st.dev/@manuarora700/components/sparkles | Backgrounds | Boas-vindas do onboarding | Implementado (fiel, via fonte equivalente) | Partículas tsparticles: opacidade piscando (speed 4), densidade configurável, push no clique, fade-in de 1 s | `SparklesCore` original da Aceternity (mesmo autor) vendorizado | Registro 21st bloqueado; mesmas opções; carregado sob demanda; desligado com movimento reduzido | Aceternity; @tsparticles/react, engine, slim 4.5.0 (MIT) | `animacoes/sparkles-*` |
| 66 | React Bits Shiny Text | reactbits.dev/text-animations/shiny-text | Texts | Marca no login, título do passo final | Implementado (fiel) | Faixa de brilho com gradiente calculado por quadro, `speed`, `delay`, `yoyo`, `trigger` | Código original vendorizado | Cores resolvidas a partir dos tokens do tema | MIT + Commons Clause | `animacoes/shiny-*` |
| 67 | React Bits Blur Text | reactbits.dev/text-animations/blur-text | Texts | Títulos do login e das boas-vindas | Implementado (fiel) | Palavras surgem do desfoque com keyframes `blur(10)→blur(5)→0`, mola com bounce 0.35, stagger por palavra | Código original vendorizado | Elemento raiz `span` (o original usa `p`, inválido dentro de `h1`) | MIT + Commons Clause; motion | `animacoes/blur-*` |

As evidências ficam em `docs/etapa-01/screenshots/depois/` e `docs/etapa-01/screenshots/animacoes/` (sequências de quadros do navegador real). O status final de cada item está no `RELATORIO_REFINAMENTO_FINAL.md`.
