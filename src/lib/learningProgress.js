const STORAGE_KEY = 'bunny-english.foundation-progress.v2'

function loadAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getLessonProgress(id) {
  if (typeof window === 'undefined') return null
  return loadAll()[id] || null
}

export function saveLessonProgress(id, patch) {
  if (typeof window === 'undefined') return null
  const all = loadAll()
  const prev = all[id] || { status: 'not_started', bestAccuracy: 0, completedAt: null, attempts: 0 }
  all[id] = { ...prev, ...patch, updatedAt: new Date().toISOString() }
  saveAll(all)
  window.dispatchEvent(new CustomEvent('bunny-progress-updated'))
  return all[id]
}

export function markLessonStarted(id) {
  const prev = getLessonProgress(id)
  if (!prev || prev.status === 'not_started') return saveLessonProgress(id, { status: 'in_progress', attempts: (prev?.attempts || 0) + 1 })
  return prev
}

export function markLessonComplete(id, accuracy) {
  const prev = getLessonProgress(id)
  return saveLessonProgress(id, {
    status: 'completed',
    bestAccuracy: Math.max(prev?.bestAccuracy || 0, accuracy),
    completedAt: prev?.completedAt || new Date().toISOString(),
  })
}

export function getAllProgress() {
  if (typeof window === 'undefined') return {}
  return loadAll()
}

export function resetFoundationProgress() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('bunny-progress-updated'))
}
