import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeGuidedWriting, scoreGuidedWriting, splitWritingSentences } from '../src/lib/writingAssessment.js'

test('writing counts sentences in a normal paragraph instead of requiring line breaks',()=>{
  const sentences=splitWritingSentences('I am Minh. I live in Bellingham. I study English every day.')
  assert.equal(sentences.length,3)
})

test('line breaks still work as sentence boundaries for beginner writing',()=>{
  const sentences=splitWritingSentences('I am Minh\nI live in Bellingham')
  assert.equal(sentences.length,2)
})

test('guided writing reports exactly what is still missing',()=>{
  const item={minSentences:2,minWords:6,requirements:[{type:'haveHas',labelVi:'have/has'},{type:'canCant',labelVi:'can/can\'t'}]}
  const analysis=analyzeGuidedWriting('I have a dog. I like music.',item)
  assert.equal(analysis.ready,false)
  assert.equal(analysis.requirements.find(x=>x.type==='haveHas').met,true)
  assert.equal(analysis.requirements.find(x=>x.type==='canCant').met,false)
})

test('guided writing scoring rewards target structures and conventions',()=>{
  const item={minSentences:2,minWords:6,requirements:[{type:'haveHas'},{type:'canCant'}]}
  const good=scoreGuidedWriting('I have a dog. I can swim.',item)
  const weak=scoreGuidedWriting('i have dog\ni like swim',item)
  assert.ok(good>weak)
  assert.ok(good>.9)
})
