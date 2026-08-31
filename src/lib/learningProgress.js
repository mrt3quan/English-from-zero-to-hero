const PROGRESS_KEY = 'bunny-english.foundation-progress.v3'
const ATTEMPT_KEY = 'bunny-english.exercise-attempts.v3'
const LEGACY_PROGRESS_KEY = 'bunny-english.foundation-progress.v2'
const MAX_ATTEMPTS = 1200

const now = () => new Date().toISOString()

function safeParse(raw, fallback) {
  try { return JSON.parse(raw) } catch { return fallback }
}

function migrateLegacyIfNeeded() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(PROGRESS_KEY)) return
  const legacy = safeParse(localStorage.getItem(LEGACY_PROGRESS_KEY) || '{}', {})
  if (legacy && Object.keys(legacy).length) localStorage.setItem(PROGRESS_KEY, JSON.stringify(legacy))
}

function loadAll() {
  if (typeof window === 'undefined') return {}
  migrateLegacyIfNeeded()
  return safeParse(localStorage.getItem(PROGRESS_KEY) || '{}', {})
}

function saveAll(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

function loadAttempts() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(ATTEMPT_KEY) || '[]', [])
}

function saveAttempts(data) {
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(data.slice(-MAX_ATTEMPTS)))
}

export function getLessonProgress(id) {
  if (typeof window === 'undefined') return null
  return loadAll()[id] || null
}

export function saveLessonProgress(id, patch) {
  if (typeof window === 'undefined') return null
  const all = loadAll()
  const prev = all[id] || { status: 'not_started', bestAccuracy: 0, completedAt: null, attempts: 0, activeRun: null }
  all[id] = { ...prev, ...patch, updatedAt: now() }
  saveAll(all)
  window.dispatchEvent(new CustomEvent('apple-progress-updated'))
  window.dispatchEvent(new CustomEvent('bunny-progress-updated'))
  return all[id]
}

export function markLessonStarted(id) {
  const prev = getLessonProgress(id)
  if (!prev || prev.status === 'not_started') {
    return saveLessonProgress(id, {
      status: 'in_progress',
      attempts: (prev?.attempts || 0) + 1,
      activeRun: prev?.activeRun || { stepIndex: 0, stepStates: {}, productionDrafts: {}, startedAt: now() },
    })
  }
  if (prev.status === 'completed') {
    return saveLessonProgress(id, {
      attempts: (prev?.attempts || 0) + 1,
      activeRun: { stepIndex: 0, stepStates: {}, productionDrafts: {}, startedAt: now() },
    })
  }
  return prev
}

export function saveActiveRun(id, activeRun) {
  const prev = getLessonProgress(id)
  return saveLessonProgress(id, { status: prev?.status === 'completed' ? 'completed' : 'in_progress', activeRun })
}

export function markLessonComplete(id, masteryScore) {
  const prev = getLessonProgress(id)
  return saveLessonProgress(id, {
    status: 'completed',
    bestAccuracy: Math.max(prev?.bestAccuracy || 0, masteryScore),
    lastAccuracy: masteryScore,
    completedAt: prev?.completedAt || now(),
    activeRun: null,
  })
}

export function getAllProgress() {
  if (typeof window === 'undefined') return {}
  return loadAll()
}

export function recordExerciseAttempt(payload) {
  if (typeof window === 'undefined') return null
  const attempts = loadAttempts()
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: now(),
    ...payload,
  }
  attempts.push(entry)
  saveAttempts(attempts)
  window.dispatchEvent(new CustomEvent('apple-attempts-updated'))
  return entry
}

export function getExerciseAttempts() {
  return loadAttempts()
}

export function getErrorProfile() {
  const attempts = loadAttempts()
  const groups = {}
  for (const a of attempts) {
    if (a.correct) continue
    const category = a.errorCategory || 'grammar'
    if (!groups[category]) groups[category] = { category, errors: 0, lessons: new Set(), lastSeen: null, examples: [] }
    const g = groups[category]
    g.errors += 1
    if (a.lessonId) g.lessons.add(a.lessonId)
    if (!g.lastSeen || a.timestamp > g.lastSeen) g.lastSeen = a.timestamp
    if (g.examples.length < 3) g.examples.push(a)
  }
  return Object.values(groups)
    .map(g => ({ ...g, lessons: g.lessons.size }))
    .sort((a, b) => b.errors - a.errors || String(b.lastSeen).localeCompare(String(a.lastSeen)))
}

export function getReviewQueue(limit = 12) {
  const attempts = loadAttempts()
  const wrong = attempts.filter(a => !a.correct)
  const correctedKeys = new Set()
  for (const a of attempts) {
    if (!a.correct) continue
    correctedKeys.add(`${a.lessonId}:${a.stepIndex}`)
  }
  const latestByStep = new Map()
  for (const a of wrong) {
    const key = `${a.lessonId}:${a.stepIndex}`
    const prev = latestByStep.get(key)
    if (!prev || a.timestamp > prev.timestamp) latestByStep.set(key, a)
  }
  return [...latestByStep.values()]
    .map(a => ({ ...a, correctedLater: correctedKeys.has(`${a.lessonId}:${a.stepIndex}`) }))
    .sort((a, b) => Number(a.correctedLater) - Number(b.correctedLater) || String(b.timestamp).localeCompare(String(a.timestamp)))
    .slice(0, limit)
}

export function resetFoundationProgress() {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(ATTEMPT_KEY)
  localStorage.removeItem(LEGACY_PROGRESS_KEY)
  window.dispatchEvent(new CustomEvent('apple-progress-updated'))
  window.dispatchEvent(new CustomEvent('apple-attempts-updated'))
  window.dispatchEvent(new CustomEvent('bunny-progress-updated'))
}
