const clone = value => JSON.parse(JSON.stringify(value))

const SUPPORTED = new Set(['choice','wordOrder','fillBlank','errorFix','identify','dictation','openSentence'])

export function toReviewTask(step, index = 0) {
  if (!step || step.type !== 'exercise' || !SUPPORTED.has(step.exerciseType)) return null
  const task = clone(step)
  task.id = `${step.id || `review-task-${index}`}-retrieval`
  task.type = 'exercise'
  task.intent = step.intent || intentForExercise(step.exerciseType)
  task.reviewTask = true
  if (task.exerciseType === 'dictation') task.promptVi = task.promptVi || 'Nghe lại rồi viết câu bạn nghe được.'
  return task
}

export function intentForExercise(exerciseType) {
  if (exerciseType === 'choice' || exerciseType === 'identify') return 'recognize'
  if (exerciseType === 'wordOrder') return 'build'
  if (exerciseType === 'errorFix') return 'repair'
  if (exerciseType === 'openSentence') return 'produce'
  if (exerciseType === 'dictation') return 'listen_write'
  return 'choose'
}

export function buildSkillReviewTasks(lesson, max = 3) {
  const explicit = (lesson.steps || []).find(step => step.type === 'review' && Array.isArray(step.tasks) && step.tasks.length)?.tasks
  if (explicit?.length) return explicit.slice(0, max).map((task, index) => ({ ...clone(task), id: task.id || `${lesson.id}-review-${index + 1}`, reviewTask: true }))

  const candidates = (lesson.steps || [])
    .filter(step => step.type === 'exercise' && SUPPORTED.has(step.exerciseType))
    .filter(step => step.exerciseType !== 'dictation' || lesson.focus?.includes('listening'))
  const ranked = [...candidates].sort((a,b) => rank(a.exerciseType) - rank(b.exerciseType))
  const tasks = []
  const types = new Set()
  for (const step of ranked) {
    if (types.has(step.exerciseType) && tasks.length < 2) continue
    const task = toReviewTask(step, tasks.length)
    if (!task) continue
    tasks.push(task)
    types.add(step.exerciseType)
    if (tasks.length >= max) break
  }
  return tasks
}

function rank(type){
  return ({ openSentence:0, errorFix:1, wordOrder:2, fillBlank:3, choice:4, identify:5, dictation:6 })[type] ?? 9
}
