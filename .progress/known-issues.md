# Known Issues

_(nenhum bloqueante; pendências evolutivas estão em todo.md)_

## Observações

- Browser QA manual ainda não foi executado nesta sessão por ausência de Docker no host.
- Lighthouse não executado (precisa de deploy real ou docker compose ativo).
- Storybook não instalado nesta sessão; stories prontas para quando for adicionado.

## Feature 013 (Explore Social) — validação pendente

- `docker` indisponível nesta sessão de shell (integração WSL do Docker Desktop não persiste entre sessões — precisa reabilitar em Settings → Resources → WSL Integration a cada nova sessão, ou instalar o Docker diretamente no WSL). Sem Postgres acessível, não foi possível fazer Browser QA ao vivo nem popular dados reais para validar visualmente `/explore` (abas Pessoas/Carros), o perfil enriquecido e os bottom sheets de filtro.
- Compensado por: typecheck estrito limpo em 4 pacotes, Biome limpo (540 arquivos), 75 testes unitários verdes, `next build` verde (26 rotas).
- **Ação recomendada**: assim que o Postgres estiver acessível, rodar `bun run dev`, criar 2-3 contas de teste com carros/flagrados/follows, e percorrer manualmente: `/explore` (todas as 4 abas, com e sem busca, filtros de pessoas e de carros, chip de owner via `/explore?type=CARS&owner=<username>`), `/u/<username>` (4 abas, botão seguir refletindo estado real), `/me` (mesmas 4 abas com dados próprios).
