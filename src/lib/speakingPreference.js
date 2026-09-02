const KEY = 'bunny.speaking.pauseUntil'
export const DEFAULT_SPEAKING_PAUSE_MS = 15 * 60 * 1000

function storage() {
  if (typeof window === 'undefined') return null
  try { return window.localStorage } catch { return null }
}

export function getSpeakingPauseUntil() {
  const store = storage()
  if (!store) return 0
  const value = Number(store.getItem(KEY) || 0)
  return Number.isFinite(value) ? value : 0
}

export function isSpeakingPaused(now = Date.now()) {
  return getSpeakingPauseUntil() > now
}

export function speakingPauseRemainingMs(now = Date.now()) {
  return Math.max(0, getSpeakingPauseUntil() - now)
}

export function pauseSpeaking(durationMs = DEFAULT_SPEAKING_PAUSE_MS, now = Date.now()) {
  const until = now + Math.max(0, Number(durationMs) || 0)
  storage()?.setItem(KEY, String(until))
  return until
}

export function resumeSpeaking() {
  storage()?.removeItem(KEY)
}

export function formatSpeakingPauseRemaining(now = Date.now()) {
  const ms = speakingPauseRemainingMs(now)
  if (!ms) return ''
  const minutes = Math.max(1, Math.ceil(ms / 60000))
  return `${minutes} phút`
}
