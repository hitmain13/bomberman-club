# 013-explore-social — Specification

## Visão

Expandir o módulo Explorar para permitir navegação social completa entre membros e seus carros: listar pessoas com contexto social (contadores, seguir), navegar até o perfil público enriquecido (estatísticas reais, abas Sobre/Carros/Flagrados/Curtidas) e navegar até carros de qualquer membro com atribuição de dono visível.

## Por quê

O app já permitia visualizar o próprio perfil e buscar por termo, mas não oferecia uma experiência de "descoberta social" passiva (sem digitar nada) nem exibia estatísticas reais de rede (seguidores/seguindo sempre apareciam zerados). Esta feature fecha esse gap, seguindo o wireframe suplementar "Bomberman Club • Pessoas & Carros".

## Escopo

- `/explore` com 4 abas (Todos, Pessoas, Carros, Flagrados) e dois modos: busca (mantém `/search` existente) e navegação sem query (`/explore/people`, `/explore/cars` novos).
- Filtros de Pessoas (cidade, ordenação, membro desde) via bottom sheet.
- Filtros de Carros (stage, ordenação) via bottom sheet + filtro por proprietário via query string (`?owner=username`).
- `CarCard` exibindo dono (avatar + @username) quando aplicável.
- Perfil público (`/u/[username]`) e próprio (`/me`) com estatísticas reais (carros, flagrados, seguidores, seguindo) e abas Sobre / Carros / Flagrados / Curtidas.
- Correção de bug: `FollowButton` sempre mostrava "Seguir" mesmo quando o usuário já seguia (não recebia estado inicial).

## Fora de escopo (justificado)

- Campo "banner" de perfil — não existe em nenhum wireframe pixel do projeto (nem o original, nem o suplementar desta feature); adicionar agora seria uma migration sem consumidor de UI real. Ver ADR 0008.
- "Último acesso" de membro — exigiria infraestrutura de presença + privacidade ("quando permitido") não especificada; fica para V1.1.
- Ordenação de Pessoas por "mais carros" — não é uma ordenação nativa performática no Postgres sem quebrar paginação por cursor; mantido apenas RECENT/FOLLOWERS (ambas nativamente suportadas via índice/relation count).
- Aba "Curtidas" mostra apenas Carros e Flagrados curtidos (perfis curtidos não são exibidos — UX incomum).

## Dependências

- Schema existente (M2): `User`, `Follow`, `Like`, `Car`, `Garage`, `Sighting`, `CarSpecificationValue` (EAV). Nenhuma migration nova.
- Módulos backend existentes: `cars`, `sightings`, `social`, `users`, `discovery`.
