import test from 'node:test'
import assert from 'node:assert/strict'
import { speechManifestEntries, clipKey, TEACHER_VOICE, SLOW_SPEED } from '../scripts/speechManifest.mjs'
import { foundationLessons } from '../src/data/foundationCurriculum.js'

const entries = speechManifestEntries()
const keys = new Set(entries.map(entry => entry.key))

test('every lesson phrase has a normal and a slow clip in the manifest', () => {
  const missing = []
  for(const lesson of foundationLessons){
    for(const step of lesson.steps || []){
      const spoken = step.speak?.length ? step.speak : (step.examples || [])
      for(const text of [...spoken, ...(step.targets || []), step.target].filter(Boolean)){
        for(const speed of [1, SLOW_SPEED]){
          const key = clipKey(TEACHER_VOICE, speed, text)
          if(!keys.has(key)) missing.push(key)
        }
      }
    }
  }
  assert.deepEqual(missing, [])
})

test('clip ids are stable and unique per phrase', () => {
  const ids = entries.map(entry => entry.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.deepEqual(speechManifestEntries().map(e => e.id), ids)
})

test('spoken text is sanitized, so no clip is keyed on IPA slashes', () => {
  assert.ok(entries.every(entry => !entry.text.includes('/')))
  assert.ok(entries.every(entry => entry.text === entry.text.trim() && entry.text.length > 0))
})
