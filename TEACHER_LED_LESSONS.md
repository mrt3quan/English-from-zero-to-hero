# Bunny English v1.6 — Teacher-Led Lesson Model

## Goal

Foundation should feel like a patient teacher is guiding a learner, not like a digital grammar handout.

The teacher flow is now:

1. **Bunny frames the goal** — what we are learning and why it matters.
2. **Learner looks first** — examples/visuals appear before the rule when possible.
3. **Learner predicts** — Discover/Notice steps pause before the explanation.
4. **Bunny explains** — short Vietnamese explanation after the learner has observed.
5. **Learner practices** — exercises require an attempt.
6. **Bunny responds** — correct and incorrect answers receive teacher-style feedback.
7. **Learner produces** — writing/speaking uses the same pattern in their own English.
8. **Learner retrieves later** — review queue brings mistakes back.

## Teacher presence

Every Foundation lesson has a lesson-specific guide in `src/data/teacherGuides.js`:

- `welcome` — how Bunny opens the lesson
- `why` — why the skill is useful
- `checkpoint` — one memorable takeaway

Every lesson step also receives a short teacher message based on the activity type.

On desktop, Bunny Teacher remains visible in the lesson sidebar. On mobile, each step begins with a compact teacher card.

## Beginner language rule

Use:

**meaning → human question → example → grammar name → abbreviation**

Example:

- “Câu đang nói về ai/cái gì?”
- `The cat`
- then: `Subject — chủ ngữ`
- later: `S`

Do not lead with formal terminology for true beginners.

## Progressive disclosure

Discover/Notice steps with a real preview now show the example first and pause before the explanation.

The learner taps:

> Tôi đã quan sát · nghe Bunny giải thích

Only then is the explanatory text revealed.

This prevents the lesson from becoming a long block of text.

## Do not regress

Do not remove:

- lesson-specific teacher guides
- TeacherGuide on every step
- teacher feedback after exercises
- progressive reveal on Discover/Notice
- meaning-first beginner rewrites
- learning integrity, review queue, speaking/listening, themes, progress, or existing lesson IDs
