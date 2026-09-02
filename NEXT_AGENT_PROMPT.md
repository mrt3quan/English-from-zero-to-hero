# Bunny English — Next Agent Handoff (after v1.8)

You are continuing Bunny English, a Vietnamese-first English-learning product whose long-term path is A0 → A1 → A2 → B1 → B2 → C1 → C2, ending in advanced speaking and college-level writing.

## Current state

A0 / Starter contains 42 lessons and a multi-skill final assessment.

The current lesson philosophy is:

**Teacher goal → Discover → Notice → Understand → Hear → Say → Build → Write → Teacher feedback → Review later**

Bunny is the teacher/guide. The learner should feel taught, not shown a digital grammar handout.

## v1.8 changes that MUST be preserved

### Clean Learn hierarchy

Learn is now:

**Level → Chapter → Lesson**

The main Learn view is a quiet level overview. A0 has one primary Continue action. Future A1–C2 levels are visible as compact locked rows.

A0 detail uses clean chapter sections and compact lesson rows. Do not restore the old zig-zag game-board path unless user testing strongly proves it is better.

### A0 writing assessment

Do not restore the old `minLines` gate.

The A0 writing test uses four guided tasks, one at a time:

1. self introduction
2. routine
3. have/has + can/can't
4. negative + place/time

Use sentence analysis, not line-break counting.

If Continue is disabled, tell the learner exactly what is missing.

Assessment progress auto-saves and can be resumed.

### Honest scoring

Foundation deterministic writing checks may inspect explicit structures, sentence boundaries, capitalization, and punctuation. Do not pretend those checks understand advanced writing quality.

Advanced free writing should eventually use a real AI/human-like writing feedback layer.

## Do not regress these older systems

- 42 A0 lessons and IDs
- teacherGuides for every lesson
- progressive Discover/Notice reveal
- meaning first → grammar name later
- multisensory loop
- SpeechService abstraction
- review queue
- skill mastery/error taxonomy
- production validator
- sound effects and user sound controls
- system/light/dark themes
- lesson resume/drafts
- mobile accessibility
- no hearts/energy/punitive limits

## Recommended next milestone

Start A1 Everyday English with a SMALL vertical slice (roughly 12–15 excellent lessons), not 100 shallow lessons.

A1 should be organized around real abilities/scenarios, with grammar underneath. Example unit framing:

- Meeting Someone
- My Family & Things
- At Home
- What Are You Doing?
- Everyday Requests

Likely structures include object pronouns, possessive 's, Present Continuous, Present Simple vs Present Continuous, countable/uncountable, some/any, much/many, time/place language, and practical WH questions.

Every A1 lesson should combine relevant grammar with vocabulary, listening, speaking, pronunciation, reading, and writing where useful.

## MUST KEEP — v1.9 voice system
- Keep `AudioService` provider-independent. Lesson components must not import Kokoro directly.
- Kokoro is the default high-quality TTS; browser SpeechSynthesis is a fallback, not the primary teaching voice.
- Keep the first-use loading state visible; do not mark audio as played before generation/playback starts successfully.
- Keep Bunny teacher voice stable for instruction and use controlled speaker variation for listening comprehension.
- Do not confuse TTS with `SpeechService` speech recognition or future pronunciation assessment.
- Preserve Profile voice provider/teacher-voice settings and the automatic fallback path.
