import { readJson, writeJson, removeKey } from './storage.js'
const KEY='bunny-english.review-queue.v1'

const HOUR=60*60*1000, DAY=24*HOUR
export function nextReviewAt(rating, now=Date.now()) {
  if (rating === 0) return new Date(now + HOUR).toISOString()
  if (rating === 0.5) return new Date(now + DAY).toISOString()
  return new Date(now + 3*DAY).toISOString()
}

export const ReviewQueueService = {
  list(){ return readJson(KEY,[]) },
  upsert(item){
    const all=this.list(); const key=item.key || `${item.lessonId}:${item.stepId}:${item.itemIndex ?? 'x'}`
    const idx=all.findIndex(x=>x.key===key)
    const next={...all[idx],...item,key,updatedAt:new Date().toISOString()}
    if(idx>=0) all[idx]=next; else all.push(next)
    writeJson(KEY,all.slice(-500)); this.emit(); return next
  },
  addMistake({lessonId,stepId,skillIds,prompt,answer,expected,errorTags}){
    return this.upsert({key:`mistake:${lessonId}:${stepId}`,type:'mistake',lessonId,stepId,skillIds,prompt,answer,expected,errorTags,dueAt:new Date().toISOString(),lastRating:0})
  },
  recordRating(item,rating){
    return this.upsert({...item,lastRating:rating,dueAt:nextReviewAt(rating),reviewCount:(item.reviewCount||0)+1,lastReviewedAt:new Date().toISOString()})
  },
  due(now=Date.now()){ return this.list().filter(x=>!x.dueAt || new Date(x.dueAt).getTime()<=now).sort((a,b)=>new Date(a.dueAt||0)-new Date(b.dueAt||0)) },
  upcoming(limit=20){ return [...this.list()].sort((a,b)=>new Date(a.dueAt||0)-new Date(b.dueAt||0)).slice(0,limit) },
  clear(){ removeKey(KEY); this.emit() },
  emit(){ if(typeof window!=='undefined') window.dispatchEvent(new CustomEvent('bunny-review-updated')) },
}
