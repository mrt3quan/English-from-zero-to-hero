# Merge Guide — Bunny English v2.4

## Recommended merge

Use the v2.4 folder as the next project base or merge the changed files listed below.

### New files

- `src/data/englishKnowledgeMap.js`
- `src/data/staticLessonHelp.js`
- `src/lib/openAnswerValidator.js`
- `src/lib/reviewTaskFactory.js`
- `scripts/validate-learning-engine.mjs`
- `tests/knowledgeMap.test.js`
- `tests/learningEngine2.test.js`
- `LEARNING_ENGINE_V2.4.md`
- `references/English_Knowledge_Map_A1_to_C2.txt`

### Modified runtime files

- `src/data/foundationCurriculum.js`
- `src/data/teacherGuides.js`
- `src/components/lesson/ExerciseRenderer.jsx`
- `src/components/lesson/StepRenderer.jsx`
- `src/components/lesson/LessonEngine.jsx`
- `src/components/PracticePage.jsx`
- `src/lib/reviewQueueService.js`
- `src/lib/skillTaxonomy.js`
- `src/lib/productionValidator.js`
- `package.json`
- `package-lock.json`

## Important behavior changes

1. Review cards now run active exercises.
2. Old lesson-review definition cards are not migrated to review queue v2.
3. `openSentence` is intentionally not exact-match validation.
4. Speaking remains optional.
5. No OpenAI/API dependency was added.

## After merge

```bash
rm -rf node_modules
npm ci
npm test
npm run validate:curriculum
npm run validate:learning-engine
npm run audit:copy
npm run build
```

## Manual checks

Open lesson `f05-complete-thought` and verify all of these pass the open task:

- My brother works.
- My brother is tired.
- My brother studies English.
- My brother has a dog.
- My brother can swim.

Verify these do not pass:

- My brother.
- My brother tall.
- My brother is.

Then finish the lesson and verify Review asks the learner to do English tasks rather than memorize definitions.
