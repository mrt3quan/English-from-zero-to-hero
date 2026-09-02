# Bunny English v2.0 — Pronunciation System

## Goal

When a learner chooses to speak, Bunny should be able to tell the difference between:

- saying the wrong words;
- producing a weak/missing sound;
- rhythm/intonation that needs practice.

Feedback should point to one useful next action.

## Architecture

```text
AudioService / Kokoro
└── Bunny speaks

Microphone
└── AudioRecorderService
    └── PronunciationService
        └── POST /api/score
            ├── transcript / phrase match
            ├── phoneme analysis
            ├── pronunciation dimensions
            └── Bunny Vietnamese coaching

Fallback
└── SpeechService / browser SpeechRecognition
    └── word-level transcript comparison
```

Lesson data remains provider-independent.

## User experience

1. Learner listens to the target sentence.
2. Learner presses **Nói để Bunny kiểm tra**.
3. Browser records a short clip.
4. Backend analyzes the expected phrase.
5. Bunny leads with a specific teaching tip, e.g. final `/s/` or `/θ/` mouth position.
6. Technical scores are secondary and collapsed by default.
7. Learner can retry immediately.

## "I can't talk right now"

Every speaking activity offers:

**Tôi không thể nói lúc này**

Choosing it:

- completes/skips the current speaking step;
- pauses microphone prompts for about 15 minutes;
- does not count as an incorrect attempt;
- does not reduce mastery/XP;
- keeps listening available;
- lets the learner turn speaking back on at any later speaking step.

The A0 speaking assessment is already non-blocking and uses the same behavior.

## Vietnamese learner coaching

The frontend contains conservative articulatory hints for common targets such as:

- final `/s/`, `/z/`, `/t/`, `/d/`, `/k/`, `/p/`;
- `/θ/` and `/ð/`;
- `/v/` vs `/w/`;
- `/r/` and `/l/`;
- selected vowel contrasts.

These tips are only shown when the backend identifies a weak target phoneme. Bunny does not invent a phoneme error from browser transcription alone.

## Privacy / data handling

- microphone recording starts only after an explicit learner action;
- the Bunny frontend does not store raw recording blobs in localStorage;
- speaking can always be skipped;
- raw audio is sent only to the configured pronunciation backend;
- backend retention/deletion policy must be reviewed before public deployment.

## Future work

- dedicated pronunciation review mode in Practice;
- per-phoneme mastery graph;
- Vietnamese-specific final-consonant drills;
- minimal pairs;
- sentence stress and linking curriculum;
- cloud/on-device provider option behind the same PronunciationService interface.
