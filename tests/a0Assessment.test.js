import test from 'node:test'
import assert from 'node:assert/strict'
import { a0Assessment } from '../src/data/a0Assessment.js'

test('A0 assessment is multi-skill and production-based',()=>{
  const ids=a0Assessment.sections.map(s=>s.id)
  assert.ok(ids.includes('listening'))
  assert.ok(ids.includes('meaning'))
  assert.ok(ids.includes('sentence'))
  assert.ok(ids.includes('reading'))
  assert.ok(ids.includes('speaking'))
  assert.ok(ids.includes('writing'))
  assert.ok(a0Assessment.sections.find(s=>s.id==='writing').weight>0)
  assert.equal(a0Assessment.sections.find(s=>s.id==='speaking').weight,0)
})

test('A0 passing rule requires more than one overall percentage',()=>{
  assert.ok(a0Assessment.passing.overall>=70)
  assert.ok(Object.keys(a0Assessment.passing.requiredSections).length>=4)
})
