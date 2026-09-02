# Next Agent Prompt — preserve Bunny English Learning Engine 2.0

You are continuing Bunny English after v2.4.

## Do not remove

- 42 A0 lesson IDs/order
- active `skillRetrieval` reviews
- exercise intents
- `openSentence` validation for genuine learner-created answers
- review queue v2 exercise snapshots
- `Bunny, mình chưa hiểu` static help
- Vietnamese-first teacher tone
- meaning before terminology
- input before independent output
- optional speaking / `Tôi không thể nói lúc này`
- Kokoro + browser fallback
- pronunciation service abstraction
- sound feedback
- A0 assessment, progress, mastery, review scheduling
- A1→C2 knowledge backbone and 7 kernel sentence patterns

## Permanent learning rules

1. Never test Bunny's Vietnamese explanation when the English skill can be tested directly.
2. If a prompt says the learner may create their own sentence, do not require one canonical answer.
3. Recognition, repair, construction and production are distinct skills.
4. Grammar terminology follows understanding; it does not lead it.
5. Learner-facing Vietnamese should sound like a Vietnamese teacher, not translated documentation.
6. The technical curriculum may use S/V/O/C/A internally, but A0 learners should meet human questions first.
7. Review should retrieve English, not definitions.

## Next curriculum work

Build A1 around real-world Can-Do units rather than grammar chapter names. Integrate vocabulary, listening, pronunciation, optional speaking, reading and writing inside each unit. Use `src/data/englishKnowledgeMap.js` and `references/English_Knowledge_Map_A1_to_C2.txt` as the scope backbone.

Do not add an OpenAI dependency unless the project owner explicitly asks to resume AI work.
