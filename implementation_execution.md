# IMPLEMENTATION_EXECUTION.md

# Bomberman Club — Autonomous Implementation Guide

> Este documento define como a IA deve executar a implementação completa do projeto.
>
> Ele complementa o `ARCHITECTURE.md` e possui prioridade máxima durante toda a execução.

---

# Objetivo

Sua missão é implementar completamente a aplicação Bomberman Club até que ela esteja pronta para produção.

A implementação deve seguir rigorosamente:

- ARCHITECTURE.md
- Wireframe oficial
- Specs SDD
- ADRs
- Rules
- Skills

Caso exista conflito entre arquivos, siga esta prioridade:

```
IMPLEMENTATION_EXECUTION.md
↓

ARCHITECTURE.md
↓

docs/specs

↓

Wireframe

↓

ADRs

↓

Rules

↓

Código existente
```

---

# Mentalidade

Atue simultaneamente como:

- Software Architect
- Staff Software Engineer
- Frontend Specialist
- Backend Specialist
- Database Architect
- QA Engineer
- UI Engineer
- Performance Engineer
- Security Engineer
- DevOps Engineer

Sempre tome decisões pensando em longo prazo.

Nunca implemente apenas para "funcionar".

Implemente para escalar.

---

# Objetivo Final

O projeto somente pode ser considerado concluído quando:

- todas as páginas existirem
- todas as funcionalidades estiverem completas
- todos os testes passarem
- nenhuma rota possuir erro
- nenhum console error existir
- nenhum warning existir
- nenhuma tela estiver quebrada
- nenhum TODO existir
- nenhuma implementação provisória existir
- nenhuma funcionalidade estiver parcialmente implementada

---

# Desenvolvimento

Nunca implemente funcionalidades aleatoriamente.

Sempre seguir exatamente esta ordem.

```
Governança

↓

Monorepo

↓

Packages

↓

Database

↓

Backend Core

↓

Frontend Foundation

↓

Feature 001

↓

Feature 002

↓

Feature 003

↓

...

↓

QA

↓

Refatoração

↓

Performance

↓

Entrega
```

Nunca pule etapas.

---

# Desenvolvimento por Feature

Cada feature deve seguir exatamente este pipeline.

```
Ler Specification

↓

Ler Acceptance Criteria

↓

Ler API Contract

↓

Ler Test Plan

↓

Criar testes

↓

Implementar Backend

↓

Executar testes

↓

Implementar SDK

↓

Implementar Frontend

↓

Criar Stories

↓

Criar Testes

↓

Executar Browser QA

↓

Refatorar

↓

Marcar como concluída
```

Nunca inverter esta ordem.

---

# Progress Tracking

Criar obrigatoriamente:

```
.progress/

progress.md

todo.md

known-issues.md

decisions.md

session-log.md
```

Esses arquivos são obrigatórios.

---

## progress.md

Registrar:

- funcionalidades concluídas
- funcionalidades em andamento
- funcionalidades pendentes

---

## todo.md

Registrar tarefas futuras.

---

## known-issues.md

Registrar qualquer bug encontrado.

Quando corrigido:

remover imediatamente.

---

## decisions.md

Registrar:

- decisões arquiteturais
- mudanças
- refatorações
- melhorias

---

## session-log.md

Ao finalizar cada ciclo de trabalho registrar:

- o que foi feito
- próximos passos
- dificuldades encontradas

---

# Auto Review

Após concluir qualquer implementação executar:

```
Code Review

↓

Architecture Review

↓

Performance Review

↓

Security Review

↓

Accessibility Review

↓

Visual Review
```

Caso encontre qualquer problema:

corrigir imediatamente.

---

# Browser QA

Após cada feature:

executar aplicação

abrir navegador

percorrer toda a feature

testar todos os fluxos

clicar todos os botões

abrir todos os modais

testar teclado

testar mobile

testar desktop

testar tablets

testar formulários

testar upload

testar loading

testar erro

testar vazio

testar sucesso

testar responsividade

testar animações

testar navegação

testar autenticação

testar sessão

testar logout

testar refresh token

testar cache

Caso qualquer problema seja encontrado:

```
Encontrar causa

↓

Corrigir

↓

Executar novamente

↓

Validar novamente

↓

Repetir até não existir erro
```

---

# Critério Visual

Toda página deve ser comparada com o wireframe.

Verificar:

- alinhamento
- espaçamentos
- hierarquia
- tipografia
- tamanhos
- responsividade
- consistência

Nenhum componente pode parecer fora do padrão.

---

# Refatoração Contínua

Sempre que encontrar:

- duplicação
- complexidade
- código morto
- código repetido
- abstrações ruins

Refatore imediatamente.

Nunca acumule dívida técnica.

---

# Performance

Durante todo o desenvolvimento:

Priorizar:

- Server Components
- Suspense
- Streaming
- Lazy Loading
- Code Splitting
- Dynamic Imports
- Image Optimization
- Cache
- Memoization

Evitar:

- renderizações desnecessárias
- dependências pesadas
- bundles grandes

---

# Lighthouse

Ao concluir todas as telas.

Executar Lighthouse.

Objetivos mínimos:

```
Performance

95+

Accessibility

95+

Best Practices

95+

SEO

95+
```

Caso qualquer nota seja inferior:

otimizar.

Executar novamente.

---

# Testes

Toda feature deve possuir:

- Unit Tests
- Integration Tests
- E2E Tests

Executar continuamente.

Nunca deixar testes quebrados.

---

# Storybook

Todo componente reutilizável deve possuir:

- Story Default
- Loading
- Error
- Empty
- Variants

---

# Segurança

Verificar continuamente:

- autenticação
- autorização
- validações
- uploads
- SQL Injection
- XSS
- CSRF
- Rate Limit
- JWT
- Refresh Token

---

# Banco de Dados

Antes de criar qualquer tabela perguntar:

Essa informação realmente precisa de uma tabela?

Pode ser reaproveitada?

Existe duplicação?

Existe uma modelagem mais escalável?

Evite migrations desnecessárias.

---

# Código

É proibido utilizar:

- any
- unknown
- ts-ignore
- ts-expect-error
- type assertions
- código comentado
- código morto
- TODO
- FIXME
- HACK

---

# Padrões

Aplicar sempre:

- SOLID
- DRY
- KISS
- YAGNI
- Clean Architecture
- Atomic Design
- Feature First
- Repository Pattern
- Factory Pattern
- Builder Pattern
- Mapper Pattern
- Guard Clauses
- Return Early

---

# Git

Após concluir uma feature:

gerar commit seguindo Conventional Commits.

```
feat

fix

refactor

perf

docs

test

build
```

---

# Critério de Conclusão

O projeto somente pode ser marcado como finalizado quando:

✅ Todas as páginas implementadas

✅ Todas as funcionalidades implementadas

✅ Todas as APIs implementadas

✅ Todos os testes passando

✅ Nenhum erro de console

✅ Nenhum erro de terminal

✅ Nenhum warning

✅ Lighthouse acima das metas

✅ Browser QA completo

✅ Pixel Perfect validado

✅ Cobertura mínima atingida

✅ Performance validada

✅ Responsividade validada

✅ Segurança validada

✅ Todos os arquivos `.progress` atualizados

---

# Relatório Final

Ao finalizar, gerar um relatório contendo:

- funcionalidades implementadas
- componentes criados
- páginas criadas
- módulos criados
- APIs criadas
- tabelas criadas
- cobertura de testes
- métricas de performance
- score Lighthouse
- pendências
- débito técnico
- melhorias futuras

Somente após esse relatório o projeto pode ser considerado concluído.
