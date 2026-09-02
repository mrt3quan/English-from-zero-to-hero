# Pronunciation backend setup

Bunny English v2.0 integrates with the HTTP API exposed by the open-source PronounceAI project. The static Vite/GitHub Pages app cannot run the Python speech models itself, so pronunciation scoring runs as a separate backend service.

## 1. Download the upstream project

From the Bunny English project folder:

```bash
npm run pronunciation:setup
```

This clones PronounceAI into:

`services/PronounceAI`

The folder is ignored by Bunny English Git so the upstream project can be updated independently.

## 2. Start the backend

### macOS / Linux

```bash
cd services/PronounceAI/backend
./setup.sh
source .venv/bin/activate
CORS_ORIGINS=http://localhost:5173 uvicorn app.main:app --reload --port 8000
```

### Windows

Use the upstream backend setup instructions to create/activate its Python environment, then run:

```powershell
$env:CORS_ORIGINS="http://localhost:5173"
uvicorn app.main:app --reload --port 8000
```

The backend can also be run with Docker after the upstream source has been cloned:

```bash
docker compose -f docker-compose.pronunciation.yml up --build
```

## 3. Connect Bunny English

Create `.env.local` in Bunny English:

```env
VITE_PRONUNCIATION_API_URL=http://127.0.0.1:8000
```

Restart Vite:

```bash
npm run dev
```

Check the backend:

```bash
npm run pronunciation:check
```

## 4. GitHub Pages production

GitHub Pages can host only the Bunny frontend. Host the PronounceAI backend somewhere that can run Python/ML models, then add this GitHub repository secret:

`PRONUNCIATION_API_URL=https://your-pronunciation-backend.example.com`

The included Pages workflow passes that secret into Vite as `VITE_PRONUNCIATION_API_URL` during the build.

The backend must allow the GitHub Pages origin through CORS.

## Fallback behavior

If the pronunciation backend is absent, offline, blocked, or too slow:

- lessons do not break;
- Bunny falls back to browser SpeechRecognition for word-level checking when available;
- learners can self-confirm speaking on unsupported browsers;
- learners can always choose **Tôi không thể nói lúc này**.

## Scope deliberately not enabled

PronounceAI also contains voice-cloning/accent-conversion features. Bunny English v2.0 does **not** use them. We only integrate pronunciation scoring/prewarming because that matches the educational need and avoids collecting unnecessary voice-enrollment data.
