import { readJson, writeJson, removeKey } from './storage.js'
import { AttemptRepository } from './attemptRepository.js'
import { ReviewQueueService } from './reviewQueueService.js'

const STORAGE_KEY='bunny-english.foundation-progress.v3'
const LEGACY_KEYS=['bunny-english.foundation-progress.v2','apple-english.foundation-progress.v2']

function migrate(){
  const current=readJson(STORAGE_KEY,null)
  if(current) return current
  for(const key of LEGACY_KEYS){
    const legacy=readJson(key,null)
    if(legacy){ writeJson(STORAGE_KEY,legacy); return legacy }
  }
  return {}
}
function loadAll(){ return migrate() }
function saveAll(data){ writeJson(STORAGE_KEY,data) }
function emit(){ if(typeof window!=='undefined') window.dispatchEvent(new CustomEvent('bunny-progress-updated')) }

export function isLessonPassed(progress){ return ['completed','tested_out'].includes(progress?.status) }
export function getLessonProgress(id){ if(typeof window==='undefined') return null; return loadAll()[id] || null }
export function saveLessonProgress(id,patch){
  if(typeof window==='undefined') return null
  const all=loadAll(); const prev=all[id] || {status:'not_started',bestAccuracy:0,completedAt:null,attempts:0}
  all[id]={...prev,...patch,updatedAt:new Date().toISOString()}; saveAll(all); emit(); return all[id]
}
export function markLessonStarted(id){
  const prev=getLessonProgress(id)
  if(!prev || prev.status==='not_started') return saveLessonProgress(id,{status:'in_progress',attempts:(prev?.attempts||0)+1,sessionStartedAt:new Date().toISOString()})
  return saveLessonProgress(id,{sessionStartedAt:new Date().toISOString()})
}
export function markLessonComplete(id,accuracy){
  const prev=getLessonProgress(id)
  return saveLessonProgress(id,{status:'completed',bestAccuracy:Math.max(prev?.bestAccuracy||0,accuracy),lastAccuracy:accuracy,completedAt:prev?.completedAt||new Date().toISOString(),lastStep:0,stepStates:prev?.stepStates||{}})
}
export function markLessonsTestedOut(ids){ ids.forEach(id=>saveLessonProgress(id,{status:'tested_out',testedOutAt:new Date().toISOString(),completedAt:new Date().toISOString(),bestAccuracy:1})) }
export function saveLessonSession(id,{lastStep,stepStates,lastAccuracy}){
  return saveLessonProgress(id,{lastStep,stepStates,lastAccuracy,lastSessionAt:new Date().toISOString()})
}
export function getAllProgress(){ if(typeof window==='undefined') return {}; return loadAll() }
export function resetFoundationProgress(){
  removeKey(STORAGE_KEY); LEGACY_KEYS.forEach(removeKey); AttemptRepository.clear(); ReviewQueueService.clear(); emit()
}
