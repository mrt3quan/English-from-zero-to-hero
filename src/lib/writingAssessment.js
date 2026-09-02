const commonPresentVerbs = ['live','work','study','like','love','want','need','play','eat','drink','go','read','watch','sleep','cook','drive','walk','speak','learn']

export function splitWritingSentences(value='') {
  const text=String(value||'').replace(/\r/g,'').trim()
  if(!text) return []
  const chunks=[]
  for(const line of text.split(/\n+/)){
    const trimmed=line.trim()
    if(!trimmed) continue
    const matches=trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []
    matches.forEach(raw=>{
      const sentence=raw.trim()
      if(!sentence) return
      const words=sentence.replace(/[.!?]+$/,'').trim().split(/\s+/).filter(Boolean)
      if(words.length) chunks.push({text:sentence,words,ended:/[.!?]$/.test(sentence)})
    })
  }
  return chunks
}

export function writingStats(value='') {
  const text=String(value||'').trim()
  const sentences=splitWritingSentences(text)
  const words=text ? text.split(/\s+/).filter(Boolean) : []
  const punctuated=sentences.filter(s=>s.ended).length
  const capitalized=sentences.filter(s=>/^[A-Z]/.test(s.text)).length
  return {
    text,
    words:words.length,
    sentences:sentences.length,
    punctuated,
    capitalized,
    punctuationRate:sentences.length ? punctuated/sentences.length : 0,
    capitalizationRate:sentences.length ? capitalized/sentences.length : 0,
  }
}

export function matchesWritingRequirement(value='',requirement={}){
  const text=String(value||'')
  switch(requirement.type){
    case 'be': return /\b(am|is|are)\b/i.test(text)
    case 'presentSimple': return new RegExp(`\\b(${commonPresentVerbs.join('|')})(s|es)?\\b`,'i').test(text)
    case 'haveHas': return /\b(have|has)\b/i.test(text)
    case 'canCant': return /\b(can|can't|cannot|can\s+not)\b/i.test(text)
    case 'negative': return /\b(not|don't|doesn't|do\s+not|does\s+not|isn't|aren't|am\s+not|can't|cannot)\b/i.test(text)
    case 'placeTime': return /\b(in|on|at|near|next\s+to|under|over|home|school|work|park|morning|afternoon|evening|night|today|tomorrow|every\s+day|every\s+morning|every\s+evening|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(text)
    case 'firstPerson': return /\b(I|my|me)\b/.test(text)
    case 'location': return /\b(live|am|stay)\b[^.!?\n]{0,40}\b(in|at|near)\b/i.test(text)
    default: return false
  }
}

export function analyzeGuidedWriting(value='',item={}){
  const stats=writingStats(value)
  const minSentences=item.minSentences||1
  const minWords=item.minWords||Math.max(4,minSentences*3)
  const requirements=(item.requirements||[]).map(req=>({...req,met:matchesWritingRequirement(value,req)}))
  const quantityReady=stats.sentences>=minSentences && stats.words>=minWords
  const requiredReady=requirements.every(req=>req.met)
  return {
    ...stats,
    minSentences,
    minWords,
    requirements,
    quantityReady,
    requiredReady,
    ready:quantityReady&&requiredReady,
  }
}

export function scoreGuidedWriting(value='',item={}){
  const analysis=analyzeGuidedWriting(value,item)
  if(!analysis.text) return 0
  const quantityScore=Math.min(1,Math.min(analysis.sentences/analysis.minSentences,analysis.words/analysis.minWords))
  const requirementScore=analysis.requirements.length ? analysis.requirements.filter(r=>r.met).length/analysis.requirements.length : 1
  const punctuationScore=Math.min(1,analysis.punctuationRate)
  const capitalizationScore=Math.min(1,analysis.capitalizationRate)
  // A0 deterministic scoring deliberately measures only observable features.
  // It does not pretend to understand free-writing quality like a human/AI writing teacher.
  return Math.max(0,Math.min(1,
    quantityScore*.30 +
    requirementScore*.40 +
    punctuationScore*.15 +
    capitalizationScore*.15
  ))
}
