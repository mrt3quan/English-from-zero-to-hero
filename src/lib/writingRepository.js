import { readJson, writeJson, removeKey } from './storage.js'

const KEY = 'bunny-english.writing.v1'

export const WritingRepository = {
  list() { return readJson(KEY, []) },
  add(entry) {
    const all = this.list()
    const record = {
      id: entry.id || `write_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...entry,
      createdAt: entry.createdAt || new Date().toISOString(),
    }
    all.push(record)
    writeJson(KEY, all.slice(-200))
    this.emit()
    return record
  },
  recent(limit = 20) { return this.list().slice(-limit).reverse() },
  remove(id) {
    const next = this.list().filter(item => item.id !== id)
    writeJson(KEY, next)
    this.emit()
  },
  clear() { removeKey(KEY); this.emit() },
  emit() { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bunny-writing-updated')) },
}
