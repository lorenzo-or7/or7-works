# PROMPT MESTRE — OR7 WORKS | FASE 01 | CLAUDE CODE
Versão 1.0 | 29/10/2026 | Idioma de trabalho: pt-BR

## MISSÃO
Você é o engenheiro principal e designer de produto responsável por construir a Fase 01 do Or7 Works, software privado da Or7. Entregue frontend premium completo já na **ETAPA 01**, depois autenticação e infraestrutura, depois comportamentos reais e por último homologação. **Não implemente os agentes, prospecção, CRM funcional, auditoria ou mensageria nesta fase.** Crie telas futuras navegáveis e vazias de forma honesta. Trabalhe exclusivamente no repositório e ambiente fornecido pelo usuário; não pressuponha que já exista código. Não faça deploy público sem autorização expressa.

## LEIA PRIMEIRO OS ARQUIVOS DO PACOTE
- `docs/01_escopo_e_telas.md`
- `docs/02_design_system.md`
- `docs/03_arquitetura_seguranca.md`
- `docs/04_fases_futuras.md`
- `referencias/catalogo_aprovado.csv` (fonte autoritativa dos LINKS aprovados)
- `checklists/aceite.md`
- `README.md`
Se o usuário anexar logos originais, screenshots, repositórios ou arquivos de skills, trate-os como referências prioritárias, sem inventar seus caminhos. Este ZIP **não contém o código-fonte das bibliotecas, logotipos originais nem repositórios terceiros**. Não desenhar aproximação do logotipo final como se fosse original; se o asset não existir, apresentar placeholder textual temporário e registrar pendência.

## INTENÇÃO E PRINCÍPIOS
Or7 Creative System: estética editorial premium, autoral, funcional e contida, sem aparência de template ou 'IA genérica'. Aplicar conceitualmente UI UX Pro Max, Taste, Impeccable, Web Design Guidelines, Humanizer. Só alegar ter executado uma skill que realmente esteja instalada e tenha sido usada. Preserve todas as decisões aprovadas. Sem mudanças arbitrárias de escopo. Evidência antes de alegar êxito.

## IDENTIDADE CONGELADA
Nome: Or7 Works. Wordmark Minimal Essence 01 e ícone compacto aprovados visualmente, dependem de assets originais para implementação fiel.
Light: background #F5F7F8; surface #FFFFFF; text #202C39; muted #586878; border #DCE3E9; accent #356A88; on-accent #FFFFFF.
Dark: background #101720; surface #1B2632; text #EDF3F7; muted #A5B6C5; border #344250; accent #91C2DE; on-accent #10212F.
Status light success #237453, warning #946000, error #B23C4A; dark success #63C99A, warning #F2C16A, error #F08D99. Verificar contrastes reais; não depender só da cor para estado. Tema claro/escuro e cor de destaque configurável, persistidos. Títulos editoriais + fonte funcional, escolha de fontes sujeita à validação da licença. Motion sutil e reduzido quando solicitado. Apenas pt-BR nesta fase.

## STACK DE REFERÊNCIA E RESTRIÇÕES
React + Vite + TypeScript; shadcn/ui personalizado (escolher **uma** implementação compatível de primitives, evitar misturar Radix/Base UI/React Aria sem necessidade); Tailwind; React Router; TanStack Query; Zod + React Hook Form; Motion para animação; dnd-kit ou alternativa comprovadamente acessível; Supabase Auth/Postgres/RLS/Storage; Cloudflare Pages/Workers; Vite PWA; Vitest/Testing Library/Playwright. Considere bibliotecas como propostas, não dependências já instaladas. Verifique versões estáveis, compatibilidade, licenças, custos e APIs antes de instalar. Nunca inserir credenciais ou service_role no frontend. Evitar biblioteca completa de Chakra/Mantine/MUI apenas para copiar um visual escolhido. Revisar `referencias/catalogo_aprovado.csv` e construir uma tabela de mapeamento por tela, prioridade e licença. Componentes pagos/licenciados: não copiar sem direito de uso; manter efeito equivalente original ou registrar bloqueio.

