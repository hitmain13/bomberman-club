---
name: validar-pixel-perfect
description: Valida fidelidade pixel-perfect de uma tela contra o wireframe.png antes de marcá-la como concluída.
---

# Skill: validar-pixel-perfect

## Quando usar

Antes de marcar qualquer tela do front como concluída. Disparar também após mudanças visuais grandes.

## Passos

1. Abrir `wireframe.png` (raiz) e localizar a tela (numeração 01–21).
2. Subir o `apps/web` em modo dev (`bun run dev:web`).
3. Abrir a tela no browser em viewport 375×812 (iPhone X equivalente).
4. Comparar com o recorte do wireframe:
   - Hierarquia tipográfica
   - Espaçamento (grid 4/8px)
   - Posicionamento de ícones
   - Ordem dos elementos
   - Botões e CTAs
   - Estados loading / empty / error
5. Toda divergência intencional do wireframe deve virar uma decisão registrada em `.progress/decisions.md` + ADR.
6. Toda divergência **não** intencional precisa ser corrigida antes de seguir.
