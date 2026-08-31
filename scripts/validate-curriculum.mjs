import { foundationLessons, validateFoundationCurriculum } from '../src/data/foundationCurriculum.js'
import { evaluateProduction } from '../src/lib/productionValidation.js'

const errors = validateFoundationCurriculum()

for (const lesson of foundationLessons) {
  lesson.steps.forEach((step, index) => {
    if (step.type !== 'production') return
    const initial = evaluateProduction(step.placeholder || '', step, {})
    const manual = {}
    initial.checks.forEach((check, checkIndex) => {
      if (check.manual) manual[checkIndex] = true
    })
    const result = evaluateProduction(step.placeholder || '', step, manual)
    if (!result.passed) {
      const failed = result.checks.filter(check => !check.passed).map(check => check.label).join(', ')
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
