export const THEME_STORAGE_KEY = 'bunny-english.theme.v1'

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Same key/validation logic index.html's pre-hydration bootstrap script
// duplicates to avoid a flash of the wrong theme.
export function readPreference() {
  if (typeof window === 'undefined') return 'system'
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  return ['system', 'light', 'dark'].includes(saved) ? saved : 'system'
}

export function writePreference(next) {
  const safe = ['system', 'light', 'dark'].includes(next) ? next : 'system'
  if (typeof window !== 'undefined') window.localStorage.setItem(THEME_STORAGE_KEY, safe)
  return safe
}
