import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_SPEAKING_PAUSE_MS, formatSpeakingPauseRemaining, isSpeakingPaused, pauseSpeaking, resumeSpeaking } from '../src/lib/speakingPreference.js'

test('speaking pause helpers are safe outside a browser', () => {
  resumeSpeaking()
  assert.equal(isSpeakingPaused(), false)
  assert.equal(formatSpeakingPauseRemaining(), '')
  assert.equal(DEFAULT_SPEAKING_PAUSE_MS, 15 * 60 * 1000)
})

test('pauseSpeaking returns an expiry even when storage is unavailable', () => {
  const now = 1000
  assert.equal(pauseSpeaking(5000, now), 6000)
})
