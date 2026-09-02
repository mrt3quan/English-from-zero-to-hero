import { normalizeWhitespace } from './textValidation.js'

const SUBJECT_START = /^(i|you|he|she|it|we|they|this|that|these|those|there|[A-Z][a-z]+|my\s+\w+|your\s+\w+|his\s+\w+|her\s+\w+|our\s+\w+|their\s+\w+|the\s+\w+|a\s+\w+|an\s+\w+)\b/i
const LEXICAL_VERB = /\b(work|works|study|studies|live|lives|sleep|sleeps|run|runs|walk|walks|read|reads|like|likes|love|loves|eat|eats|drink|drinks|play|plays|go|goes|do|does|want|wants|need|needs|look|looks|feel|feels|seem|seems|sit|stand|wait|open|close)\b/i
const BE_COMPLEMENT = /\b(am|is|are)\s+(?:not\s+)?(?:a\s+|an\s+|the\s+)?[a-z][\w'-]*/i
const CAN_VERB = /\bcan(?:not|'t)?\s+[a-z][\w'-]*/i
const HAVE_OBJECT = /\b(?:have|has)\s+(?:a|an|the|my|your|his|her|our|their|\w+)/i
const IMPERATIVE = /^(please\s+)?(sit|stand|wait|open|close|look|listen|read|write|come|go|stop|turn|take|put)\b/i

function words(value){
  return normalizeWhitespace(value).replace(/[.!?]+$/,'').split(/\s+/).filter(Boolean)
}

export function analyzeOpenSentence(value, step = {}) {
  const raw = normalizeWhitespace(value)
  const tokenList = words(raw)
  const startsCorrectly = SUBJECT_START.test(raw) || IMPERATIVE.test(raw)
  const remainder = step.requiredStart && raw.toLowerCase().startsWith(String(step.requiredStart).toLowerCase()) ? raw.slice(String(step.requiredStart).length).trim().replace(/[.!?]+$/,'') : ''
  const thirdPersonLike = !!remainder && !/^(is|has|does)$/i.test(remainder) && /^[a-z][a-z'-]*(?:s|es|ies)\b/i.test(remainder)
  const hasPredicate = LEXICAL_VERB.test(raw) || BE_COMPLEMENT.test(raw) || CAN_VERB.test(raw) || HAVE_OBJECT.test(raw) || thirdPersonLike
  const minWords = step.minWords || 2
  const enoughWords = tokenList.length >= minWords
  const requiredStart = step.requiredStart ? raw.toLowerCase().startsWith(String(step.requiredStart).toLowerCase()) : true
  const punctuationOkay = step.punctuationRequired === false || /[.!?]$/.test(raw)
  const forbiddenFragmentOnly = /^(my|your|his|her|our|their|the|a|an)\s+\w+[.!?]?$/i.test(raw)
  const correct = Boolean(raw && enoughWords && startsCorrectly && hasPredicate && requiredStart && punctuationOkay && !forbiddenFragmentOnly)

  const missing = []
  if (!enoughWords) missing.push('thêm thông tin để ý trọn vẹn hơn')
  if (!startsCorrectly) missing.push('bắt đầu bằng người/vật hoặc một câu chỉ dẫn rõ ràng')
  if (!hasPredicate) missing.push('thêm điều xảy ra, trạng thái hoặc thông tin về người/vật đó')
  if (!requiredStart) missing.push(`giữ phần mở đầu “${step.requiredStart}”`)
  if (!punctuationOkay) missing.push('thêm dấu câu ở cuối')

  return {
    correct,
    normalized: raw,
    missing,
    feedbackVi: correct
      ? step.successVi || 'Câu của bạn đã truyền đạt được một ý trọn vẹn. Đây là một đáp án hợp lệ; không cần giống câu mẫu của Bunny.'
      : `Câu này chưa đủ rõ. Hãy ${missing[0] || 'thêm phần còn thiếu'} rồi thử lại.`,
  }
}

export function validateOpenSentence(value, step = {}) {
  return analyzeOpenSentence(value, step).correct
}
