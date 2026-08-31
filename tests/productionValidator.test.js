import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateProduction } from '../src/lib/productionValidator.js'

test('mastery requirements are evaluated independently',()=>{
  const step={requirements:[
    {id:'lines',type:'minLines',value:3,labelVi:'3 lines'},
    {id:'be',type:'containsPattern',pattern:'be',count:2,labelVi:'2 be'},
    {id:'negative',type:'containsNegative',count:1,labelVi:'negative'},
    {id:'question',type:'containsQuestion',count:1,labelVi:'question'},
  ]}
  const result=evaluateProduction(step,'I am Minh.\nShe is kind.\nI like coffee.')
  assert.equal(result.requirements[0].passed,true)
  assert.equal(result.requirements[1].passed,true)
  assert.equal(result.requirements[2].passed,false)
  assert.equal(result.requirements[3].passed,false)
  assert.equal(result.passed,false)
})

test('mastery project rejects random text with enough lines',()=>{
  const step={requirements:[
    {id:'lines',type:'minLines',value:10,labelVi:'10'},
    {id:'negative',type:'containsNegative',count:1,labelVi:'neg'},
    {id:'question',type:'containsQuestion',count:1,labelVi:'q'},
  ]}
  const text=Array.from({length:10},()=> 'random words here.').join('\n')
  assert.equal(evaluateProduction(step,text).passed,false)
})
