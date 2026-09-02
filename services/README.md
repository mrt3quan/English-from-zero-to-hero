# Optional speech services

Bunny English keeps large speech/ML runtimes outside the static Vite app.

Run `npm run pronunciation:setup` to clone the MIT-licensed PronounceAI repository into `services/PronounceAI` on your development machine. The folder is ignored by Git so the upstream project remains independently updateable instead of being copied into Bunny English.

The Bunny frontend talks only to the documented PronounceAI HTTP API (`POST /api/score`, `POST /api/prewarm`, `GET /health`).
