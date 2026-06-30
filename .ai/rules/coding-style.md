# Coding Style (canonical)

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- Proibido: `any`, `unknown` solto, `as Foo`, `@ts-ignore`, `@ts-expect-error`.
- Sempre tipar retorno de funções públicas.
- Nada de default export em componentes.

## Naming

- Arquivos React: `PascalCase.tsx`.
- Arquivos utilitários/serviços: `kebab-case.ts`.
- Variáveis e funções: `camelCase`.
- Tipos e interfaces: `PascalCase`.
- Constantes globais: `SCREAMING_SNAKE_CASE`.

## Estrutura de arquivo

- Imports agrupados: externos → internos absolutos → internos relativos.
- Path alias `@/*` no front; sem `../../..` profundos.
- 1 responsabilidade por arquivo.

## Patterns

- Guard clauses + return early.
- Builder para entidades complexas.
- Factory para criação parametrizada.
- Repository para persistência.
- Mapper Entity ↔ DTO.
- Composition over inheritance.

## Proibições

- Código comentado.
- Código morto.
- `// TODO`, `// FIXME`, `// HACK`.
- Funções com mais de ~30 linhas (sinalize refactor).
- Componentes com mais de ~150 linhas (sinalize split).
