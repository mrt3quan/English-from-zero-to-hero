import test from 'node:test'
import assert from 'node:assert/strict'
import { AudioService, cleanText } from '../src/lib/audioService.js'

test('high-quality voice settings are safe outside the browser', () => {
  const settings = AudioService.getSettings()
  assert.equal(settings.provider, 'kokoro')
  assert.equal(settings.teacherVoice, 'af_heart')
  assert.equal(AudioService.supported(), false)
})

test('Kokoro voice catalog includes teacher and listening speakers', () => {
  const teacherIds = AudioService.voices.teacher.map(item => item.id)
  const femaleIds = AudioService.voices.listeningFemale.map(item => item.id)
  const maleIds = AudioService.voices.listeningMale.map(item => item.id)
  assert.ok(teacherIds.includes('af_heart'))
  assert.ok(femaleIds.includes('af_bella'))
  assert.ok(maleIds.includes('am_michael'))
})

test('speech text drops teaching marks and never reads IPA slashes aloud', () => {
  assert.equal(cleanText('map → /m/ /æ/ /p/'), 'map m æ p')
  assert.equal(cleanText('Birds | fly'), 'Birds fly')
  assert.equal(cleanText('She can swim. ✓ · She can swims. ✗'), 'She can swim. · She can swims.')
})

test('slow playback stays clearly slower than normal', () => {
  assert.equal(AudioService.getSettings().slowSpeed, 0.5)
})
