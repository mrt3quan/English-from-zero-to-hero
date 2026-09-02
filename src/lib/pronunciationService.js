const DEFAULT_ACCENT = 'GA'
const DEFAULT_L1 = 'vi'

function envApiUrl() {
  try {
    const value = import.meta?.env?.VITE_PRONUNCIATION_API_URL
    return typeof value === 'string' ? value.trim().replace(/\/$/, '') : ''
  } catch {
    return ''
  }
}

function storedApiUrl() {
  if (typeof window === 'undefined') return ''
  try {
    return (window.localStorage.getItem('bunny.pronunciation.apiUrl') || '').trim().replace(/\/$/, '')
  } catch {
    return ''
  }
}

export function pronunciationApiUrl() {
  return storedApiUrl() || envApiUrl()
}

export function pronunciationBackendConfigured() {
  return !!pronunciationApiUrl()
}

export function setPronunciationApiUrl(url) {
  if (typeof window === 'undefined') return
  const normalized = String(url || '').trim().replace(/\/$/, '')
  if (normalized) window.localStorage.setItem('bunny.pronunciation.apiUrl', normalized)
  else window.localStorage.removeItem('bunny.pronunciation.apiUrl')
}

function numberOrNull(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function flattenPhonemes(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.flatMap(item => {
    if (!item) return []
    if (Array.isArray(item.phonemes)) return flattenPhonemes(item.phonemes)
    return [item]
  })
  if (typeof raw === 'object') return Object.values(raw).flatMap(flattenPhonemes)
  return []
}

function normalizePhoneme(item, index) {
  const symbol = item?.phoneme ?? item?.phone ?? item?.expected ?? item?.label ?? ''
  const expected = item?.expected ?? symbol
  const heard = item?.heard ?? item?.actual ?? item?.substitution ?? null
  const score = numberOrNull(item?.score ?? item?.accuracy ?? item?.confidence ?? item?.gop)
  const correct = typeof item?.correct === 'boolean'
    ? item.correct
    : (score != null ? score >= 0.65 : !heard || heard === expected)
  return {
    id: `${index}-${symbol || 'phone'}`,
    phoneme: String(symbol || ''),
    expected: String(expected || ''),
    heard: heard == null ? null : String(heard),
    correct,
    score,
    startMs: numberOrNull(item?.start_ms ?? item?.startMs ?? item?.start),
    endMs: numberOrNull(item?.end_ms ?? item?.endMs ?? item?.end),
    word: item?.word ? String(item.word) : null,
  }
}

function normalizeScores(raw = {}) {
  const source = raw?.scores && typeof raw.scores === 'object' ? raw.scores : raw
  return {
    phonemeAccuracy: numberOrNull(source.phoneme_accuracy ?? source.accuracy ?? source.pronunciation_accuracy),
    intonation: numberOrNull(source.intonation ?? source.prosody),
    stressRhythm: numberOrNull(source.stress_rhythm ?? source.rhythm ?? source.stress),
    vowelQuality: numberOrNull(source.vowel_quality ?? source.vowels),
  }
}

export function normalizePronunciationResult(raw = {}, target = '') {
  const phonemes = flattenPhonemes(raw.phonemes ?? raw.word_scores ?? raw.words)
    .map(normalizePhoneme)
    .filter(item => item.phoneme || item.expected)

  const overall = numberOrNull(raw.overall ?? raw.score ?? raw.overall_score)
  const transcript = String(raw.transcript ?? raw.text ?? raw.asr_transcript ?? '')
  const phraseMatchStatus = String(raw.phrase_match_status ?? raw.phraseMatchStatus ?? '')
  const feedback = raw.feedback ?? raw.actionable_tip ?? raw.tip ?? raw.message ?? null

  return {
    provider: 'pronounce-ai',
    target,
    transcript,
    overall,
    phraseMatchStatus,
    scores: normalizeScores(raw),
    phonemes,
    needsWork: phonemes.filter(item => !item.correct).slice(0, 6),
    feedback: feedback == null ? null : String(feedback),
    raw,
  }
}

const VI_PHONE_TIPS = {
  s: 'Giữ một luồng hơi ngắn ở cuối; đừng nuốt mất âm /s/.',
  z: 'Giữ âm cuối và cho dây thanh rung nhẹ; /z/ không phải /s/.',
  t: 'Chạm đầu lưỡi vào lợi phía sau răng trên rồi nhả nhanh âm cuối.',
  d: 'Giống /t/ nhưng có rung giọng; đừng bỏ mất âm cuối.',
  k: 'Nâng phần sau lưỡi chạm vòm mềm rồi nhả âm rõ ở cuối.',
  p: 'Khép hai môi rồi bật hơi nhẹ; chú ý nếu /p/ nằm ở cuối từ.',
  v: 'Răng trên chạm nhẹ môi dưới và giữ rung giọng; đừng đổi thành /w/.',
  f: 'Răng trên chạm nhẹ môi dưới và đẩy hơi ra; không rung giọng.',
  'θ': 'Đặt đầu lưỡi nhẹ giữa hai răng và đẩy hơi ra, như trong “think”.',
  'ð': 'Đặt đầu lưỡi nhẹ giữa hai răng nhưng có rung giọng, như trong “this”.',
  r: 'Đầu lưỡi không chạm vòm miệng; kéo lưỡi hơi về sau để tạo /r/ tiếng Anh.',
  l: 'Đầu lưỡi chạm lợi phía sau răng trên; giữ /l/ rõ, nhất là ở cuối từ.',
  'æ': 'Mở miệng rộng hơn âm “e” tiếng Việt; âm nằm giữa /a/ và /e/.',
  'ɪ': 'Âm ngắn và lỏng hơn /iː/; đừng kéo dài như “ee”.',
  'iː': 'Giữ âm dài và căng hơn /ɪ/; chú ý độ dài của nguyên âm.',
}

export function vietnamesePronunciationFeedback(result, { focusVi = '' } = {}) {
  if (!result) return ''
  if (result.phraseMatchStatus && !['ok', 'match', 'matched'].includes(result.phraseMatchStatus.toLowerCase())) {
    return 'Bunny chưa nghe đủ đúng câu mục tiêu. Hãy nói chậm hơn một chút, chia câu thành hai phần rồi thử lại cả câu.'
  }
  const weak = result.needsWork?.[0]
  if (weak) {
    const phone = String(weak.expected || weak.phoneme || '').replace(/[\/\[\]]/g, '')
    if (phone) {
      const tip = VI_PHONE_TIPS[phone]
      return `Bunny nghe thấy âm /${phone}/ cần luyện thêm. ${tip || 'Nghe mẫu, nói riêng từ chứa âm này một lần, rồi thử lại cả câu.'}`
    }
  }
  if (focusVi) return `Tốt rồi. Hãy nghe lại một lần và chú ý ${focusVi.toLowerCase()}`
  if (result.overall != null && result.overall >= 80) return 'Rất tốt. Âm và nhịp của câu khá rõ. Bạn có thể thử lại nếu muốn nghe tự nhiên hơn nữa.'
  return 'Khá tốt. Nghe mẫu thêm một lần, chú ý âm cuối và nhịp câu, rồi thử lại nếu bạn muốn.'
}

async function parseError(response) {
  try {
    const body = await response.json()
    return body?.detail || body?.message || `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

export const PronunciationService = {
  configured: pronunciationBackendConfigured,
  apiUrl: pronunciationApiUrl,
  setApiUrl: setPronunciationApiUrl,

  async healthCheck({ signal } = {}) {
    const base = pronunciationApiUrl()
    if (!base || typeof fetch === 'undefined') return { ok: false, reason: 'not-configured' }
    try {
      const response = await fetch(`${base}/health`, { signal })
      if (!response.ok) return { ok: false, reason: await parseError(response) }
      return { ok: true, data: await response.json().catch(() => ({ status: 'ok' })) }
    } catch (error) {
      return { ok: false, reason: error?.name === 'AbortError' ? 'aborted' : (error?.message || 'network-error') }
    }
  },

  async prewarm({ phrase, accent = DEFAULT_ACCENT, signal } = {}) {
    const base = pronunciationApiUrl()
    if (!base || !phrase || typeof fetch === 'undefined') return false
    try {
      const response = await fetch(`${base}/api/prewarm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase, accent }),
        signal,
      })
      return response.ok
    } catch {
      return false
    }
  },

  async assess({ audio, target, accent = DEFAULT_ACCENT, l1 = DEFAULT_L1, signal } = {}) {
    const base = pronunciationApiUrl()
    if (!base) throw new Error('pronunciation-backend-not-configured')
    if (!audio) throw new Error('pronunciation-audio-required')
    if (!target) throw new Error('pronunciation-target-required')
    if (typeof fetch === 'undefined' || typeof FormData === 'undefined') throw new Error('pronunciation-fetch-unavailable')

    const form = new FormData()
    const filename = audio?.name || 'recording.webm'
    form.append('audio', audio, filename)
    form.append('phrase', target)
    form.append('accent', accent)
    form.append('l1', l1 || DEFAULT_L1)

    const response = await fetch(`${base}/api/score`, { method: 'POST', body: form, signal })
    if (!response.ok) throw new Error(await parseError(response))
    const raw = await response.json()
    return normalizePronunciationResult(raw, target)
  },
}
