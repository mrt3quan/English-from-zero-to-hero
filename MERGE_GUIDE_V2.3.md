# Merge Guide — Bunny English v2.3

## Recommended merge

Use this package as the new project base if your current branch is v2.0–v2.2 derived.

The most important files for the lesson-quality change are:

- `src/data/curated/a0TeachingCopy.vi.js` — curated static Vietnamese copy for all 42 A0 lessons
- `src/data/teacherGuides.js` — teacher-led static guidance
- `src/data/foundationCurriculum.js` — generic learning-cycle copy cleanup + a few review/check wording fixes
- `src/components/lesson/TeacherGuide.jsx` — static teacher UI; no runtime AI tutor
- `LESSON_QUALITY_GUIDE_VI.md` — writing/teaching standard for future A1–C2 lessons
- `tests/staticLessonQuality.test.js` — protects 42-lesson copy coverage and confirms AI tutor is postponed

## OpenAI status

OpenAI/API tutoring is intentionally **not part of this release**. Do not add API keys or client-side OpenAI calls.

## Preserved systems

Keep the existing Kokoro TTS, optional pronunciation backend, “I can’t talk right now” flow, review queue, skill mastery, writing assessment, level test, sound effects, themes, and progress/resume behavior.

## After merge

Run:

```bash
npm ci
npm test
npm run audit:copy
npm run build
```

If `npm ci` is blocked by network/package registry access, run the tests with the dependencies already installed in your normal development environment.
