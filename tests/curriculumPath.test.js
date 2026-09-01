import test from 'node:test'
import assert from 'node:assert/strict'
import { foundationLessons, foundationChapters, foundationLessonById, validateFoundationCurriculum } from '../src/data/foundationCurriculum.js'

const indexOf = id => foundationLessons.findIndex(lesson => lesson.id === id)

test('ability-first Foundation path is internally valid', () => {
  assert.deepEqual(validateFoundationCurriculum(), [])
  assert.equal(foundationLessons.length, 42)
  assert.equal(foundationChapters[0].optional, true)
})

test('meaning comes before third-person mechanics', () => {
  assert.ok(indexOf('f28-present-simple-meaning') < indexOf('f15-third-person-s'))
})

test('a/an is taught before adjective noun expansion and the comes later', () => {
  assert.ok(indexOf('f16-a-an') < indexOf('f18-adjectives'))
  assert.ok(indexOf('f17-the-and-zero') > indexOf('f22-parts-of-speech-map'))
})

test('have/has is available before the final mastery project', () => {
  assert.ok(indexOf('f31-have-has') < indexOf('f30-foundation-mastery'))
})

test('gold-standard lesson has the multisensory learning loop', () => {
  const lesson = foundationLessonById['f15-third-person-s']
  const types = lesson.steps.map(step => step.type)
  const kinds = lesson.steps.filter(step => step.type === 'content').map(step => step.kind)
  assert.ok(kinds.includes('discover'))
  assert.ok(kinds.includes('notice'))
  assert.ok(types.includes('listen'))
  assert.ok(types.includes('speak'))
  assert.ok(lesson.steps.some(step => step.exerciseType === 'dictation'))
  assert.ok(lesson.steps.some(step => step.exerciseType === 'wordOrder'))
  assert.ok(types.includes('production'))
  assert.ok(types.includes('review'))
})


test('A0 practical communication lessons come before final mastery project', () => {
  assert.ok(indexOf('f32-hello-introduce-yourself') < indexOf('f30-foundation-mastery'))
  assert.ok(indexOf('f36-wh-what-who-where') < indexOf('f30-foundation-mastery'))
  assert.ok(indexOf('f37-there-is-are') < indexOf('f30-foundation-mastery'))
  assert.ok(indexOf('f38-can-cant') < indexOf('f30-foundation-mastery'))
  assert.ok(indexOf('f42-a0-big-review') < indexOf('f30-foundation-mastery'))
})
