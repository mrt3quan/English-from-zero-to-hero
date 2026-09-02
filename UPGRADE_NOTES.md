# Bunny English v1.8 — Clean Learning Experience

This release focuses on two problems found during real testing:

1. The A0 writing test could block a learner who wrote many valid sentences because it counted line breaks instead of sentences.
2. The Learn screen had too many visual elements competing for attention.

## A0 writing test rebuilt

The final writing section is no longer one large 8–10 sentence textarea.

It is now four guided teacher-style tasks:

1. Introduce yourself — 2 sentences.
2. Talk about a routine — 2 sentences.
3. Use `have/has` and `can/can't` — 2 sentences.
4. Add a negative and a place/time detail — 2 sentences.

The learner sees one writing task at a time.

### The line-break bug is removed

Writing is analyzed as sentences rather than `text.split(/\n+/)`.

Both of these work:

`I am Minh. I live in Bellingham.`

and

```
I am Minh
I live in Bellingham
```

Line breaks are no longer an artificial requirement.

### Live writing requirements

The learner sees a transparent checklist, for example:

- 2 / 2 sentences
- `have / has` found
- `can / can't` still needed

If Continue is blocked, the footer explains exactly what is missing.

The deterministic scorer only measures features it can verify transparently: completion, target A0 structures, capitalization, and punctuation. It does not pretend to be a human essay grader.

### Test resume

A0 assessment answers, current section, speaking state, and current writing task are saved locally while the learner works. Closing and reopening the assessment offers **Continue saved test**.

## Cleaner Learn organization

The Learn screen now uses a simple three-level hierarchy:

**Level → Chapter → Lesson**

The first Learn screen shows:

- current A0 level
- progress
- one obvious Continue action
- A0 final test
- future A1–C2 levels as quiet locked rows

Opening A0 shows the detailed journey.

The old zig-zag / game-board lesson path was replaced with calmer chapter sections and compact lesson rows.

Each lesson row shows only useful information:

- lesson number/state
- English + Vietnamese title
- minutes
- number of short lesson steps
- Up next / Complete / Locked state

This borrows the information-hierarchy principle of clean modern learning products without copying another site's visual identity.

## Preserved systems

v1.8 keeps the existing:

- 42 A0 lessons
- teacher-led lesson guides
- Discover → Notice → Understand → Hear → Say → Build → Write → Review loop
- speaking/listening/dictation
- review queue and skill mastery
- production validation
- progress/resume
- sound effects
- themes
- XP/streak
- existing lesson IDs

## New/changed files

- `src/components/LevelAssessment.jsx`
- `src/components/FoundationMap.jsx`
- `src/data/a0Assessment.js`
- `src/lib/writingAssessment.js` (new)
- `src/lib/assessmentRepository.js`
- `src/index.css`
- `src/App.jsx`
- `tests/writingAssessment.test.js` (new)
- `tests/a0Assessment.test.js`

## v1.9 — Natural voice upgrade

- Replaced browser SpeechSynthesis as the default lesson voice with a provider-backed `AudioService` using Kokoro.
- Added pinned lazy loading of `kokoro-js@1.2.1` and the Kokoro 82M v1.0 ONNX model.
- Added `af_heart` as the default Bunny teacher voice, plus Bella, Jessica and Michael teacher choices.
- Added female/male listening variation for assessment audio.
- Added loading states to Listen, Hear/Say examples, dictation and A0 listening assessment controls.
- Added automatic browser-TTS fallback if Kokoro/CDN/model loading fails.
- Added Profile controls for high-quality voice vs browser voice and teacher voice preview.
- Preserved the existing `SpeechService` microphone/speech-recognition layer; TTS and speech recognition remain separate systems.
- Added `VOICE_SYSTEM.md` and `THIRD_PARTY_NOTICES.md`.
