# Upgrade Notes — v2.4 Learning Engine 2.0

## Major changes

### Active skill review
All 42 A0 lesson review steps are upgraded to `skillRetrieval` mode. Reviews now use actual exercises rather than primarily asking learners to recall Bunny's Vietnamese explanation.

### Open learner-created answers
Added `openSentence` + `openAnswerValidator` for genuine production tasks. The `My brother...` exercise no longer requires only `My brother works.`.

### Exercise intent model
Added pedagogical intents to the Foundation constructors and generated multisensory steps:

- recognize
- choose
- repair
- build
- produce
- listen_write

### Static teacher help
Added `Bunny, mình chưa hiểu` to lesson steps with four no-API help modes.

### Professional knowledge map
Added `englishKnowledgeMap.js` with A1→C2 scope, seven kernel patterns, sentence growth and Vietnamese learner priorities. The supplied source is preserved under `references/`.

### Better review persistence
Review queue v2 stores exercise snapshots and drops legacy definition-only lesson review cards during migration.

### Skill taxonomy expansion
Communication lessons f32–f42 now map to explicit skills such as greetings, possessives, WH questions, there is/are, can/can't, requests, time and conversation.

## Preserved systems

- 42 A0 lesson IDs/order
- natural Vietnamese curated copy
- Bunny teacher guides
- Kokoro voice system
- pronunciation service integration
- `Tôi không thể nói lúc này`
- sound feedback
- progress/resume
- mastery tracking
- A0 multi-skill assessment
- theme/accessibility foundations

## No AI dependency

No OpenAI runtime or API key is required in v2.4.
