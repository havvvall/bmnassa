#!/usr/bin/env bash
# Builds the Claude artifact preview of the app: dist/claude-preview/index.html
# Run from the repo root:  bash scripts/claude-preview/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
HERE=scripts/claude-preview
WORK=dist/claude-preview-work
OUT=dist/claude-preview/index.html
PORT=5174
mkdir -p "$WORK" "$(dirname "$OUT")"

echo "1/5 Building the app"
npx vite build --outDir "$WORK/dist" --emptyOutDir >/dev/null

echo "2/5 Starting the dev server on port $PORT"
npx vite --port "$PORT" --strictPort >"$WORK/vite.log" 2>&1 &
VITE_PID=$!
trap 'kill $VITE_PID 2>/dev/null || true' EXIT
for i in $(seq 1 30); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done

echo "3/5 Recording live data and map tiles"
node "$HERE/record.cjs" "$WORK/rec.json" "http://localhost:$PORT"

echo "4/5 Downloading Leaflet"
curl -sS -o "$WORK/leaflet.css" https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css
curl -sS -o "$WORK/leaflet.js" https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js

echo "5/5 Packing one self-contained page"
node "$HERE/pack.cjs" "$WORK/dist" public "$WORK/rec.json" "$WORK" "$OUT"
