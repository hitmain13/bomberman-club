#!/usr/bin/env bash
# Deploy Bomberman API no Render via Blueprint API.
# Requer: RENDER_API_KEY (Account Settings → API Keys)
# Uso: ./scripts/render-deploy.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${RENDER_API_KEY:-}" ]]; then
  echo "Erro: defina RENDER_API_KEY (https://dashboard.render.com/u/settings#api-keys)" >&2
  exit 1
fi

REPO="${RENDER_REPO:-https://github.com/hitmain13/bomberman-club}"
BRANCH="${RENDER_BRANCH:-master}"

echo "→ Validando render.yaml..."
if command -v render >/dev/null 2>&1; then
  CI=true render -o json blueprints validate render.yaml
else
  echo "  (render CLI não instalado — pulando validação local)"
fi

echo "→ Criando/atualizando Blueprint no Render..."
RESP=$(curl -sS -X POST "https://api.render.com/v1/blueprints" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"bomberman-club\",\"repo\":\"${REPO}\",\"branch\":\"${BRANCH}\",\"autoDeploy\":\"yes\"}")

echo "$RESP" | head -c 500
echo ""
echo ""
echo "→ Abra o dashboard Render para preencher env vars (sync: false):"
echo "  DATABASE_URL, WEB_ORIGIN, API_BASE_URL, S3_*"
echo "  https://dashboard.render.com/"
