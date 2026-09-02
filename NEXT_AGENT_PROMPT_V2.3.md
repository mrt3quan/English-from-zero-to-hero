# Next Agent Prompt — Preserve the v2.3 Teaching Standard

You are continuing Bunny English after **v2.3 Static Lesson Quality Pass**.

## Do not undo

- 42-lesson A0 curriculum and existing IDs
- teacher-led lesson structure
- natural Vietnamese-first explanations
- meaning before terminology
- adult-friendly tone
- Kokoro voice system
- optional speaking / “Tôi không thể nói lúc này”
- pronunciation-service abstraction
- review queue and skill mastery
- A0 guided writing assessment
- correct/wrong sound feedback
- clean Level → Chapter → Lesson UI

## Important product decision

OpenAI/API tutoring is postponed. Do not add OpenAI dependencies, API keys, runtime AI buttons, or AI-generated lesson content unless the user explicitly asks to resume that project later.

## Lesson quality rule

Every new lesson should feel like a teacher is guiding the learner:

**Discover → Notice → Understand → Hear → Say (optional) → Build → Write/Use → Review**

Vietnamese should be written naturally for Vietnamese adult learners, not translated literally from English. Use Vietnamese/English contrast only when it genuinely helps explain a likely learner error.

## Next curriculum direction

When A0 testing is stable, build A1 in small batches of excellent lessons rather than adding a large quantity at once. Reuse `LESSON_QUALITY_GUIDE_VI.md` as the content standard.
