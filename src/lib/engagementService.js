import { readJson, writeJson, removeKey } from './storage.js'

const KEY = 'bunny-english.engagement.v1'
const DEFAULT = { xp: 0, awardedLessons: [], days: {} }

function dayKey(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function load() {
  const data = readJson(KEY, DEFAULT)
  return {
    ...DEFAULT,
    ...data,
    awardedLessons: Array.isArray(data?.awardedLessons) ? data.awardedLessons : [],
    days: data?.days && typeof data.days === 'object' ? data.days : {},
  }
}

function save(data) {
  writeJson(KEY, data)
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bunny-engagement-updated'))
  return data
}

function ensureDay(data, key) {
  const current = data.days[key] || {}
  data.days[key] = {
    lessons: Array.isArray(current.lessons) ? current.lessons : [],
    reviews: Array.isArray(current.reviews) ? current.reviews : [],
    sessions: Number(current.sessions || 0),
    ...current,
  }
  return data.days[key]
}

function streakFromDays(days) {
  const active = new Set(Object.entries(days)
    .filter(([, value]) => (value.lessons?.length || 0) + (value.reviews?.length || 0) + (value.sessions || 0) > 0)
    .map(([key]) => key))

  if (!active.size) return 0
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  let cursor = active.has(dayKey(today)) ? today : active.has(dayKey(yesterday)) ? yesterday : null
  if (!cursor) return 0

  let streak = 0
  while (active.has(dayKey(cursor))) {
    streak += 1
    cursor = new Date(cursor)
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export const EngagementService = {
  summary() {
    const data = load()
    const today = ensureDay(data, dayKey())
    return {
      xp: Number(data.xp || 0),
      streak: streakFromDays(data.days),
      today: {
        lessons: today.lessons.length,
        reviews: today.reviews.length,
      },
      goal: {
        lessons: 1,
        reviews: 5,
        lessonDone: today.lessons.length >= 1,
        reviewDone: today.reviews.length >= 5,
      },
    }
  },

  recordSession(key = 'learning') {
    const data = load()
    const today = ensureDay(data, dayKey())
    today.sessions += 1
    today.lastSession = key
    today.lastActivityAt = new Date().toISOString()
    return save(data)
  },

  recordLessonComplete(lessonId, { firstCompletion = false } = {}) {
    const data = load()
    const today = ensureDay(data, dayKey())
    if (!today.lessons.includes(lessonId)) today.lessons.push(lessonId)
    if (firstCompletion && !data.awardedLessons.includes(lessonId)) {
      data.awardedLessons.push(lessonId)
      data.xp += 20
    }
    today.lastActivityAt = new Date().toISOString()
    return save(data)
  },

  recordReview(reviewKey) {
    const data = load()
    const today = ensureDay(data, dayKey())
    const key = String(reviewKey || `review-${today.reviews.length + 1}`)
    if (!today.reviews.includes(key)) {
      today.reviews.push(key)
      data.xp += 2
    }
    today.lastActivityAt = new Date().toISOString()
    return save(data)
  },

  clear() {
    removeKey(KEY)
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bunny-engagement-updated'))
  },
}
