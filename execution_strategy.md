# EXECUTION_STRATEGY.md

# Bomberman Club — Autonomous Execution Strategy

> Este documento define como a IA deve conduzir a implementação do projeto de forma eficiente, previsível e econômica em termos de tempo e tokens.

---

# Objetivo

O objetivo não é desenvolver o projeto o maior tempo possível.

O objetivo é desenvolver o projeto da forma mais eficiente possível.

Toda decisão deve considerar:

- qualidade
- previsibilidade
- escalabilidade
- economia de contexto
- economia de tokens

---

# Princípios

Sempre priorizar:

- terminar tarefas
- reduzir retrabalho
- evitar loops
- evitar refatorações desnecessárias
- evitar otimizações prematuras

Nunca buscar perfeição infinita.

Buscar qualidade suficiente para produção.

---

# Estratégia Geral

O projeto deve ser desenvolvido por fases.

Nunca trabalhar em toda a aplicação simultaneamente.

Pipeline:

```text
Planejamento

↓

Implementação

↓

Validação

↓

Refatoração

↓

Conclusão

↓

Próxima fase
```

Após concluir uma fase, nunca voltar para ela sem motivo.

---

# Milestones

Toda implementação deve ser dividida em milestones.

## Milestone 1

Infraestrutura

- Monorepo
- Bun
- Turborepo
- Configurações
- Docker
- CI

STOP

---

## Milestone 2

Banco de Dados

- Prisma
- Migrations
- Seeds
- Modelagem

STOP

---

## Milestone 3

Backend Core

- Plugins
- Middlewares
- Auth
- Users

STOP

---

## Milestone 4

Frontend Foundation

- Layout
- Providers
- Design System
- Atomic Components

STOP

---

## Milestone 5

Feature Auth

STOP

---

## Milestone 6

Profile

STOP

---

## Milestone 7

Garage

STOP

---

## Milestone 8

Cars

STOP

---

## Milestone 9

Sightings

STOP

---

## Milestone 10

Map

STOP

---

## Milestone 11

Social

STOP

---

## Milestone 12

Ranking

STOP

---

## Milestone 13

QA Final

STOP

---

# Ordem de execução

Cada milestone deve seguir exatamente:

```text
Ler Specs

↓

Implementar

↓

Executar testes

↓

Executar Browser QA

↓

Executar Refatoração

↓

Marcar como concluído

↓

Ir para próximo milestone
```

Nunca inverter.

---

# Browser QA

O Browser QA possui limite.

Fluxo:

```text
Executar Browser QA

↓

Problemas encontrados?

↓

Não

↓

Concluir

↓

Sim

↓

Corrigir

↓

Executar novamente

↓

Máximo 3 ciclos
```

Após três ciclos:

Registrar em:

.progress/known-issues.md

Continuar desenvolvimento.

---

# Lighthouse

Executar apenas:

- quando uma feature grande for concluída
- no QA final

Nunca executar Lighthouse continuamente.

Limite:

```text
Primeira execução

↓

Corrigir problemas

↓

Segunda execução

↓

Registrar resultado

↓

Encerrar
```

Máximo:

2 execuções.

---

# Testes

Após implementar uma feature:

Executar todos os testes.

Caso exista falha:

Corrigir.

Executar novamente.

Máximo:

3 tentativas.

Persistindo erro:

Registrar em:

.progress/known-issues.md

Continuar.

---

# Refatoração

Executar apenas uma vez por feature.

Não realizar:

- micro otimizações
- mudanças estéticas
- mudanças de preferência pessoal

Refatorar apenas:

- duplicação
- código morto
- violações SOLID
- baixa reutilização
- alta complexidade

---

# Performance

Performance deve ser otimizada apenas:

- quando houver evidência de problema
- durante o QA final

Nunca realizar otimizações prematuras.

---

# Reexecução

Nunca repetir uma etapa já concluída.

Somente repetir quando:

- houve alteração direta naquela etapa
- testes falharam
- Browser QA falhou
- build falhou

Caso contrário:

seguir para a próxima etapa.

---

# Economia de Tokens

Evitar:

- análises repetidas
- reexecuções completas
- testes completos desnecessários
- browser QA repetitivo
- Lighthouse repetitivo
- refatorações sucessivas

Sempre executar apenas o necessário.

---

# Critério para interromper loops

Caso uma mesma tarefa seja executada repetidamente sem progresso mensurável:

Interromper imediatamente.

Registrar em:

.progress/known-issues.md

Continuar para a próxima tarefa.

Nunca permanecer em loop.

---

# Definition of Done

Uma feature é considerada concluída quando:

- implementação finalizada
- testes passando
- Browser QA concluído
- build funcionando
- typecheck funcionando
- lint funcionando
- stories criadas
- documentação atualizada

Após isso:

Nunca revisitar a feature sem necessidade.

---

# Controle de Contexto

Ao iniciar uma nova sessão:

Ler obrigatoriamente:

```text
.progress/progress.md

↓

.progress/todo.md

↓

.progress/known-issues.md

↓

.progress/decisions.md

↓

.progress/session-log.md
```

Somente após recuperar o contexto iniciar o desenvolvimento.

---

# Registro de Sessão

Ao finalizar qualquer sessão registrar:

## Concluído

Lista das tarefas concluídas.

## Próximo passo

O que deve ser implementado na próxima sessão.

## Problemas

Problemas encontrados.

## Decisões

Decisões arquiteturais tomadas.

---

# Critério de Encerramento

Encerrar definitivamente a implementação quando:

- todos os milestones estiverem concluídos
- todas as funcionalidades estiverem implementadas
- QA final concluído
- Lighthouse dentro das metas
- Browser QA final concluído
- testes passando
- build funcionando
- nenhuma pendência crítica existir

Após isso:

Gerar relatório final.

Não iniciar novos ciclos de otimização ou refatoração sem uma solicitação explícita do usuário.
