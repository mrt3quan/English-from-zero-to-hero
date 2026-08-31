import { normalizeForComparison } from './textValidation.js'

function recognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function speechRecognitionSupported() {
  return !!recognitionCtor()
}

export function scoreTranscript(transcript, target) {
  const heard = normalizeForComparison(String(transcript || ''), { punctuationRequired: false })
  const expected = normalizeForComparison(String(target || ''), { punctuationRequired: false })
  if (!heard || !expected) return { score: 0, exact: false, heard, expected, missing: [] }
  const exact = heard === expected
  const heardWords = heard.split(/\s+/).filter(Boolean)
  const expectedWords = expected.split(/\s+/).filter(Boolean)
  const matched = expectedWords.filter((word, index) => heardWords[index] === word).length
  const score = expectedWords.length ? matched / expectedWords.length : 0
  const missing = expectedWords.filter(word => !heardWords.includes(word))
  return { score, exact, heard, expected, missing }
}

export const SpeechService = {
  supported: speechRecognitionSupported,
  listen({ locale = 'en-US', interimResults = false, onStart, onResult, onError, onEnd } = {}) {
    const Ctor = recognitionCtor()
    if (!Ctor) return { started: false, stop() {} }
    const recognition = new Ctor()
    recognition.lang = locale
    recognition.interimResults = interimResults
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognition.onstart = () => onStart?.()
    recognition.onerror = event => onError?.(event.error || 'speech-recognition-error')
    recognition.onend = () => onEnd?.()
    recognition.onresult = event => {
      const result = event.results?.[event.results.length - 1]
      const transcript = result?.[0]?.transcript || ''
      onResult?.({ transcript, confidence: result?.[0]?.confidence ?? null, isFinal: result?.isFinal ?? true })
    }
    try {
      recognition.start()
      return { started: true, stop: () => { try { recognition.stop() } catch {} } }
    } catch (error) {
      onError?.(error?.message || 'speech-recognition-start-failed')
      return { started: false, stop() {} }
    }
  },
}
