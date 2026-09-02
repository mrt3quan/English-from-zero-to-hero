# Bunny English Learning Engine 2.0

## 1. Why this upgrade exists

Real learner feedback showed two important problems:

1. Review screens asked learners to remember abstract Vietnamese definitions instead of using English.
2. Some exercises looked open-ended but accepted only one hidden sentence.

v2.4 fixes both at engine level so A1–C2 do not inherit the same problems.

## 2. Lesson rhythm

The preferred lesson flow is:

1. Bunny creates context
2. learner discovers an example
3. learner notices a pattern
4. Bunny explains one idea
5. learner hears it
6. learner may say it (speaking remains optional)
7. learner recognizes the structure
8. learner builds it
9. learner repairs a mistake
10. learner produces their own English
11. later review tests the English skill again

Meaning comes before terminology. Input comes before independent output.

## 3. Five core exercise intents

The engine now distinguishes why an activity exists:

- `recognize` — notice/identify the correct English
- `choose` — supply a constrained answer
- `repair` — correct broken English
- `build` — construct English from pieces
- `produce` — create original English

`listen_write` is used for dictation.

The intent is separate from the UI widget. This lets future A1–C2 lessons change interaction type without losing the pedagogical purpose.

## 4. Active review

Old review:

- asks a definition
- shows a memorized answer
- learner self-rates

New review:

- reuses a real English task from the lesson
- learner answers first
- Bunny gives feedback
- learner rates `Cần ôn lại / Nhớ một phần / Nhớ rồi`

Every A0 lesson now has 1–3 active review tasks. Definition cards remain only as a legacy fallback for old data.

## 5. Open-answer validation

`openSentence` is for prompts where many answers can be correct.

Example:

`My brother...`

Valid examples include:

- My brother works.
- My brother studies English.
- My brother is tall.
- My brother has a dog.
- My brother can swim.

The app no longer compares this type of task to one sample sentence.

The current validator is intentionally conservative and A0-focused. It does not claim to understand arbitrary advanced English. Later B1+ free writing should use a richer grammar/writing feedback system.

## 6. Static Bunny help

Every lesson step now includes:

`Bunny, mình chưa hiểu`

The learner can choose:

- Giải thích dễ hơn
- Cho thêm ví dụ
- So với tiếng Việt
- Cho mình thử thêm

This is authored/static help. No OpenAI key or external AI backend is required.

## 7. Knowledge backbone

`src/data/englishKnowledgeMap.js` encodes the professional A1–C2 roadmap used by the project:

- CEFR A1, A2, B1, B2, C1, C2
- 7 kernel sentence patterns
- simple → compound → complex → compound-complex growth
- Vietnamese pronunciation priorities
- input-before-output progression
- shadowing/collocations at intermediate stages
- academic/rhetorical control at advanced stages

Important: the data model can be technical while learner-facing A0 lessons remain simple.

## 8. Review queue migration

The queue storage key moved from `review-queue.v1` to `review-queue.v2`.

When v2 first loads:

- useful old mistake/retrieval items may migrate
- old `lesson_review` definition cards are intentionally dropped
- new review items store an exercise snapshot when possible

This prevents old abstract review cards from surviving after the engine upgrade.

## 9. What not to do next

Do not turn the 7 sentence patterns into one A0 formula dump.
Do not make every lesson a grammar chapter.
Do not require AI for basic learning.
Do not judge open writing with fake precision.
Do not reintroduce definition memorization as the main review method.

A1 should be built on this engine using real-world Can-Do missions and integrated vocabulary, listening, pronunciation, speaking, reading and writing.
