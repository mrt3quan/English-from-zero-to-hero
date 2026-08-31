import { foundationLessons, validateFoundationCurriculum } from '../src/data/foundationCurriculum.js'
import { evaluateProduction, getRequirements } from '../src/lib/productionValidator.js'

const errors = validateFoundationCurriculum()

for (const lesson of foundationLessons) {
  lesson.steps.forEach((step, index) => {
    if (step.type !== 'production') return
    const requirements = getRequirements(step)
    // An honest learner would confirm every self-check the placeholder genuinely satisfies.
    const manualChecks = {}
    requirements.forEach(r => { if (r.type === 'selfCheck') manualChecks[r.id] = true })
    const result = evaluateProduction(step, step.placeholder || '', manualChecks)
    if (!result.passed) {
      const failed = result.requirements.filter(r => !r.passed).map(r => `${r.id} (${r.type})`).join(', ')
      errors.push(`${lesson.id} step ${index + 1}: production placeholder fails: ${failed}`)
    }
  })
}

if (errors.length) {
  console.error(`Curriculum validation failed with ${errors.length} error(s):`)
  errors.forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

const productionCount = foundationLessons.reduce((count, lesson) => count + lesson.steps.filter(step => step.type === 'production').length, 0)
console.log(`✓ ${foundationLessons.length} lessons validated`)
console.log(`✓ ${productionCount} production tasks validated`)
