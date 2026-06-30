# React / Next.js 15 (canonical)

## App Router

- Server Components por padrão.
- `"use client"` somente quando há estado/evento/hook do client.
- Streaming + Suspense em listagens grandes.
- `loading.tsx`, `error.tsx`, `not-found.tsx` em cada segmento.

## Estado

- Servidor: **TanStack Query** v5. Nunca `useEffect` + `fetch`.
- Local efêmero: **Zustand** atômico por feature.
- Auth/theme: **Context API** em `shared/contexts/`.
- Forms: **React Hook Form + Zod**.

## Composição

Atomic Design. Estrutura de pasta de componente conforme `.cursor/rules/30-atomic-design.mdc`.

## Performance

- `next/image` com `sizes` corretos.
- Code split por rota (App Router já faz).
- `dynamic()` para componentes pesados client-only.
- Memoization quando houver evidência de re-render caro.
- Evitar dependências pesadas no client bundle (mapas, charts → dynamic).

## Acessibilidade

- Componentes com `aria-*` quando faltar semântica nativa.
- Targets de toque ≥ 44×44px (mobile-first).
- Contraste mínimo AA.
- Foco visível em todos os interativos.

## Mobile-first

Base 375px. Breakpoints Tailwind: `sm 640 / md 768 / lg 1024 / xl 1280`.
