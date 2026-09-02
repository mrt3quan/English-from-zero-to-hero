import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePronunciationResult, pronunciationBackendConfigured, vietnamesePronunciationFeedback } from '../src/lib/pronunciationService.js'

test('pronunciation service is safe when no backend is configured', () => {
  assert.equal(pronunciationBackendConfigured(), false)
})

test('PronounceAI-shaped results are normalized for Bunny lessons', () => {
  const result = normalizePronunciationResult({
    overall: 78,
    transcript: 'she work every day',
    phrase_match_status: 'ok',
    scores: { phoneme_accuracy: 73, intonation: 82 },
    phonemes: [
      { phoneme: 'w', expected: 'w', correct: true, start_ms: 10, end_ms: 80 },
      { phoneme: 's', expected: 's', correct: false, start_ms: 90, end_ms: 130 },
    ],
  }, 'She works every day.')
  assert.equal(result.provider, 'pronounce-ai')
  assert.equal(result.overall, 78)
  assert.equal(result.scores.phonemeAccuracy, 73)
  assert.equal(result.needsWork.length, 1)
  assert.equal(result.needsWork[0].expected, 's')
})

test('Bunny feedback points learner to a sound instead of only a score', () => {
  const result = normalizePronunciationResult({ phonemes: [{ phoneme: 's', expected: 's', correct: false }] }, 'works')
  assert.match(vietnamesePronunciationFeedback(result), /\/s\//)
})
