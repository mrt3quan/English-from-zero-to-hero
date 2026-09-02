import { foundationLessons, foundationLessonById } from '../src/data/foundationCurriculum.js'
import { analyzeOpenSentence } from '../src/lib/openAnswerValidator.js'
import { KERNEL_SENTENCE_PATTERNS, CEFR_KNOWLEDGE_MAP } from '../src/data/englishKnowledgeMap.js'

const errors=[]
for(const lesson of foundationLessons){
  const review=lesson.steps.find(step=>step.type==='review')
  if(!review) errors.push(`${lesson.id}: missing review step`)
  else {
    if(review.mode!=='skillRetrieval') errors.push(`${lesson.id}: review is not skill retrieval`)
    if(!review.tasks?.length) errors.push(`${lesson.id}: review has no active tasks`)
    for(const task of review.tasks||[]){
      if(task.type!=='exercise') errors.push(`${lesson.id}: review task is not an exercise`)
    }
  }
}

const f05=foundationLessonById['f05-complete-thought']
const open=f05?.steps.find(step=>step.exerciseType==='openSentence')
if(!open) errors.push('f05: missing openSentence task')
else {
  const accepted=['My brother works.','My brother is tired.','My brother has a dog.','My brother can swim.','My brother studies English.']
  accepted.forEach(answer=>{if(!analyzeOpenSentence(answer,open).correct) errors.push(`f05 incorrectly rejects: ${answer}`)})
  ;['My brother.','My brother tall.','My brother is.'].forEach(answer=>{if(analyzeOpenSentence(answer,open).correct) errors.push(`f05 incorrectly accepts fragment: ${answer}`)})
}

if(KERNEL_SENTENCE_PATTERNS.length!==7) errors.push('knowledge map: expected 7 kernel sentence patterns')
if(Object.keys(CEFR_KNOWLEDGE_MAP).join(',')!=='A1,A2,B1,B2,C1,C2') errors.push('knowledge map: CEFR levels are incomplete')

if(errors.length){
  console.error(`Learning Engine validation failed with ${errors.length} error(s):`)
  errors.forEach(error=>console.error(`- ${error}`))
  process.exit(1)
}
console.log(`✓ ${foundationLessons.length} A0 lessons use active skill retrieval`)
console.log('✓ Open sentence validation accepts multiple valid answers')
console.log('✓ A1–C2 knowledge backbone and 7 kernel patterns loaded')
