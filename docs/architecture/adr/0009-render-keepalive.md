# ADR 0009 — Mitigação de hibernação do Render (keep-alive)

## Status

Aceito

## Contexto

O backend hospedado no Render (tier gratuito) entra em hibernação após ~15 minutos de inatividade. A primeira requisição após o cold start demora vários segundos e, combinada com falhas transitórias de refresh durante o boot, degradava a experiência de sessão.

## Decisão

Adotar uma estratégia dupla, de baixo custo e facilmente removível:

1. **GitHub Actions** — workflow `render-keepalive.yml` com cron a cada 14 minutos chamando `GET /health`.
2. **Cliente web** — componente `ApiHeartbeat` que envia ping periódico (10 min) enquanto o usuário está autenticado.

Nenhuma alteração na API além do endpoint `/health` já existente.

## Consequências

- Reduz frequência de cold starts sem upgrade de plano.
- Workaround temporário: remover workflow e componente ao migrar para plano always-on ou outro host.
- Consumo mínimo de banda (health check leve).
