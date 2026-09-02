# Bunny English v2.3 Validation

Recorded in the artifact environment:

- Curated static Vietnamese copy: **42 / 42 A0 lessons**
- Automated test suite: **41 / 41 passed**
- Vietnamese learner-copy audit: **passed**
- JS/JSX syntax parse: **36 files, 0 syntax errors**
- Runtime Bunny AI tutor dependency: **removed / postponed**
- Existing curriculum, review, Kokoro voice, pronunciation, speaking skip, writing assessment, sound feedback, and A0 assessment tests: **preserved and passing**

## Production build note

A clean `npm ci` could not finish in this artifact environment because package-registry access timed out. Therefore a fresh Vite production bundle was not claimed here.

Run in the normal development/merge environment:

```bash
npm ci
npm test
npm run audit:copy
npm run build
```
