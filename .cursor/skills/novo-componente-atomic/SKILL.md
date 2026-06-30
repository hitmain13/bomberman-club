---
name: novo-componente-atomic
description: Cria um novo componente atomic (atom/molecule/organism/template) com a pasta de 6 arquivos exigida pelo projeto.
---

# Skill: novo-componente-atomic

## Quando usar

Sempre que precisar criar um componente React reutilizável em `apps/web/src/components/` ou `packages/ui/src/`.

## Passo a passo

1. Definir o nível: `atom` | `molecule` | `organism` | `template`.
2. Criar a pasta `ComponentName/` com os 6 arquivos (não pode faltar nenhum):
   - `ComponentName.tsx`
   - `ComponentName.types.ts`
   - `ComponentName.styles.ts`
   - `ComponentName.test.tsx`
   - `ComponentName.stories.tsx`
   - `index.ts`
3. Server Component por padrão. Adicionar `"use client"` **apenas** se houver hook, evento, estado client-side.
4. Tipar props em `ComponentName.types.ts` (sem `any`/`unknown`/`as`).
5. Centralizar classes Tailwind em `ComponentName.styles.ts` (usar `cva` se houver variantes).
6. `index.ts` apenas re-exporta. Sem default export.
7. Story `Default` + estados relevantes.
8. Teste mínimo: render + 1 asserção.

## Template canônico

Ver `.ai/templates/component/`.
