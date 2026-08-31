import test from 'node:test'
import assert from 'node:assert/strict'
import { nextReviewAt } from '../src/lib/reviewQueueService.js'
import { calculateSkillMastery } from '../src/lib/skillMasteryService.js'

test('review scheduling spaces stronger recall farther out',()=>{
  const now=Date.UTC(2026,7,30,12,0,0)
  assert.ok(Date.parse(nextReviewAt(0,now)) < Date.parse(nextReviewAt(.5,now)))
  assert.ok(Date.parse(nextReviewAt(.5,now)) < Date.parse(nextReviewAt(1,now)))
})

test('mastery uses a prior so one answer is not 0 or 100',()=>{
  const correct=[{skillIds:['articles'],correct:true,createdAt:'2026-08-30T00:00:00Z'}]
  const wrong=[{skillIds:['articles'],correct:false,createdAt:'2026-08-30T00:00:00Z'}]
  assert.equal(calculateSkillMastery(correct,'articles').masteryScore,60)
  assert.equal(calculateSkillMastery(wrong,'articles').masteryScore,40)
})
