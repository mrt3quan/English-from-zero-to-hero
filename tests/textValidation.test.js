import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTextAnswer, validateWordOrder } from '../src/lib/textValidation.js'

test('error fix requires whole accepted sentence',()=>{
  const step={exerciseType:'errorFix',accepted:['She does not like coffee.'],validationMode:'acceptedVariants'}
  assert.equal(validateTextAnswer('She does not like coffee.',step),true)
  assert.equal(validateTextAnswer('She does not like coffee blah blah',step),false)
})

test('word order can ignore punctuation when configured',()=>{
  const step={answer:'Birds fly.',punctuationRequired:false}
  assert.equal(validateWordOrder('Birds fly',step),true)
})

test('word order requires punctuation when configured',()=>{
  const step={answer:'Are you ready?',punctuationRequired:true}
  assert.equal(validateWordOrder('Are you ready ?',step),true)
  assert.equal(validateWordOrder('Are you ready',step),false)
})
