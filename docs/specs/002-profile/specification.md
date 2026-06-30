# 002-profile — Specification

## Visão

Permitir que o Bomberman visualize seu perfil e o perfil de outros membros, e edite os próprios dados (foto, bio, cidade, username).

## Escopo

- Tela 08 Perfil (visão geral) com header (foto, nome, username, cidade, bio), métricas (seguidores, seguindo, carros) e tabs Carros / Flagrados / Galeria.
- Tela 11 Editar perfil (foto, nome, bio, cidade, website opcional).
- Rota pública por username: `/u/:username`.
- Rota privada `/me` consumindo `users.me`.

## Fora de escopo

- Upload real de avatar (apenas placeholder em V1, fica para M+ Uploads).
- Conteúdo das tabs (carros vem em M7/M8, flagrados em M9).
- Settings (tela 20) — feature posterior.

## Dependências

- Backend: módulos `users`, `garages`, `cars` (cars chega em M8 — temporariamente exibimos placeholder).
- Frontend: `useAuth`, `useQuery` para `users.me` e `users.byUsername`.
