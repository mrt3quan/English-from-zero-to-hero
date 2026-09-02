# Validation — v2.4

Validation completed in the build workspace.

- 42 A0 lessons present
- 42 production tasks pass curriculum validator
- all 42 A0 reviews use active skill retrieval tasks
- open-answer validator accepts multiple valid `My brother...` completions
- open-answer validator rejects tested fragments
- 7 kernel sentence patterns loaded
- A1→C2 knowledge map loaded
- Vietnamese copy audit: no high-confidence warnings
- 60 automated tests passed
- 42 JS/JSX source files parsed with TypeScript parser: 0 syntax errors

## Build limitation

A fresh `npm ci` was attempted but dependency download timed out in this environment. Therefore a full Vite production bundle was not claimed as verified here.

Run locally after merge:

```bash
rm -rf node_modules
npm ci
npm test
npm run validate:curriculum
npm run validate:learning-engine
npm run audit:copy
npm run build
```
