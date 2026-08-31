import { readJson, writeJson, removeKey } from './storage.js'
const KEY = 'bunny-english.attempts.v1'

export const AttemptRepository = {
  list() { return readJson(KEY, []) },
  add(attempt) {
    const all = this.list()
    const record = { id: attempt.id || `att_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, ...attempt, createdAt: attempt.createdAt || new Date().toISOString() }
    all.push(record)
    writeJson(KEY, all.slice(-1000))
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bunny-attempt-updated'))
    return record
  },
  forLesson(lessonId) { return this.list().filter(a=>a.lessonId===lessonId) },
  recent(limit=20) { return this.list().slice(-limit).reverse() },
  clear() { removeKey(KEY) },
}
