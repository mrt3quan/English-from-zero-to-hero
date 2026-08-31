# Bunny English — Foundation Engine v1

This slice intentionally focuses on the durable learning engine plus 30 Foundation lessons.

## Architecture

- `src/data/foundationCurriculum.js` — curriculum data only. 30 lessons across 20 units. No React presentation logic.
- `src/components/lesson/LessonEngine.jsx` — generic step navigator, mastery gate, progress persistence.
- `src/components/lesson/StepRenderer.jsx` — content/production/review registry.
- `src/components/lesson/ExerciseRenderer.jsx` — reusable exercise registry (choice, word order, fill, error correction, identify).
- `src/lib/learningProgress.js` — localStorage repository abstraction. Can later be replaced by API/PostgreSQL without changing lesson data.
- `src/components/FoundationMap.jsx` — responsive curriculum map.

## Learning cycle

Lessons use progressive disclosure:

Discover → Understand → Visualize / Compare → Guided Practice / Build / Correct → Produce → Review

The engine records exercise accuracy and requires production for lesson completion. The final mastery project requires 10 self-produced sentences.

## Curriculum source intent

Foundation sequencing follows early literacy/conventions ideas from the Common Core ELA foundational/language standards and multilingual, functional-language principles from WIDA, while the Vietnamese contrast notes follow the project brief and supplied Vietnamese grammar handbook.

## Run

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```
