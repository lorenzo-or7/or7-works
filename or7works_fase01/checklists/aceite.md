# Checklist de aceite — validação real obrigatória

## Checkpoint A — UI
- [ ] todas as rotas planejadas navegam
- [ ] visual Glacier Original e identidade preservada
- [ ] desktop e Android sem overflow e com safe-area
- [ ] estados vazios honestos; nenhuma métrica fictícia
- [ ] animações suaves, reduced-motion e navegação por teclado
- [ ] fontes/assets/licenças rastreados

## Checkpoint B — segurança
- [ ] login real e TOTP configurado
- [ ] RLS e autenticação `aal2` testados
- [ ] recuperação segura e códigos de backup validados ou bloqueador documentado
- [ ] sem credenciais no frontend

## Checkpoint C — comportamento
- [ ] layouts/widgets, onboarding e preferências persistidos
- [ ] Ctrl+K funcional para páginas/dados existentes
- [ ] notificações verdadeiras e estados corretos
- [ ] backup diário externo executado, cifrado e restauração isolada testada; caso contrário não declarar concluído
- [ ] custos e limites operacionais documentados

## Checkpoint D — homologação
- [ ] teste desktop + Android (viewport e quando possível real)
- [ ] acessibilidade, PWA online-only, performance e segurança
- [ ] unitários + integração + e2e com PASS/FAIL/SKIP reais
- [ ] relatório de arquivos, testes, bloqueadores e instruções
- [ ] autorização explícita do usuário ANTES de deploy público
