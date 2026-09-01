import test from 'node:test'
import assert from 'node:assert/strict'
import { SoundEffectsService } from '../src/lib/soundEffectsService.js'

test('sound service exposes safe public API',()=>{
  assert.equal(typeof SoundEffectsService.correct,'function')
  assert.equal(typeof SoundEffectsService.incorrect,'function')
  assert.equal(typeof SoundEffectsService.lessonComplete,'function')
  assert.equal(typeof SoundEffectsService.levelComplete,'function')
  assert.equal(typeof SoundEffectsService.feedback,'function')
})
