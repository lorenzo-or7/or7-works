# Escopo e telas — Fase 01

Objetivo: UI/UX completa na primeira etapa; segurança, funções reais e homologação nas etapas seguintes. **Não desenvolver agentes ainda**.

## Telas plenamente operacionais ao final da Fase 01
- Login com e-mail/senha, TOTP obrigatório e recuperação protegida
- Onboarding em etapas com progresso persistente
- Dashboard com widgets rearranjáveis, filtros e estados vazios honestos
- Settings: perfil, aparência, widgets, segurança, notificações, dados, backup, sistema
- Central de notificações reais do sistema e busca global Ctrl+K
- Shell: sidebar desktop, header, barra inferior Android e PWA online-only

## Telas apenas com UI + estado vazio preparatório
Leads, CRM, auditorias, agentes, clientes, projetos, propostas/contratos, documentos, financeiro, calendário, relatórios, monitoramento. Pode haver elementos de navegação, descrição do módulo e indisponibilidade honesta; nenhum botão falso.

## Etapas
1. UI/UX visual completa e responsiva
2. Auth, TOTP, RLS e infraestrutura
3. Persistência de widgets/onboarding, busca, notificações, backup externo
4. Testes, polimento e homologação sem publicação automática

## Regra
Não usar dados fictícios em interface de produção. Fixture apenas de teste, devidamente isolada.
