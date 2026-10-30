# Or7 Works — Produto

> Fonte: kit `or7works_fase01/` (Prompt Mestre v1.0, 29/10/2026) e respostas do usuário nesta sessão.
> Itens marcados *(inferido)* vêm do kit e não foram confirmados à parte.

## O que é
Software privado da Or7 para operar o próprio negócio: descobrir empresas com potencial de projeto, auditar suas presenças digitais, conduzir propostas e gerenciar clientes, projetos e finanças internas.

## Quem usa
Uma única conta administradora da Or7. Não há cadastro público nem outros perfis nesta fase. Uso em navegador desktop e como PWA no Android.

## Fase 01 (em execução)
UI/UX completa (Etapa 01) → autenticação, MFA e infraestrutura (Etapa 02) → persistência, notificações reais e backup externo (Etapa 03) → testes e homologação (Etapa 04). Checkpoints A/B/C/D exigem aprovação do usuário.

## Regras de produto que não mudam
- Nenhuma métrica, notificação ou dado fictício na interface de produção. Sem dados = "Sem dados" ou travessão.
- Módulos futuros aparecem navegáveis e vazios, com a fase em que entram.
- MFA TOTP obrigatório e aplicado no banco (aal2), não só na tela.
- Aprovação humana obrigatória antes de contato, contrato, preço ou ação relevante (Fase 04).
- Orçamento de operação R$ 0–50/mês, alerta em R$ 30; sem promessa de teto universal nos provedores.
- Assinaturas de chat (Claude/ChatGPT/Gemini/Copilot) não incluem créditos de API.
- Finanças internas separadas do NEXO *(inferido do roadmap)*.
- Idioma: apenas pt-BR.

## Marca
- Nome: Or7 Works. Wordmark "Minimal Essence 01" e ícone compacto aprovados; arquivos originais ainda não estão no repositório (usuário vai enviar).
- Identidade visual: Glacier Original — tokens congelados em `or7works_fase01/docs/02_design_system.md`.

## Plataforma
web (SPA/PWA). Stack de referência: React + Vite + TypeScript, Tailwind, Radix (via shadcn-style), React Router; Supabase e Cloudflare a partir da Etapa 02.
