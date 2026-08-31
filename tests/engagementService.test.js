import test from 'node:test'
import assert from 'node:assert/strict'

class LocalStorageMock {
  constructor(){ this.map = new Map() }
  getItem(key){ return this.map.has(key) ? this.map.get(key) : null }
  setItem(key,value){ this.map.set(key,String(value)) }
  removeItem(key){ this.map.delete(key) }
  clear(){ this.map.clear() }
}

global.window = {
  localStorage: new LocalStorageMock(),
  dispatchEvent(){},
}
global.CustomEvent = class CustomEvent { constructor(type){ this.type=type } }

const { EngagementService } = await import('../src/lib/engagementService.js')

test('lesson XP is awarded only once per lesson', () => {
  EngagementService.clear()
  EngagementService.recordLessonComplete('lesson-1', { firstCompletion: true })
  EngagementService.recordLessonComplete('lesson-1', { firstCompletion: true })
  const summary = EngagementService.summary()
  assert.equal(summary.xp, 20)
  assert.equal(summary.today.lessons, 1)
})

test('review XP is awarded once per review item per day', () => {
  EngagementService.clear()
  EngagementService.recordReview('review-1')
  EngagementService.recordReview('review-1')
  EngagementService.recordReview('review-2')
  const summary = EngagementService.summary()
  assert.equal(summary.xp, 4)
  assert.equal(summary.today.reviews, 2)
})
