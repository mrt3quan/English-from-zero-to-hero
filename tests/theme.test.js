import test from 'node:test'
import assert from 'node:assert/strict'

class MemoryStorage {
  constructor() { this.store = new Map() }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null }
  setItem(key, value) { this.store.set(key, String(value)) }
  removeItem(key) { this.store.delete(key) }
}
globalThis.window = { localStorage: new MemoryStorage() }

const { readPreference, THEME_STORAGE_KEY } = await import('../src/lib/themePreference.js')

test('theme preference persists once saved', () => {
  assert.equal(readPreference(), 'system')
  window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
  assert.equal(readPreference(), 'dark')
})

test('an invalid stored value falls back to system rather than crashing', () => {
  window.localStorage.setItem(THEME_STORAGE_KEY, 'not-a-real-theme')
  assert.equal(readPreference(), 'system')
})
