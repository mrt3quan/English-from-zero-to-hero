import { a0TeachingCopy } from './curated/a0TeachingCopy.vi.js'

const copyFields = ['title', 'bodyVi', 'promptVi', 'explainVi', 'placeholder', 'focusVi', 'callout']

export function applyLessonTeachingCopy(lesson) {
  const patch = a0TeachingCopy[lesson?.id]
  if (!patch) return lesson
  const lessonPatch = patch.lesson || {}
  const stepPatches = patch.steps || {}
  const steps = (lesson.steps || []).map((step, index) => {
    const stepPatch = stepPatches[String(index)] || stepPatches[index]
    if (!stepPatch) return step
    const safe = {}
    for (const key of copyFields) {
      if (typeof stepPatch[key] === 'string' && stepPatch[key].trim()) safe[key] = stepPatch[key].trim()
    }
    return { ...step, ...safe }
  })
  return {
    ...lesson,
    ...(typeof lessonPatch.titleVi === 'string' && lessonPatch.titleVi.trim() ? { titleVi: lessonPatch.titleVi.trim() } : {}),
    ...(typeof lessonPatch.objectiveVi === 'string' && lessonPatch.objectiveVi.trim() ? { objectiveVi: lessonPatch.objectiveVi.trim() } : {}),
    steps,
  }
}

export function applyTeacherGuideCopy(lessonId, guide) {
  const patch = a0TeachingCopy[lessonId]?.teacherGuide
  if (!patch) return guide
  return {
    ...guide,
    ...(typeof patch.welcome === 'string' && patch.welcome.trim() ? { welcome: patch.welcome.trim() } : {}),
    ...(typeof patch.why === 'string' && patch.why.trim() ? { why: patch.why.trim() } : {}),
    ...(typeof patch.checkpoint === 'string' && patch.checkpoint.trim() ? { checkpoint: patch.checkpoint.trim() } : {}),
  }
}
