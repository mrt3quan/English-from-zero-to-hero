const BE = /\b(am|is|are)\b/i
const NEGATIVE = /\b(am not|is not|isn't|are not|aren't|do not|don't|does not|doesn't)\b/i
const CONNECTORS = /\b(because|so)\b/i
const ARTICLES = /\b(a|an|the)\b/i
const COMMON_PREPOSITIONS = /\b(in|on|at|under|over|above|below|beside|behind|between|near|next to|with|for|from|to)\b/i
const QUESTION_START = /^(am|is|are|do|does|can|will|what|where|when|why|who|how)\b/i
const ADVERBS = /\b(always|usually|often|sometimes|never|quickly|slowly|carefully|quietly|softly|well)\b|\b\w+ly\b/i
const PRONOUNS = /\b(i|you|he|she|it|we|they|me|him|her|us|them|this|that|these|those)\b/i
const COMMON_ADJECTIVES = /\b(good|bad|big|small|happy|sad|kind|nice|new|old|red|blue|green|black|white|young|beautiful|interesting|difficult|easy|tired|busy|ready|friendly|smart|quiet)\b/i

export function splitNonEmptyLines(value) {
  return String(value ?? '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}
export function splitSentences(value) {
  const lines = splitNonEmptyLines(value)
  if (lines.length > 1) return lines
  return String(value ?? '').split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean)
}
export function wordCount(value) { return String(value ?? '').trim().split(/\s+/).filter(Boolean).length }

export function legacyCheckToRequirement(label, step, index) {
  const s = String(label || '').toLowerCase()
  const id = `legacy_${index}`
  const number = Number(s.match(/\d+/)?.[0] || 0)
  if (/ký tự/.test(s)) return { id, type:'minChars', value:number || 2, labelVi:label }
  if (/\btừ\b/.test(s) && number) return { id, type:'minWords', value:number, labelVi:label }
  if (/chữ đầu viết hoa/.test(s)) return { id, type:'startsWithCapital', labelVi:label }
  if (/dấu chấm cuối/.test(s)) return { id, type:'endsWithPeriod', labelVi:label }
  if (/dấu câu cuối/.test(s)) return { id, type:'endsWithPunctuation', labelVi:label }
  if (/dòng 2 là câu hỏi/.test(s)) return { id, type:'lineIsQuestion', line:2, labelVi:label }
  if (/câu hỏi/.test(s) && number) return { id, type:'containsQuestion', count:number, labelVi:label }
  if (/một question|có một câu hỏi/.test(s)) return { id, type:'containsQuestion', count:1, labelVi:label }
  if (/negative|phủ định/.test(s) && /be-negative/.test(s)) return { id, type:'containsBeNegative', count:1, labelVi:label }
  if (/do\/does-negative/.test(s)) return { id, type:'containsDoNegative', count:1, labelVi:label }
  if (/negative|phủ định/.test(s)) return { id, type:'containsNegative', count:1, labelVi:label }
  if (/because và so/.test(s)) return { id, type:'containsAll', values:['because','so'], labelVi:label }
  if (/because hoặc so/.test(s)) return { id, type:'containsAny', values:['because','so'], count:1, labelVi:label }
  if (/am, is, are/.test(s)) return { id, type:'containsAll', values:['am','is','are'], labelVi:label }
  if (/be\/do\/does/.test(s)) return { id, type:'containsAll', values:['be-question','do-question','does-question'], labelVi:label }
  if (/a\/an và the|a\/an.*the/.test(s)) return { id, type:'containsArticleGroups', groups:[['a','an'],['the']], labelVi:label }
  if (/có a và an/.test(s)) return { id, type:'containsAll', values:['a','an'], labelVi:label }
  if (/giới từ/.test(s)) return { id, type:'containsPreposition', count:1, labelVi:label }
  if (/adverb/.test(s)) return { id, type:'containsAdverb', count:1, labelVi:label }
  if (/-s\/-es/.test(s)) return { id, type:'containsThirdPersonS', count:1, labelVi:label }
  if (/có ít nhất 2 câu với be|2 câu với be/.test(s)) return { id, type:'containsPattern', pattern:'be', count:2, labelVi:label }
  if (/có be \+ complement/.test(s)) return { id, type:'selfCheck', labelVi:label, helpVi:'Hãy tự kiểm tra be có nối subject với complement phù hợp.' }
  if (/dòng|câu/.test(s) && number) return { id, type:'minLines', value:number, labelVi:label }
  if (/mục|cụm|verbs|động từ|danh từ/.test(s) && number) return { id, type:'minItems', value:number, labelVi:label }
  if (/một từ được chọn/.test(s)) return { id, type:'minWords', value:1, labelVi:label }
  if (/subject \+ verb|s\+v|object|thói quen|sự thật|phát triển từ câu trước|gọi tên|4 verbs|4 danh từ|4 cụm|3 cụm/.test(s)) return { id, type:'selfCheck', labelVi:label, helpVi:'Bunny chưa tự động đánh giá chắc chắn mục này. Hãy tự kiểm tra trước khi tiếp tục.' }
  return { id, type:'selfCheck', labelVi:label, helpVi:'Tự kiểm tra mục này. Hệ thống không giả vờ hiểu ngữ nghĩa khi chưa đủ chắc chắn.' }
}

export function getRequirements(step) {
  if (Array.isArray(step.requirements) && step.requirements.length) return step.requirements
  const fromChecks = (step.checks || []).map((label, i) => legacyCheckToRequirement(label, step, i))
  if (step.minLines && !fromChecks.some(r => r.type === 'minLines')) fromChecks.push({ id:'minimum_lines', type:'minLines', value:step.minLines, labelVi:`Có ít nhất ${step.minLines} dòng/câu` })
  if (step.minWords && !fromChecks.some(r => ['minWords','minItems','minChars'].includes(r.type))) fromChecks.push({ id:'minimum_words', type:'minWords', value:step.minWords, labelVi:`Có ít nhất ${step.minWords} từ` })
  if (!fromChecks.length) fromChecks.push({ id:'minimum_words', type:'minWords', value:1, labelVi:'Có nội dung để kiểm tra' })
  return fromChecks
}

function countLinesMatching(value, regex) { return splitSentences(value).filter(line => regex.test(line)).length }
function tokenize(value) { return String(value).toLowerCase().replace(/[.,!?;:()→]/g,' ').split(/\s+/).filter(Boolean) }
function countQuestions(value) { return splitSentences(value).filter(line => line.endsWith('?') && QUESTION_START.test(line)).length }
function countThirdPersonS(value) {
  return splitSentences(value).filter(line => {
    const tokens = line.toLowerCase().replace(/[^a-z']/g, ' ').split(/\s+/).filter(Boolean)
    let verbIndex = -1
    if (['he','she','it'].includes(tokens[0])) verbIndex = 1
    else if (tokens[0] === 'my' && tokens[1]) verbIndex = 2
    else if (['the','a','an'].includes(tokens[0]) && tokens[1]) verbIndex = 2
    if (verbIndex < 0 || !tokens[verbIndex]) return false
    const verb = tokens[verbIndex]
    if (['is','does','has'].includes(verb)) return false
    return /(s|es|ies)$/.test(verb)
  }).length
}

export function evaluateRequirement(requirement, value, manualChecks = {}) {
  const lines = splitSentences(value)
  const words = tokenize(value)
  // Phone keyboards (and our own curriculum text) produce the typographic
  // apostrophe "’", while requirement values are written with "'". Fold them
  // together so "can’t" and "can't" satisfy the same requirement.
  const raw = String(value ?? '').trim().replace(/[‘’]/g, "'")
  const lower = raw.toLowerCase()
  const count = requirement.count || 1
  let passed = false
  let detail = ''
  switch(requirement.type) {
    case 'minLines': passed = lines.length >= requirement.value; detail = `${lines.length}/${requirement.value}`; break
    case 'minWords': passed = wordCount(raw) >= requirement.value; detail = `${wordCount(raw)}/${requirement.value}`; break
    case 'minChars': passed = raw.length >= requirement.value; detail = `${raw.length}/${requirement.value}`; break
    case 'minItems': { const items = raw.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean); passed = items.length >= requirement.value; detail = `${items.length}/${requirement.value}`; break }
    case 'startsWithCapital': passed = /^[A-Z]/.test(raw); break
    case 'endsWithPeriod': passed = /\.$/.test(raw); break
    case 'endsWithPunctuation': passed = /[.!?]$/.test(raw); break
    case 'lineIsQuestion': { const target = splitNonEmptyLines(raw)[(requirement.line || 1)-1] || ''; passed = target.endsWith('?') && QUESTION_START.test(target); break }
    case 'containsPattern': {
      const regex = requirement.pattern === 'be' ? BE : new RegExp(requirement.pattern, 'i')
      passed = countLinesMatching(raw, regex) >= count
      detail = `${countLinesMatching(raw, regex)}/${count}`
      break
    }
    case 'containsNegative': passed = countLinesMatching(raw, NEGATIVE) >= count; detail = `${countLinesMatching(raw, NEGATIVE)}/${count}`; break
    case 'containsBeNegative': { const re=/\b(am not|is not|isn't|are not|aren't)\b/i; passed=countLinesMatching(raw,re)>=count; break }
    case 'containsDoNegative': { const re=/\b(do not|don't|does not|doesn't)\b/i; passed=countLinesMatching(raw,re)>=count; break }
    case 'containsQuestion': passed = countQuestions(raw) >= count; detail = `${countQuestions(raw)}/${count}`; break
    case 'containsAny': { const hits=(requirement.values||[]).filter(v=>new RegExp(`\\b${escapeRegExp(v)}\\b`,'i').test(lower)).length; passed=hits>=count; break }
    case 'containsAll': {
      passed = (requirement.values||[]).every(v => {
        if (v==='be-question') return splitSentences(raw).some(l=>/^(am|is|are)\b/i.test(l) && l.endsWith('?'))
        if (v==='do-question') return splitSentences(raw).some(l=>/^do\b/i.test(l) && l.endsWith('?'))
        if (v==='does-question') return splitSentences(raw).some(l=>/^does\b/i.test(l) && l.endsWith('?'))
        return new RegExp(`\\b${escapeRegExp(v)}\\b`,'i').test(lower)
      }); break
    }
    case 'containsArticleGroups': passed=(requirement.groups||[]).every(group=>group.some(v=>new RegExp(`\\b${escapeRegExp(v)}\\b`,'i').test(lower))); break
    case 'containsArticle': passed = (lower.match(ARTICLES)||[]).length >= count; break
    case 'containsPreposition': passed = countLinesMatching(raw, COMMON_PREPOSITIONS) >= count; break
    case 'containsAdverb': passed = countLinesMatching(raw, ADVERBS) >= count; break
    case 'containsPronoun': passed = countLinesMatching(raw, PRONOUNS) >= count; break
    case 'containsAdjective': passed = countLinesMatching(raw, COMMON_ADJECTIVES) >= count; break
    case 'containsThirdPersonS': passed = countThirdPersonS(raw) >= count; detail = `${countThirdPersonS(raw)}/${count}`; break
    case 'selfCheck': passed = !!manualChecks[requirement.id]; break
    default: passed = false
  }
  return { ...requirement, passed, detail }
}

export function evaluateProduction(step, value, manualChecks = {}) {
  const requirements = getRequirements(step)
  const results = requirements.map(req => evaluateRequirement(req, value, manualChecks))
  return { requirements: results, passed: results.length > 0 && results.every(r => r.passed) }
}

function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&') }
