import test from 'node:test'
import assert from 'node:assert/strict'
import { CEFR_KNOWLEDGE_MAP, KERNEL_SENTENCE_PATTERNS, SENTENCE_GROWTH, LEARNING_PRINCIPLES } from '../src/data/englishKnowledgeMap.js'

test('professional knowledge backbone covers A1 through C2', () => {
  assert.deepEqual(Object.keys(CEFR_KNOWLEDGE_MAP), ['A1','A2','B1','B2','C1','C2'])
  assert.ok(Object.values(CEFR_KNOWLEDGE_MAP).every(level => level.canDoVi && level.grammar?.length))
})

test('all seven kernel sentence patterns are represented', () => {
  assert.equal(KERNEL_SENTENCE_PATTERNS.length, 7)
  assert.deepEqual(KERNEL_SENTENCE_PATTERNS.map(item => item.id), ['sv','svo','svc','sva','svoo','svoc','svoa'])
})

test('sentence growth and pedagogy prioritize input before output', () => {
  assert.deepEqual(SENTENCE_GROWTH.map(item => item.id), ['simple','compound','complex','compound_complex'])
  assert.ok(LEARNING_PRINCIPLES.sequence.indexOf('input') < LEARNING_PRINCIPLES.sequence.indexOf('independent_output'))
  assert.ok(LEARNING_PRINCIPLES.vietnamesePriorities.includes('final_sounds'))
})
