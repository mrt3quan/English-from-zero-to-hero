import { foundationLessons } from '../src/data/foundationCurriculum.js'
import { teacherGuides } from '../src/data/teacherGuides.js'

const banned = [
  ['Lỗi người Việt', 'Use a neutral phrase such as “Điểm dễ nhầm khi dịch từ tiếng Việt”.'],
  ['NORMAL VERB', 'Use “động từ thường”.'],
  ['normal verb', 'Use “động từ thường”.'],
  ['main verb', 'Use “động từ chính”.'],
  ['base verb', 'Use “động từ nguyên mẫu / dạng gốc” after teaching the idea.'],
  ['statement', 'Use “câu khẳng định”.'],
  ['Instruction', 'Use “câu chỉ dẫn”.'],
  ['Core sentence', 'Use “câu lõi / phần câu chính”.'],
  ['referent', 'Explain the meaning directly in Vietnamese.'],
  ['routine', 'Use “thói quen / sinh hoạt hằng ngày”.'],
  ['mastery credit', 'Use a learner-facing Vietnamese label.'],
  ['production', 'Use “phần tự viết / phần tự làm”.'],
]

const learnerFacingKeys = new Set(['titleVi','objectiveVi','descriptionVi','outcomeVi','welcome','why','checkpoint','title','bodyVi','promptVi','explainVi','placeholder','focusVi','callout','noticeVi','labelVi','helpVi'])
const warnings = []
function inspect(value, path, key='') {
  if (typeof value === 'string') {
    if (!learnerFacingKeys.has(key) && !/[À-ỹ]/.test(value)) return
    for (const [term, suggestion] of banned) if (value.includes(term)) warnings.push({ path, term, text: value, suggestion })
    if (value.length > 260 && /[À-ỹ]/.test(value)) warnings.push({ path, term: 'long-copy', text: value, suggestion: 'Consider splitting into two teacher turns for mobile.' })
    return
  }
  if (Array.isArray(value)) return value.forEach((v, i) => inspect(v, `${path}[${i}]`, key))
  if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) inspect(v, `${path}.${k}`, k)
}

foundationLessons.forEach(l => inspect(l, `lesson:${l.id}`))
for (const [id, guide] of Object.entries(teacherGuides)) inspect(guide, `teacher:${id}`)

if (!warnings.length) {
  console.log('✅ Vietnamese copy audit: no high-confidence machine-translation/code-mix warnings.')
  process.exit(0)
}
console.log(`⚠️ Vietnamese copy audit found ${warnings.length} warning(s):`)
for (const w of warnings) console.log(`- ${w.path}: [${w.term}] ${w.text}\n  ↳ ${w.suggestion}`)
process.exitCode = 2
