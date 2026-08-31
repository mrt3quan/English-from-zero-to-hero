import test from 'node:test'
import assert from 'node:assert/strict'

// learningProgress.js (and the storage.js it sits on) guard every read/write
// behind `typeof window === 'undefined'`, so a plain Node test needs a
// minimal localStorage + window shim before importing the module -- there is
// no real browser storage to fall back on here.
class MemoryStorage {
  constructor() { this.store = new Map() }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null }
  setItem(key, value) { this.store.set(key, String(value)) }
  removeItem(key) { this.store.delete(key) }
}
globalThis.window = { localStorage: new MemoryStorage(), dispatchEvent: () => {} }

const { getLessonProgress, markLessonStarted, saveLessonSession } = await import('../src/lib/learningProgress.js')

test('lesson resume: saved lastStep and stepStates round-trip through storage', () => {
  markLessonStarted('f01-alphabet-map')
  saveLessonSession('f01-alphabet-map', {
    lastStep: 3,
    stepStates: { 0: { completed: true }, 1: { completed: true } },
    lastAccuracy: 0.5,
  })

  const reloaded = getLessonProgress('f01-alphabet-map')
  assert.equal(reloaded.status, 'in_progress')
  assert.equal(reloaded.lastStep, 3)
  assert.deepEqual(reloaded.stepStates, { 0: { completed: true }, 1: { completed: true } })
})

test('production draft persists across a simulated close/reopen', () => {
  markLessonStarted('f30-foundation-mastery')
  saveLessonSession('f30-foundation-mastery', {
    lastStep: 5,
    stepStates: { 5: { value: 'I am Minh.\nI live in Hanoi.', completed: false } },
    lastAccuracy: 0,
  })

  // Simulate reopening the lesson: a fresh read must still see the draft text.
  const reopened = getLessonProgress('f30-foundation-mastery')
  assert.equal(reopened.stepStates[5].value, 'I am Minh.\nI live in Hanoi.')
  assert.equal(reopened.stepStates[5].completed, false)
})

test('resuming an already-completed lesson does not carry over stale in-progress state', () => {
  markLessonStarted('f05-complete-thought')
  saveLessonSession('f05-complete-thought', { lastStep: 2, stepStates: {}, lastAccuracy: 1 })
  const started = getLessonProgress('f05-complete-thought')
  assert.equal(started.status, 'in_progress')
})
