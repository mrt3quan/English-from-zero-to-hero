import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreTranscript, speechRecognitionSupported } from '../src/lib/speechService.js'

test('scoreTranscript matches normalized sentence text', () => {
  const result = scoreTranscript('She works every day', 'She works every day.')
  assert.equal(result.exact, true)
  assert.equal(result.score, 1)
})

test('scoreTranscript exposes missing words without pretending to score phonemes', () => {
  const result = scoreTranscript('she work every day', 'She works every day.')
  assert.equal(result.exact, false)
  assert.ok(result.score < 1)
  assert.ok(result.missing.includes('works'))
})

test('speech support check is safe outside the browser', () => {
  assert.equal(speechRecognitionSupported(), false)
})
