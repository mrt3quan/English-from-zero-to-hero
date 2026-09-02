# Merge Guide — Bunny English v1.8

Preferred approach: use this project as the new base if your current project is still v1.7-compatible.

If merging manually, copy these files first:

- `src/components/LevelAssessment.jsx`
- `src/components/FoundationMap.jsx`
- `src/data/a0Assessment.js`
- `src/lib/writingAssessment.js`
- `src/lib/assessmentRepository.js`
- `src/index.css`
- `src/App.jsx`
- `tests/a0Assessment.test.js`
- `tests/writingAssessment.test.js`

Then update `package.json` version if desired.

## Important compatibility notes

- Existing 42 lesson IDs were not changed.
- Existing progress/localStorage keys remain compatible.
- Completed lesson progress is preserved.
- Assessment result history still uses `bunny-english-assessments-v1`.
- A new draft key prefix is added: `bunny-english-assessment-draft-v1:`.
- The A0 writing item IDs remain `w1`–`w4` in the new format; old single-writing draft data should simply be restarted because the task format changed.

## Validate after merge

```bash
npm install
npm test
npm run build
```
