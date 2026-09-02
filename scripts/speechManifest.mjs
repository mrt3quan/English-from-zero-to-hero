// Single source of truth for "which English audio does the course need?".
//
// The A0 course speaks a fixed, finite set of strings, so every one of them can
// be synthesised once at build time and shipped as an audio file. That is why
// lessons never wait for a speech model to download: the clip is already there.
//
// Both the generator (scripts/generate-speech.mjs) and the app read this list,
// so a clip can never be keyed differently than it is requested.
import { createHash } from 'node:crypto'
import { foundationLessons } from '../src/data/foundationCurriculum.js'
import { a0Assessment } from '../src/data/a0Assessment.js'
import { cleanText } from '../src/lib/audioService.js'

export const TEACHER_VOICE = 'af_heart'
export const LISTENING_FEMALE_VOICE = 'af_bella'
export const LISTENING_MALE_VOICE = 'am_michael'
export const PREVIEW_TEXT = 'Hello! I am Bunny. Let us learn English together.'
export const PREVIEW_VOICES = ['af_heart', 'af_bella', 'af_jessica', 'am_michael']

// Kokoro scales phoneme durations, so a slow clip is genuinely slower without
// the pitch drop you get from replaying a normal clip at a lower rate.
export const NORMAL_SPEED = 1
export const SLOW_SPEED = 0.5

export function clipKey(voice, speed, text){
  return `${voice}|${speed}|${cleanText(text)}`
}

export function clipId(voice, speed, text){
  return createHash('sha1').update(clipKey(voice, speed, text)).digest('hex').slice(0, 12)
}

function collectLessonText(){
  const out = new Set()
  const add = value => { const t = cleanText(value); if(t) out.add(t) }
  for(const lesson of foundationLessons){
    for(const step of lesson.steps || []){
      // Only content steps render audio buttons for their examples. Exercise
      // steps may carry examples too (openSentence shows sample answers as a
      // text hint), and rendering a clip for those would ship audio nothing
      // can play.
      if(step.type === 'content'){
        // step.speak is the curated spoken form of a notation-heavy example
        // ("map → /m/ /æ/ /p/" is displayed, "map" is spoken).
        if(step.speak?.length) step.speak.forEach(add)
        else (step.examples || []).forEach(add)
      }
      ;(step.targets || []).forEach(add)
      add(step.target)
      add(step.audioText)
      if(step.type === 'dictation') add(step.answer)
    }
  }
  return [...out]
}

function collectAssessmentText(){
  const out = new Set()
  for(const section of a0Assessment.sections || []){
    for(const item of section.items || []){
      const t = cleanText(item.audio)
      if(t) out.add(t)
    }
  }
  return [...out]
}

// Every clip the build must produce, deduplicated by key.
export function speechManifestEntries(){
  const entries = new Map()
  const push = (voice, speed, text) => {
    const key = clipKey(voice, speed, text)
    if(!entries.has(key)) entries.set(key, { id: clipId(voice, speed, text), voice, speed, text: cleanText(text), key })
  }

  for(const text of collectLessonText()){
    push(TEACHER_VOICE, NORMAL_SPEED, text)
    push(TEACHER_VOICE, SLOW_SPEED, text)
  }

  // Listening items alternate speakers, and the learner may switch the
  // listening voices in Profile, so render both rather than only the
  // speaker the current setting happens to pick.
  for(const text of collectAssessmentText()){
    for(const voice of [LISTENING_FEMALE_VOICE, LISTENING_MALE_VOICE]) push(voice, NORMAL_SPEED, text)
  }

  for(const voice of PREVIEW_VOICES) push(voice, NORMAL_SPEED, PREVIEW_TEXT)

  return [...entries.values()]
}
