# Arquitetura, autenticação, infraestrutura e custos

- SPA/PWA React + Vite + TypeScript em Cloudflare; Supabase Postgres/Auth/Storage.
- Preferências/layouts persistidos; tabelas iniciais sugeridas: profiles, user_preferences, dashboard_layouts, onboarding_progress, notifications, activity_events, backup_runs, system_settings. Migrações e RLS.
- Conta única, sem registro público; e-mail/senha; MFA TOTP `aal2` obrigatório e aplicado às políticas sensíveis; fluxos de recuperação e backup codes seguros server-side. Não considerar login visual equivalente a segurança.
- Backup diário externo, criptografado, retenção documentada, teste de restauração isolado, cobertura de arquivos Storage. Dependência de destino e credenciais precisa ser registrada honestamente.
- Monitorar gastos; alertar em R$30 e proteger novas operações pagas controláveis ao chegar a R$50 mensais. Provedores distintos podem cobrar mesmo com bloqueios locais; nunca prometer hard cap universal.
- Não presumir disponibilidade SLA 24/7 em tiers gratuitos; backups gerenciados Supabase e execução agendada dependem de plano e limites reais.
- Assinaturas Claude Pro / ChatGPT Pro / Gemini Pro / Copilot Pro não implicam créditos de API.
- Sem n8n, Ruflo ou agentes reais na Fase 01.
- PWA Android instalável, online-only; não armazenar dados privados em cache público. Desktop navegador.
- Sem push para produção, publicação, merge ou migração de produção sem aprovação explícita.
