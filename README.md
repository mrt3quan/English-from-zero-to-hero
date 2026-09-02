# Bunny English v2.3 — Static Lesson Quality Pass

Bunny English is a Vietnamese-first English learning app designed to grow from first sentences toward advanced speaking and academic/college writing.

## Current release focus

v2.3 improves the **actual A0 lesson teaching quality** without requiring an AI API.

- 42 A0 lessons
- teacher-led Bunny guidance in every lesson
- natural Vietnamese explanations written for Vietnamese learners
- meaning before grammar terminology
- Listen → optional Say → Build → Write → Review learning loop
- Kokoro natural TTS with browser fallback
- optional pronunciation assessment backend + browser speech fallback
- “Tôi không thể nói lúc này” speaking skip/pause
- personalized review and skill mastery
- A0 multi-skill final assessment
- correct/wrong learning sound feedback
- clean Level → Chapter → Lesson navigation

## No OpenAI dependency in v2.3

OpenAI/API tutoring is intentionally postponed. The app does not need an OpenAI key for this release.

## Development

```bash
npm ci
npm test
npm run audit:copy
npm run dev
```

Build:

```bash
npm run build
```

See `LESSON_QUALITY_GUIDE_VI.md` for the teaching/copy standard and `MERGE_GUIDE_V2.3.md` for merge instructions.
