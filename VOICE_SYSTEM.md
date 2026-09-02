# Bunny English v1.9 — Natural Voice System

## Goal
Replace the old OS/browser TTS as the default English teaching voice while keeping a zero-blocking fallback for weak devices and restricted networks.

## Primary voice: pre-rendered clips

The A0 course speaks a fixed set of phrases — 143 distinct strings, about 2,000
characters in total. All of them are synthesised once with Kokoro at build time
(`scripts/generate-speech.mjs`, run by the *Generate lesson voice clips*
workflow) and committed as MP3s under `public/voice/`.

Lessons therefore play audio immediately, from our own origin. No model
download, no first-press wait, and audio keeps working on networks that block
jsDelivr or Hugging Face.

`scripts/speechManifest.mjs` is the single source of truth for which clips exist.
Both the generator and `AudioService` key clips the same way
(`voice|speed|sanitized text`), so a phrase can never be requested under a key
the build did not produce. Change curriculum text and the workflow re-renders
only what moved.

## Fallback voice engine
- Kokoro 82M v1.0 ONNX
- Runtime: `kokoro-js` 1.2.1, loaded lazily from a pinned jsDelivr ESM URL
- Model: `onnx-community/Kokoro-82M-v1.0-ONNX`
- Inference: q8 + WASM for broad browser compatibility
- Model and voice files are fetched only when the learner first asks for speech and are normally browser-cached by the underlying runtime.

## Voice roles
- Bunny teacher: `af_heart` by default
- Optional teacher voices: `af_bella`, `af_jessica`, `am_michael`
- Listening female: `af_bella` by default
- Listening male: `am_michael` by default

A0 teaching examples use the stable Bunny teacher voice. Formal listening-test items use stable female/male variation so learners do not memorize one speaker.

## Playback behavior
- Normal: 1.0x Kokoro generation speed
- Slow: 0.5x Kokoro generation speed. Rendering slow clips separately keeps the
  pitch natural; replaying a normal clip at a lower rate would not.
- Playback order is: pre-rendered clip → Kokoro in the browser → browser
  SpeechSynthesis. Lesson audio takes the first path.
- `Đang chuẩn bị…` only appears on the rare fallback path, not for lesson audio.
- If Kokoro cannot load or generate, `AudioService` automatically falls back to the browser's English SpeechSynthesis voice.
- Learners can choose Kokoro or Browser voice in Profile → Giọng đọc bài học.

## Architecture
Lessons call only `AudioService.speak(text, options)`.

Supported options:
- `speed: 'normal' | 'slow'`
- `voiceRole: 'teacher' | 'listening' | 'female' | 'male'`
- `voice: '<explicit Kokoro voice id>'`

Do not import Kokoro inside lesson data/components. The provider remains replaceable.

## Network / hosting note
The current implementation intentionally keeps the app bundle light by lazy-loading the pinned Kokoro JS runtime from jsDelivr and model assets from Hugging Face. If Bunny English later needs offline-first or enterprise-restricted deployment, self-host the JS/runtime/model assets and change only `AudioService`.
