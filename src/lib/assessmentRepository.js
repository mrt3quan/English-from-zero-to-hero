import { readJson, writeJson } from './storage.js'
const KEY='bunny-english-assessments-v1'
export const AssessmentRepository={
  all:()=>readJson(KEY,[]),
  latest(level='A0'){return this.all().filter(x=>x.level===level).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0]||null},
  save(result){const next=[...this.all(),{...result,id:result.id||`${result.level}-${Date.now()}`,createdAt:result.createdAt||new Date().toISOString()}].slice(-20);writeJson(KEY,next);if(typeof window!=='undefined')window.dispatchEvent(new Event('bunny-assessment-updated'));return next.at(-1)},
  reset(){writeJson(KEY,[]);if(typeof window!=='undefined')window.dispatchEvent(new Event('bunny-assessment-updated'))},
}