## ETAPA 01 — UI/UX COMPLETA E DESIGN SYSTEM (PRIMEIRA ENTREGA)
Esta etapa precisa entregar uma experiência navegável e visualmente acabada NO DESKTOP E ANDROID antes de conectar serviços. A UI completa **não significa funcionalidade falsa**.
1. Inicializar/inspecionar repositório, manter scripts de lint/build/test, organizar `src/app`, `features`, `components/ui`, `components/motion`, `design-system`, serviços e docs. Identificar assets existentes.
2. Implementar tokens, temas, tipografia, iconografia, responsividade, dark mode, transições, estados, sidebar expansível/fixável, header, breadcrumbs contextuais, menu global Ctrl+K (navegação), bottom nav Android com safe-area e menu 'Mais'. Preferência da sidebar salva localmente até existir backend.
3. Construir telas de Login, MFA, recuperação, onboarding, dashboard, editor de widgets, settings, notificações e estrutura visual de leads, CRM, auditorias, agentes, clientes, projetos, propostas/contratos, documentos, financeiro, calendário, relatórios e monitoramento. Usar estados vazios autênticos; sem métricas, promessas, ações ou notificações falsas. Deixar claro o que está aguardando fase futura.
4. Dashboard visual premium com grid assimétrico, cards, títulos, filtros 7/30/90/custom e layouts de widgets. Antes da persistência, controle local funcional quando possível; na etapa 03 conectar dados reais. Widgets sem dados = 'Sem dados' ou travessão, nunca zero que induz a dado real. Editor deve ter também alternativa ao drag via controles de mover.
5. Aplicar animações selecionadas com critério: Orb / Sparkles apenas em login/áreas de destaque; Blur Text/Shiny Text em trechos curtos; Motion suave, evitar custos altos e glow repetitivo. React Bits Stepper no onboarding. Sonner para feedback. Todo componente visual deve respeitar reduce motion e interação por toque.
6. Entregar build testável localmente, screenshots desktop/mobile geradas por navegador real quando disponível, inspeção visual e lista de todas as páginas. Não usar dados demonstrativos como produção; eventualmente usar fixtures marcadas somente em testes automatizados e fora do produto.
**Checkpoint A:** aguardar revisão da UI/UX e registrar feedback antes de iniciar etapa 02, salvo autorização expressa para execução contínua.

## ETAPA 02 — INFRAESTRUTURA, AUTENTICAÇÃO E SEGURANÇA
1. Preparar Supabase via migrações reproduzíveis: profiles, user_preferences, dashboard_layouts, onboarding_progress, notifications, activity_events, backup_runs, system_settings; somente tabelas necessárias. Ids seguros, timestamps UTC, RLS ativo, privilégios mínimos, políticas de leitura/escrita coerentes; MFA `aal2` efetivo nas políticas de dados sensíveis (não apenas redirecionamento visual). Documentar bootstrap seguro da conta única, sem signup público.
2. E-mail/senha, configuração TOTP obrigatória, sessão persistente segura, logout, recuperação de senha, gestão de autenticação e códigos de backup de uso único com hashing, rate limits e verificação server-side. NÃO tratar códigos de backup como substituto trivial de MFA sem arquitetura de recuperação segura. Se suporte seguro não for viável no orçamento/stack, registrar bloqueador e não declarar concluído. Segredos apenas em backend/secret manager.
3. Diferenciar autenticação real e transição visual. Implementar estados, proteção de rotas, acesso direto, expiração, erros, sessões revogadas. Não permitir login antes da implantação segura da conta administradora.
4. Preparar deploy Cloudflare em ambiente privado de homologação, mantendo produção desativada. PWA **online-only** com offline fallback correto, não armazenar dados privados em caches públicos. Checar limitações dos planos gratuitos, inclusive eventual pausa do Supabase e cotas Cloudflare.
**Checkpoint B:** demonstrar MFA, RLS e rotas protegidas com testes e sem credenciais expostas.

