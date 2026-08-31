export function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/[’]/g, "'")
    .replace(/\s+([?.!,;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeCase(value) {
  return normalizeWhitespace(value).toLowerCase()
}

export function stripTerminalPunctuation(value) {
  return normalizeCase(value).replace(/[.!?]+$/g, '').trim()
}

export function normalizeWithoutPunctuation(value) {
  return normalizeCase(value).replace(/[?.!,;:]/g, '').replace(/\s+/g, ' ').trim()
}

export function validateTextAnswer(value, step) {
  const accepted = (Array.isArray(step.accepted) && step.accepted.length ? step.accepted : [step.answer]).filter(v => v != null)
  const mode = step.validationMode || (step.exerciseType === 'errorFix' ? 'acceptedVariants' : 'normalizedExact')

  if (mode === 'exact') return accepted.some(a => String(value).trim() === String(a).trim())
  if (mode === 'normalizedExact') return accepted.some(a => normalizeCase(value) === normalizeCase(a))
  if (mode === 'acceptedVariants') return accepted.some(a => normalizeCase(value) === normalizeCase(a))
  if (mode === 'containsRequiredStructure') {
    const normalized = normalizeCase(value)
    const required = step.requiredStructures || accepted
    return required.every(pattern => {
      if (pattern instanceof RegExp) return pattern.test(normalized)
      return normalized.split(/\b/).includes(String(pattern).toLowerCase()) || normalized.includes(String(pattern).toLowerCase())
    })
  }
  return accepted.some(a => normalizeCase(value) === normalizeCase(a))
}

export function validateWordOrder(answer, step) {
  const expected = String(step.answer ?? '')
  if (step.punctuationRequired) return normalizeCase(answer) === normalizeCase(expected)
  return normalizeWithoutPunctuation(answer) === normalizeWithoutPunctuation(expected)
}
