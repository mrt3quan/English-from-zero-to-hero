#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="$ROOT/services/PronounceAI"
REPO="https://github.com/vikranthreddimasu/PronounceAI.git"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required. Install git, then run this script again." >&2
  exit 1
fi

if [ -d "$TARGET/.git" ]; then
  echo "PronounceAI already exists at $TARGET"
  echo "Updating it..."
  git -C "$TARGET" pull --ff-only
else
  echo "Cloning PronounceAI into $TARGET"
  git clone --depth 1 "$REPO" "$TARGET"
fi

cat <<'MSG'

PronounceAI source is ready.

Recommended local backend start:
  cd services/PronounceAI/backend
  ./setup.sh
  source .venv/bin/activate
  CORS_ORIGINS=http://localhost:5173 uvicorn app.main:app --reload --port 8000

Then create .env.local in Bunny English with:
  VITE_PRONUNCIATION_API_URL=http://127.0.0.1:8000

Start Bunny English in another terminal:
  npm install
  npm run dev
MSG