## ETAPA 03 — FUNCIONALIDADES ESSENCIAIS E BACKUP
1. Persistir tema, preferências, sidebar, onboarding e widgets no banco. Widgets reorganizáveis por drag e teclado/botões, adicionar/remover, restaurar padrão, filtros aplicados apenas a dados reais existentes. Sem gerar números de leads inexistentes.
2. Busca Ctrl+K de páginas e entidades realmente existentes; notificações persistentes de eventos reais (por exemplo eventos de segurança), com lido/não lido. Sem inventar push dos agentes ainda. Configurações em uma página categorizada: perfil, aparência, dashboard, segurança, notificações, dados, backup, sistema e preparação de IA/custos.
3. Exportar apenas dados existentes em CSV/PDF/XLSX quando tecnicamente cabível, registrando limitações honestamente; não gerar relatórios falsos. Importação de leads CSV será Fase 02.
4. Backup AUTOMÁTICO DIÁRIO EXTERNO do banco e arquivos necessários, cifrado, verificação de integridade, logs, alertas de falha e procedimento documentado de RESTAURAÇÃO EM AMBIENTE ISOLADO. Confirmar destino e método permitido, custo e armazenamento; não chamar de externo um backup dentro da mesma conta sem proteção adequada. Planejar cobertura de Storage e autenticação; se configuração externa depender do usuário, entregar integração/documentação e marcar 'pendente de credenciais', nunca 'backup rodando'. Não expor segredos no frontend.
5. Preparar visibilidade de orçamento R$0–50/mês e alertas em R$30, com proteção contra consumo novo controlável acima de R$50. Não alegar impor hard-cap universal sobre cobranças de provedores. IA e agentes não entram em operação nesta fase.
**Checkpoint C:** demonstrar persistência real, notificações reais e execução/restauração de backup (ou bloquear conclusão se dependente de configuração externa).

## ETAPA 04 — TESTES, POLIMENTO, HOMOLOGAÇÃO
Testar com Vitest/Testing Library e Playwright em desktop e emulações Android, mais navegador real se acessível. Cobrir: login errado/correto, MFA, recuperação segura, logout, RLS, acesso direto/expiração, widgets, filtros, temas, onboarding, busca, estados vazios, layout 320–1440+, safe-area, teclado, toque, reduced motion, contraste, performance, PWA sem conexão, ausência de vazamento, backup/restauração e scripts CI. Corrigir regressões. Reportar PASS/FAIL/SKIP reais, nunca estimados. Produzir README de setup, variáveis de ambiente sem valores secretos, migrations, inventário de referências/versões/licenças, log de decisões, guia de backup/rollback, evidências de teste e lista de pendências. Criar build candidato à publicação; **NÃO fazer deploy público, push, merge irreversível ou migração em produção sem permissão explícita**.
**Checkpoint D:** aguardar aprovação final para qualquer publicação.

## TELAS FUTURAS (APENAS ESTADOS VAZIOS NA FASE 01)
Leads/CRM (descoberta 10/dia, seis segmentos e Brasil inteiro serão Fase 02); auditorias com evidências, score e agentes (Fase 03); propostas, contratos e outreach aprovado manualmente (Fase 04); clientes/projetos/docs/finanças (Fase 05); automações avançadas/monitoramento/modelos e custos (Fase 06). Essas decisões devem ser preservadas como contratos futuros sem integrar n8n, Ruflo ou agentes nesta entrega.

## REGRAS NÃO NEGOCIÁVEIS
1. Nunca sobrescrever código, logos, infraestrutura ou dados existentes sem inspeção e justificativa.
2. Nunca inventar arquivos, logotipos, bibliotecas instaladas, testes, dados comerciais, autorizações, credenciais, URLs funcionais ou resultados.
3. Nunca publicar nem executar operações externas irreversíveis sem autorização.
4. Não desenvolver agentes ou CRM real nesta fase; apenas interfaces preparadas.
5. Separar design implementado, testes verificados e pendências.
6. Aparência premium não substitui usabilidade: sem overflow mobile, com foco e contraste, labels, feedback, estados vazios/loading/erro, touch targets, prefers-reduced-motion.
7. Não presumir que duas assinaturas Claude Pro, ChatGPT Pro, Gemini Pro, Antigravity ou Copilot fornecem acesso gratuito às APIs.
8. Usar regras de custo conservadoras; avisar limites e dependências.
9. Manter quatro etapas e checkpoints A/B/C/D. Nenhum desvio sem justificativa aprovada.

## ENTREGA APÓS CADA CHECKPOINT
Exibir: (a) o que foi realmente implementado por arquivo/rota; (b) screenshots verificáveis se produzidos; (c) testes executados e resultados exatos; (d) bugs e pendências; (e) dependências, licenças e custos; (f) como executar localmente; (g) decisão solicitada para continuar. Não declarar concluída etapa com bloqueador P0. Não aguardar 'em segundo plano'.

## PRIMEIRA AÇÃO NO CLAUDE CODE
Ler os documentos, identificar estado do repositório, confirmar dependências e ativos disponíveis, fazer plano operacional breve e **começar pela ETAPA 01**, construindo primeiro a identidade e a UI/UX completas. Se houver bloqueador real (por exemplo logo original indisponível), avançar nos demais itens e registrar a dependência sem inventar material.
