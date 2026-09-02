import test from 'node:test'
import assert from 'node:assert/strict'
import { foundationLessons } from '../src/data/foundationCurriculum.js'
import { teacherGuides } from '../src/data/teacherGuides.js'

const banned = ['Lỗi người Việt','NORMAL VERB','normal verb','main verb','base verb','statement','Instruction cơ bản','Core sentence','referent','routine/sự thật','mastery credit']
const fields = new Set(['titleVi','objectiveVi','descriptionVi','outcomeVi','welcome','why','checkpoint','title','bodyVi','promptVi','explainVi','placeholder','focusVi','callout','noticeVi','labelVi','helpVi'])

function collect(value, key = '') {
  if (typeof value === 'string') return fields.has(key) || /[À-ỹ]/.test(value) ? [value] : []
  if (Array.isArray(value)) return value.flatMap(v => collect(v, key))
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k,v]) => collect(v,k))
  return []
}

test('learner-facing Vietnamese avoids known machine-translation/code-mix phrases', () => {
  const text = [...foundationLessons.flatMap(lesson => collect(lesson)), ...Object.values(teacherGuides).flatMap(guide => collect(guide))].join('\n')
  for (const phrase of banned) assert.equal(text.includes(phrase), false, `found banned phrase: ${phrase}`)
})
