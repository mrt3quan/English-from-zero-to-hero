const COMMON_PREPOSITIONS = ['in','on','at','under','over','above','below','behind','beside','near','next to','between','with','for','from','to','into','inside','outside']
const COMMON_ADJECTIVES = ['good','bad','big','small','new','old','happy','sad','kind','nice','red','blue','green','black','white','young','beautiful','interesting','useful','quiet','busy','tired','ready','friendly','smart','difficult','easy']

const clean = value => String(value ?? '').replace(/[“”]/g, '"').replace(/[’]/g, "'").trim()
const words = value => clean(value).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []
const lines = value => clean(value).split(/\n+/).map(x => x.trim()).filter(Boolean)
const listItems = value => clean(value).split(/\n|,|;|→|->/).map(x => x.trim()).filter(Boolean)
const norm = value => clean(value).toLowerCase().replace(/[^a-z0-9?'\s]/g, ' ').replace(/\s+/g, ' ').trim()
const wordCount = value => words(value).length
const isCapitalized = line => /^[A-Z]/.test(line.trim())
const hasEndPunctuation = line => /[.!?]$/.test(line.trim())
const lineWords = line => words(line)
const hasWholeWord = (text, target) => {
  if (target.includes(' ')) return norm(text).includes(norm(target))
  return new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
}

export function inferProductionRule(label = '', step = {}) {
  const l = label.toLowerCase()
  const n = Number((label.match(/(\d+)/) || [])[1])
  if (/ký tự/.test(l) && n) return { type: 'minChars', value: n }
  if (/chữ đầu viết hoa/.test(l)) return { type: 'startsWithCapital' }
  if (/dấu chấm cuối câu/.test(l)) return { type: 'endsWithPeriod' }
  if (/dấu câu cuối/.test(l)) return { type: 'endsWithPunctuation' }
  if (/ít nhất \d+ mục/.test(l) || /có \d+ danh từ/.test(l) || /có \d+ động từ/.test(l) || /có \d+ verbs/.test(l) || /có \d+ cụm/.test(l)) return { type: 'minListItems', value: n }
  if (/ít nhất \d+ cụm/.test(l)) return { type: 'minListItems', value: n }
  if (/ít nhất \d+ dòng/.test(l) || /có \d+ dòng/.test(l) || /có đúng \d+ dòng/.test(l)) return { type: 'minLines', value: n }
  if (/có \d+ dòng câu/.test(l)) return { type: 'minSentenceLines', value: n }
  if (/có \d+ câu/.test(l)) return { type: 'minSentences', value: n }
  if (/mỗi câu có subject \+ verb/.test(l) || /mỗi câu đủ s\+v/.test(l)) return { type: 'eachLineMinWords', value: 2, requirePunctuation: true }
  if (/mỗi câu có object/.test(l)) return { type: 'eachLineMinWords', value: 3, requirePunctuation: true }
  if (/có am, is, are/.test(l)) return { type: 'containsAll', values: ['am','is','are'] }
  if (/dòng 2 là câu hỏi/.test(l)) return { type: 'lineIsQuestion', index: 1 }
  if (/verb -s\/-es/.test(l)) return { type: 'thirdPersonMarker', min: 1 }
  if (/có a và an/.test(l)) return { type: 'containsAll', values: ['a','an'] }
  if (/a\/an và the/.test(l)) return { type: 'articleSequence' }
  if (/có adverb/.test(l)) return { type: 'adverbLike', min: 1 }
  if (/giới từ nơi chốn/.test(l)) return { type: 'containsAny', values: COMMON_PREPOSITIONS }
  if (/because và so/.test(l)) return { type: 'containsAll', values: ['because','so'] }
  if (/because hoặc so/.test(l)) return { type: 'containsAny', values: ['because','so'] }
  if (/be \+ complement/.test(l)) return { type: 'beComplementLines', min: n || 1 }
  if (/be-negative/.test(l)) return { type: 'regex', pattern: '\\b(am|is|are)\\s+not\\b|\\b(isn\'t|aren\'t)\\b' }
  if (/do\/does-negative/.test(l)) return { type: 'regex', pattern: '\\b(do|does)\\s+not\\b|\\b(don\'t|doesn\'t)\\b' }
  if (/câu hỏi/.test(l) && n) return { type: 'minQuestions', value: n }
  if (/có be\/do\/does/.test(l)) return { type: 'containsAnyFromGroups', groups: [['am','is','are'],['do'],['does']] }
  if (/phát triển từ câu trước/.test(l)) return { type: 'expansionChain' }
  if (/ít nhất 2 câu với be/.test(l)) return { type: 'beSentenceCount', value: 2 }
  if (/có một negative/.test(l)) return { type: 'negativeCount', value: 1 }
  if (/có một question/.test(l)) return { type: 'minQuestions', value: 1 }
  if (/có một adjective/.test(l)) return { type: 'adjectiveLike', min: 1 }
  if (/có một preposition/.test(l)) return { type: 'containsAny', values: COMMON_PREPOSITIONS }
  if (/present simple/.test(l) && n) return { type: 'presentSimpleLike', value: n }
  if (/có một từ được chọn/.test(l)) return { type: 'minWords', value: 1 }
  if (/có ít nhất \d+ từ/.test(l)) return { type: 'minWords', value: n }
  if (/gọi tên một người/.test(l) || /nói thói quen\/sự thật/.test(l)) return { type: 'manual' }
  return { type: 'manual' }
}

export function validateProductionRule(value, rule, manual = false) {
  const text = clean(value)
  const ls = lines(text)
  switch (rule?.type) {
    case 'minChars': return text.replace(/\s/g, '').length >= rule.value
    case 'minWords': return wordCount(text) >= rule.value
    case 'minLines': return ls.length >= rule.value
    case 'minSentenceLines': return ls.filter(line => wordCount(line) >= 2 && hasEndPunctuation(line)).length >= rule.value
    case 'minSentences': {
      const punctuated = (text.match(/[.!?]+(?=\s|$)/g) || []).length
      return Math.max(punctuated, ls.filter(line => wordCount(line) >= 2).length) >= rule.value
    }
    case 'minListItems': return listItems(text).length >= rule.value
    case 'startsWithCapital': return !!text && isCapitalized(text)
    case 'endsWithPeriod': return /\.$/.test(text)
    case 'endsWithPunctuation': return /[.!?]$/.test(text)
    case 'eachLineMinWords': return ls.length > 0 && ls.every(line => wordCount(line) >= rule.value && (!rule.requirePunctuation || hasEndPunctuation(line)))
    case 'eachLineCapitalizedAndPunctuated': return ls.length > 0 && ls.every(line => wordCount(line) >= (rule.minWords || 2) && isCapitalized(line) && hasEndPunctuation(line))
    case 'containsAll': return (rule.values || []).every(v => hasWholeWord(text, v))
    case 'containsAny': return (rule.values || []).some(v => hasWholeWord(text, v))
    case 'containsAnyFromGroups': return (rule.groups || []).every(group => group.some(v => hasWholeWord(text, v)))
    case 'lineIsQuestion': return !!ls[rule.index] && /\?$/.test(ls[rule.index])
    case 'thirdPersonMarker': {
      const count = ls.filter(line => /\b(he|she|it)\b/i.test(line) && /\b[a-z]+(?:s|es)\b/i.test(line)).length
      return count >= (rule.min || 1)
    }
    case 'articleSequence': return /\b(a|an)\b/i.test(text) && /\bthe\b/i.test(text)
    case 'adverbLike': {
      const count = words(text).filter(w => /ly$/i.test(w) || /^(always|usually|often|sometimes|rarely|never|fast|well|hard)$/i.test(w)).length
      return count >= (rule.min || 1)
    }
    case 'adjectiveLike': {
      const all = words(text).map(w => w.toLowerCase())
      const count = all.filter(w => COMMON_ADJECTIVES.includes(w) || /(ful|less|ous|ive|able|ible|al|ic|y)$/.test(w)).length
      return count >= (rule.min || 1)
    }
    case 'beComplementLines': return ls.filter(line => /\b(am|is|are)\b/i.test(line) && wordCount(line) >= 3).length >= (rule.min || 1)
    case 'regex': {
      try { return new RegExp(rule.pattern, rule.flags || 'i').test(text) } catch { return false }
    }
    case 'minQuestions': return ls.filter(line => /\?$/.test(line)).length >= rule.value
    case 'beSentenceCount': return ls.filter(line => /\b(am|is|are)\b/i.test(line)).length >= rule.value
    case 'negativeCount': return ls.filter(line => /\b(not|never|no)\b|\b(don't|doesn't|isn't|aren't|can't|won't)\b/i.test(line)).length >= rule.value
    case 'presentSimpleLike': {
      const candidates = ls.filter(line => {
        if (/\?$/.test(line)) return false
        if (/\b(am|is|are)\s+\w+ing\b/i.test(line)) return false
        if (/\b(was|were|did|yesterday|ago|last)\b/i.test(line)) return false
        return wordCount(line) >= 2 && hasEndPunctuation(line)
      })
      return candidates.length >= rule.value
    }
    case 'expansionChain': {
      if (ls.length < 2) return false
      const tokens = ls.map(line => lineWords(line).map(w => w.toLowerCase()))
      for (let i = 1; i < tokens.length; i++) {
        const prev = tokens[i - 1]
        const next = tokens[i]
        let cursor = 0
        for (const token of next) if (token === prev[cursor]) cursor += 1
        if (cursor < prev.length || next.length <= prev.length) return false
      }
      return true
    }
    case 'manual': return !!manual
    default: return false
  }
}

export function evaluateProduction(value, step, manualChecks = {}) {
  const labels = step.checks || []
  const rules = labels.map((label, index) => step.validators?.[index] || inferProductionRule(label, step))
  const checks = labels.map((label, index) => {
    const rule = rules[index]
    const manual = rule.type === 'manual'
    const passed = validateProductionRule(value, rule, manualChecks[index])
    return { label, rule, manual, passed }
  })
  const base = wordCount(value) >= (step.minWords || 1) && lines(value).length >= (step.minLines || 1)
  return {
    base,
    checks,
    passed: base && checks.every(c => c.passed),
    stats: { words: wordCount(value), lines: lines(value).length, chars: clean(value).length },
  }
}

export const productionRuleCatalog = {
  COMMON_PREPOSITIONS,
  COMMON_ADJECTIVES,
}
