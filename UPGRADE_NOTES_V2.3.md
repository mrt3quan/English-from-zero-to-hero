# Bunny English v2.3 — Static Lesson Quality Pass

## Purpose

This release pauses OpenAI/API tutoring and focuses on the core product: high-quality static lessons that already feel like a real teacher.

## What changed

- All **42 A0 lessons** now have curated Vietnamese teaching copy.
- Every lesson has a lesson-specific Bunny teacher opening, reason-to-learn, and checkpoint.
- Rewrote the most visible explanations to use **meaning → notice → explanation → grammar name**.
- Removed machine-translation-style code mixing such as `spelling`, `state verb`, `base verb`, and technical learner-facing wording where it was unnecessary.
- Reworked several Vietnamese/English contrast explanations (be, adjective order, third-person -s, because/so, articles, questions, instructions).
- Generic Listen / Speak / Dictation / Build prompts are more natural and less technical.
- Speaking remains optional and explicitly supports **“Tôi không thể nói lúc này.”**
- Removed the experimental runtime Bunny AI tutor button and all OpenAI authoring/runtime dependencies from the merge package.
- Kokoro voice, pronunciation service integration, review, mastery, writing assessment, sounds, themes, and A0 level test are preserved.

## Curriculum safety

Lesson IDs, answer keys, validation rules, progress storage, skill IDs, and review mechanics were intentionally preserved.
