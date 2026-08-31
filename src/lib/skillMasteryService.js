import { AttemptRepository } from './attemptRepository.js'
import { SKILLS } from './skillTaxonomy.js'

export function calculateSkillMastery(attempts, skillId) {
  const rows = attempts.filter(a => (a.skillIds || []).includes(skillId))
  const scored = rows.reduce((sum,a)=>sum + (a.correct ? 1 : 0), 0)
  // Beta(2,2) prior keeps one answer from looking artificially precise.
  const masteryScore = Math.round(((scored + 2) / (rows.length + 4)) * 100)
  return {
    skillId,
    label: SKILLS[skillId]?.label || skillId,
    labelVi: SKILLS[skillId]?.labelVi || skillId,
    attempts: rows.length,
    correct: scored,
    incorrect: rows.length - scored,
    masteryScore,
    lastPracticed: rows.at(-1)?.createdAt || null,
    recentErrors: rows.filter(a=>!a.correct).slice(-5).flatMap(a=>a.errorTags||[]),
  }
}

export function getAllSkillMastery() {
  const attempts = AttemptRepository.list()
  return Object.keys(SKILLS).map(skillId => calculateSkillMastery(attempts, skillId)).filter(x=>x.attempts>0)
}

export function getWeakSkills(limit=5) {
  return getAllSkillMastery().filter(s=>s.attempts>=1).sort((a,b)=>a.masteryScore-b.masteryScore || new Date(a.lastPracticed)-new Date(b.lastPracticed)).slice(0,limit)
}
