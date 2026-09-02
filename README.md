# Bunny English v1.9

Vietnamese-first English learning from A0 foundation toward advanced speaking and college-level writing.

## Current release

- 42 A0 lessons
- teacher-led lesson experience
- multisensory learning loop
- personalized review/mastery
- listening + browser speech-recognition practice
- sound feedback
- A0 final level assessment
- guided A0 writing assessment
- clean Level → Chapter → Lesson Learn UI
- light/dark/system themes
- responsive mobile/desktop UI

## Learning philosophy

Meaning first. Grammar terminology later.

The learner should repeatedly:

**Discover → Notice → Understand → Hear → Say → Build → Write → Review**

## Run locally

```bash
npm install
npm test
npm run validate:curriculum
npm run dev
```

Production validation:

```bash
npm run build
```

## Important files

- `src/data/foundationCurriculum.js` — 42 A0 lessons
- `src/data/teacherGuides.js` — lesson-specific Bunny teacher guidance
- `src/components/lesson/` — lesson engine/renderers
- `src/components/FoundationMap.jsx` — clean learning-path UI
- `src/components/LevelAssessment.jsx` — reusable assessment UI
- `src/data/a0Assessment.js` — A0 assessment definition
- `src/lib/writingAssessment.js` — transparent A0 writing analysis
- `src/lib/soundEffectsService.js` — correct/wrong/completion sounds
- `src/lib/audioService.js` — provider-independent TTS (Kokoro + browser fallback)
- `scripts/validate-curriculum.mjs` — checks every production placeholder satisfies its own requirements

## Natural English voice (v1.9)

Bunny English now defaults to Kokoro-based in-browser TTS for a more natural American English teacher voice. The model is lazy-loaded only when audio is requested. Learners can switch back to browser TTS under Profile → Giọng đọc bài học. See `VOICE_SYSTEM.md` for architecture and fallback details.
