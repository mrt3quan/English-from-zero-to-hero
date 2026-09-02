# Bunny English v2.4 — Learning Engine 2.0

Bunny English is a Vietnamese-first English learning app that grows from first English sentences toward fluent speaking and academic/college writing.

## What v2.4 changes

v2.4 is a learning-system upgrade, not a visual redesign.

- keeps all 42 A0 lessons and their IDs
- replaces definition-style lesson review with active English retrieval
- adds explicit exercise intents: recognize / choose / repair / build / produce / listen & write
- adds open-answer sentence validation so learner-created English is not forced into one hidden sample answer
- fixes the `My brother...` task so many valid completions can pass
- adds a static `Bunny, mình chưa hiểu` help drawer to every lesson step
- adds a structured A1→C2 knowledge backbone and the 7 kernel sentence patterns for future curriculum work
- expands A0 sub-skill tracking for communication lessons 32–42
- migrates the review queue away from old definition-style lesson-review cards
- keeps Kokoro TTS, optional pronunciation assessment, optional speaking, sound feedback, A0 assessment, mastery and progress systems
- requires no OpenAI/API key

## Learning rule

> Never test Bunny's explanation when we can test the learner's English directly.

And:

> If Bunny asks the learner to create their own English, Bunny must not secretly require one predetermined sentence.

## Development

```bash
npm ci
npm test
npm run validate:curriculum
npm run validate:learning-engine
npm run audit:copy
npm run dev
```

Production build:

```bash
npm run build
```

See:

- `LEARNING_ENGINE_V2.4.md`
- `MERGE_GUIDE_V2.4.md`
- `UPGRADE_NOTES_V2.4.md`
- `VALIDATION_V2.4.md`
- `references/English_Knowledge_Map_A1_to_C2.txt`
