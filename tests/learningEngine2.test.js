import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { foundationLessons, foundationLessonById } from '../src/data/foundationCurriculum.js'
import { analyzeOpenSentence } from '../src/lib/openAnswerValidator.js'
import { buildSkillReviewTasks } from '../src/lib/reviewTaskFactory.js'

const openStep = foundationLessonById['f05-complete-thought'].steps.find(step => step.exerciseType === 'openSentence')

test('free sentence task accepts multiple valid learner-created answers', () => {
  const valid = [
    'My brother works.',
    'My brother studies English.',
    'My brother is tall.',
    'My brother has a dog.',
    'My brother can swim.',
    'My brother drives carefully.',
  ]
  for (const answer of valid) assert.equal(analyzeOpenSentence(answer, openStep).correct, true, answer)
})

test('free sentence task rejects the original fragment and missing-be fragment', () => {
  assert.equal(analyzeOpenSentence('My brother.', openStep).correct, false)
  assert.equal(analyzeOpenSentence('My brother tall.', openStep).correct, false)
  assert.equal(analyzeOpenSentence('My brother is.', openStep).correct, false)
})

test('all A0 lesson reviews use active English retrieval tasks', () => {
  for (const lesson of foundationLessons) {
    const review = lesson.steps.find(step => step.type === 'review')
    assert.ok(review, `${lesson.id}: missing review`)
    assert.equal(review.mode, 'skillRetrieval', `${lesson.id}: old review mode`)
    assert.ok(review.tasks?.length >= 1, `${lesson.id}: no active review tasks`)
    assert.ok(review.tasks.every(task => task.type === 'exercise'), `${lesson.id}: review should test English directly`)
  }
})

test('review task factory favors production, repair and construction over definitions', () => {
  const tasks = buildSkillReviewTasks(foundationLessonById['f05-complete-thought'])
  assert.equal(tasks[0].exerciseType, 'openSentence')
  assert.ok(tasks.some(task => ['wordOrder','choice'].includes(task.exerciseType)))
})

test('static lesson help is present without an AI runtime dependency', () => {
  const stepRenderer = fs.readFileSync(new URL('../src/components/lesson/StepRenderer.jsx', import.meta.url), 'utf8')
  const helpSource = fs.readFileSync(new URL('../src/data/staticLessonHelp.js', import.meta.url), 'utf8')
  assert.match(stepRenderer, /Bunny, mình chưa hiểu/)
  assert.doesNotMatch(helpSource, /OpenAI|OPENAI_API_KEY|fetch\(/)
})
