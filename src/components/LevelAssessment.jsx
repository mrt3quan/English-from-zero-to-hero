import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, Circle, Headphones, Lightbulb, Mic, PenLine, RotateCcw, Save, Trophy, Volume2, X } from 'lucide-react'
import Mascot from './Mascot'
import { a0Assessment } from '../data/a0Assessment'
import { AudioService } from '../lib/audioService'
import { SpeechService, scoreTranscript } from '../lib/speechService'
import { normalizeCase } from '../lib/textValidation'
import { AssessmentRepository } from '../lib/assessmentRepository'
import { SoundEffectsService } from '../lib/soundEffectsService'
import { analyzeGuidedWriting, scoreGuidedWriting, writingStats } from '../lib/writingAssessment'

export default function LevelAssessment({ assessment=a0Assessment, onClose }){
  const savedDraft=useMemo(()=>AssessmentRepository.draft(assessment.id),[assessment.id])
  const [started,setStarted]=useState(false)
  const [sectionIndex,setSectionIndex]=useState(savedDraft?.sectionIndex||0)
  const [answers,setAnswers]=useState(savedDraft?.answers||{})
  const [submitted,setSubmitted]=useState(false)
  const [result,setResult]=useState(null)
  const [speaking,setSpeaking]=useState(savedDraft?.speaking||{})
  const [itemPage,setItemPage]=useState(savedDraft?.itemPage||{})
  const section=assessment.sections[sectionIndex]
  const guided=section?.layout==='guidedSteps'
  const guidedIndex=guided ? (itemPage[section.id]||0) : 0
  const visibleItems=guided ? [section.items[guidedIndex]] : section.items
  const sectionProgress=Math.round(((sectionIndex+(guided ? (guidedIndex+1)/section.items.length : 1))/assessment.sections.length)*100)

  useEffect(()=>{
    if(!started||submitted)return
    AssessmentRepository.saveDraft(assessment.id,{started:true,sectionIndex,answers,speaking,itemPage})
  },[assessment.id,started,submitted,sectionIndex,answers,speaking,itemPage])

  const answer=(id,value)=>setAnswers(prev=>({...prev,[id]:value}))
  const itemReady=item=>{
    const value=answers[item.id]
    if(item.type==='guidedWriting') return analyzeGuidedWriting(value,item).ready
    if(item.type==='writing'){
      const stats=writingStats(value)
      return stats.sentences>=(item.minSentences||item.minLines||1)&&stats.words>=(item.minWords||1)
    }
    return String(value??'').trim().length>0
  }
  const sectionReady=section.optional ? true : section.items.every(itemReady)
  const visibleReady=section.optional ? true : visibleItems.every(itemReady)

  const resetDraft=()=>{
    AssessmentRepository.clearDraft(assessment.id)
    setSectionIndex(0);setAnswers({});setSpeaking({});setItemPage({});setStarted(true)
  }
  const finish=()=>{
    const scored=scoreAssessment(assessment,answers)
    const record=AssessmentRepository.save(scored)
    AssessmentRepository.clearDraft(assessment.id)
    setResult(record);setSubmitted(true)
    if(record.passed) SoundEffectsService.levelComplete()
  }
  const goBack=()=>{
    if(guided&&guidedIndex>0){setItemPage(prev=>({...prev,[section.id]:guidedIndex-1}));return}
    if(sectionIndex>0)setSectionIndex(i=>i-1)
  }
  const goNext=()=>{
    if(guided&&guidedIndex<section.items.length-1){setItemPage(prev=>({...prev,[section.id]:guidedIndex+1}));return}
    if(sectionIndex<assessment.sections.length-1)setSectionIndex(i=>i+1)
  }

  if(submitted&&result) return <Result assessment={assessment} result={result} onClose={onClose} onRetry={()=>{setStarted(false);setSectionIndex(0);setAnswers({});setSubmitted(false);setResult(null);setSpeaking({});setItemPage({});AssessmentRepository.clearDraft(assessment.id)}}/>

  if(!started) return <AssessmentIntro assessment={assessment} draft={savedDraft} onClose={onClose} onStart={()=>setStarted(true)} onRestart={resetDraft}/>

  return <div className="fixed inset-0 z-[110] overflow-y-auto p-0 backdrop-blur-sm sm:p-5" style={{background:'var(--overlay)'}}>
    <div className="assessment-shell surface-card mx-auto min-h-screen max-w-4xl overflow-hidden sm:min-h-0 sm:rounded-[32px]" style={{boxShadow:'var(--shadow-floating)'}}>
      <header className="assessment-header sticky top-0 z-20 border-b px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} aria-label="Đóng bài kiểm tra" className="icon-button"><X className="h-5 w-5"/></button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-extrabold text-strong">{assessment.titleVi}</p><span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted"><Save className="h-3.5 w-3.5"/>Tự lưu</span></div>
            <p className="text-xs font-medium text-muted">{assessment.label} · phần {sectionIndex+1}/{assessment.sections.length}{guided ? ` · viết ${guidedIndex+1}/${section.items.length}` : ''}</p>
            <div className="progress-track mt-2 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{width:`${Math.min(100,sectionProgress)}%`}}/></div>
          </div>
        </div>
      </header>

      <main className="p-4 pb-28 sm:p-7 sm:pb-28">
        <div className="mx-auto max-w-3xl">
          <div className="assessment-teacher mb-5 flex items-start gap-3 rounded-[22px] p-4"><Mascot size={58} mood="explaining"/><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Bunny · Giáo viên kiểm tra</p><p className="mt-1 text-sm font-semibold leading-6 text-strong">{teacherMessage(section.id,guidedIndex)}</p></div></div>
          <div className="mb-6">
            <p className="eyebrow primary-eyebrow">{section.labelVi}</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">{sectionHeading(section.id)}</h1>
            {section.introVi&&<p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted">{section.introVi}</p>}
            {section.passage&&<div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 text-[15px] font-medium leading-7 text-slate-700"><p className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-violet-600">Đọc đoạn văn</p>{section.passage}</div>}
          </div>
          <div className="space-y-5">{visibleItems.map((item,index)=><AssessmentItem key={item.id} item={item} index={guided ? guidedIndex : index} value={answers[item.id]} onChange={value=>answer(item.id,value)} speaking={speaking[item.id]} onSpeaking={value=>setSpeaking(prev=>({...prev,[item.id]:value}))}/>)}</div>
        </div>
      </main>

      <div className="assessment-actions sticky bottom-0 z-20 border-t px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button disabled={sectionIndex===0&&(!guided||guidedIndex===0)} onClick={goBack} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 disabled:opacity-30"><ChevronLeft className="h-4 w-4"/>Quay lại</button>
          <div className="min-w-0 text-right">
            {!visibleReady&&!section.optional&&<p className="mb-1 max-w-[220px] text-[11px] font-semibold leading-4 text-amber-700">{blockedReason(visibleItems,answers)}</p>}
            {guided&&guidedIndex<section.items.length-1 ? <button disabled={!visibleReady} onClick={goNext} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white disabled:bg-slate-300">Bài viết tiếp theo <ChevronRight className="h-4 w-4"/></button> : sectionIndex<assessment.sections.length-1 ? <button disabled={!sectionReady} onClick={goNext} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white disabled:bg-slate-300">Phần tiếp theo <ChevronRight className="h-4 w-4"/></button> : <button disabled={!sectionReady} onClick={finish} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:bg-slate-300"><Trophy className="h-4 w-4"/>Xem kết quả A0</button>}
          </div>
        </div>
      </div>
    </div>
  </div>
}

function AssessmentIntro({assessment,draft,onClose,onStart,onRestart}){
  const sectionMeta={
    listening:{icon:Headphones,tasks:'4 câu'},meaning:{icon:BookOpen,tasks:'4 câu'},sentence:{icon:CheckCircle2,tasks:'6 câu'},reading:{icon:BookOpen,tasks:'4 câu'},speaking:{icon:Mic,tasks:'luyện nói'},writing:{icon:PenLine,tasks:'4 bài ngắn'},
  }
  return <div className="fixed inset-0 z-[110] overflow-y-auto p-0 backdrop-blur-sm sm:p-5" style={{background:'var(--overlay)'}}><div className="surface-card mx-auto min-h-screen max-w-3xl p-5 sm:min-h-0 sm:rounded-[32px] sm:p-8" style={{boxShadow:'var(--shadow-floating)'}}>
    <div className="flex justify-end"><button onClick={onClose} aria-label="Đóng" className="icon-button"><X className="h-5 w-5"/></button></div>
    <div className="mx-auto max-w-2xl text-center"><Mascot size={112} mood="encouraging" withBook={false} className="mx-auto"/><p className="mt-1 text-xs font-black uppercase tracking-[.15em] text-primary">{assessment.label}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">Cho Bunny xem bạn có thể làm gì</h1><p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-muted">{assessment.introVi}</p></div>
    <div className="mx-auto mt-7 max-w-2xl rounded-[26px] border border-slate-200 bg-white p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-extrabold text-strong">Khoảng 15–20 phút</p><p className="mt-0.5 text-xs font-medium text-muted">6 phần ngắn · tiến độ được tự lưu</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">A0 Final Check</span></div><div className="divide-y divide-slate-100">{assessment.sections.map(section=>{const meta=sectionMeta[section.id]||{icon:Circle,tasks:`${section.items.length} câu`};const Icon=meta.icon;return <div key={section.id} className="flex items-center gap-3 py-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-600"><Icon className="h-4 w-4"/></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-strong">{section.labelVi}</p><p className="text-xs font-medium text-muted">{meta.tasks}{section.optional?' · không chặn kết quả':''}</p></div><Check className="h-4 w-4 text-slate-300"/></div>})}</div></div>
    <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">Bunny sẽ không báo đúng/sai trong lúc làm. Phần viết được chia thành 4 nhiệm vụ ngắn thay vì một ô văn bản lớn.</div>
    <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">{draft?<><button onClick={onStart} className="primary-button pressable min-h-12 flex-1 rounded-2xl px-5 text-sm font-bold">Tiếp tục bài đang làm</button><button onClick={onRestart} className="pressable min-h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700">Làm lại từ đầu</button></>:<button onClick={onStart} className="primary-button pressable min-h-12 flex-1 rounded-2xl px-5 text-sm font-bold">Bắt đầu kiểm tra <ChevronRight className="ml-1 inline h-4 w-4"/></button>}</div>
  </div></div>
}

function AssessmentItem({item,index,value,onChange,speaking,onSpeaking}){
  if(item.type==='listenChoice') return <div className="assessment-question rounded-3xl p-5"><p className="text-sm font-bold text-strong">{index+1}. {item.promptVi}</p><AssessmentListenButton text={item.audio} voice={item.voice}/><ChoiceOptions item={item} value={value} onChange={onChange}/></div>
  if(item.type==='choice') return <div className="assessment-question rounded-3xl p-5"><p className="text-sm font-bold leading-6 text-strong">{index+1}. {item.promptVi}</p><ChoiceOptions item={item} value={value} onChange={onChange}/></div>
  if(item.type==='text') return <div className="assessment-question rounded-3xl p-5"><label className="text-sm font-bold leading-6 text-strong">{index+1}. {item.promptVi}</label><input value={value||''} onChange={e=>onChange(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Viết toàn bộ câu…"/></div>
  if(item.type==='guidedWriting') return <GuidedWritingItem item={item} value={value} onChange={onChange}/>
  if(item.type==='writing') return <LegacyWritingItem item={item} value={value} onChange={onChange}/>
  if(item.type==='speaking') return <SpeakingItem item={item} state={speaking} onChange={onSpeaking}/>
  return null
}


function AssessmentListenButton({text,voice}){
  const [loading,setLoading]=useState(false)
  const play=async()=>{if(loading)return;setLoading(true);await AudioService.speak(text,{speed:'normal',voiceRole:'listening',voice});setLoading(false)}
  return <button disabled={loading} onClick={play} className="pressable mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-60"><Volume2 className="h-4 w-4"/>{loading?'Đang chuẩn bị giọng…':'Nghe câu'}</button>
}

function GuidedWritingItem({item,value,onChange}){
  const [hint,setHint]=useState(false)
  const analysis=analyzeGuidedWriting(value,item)
  return <div className="guided-writing-card rounded-[28px] p-5 sm:p-6">
    <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700"><PenLine className="h-5 w-5"/></div><div><p className="text-xs font-black uppercase tracking-[.12em] text-amber-700">Nhiệm vụ viết</p><h2 className="mt-1 text-xl font-extrabold text-strong">{item.titleVi}</h2><p className="mt-2 text-sm font-semibold leading-6 text-strong">{item.promptVi}</p></div></div>
    <textarea rows={5} value={value||''} onChange={e=>onChange(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-[15px] font-medium leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Viết tự nhiên. Bạn có thể viết các câu trên cùng một dòng hoặc xuống dòng…"/>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className={`text-xs font-extrabold ${analysis.sentences>=item.minSentences?'text-emerald-700':'text-muted'}`}>{analysis.sentences}/{item.minSentences} câu · {analysis.words} từ</p><button onClick={()=>setHint(v=>!v)} className="pressable inline-flex min-h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold text-amber-700"><Lightbulb className="h-3.5 w-3.5"/>{hint?'Ẩn gợi ý':'Cần gợi ý?'}</button></div>
    {hint&&<div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900">{item.hintVi}</div>}
    <div className="mt-4 grid gap-2 sm:grid-cols-2"><Requirement met={analysis.sentences>=item.minSentences} label={`Viết ít nhất ${item.minSentences} câu`}/>{analysis.requirements.map(req=><Requirement key={req.type} met={req.met} label={req.labelVi}/>)}</div>
    {analysis.sentences>0&&analysis.punctuationRate<1&&<p className="mt-3 text-xs font-semibold leading-5 text-muted">Bunny nhận thấy một số câu chưa có dấu cuối câu. Bạn vẫn có thể tiếp tục khi đủ yêu cầu; dấu câu sẽ ảnh hưởng điểm viết.</p>}
  </div>
}
function Requirement({met,label}){return <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${met?'border-emerald-200 bg-emerald-50 text-emerald-800':'border-slate-200 bg-white text-slate-600'}`}>{met?<CheckCircle2 className="h-4 w-4 shrink-0"/>:<Circle className="h-4 w-4 shrink-0"/>}{label}</div>}
function LegacyWritingItem({item,value,onChange}){const stats=writingStats(value);return <div className="guided-writing-card rounded-3xl p-5"><label className="text-sm font-bold leading-6 text-strong">{item.promptVi}</label><textarea rows={8} value={value||''} onChange={e=>onChange(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Viết tự nhiên…"/><p className="mt-2 text-xs font-semibold text-muted">{stats.sentences} câu · {stats.words} từ</p></div>}
function ChoiceOptions({item,value,onChange}){return <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.options.map(option=><button key={option} onClick={()=>onChange(option)} className={`pressable min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${value===option?'border-blue-500 bg-blue-50 text-blue-800':'border-slate-200 bg-white text-slate-700'}`}>{option}</button>)}</div>}
function SpeakingItem({item,state={},onChange}){const [busy,setBusy]=useState(false);const start=()=>{if(!SpeechService.supported())return;setBusy(true);SpeechService.listen({locale:'en-US',onResult:({transcript})=>{setBusy(false);onChange({...state,completed:true,transcript,score:scoreTranscript(transcript,item.target)})},onError:()=>setBusy(false)})};return <div className="assessment-question rounded-3xl p-5"><p className="text-sm font-bold text-strong">{item.promptVi}</p><p className="mt-2 text-lg font-extrabold">{item.target}</p><div className="mt-3 flex flex-wrap gap-2"><button disabled={!SpeechService.supported()} onClick={start} className="pressable inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40"><Mic className="h-4 w-4"/>{busy?'Đang nghe…':'Thử microphone'}</button><button onClick={()=>onChange({...state,completed:true,selfConfirmed:true})} className="pressable min-h-11 rounded-xl border border-violet-200 bg-white px-4 text-sm font-bold text-violet-700">Tôi đã nói thành tiếng</button></div>{state.transcript&&<p className="mt-3 text-xs font-semibold text-muted">Bunny nghe: “{state.transcript}”</p>}{!SpeechService.supported()&&<p className="mt-2 text-xs font-semibold text-amber-800">Trình duyệt không hỗ trợ speech recognition. Bạn vẫn có thể luyện nói bằng nút tự xác nhận.</p>}</div>}

export function scoreAssessment(assessment,answers){
  const sections={};let weighted=0,totalWeight=0
  assessment.sections.forEach(section=>{
    if(!section.weight)return
    let earned=0
    section.items.forEach(item=>{earned+=scoreItem(item,answers[item.id])})
    const score=Math.round((earned/section.items.length)*100)
    sections[section.id]={score,labelVi:section.labelVi,weight:section.weight}
    weighted+=score*section.weight;totalWeight+=section.weight
  })
  const overall=Math.round(weighted/totalWeight)
  const requiredOk=Object.entries(assessment.passing.requiredSections||{}).every(([id,min])=>(sections[id]?.score||0)>=min)
  const passed=overall>=assessment.passing.overall&&requiredOk
  return {level:assessment.level,assessmentId:assessment.id,overall,sections,passed,answers}
}
export function scoreItem(item,value){
  if(item.type==='choice'||item.type==='listenChoice') return normalizeCase(value)===normalizeCase(item.answer)?1:0
  if(item.type==='text') return (item.accepted||[]).some(answer=>normalizeCase(value)===normalizeCase(answer))?1:0
  if(item.type==='guidedWriting') return scoreGuidedWriting(value,item)
  if(item.type==='writing'){
    const stats=writingStats(value)
    if(stats.sentences<(item.minSentences||item.minLines||1)||stats.words<(item.minWords||1))return .25
    return Math.min(1,(stats.punctuationRate+stats.capitalizationRate)/2)
  }
  return 0
}
function sectionHeading(id){return ({listening:'Nghe để hiểu ý chính',meaning:'Hiểu từ trong ngữ cảnh',sentence:'Tự chọn và sửa cấu trúc',reading:'Đọc một đoạn tiếng Anh ngắn',speaking:'Nói thành tiếng',writing:'Viết từng bước, không cần đoán hệ thống muốn gì'})[id]||'Kiểm tra khả năng'}
function teacherMessage(id,writingIndex){if(id==='writing')return ['Bắt đầu bằng hai câu rất quen thuộc: bạn là ai và bạn sống ở đâu.','Bây giờ dùng tiếng Anh để nói về một thói quen thật của bạn.','Tiếp theo, cho Bunny thấy bạn dùng được have/has và can/can’t.','Cuối cùng, thêm một câu phủ định và một chi tiết về nơi chốn hoặc thời gian.'][writingIndex]||'Viết từng bước.';return 'Trong bài kiểm tra, Bunny không báo đúng/sai ngay. Hãy làm bằng khả năng của bạn; cuối bài Bunny mới chỉ rõ phần mạnh và phần cần ôn.'}
function blockedReason(items,answers){const item=items[0];if(!item)return 'Hoàn thành phần này để tiếp tục.';if(item.type==='guidedWriting'){const a=analyzeGuidedWriting(answers[item.id],item);if(a.sentences<item.minSentences)return `Cần thêm ${item.minSentences-a.sentences} câu ngắn.`;const missing=a.requirements.filter(r=>!r.met);if(missing.length)return `Còn thiếu: ${missing.map(r=>r.labelVi).join(', ')}.`;return 'Hoàn thành yêu cầu để tiếp tục.'}return 'Hãy trả lời câu hỏi trước khi tiếp tục.'}

function Result({assessment,result,onClose,onRetry}){
  const weak=Object.values(result.sections).filter(x=>x.score<70).map(x=>x.labelVi)
  const writingItems=assessment.sections.find(s=>s.id==='writing')?.items||[]
  const writingSamples=writingItems.map(item=>result.answers?.[item.id]).filter(Boolean)
  return <div className="fixed inset-0 z-[110] overflow-y-auto p-4 backdrop-blur-sm" style={{background:'var(--overlay)'}}><div className="surface-card mx-auto mt-6 max-w-3xl rounded-[32px] p-6 sm:p-8" style={{boxShadow:'var(--shadow-floating)'}}><div className="text-center"><Mascot size={132} mood={result.passed?'celebrating':'encouraging'} withBook={false} className="mx-auto"/><p className="mt-2 text-xs font-black uppercase tracking-[.16em] text-primary">{assessment.label}</p><h2 className="mt-2 text-3xl font-extrabold text-strong">{result.passed?'Bạn đã sẵn sàng cho A1!':'A0 chưa vững hoàn toàn — Bunny biết nên ôn gì.'}</h2><div className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full border-8 border-blue-100 bg-blue-50 text-2xl font-black text-blue-700">{result.overall}%</div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(result.sections).map(([id,s])=><div key={id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><span className="text-sm font-bold text-strong">{s.labelVi}</span><span className={`text-sm font-black ${s.score>=70?'text-emerald-700':'text-amber-700'}`}>{s.score}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${s.score>=70?'bg-emerald-500':'bg-amber-400'}`} style={{width:`${s.score}%`}}/></div></div>)}</div><div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">{result.passed?'Bạn đã chứng minh khả năng nghe, đọc, xây câu và tự viết ở mức Starter. Khi A1 mở, Bunny vẫn sẽ đưa các điểm yếu vào ôn tập.':weak.length?`Ưu tiên ôn lại: ${weak.join(', ')}. Kết quả này giúp bạn biết nên học gì tiếp theo.`:'Hãy ôn lại các bài gần đây rồi thử lại.'}</div>{writingSamples.length>0&&<details className="quiet-details mt-4 rounded-2xl"><summary className="cursor-pointer px-4 py-3 text-sm font-bold text-strong">Xem bài viết A0 của bạn</summary><div className="border-t px-4 py-4"><p className="whitespace-pre-line text-sm font-medium leading-7 text-slate-700">{writingSamples.join('\n\n')}</p><p className="mt-3 text-xs font-medium leading-5 text-muted">Điểm viết hiện chỉ dùng các dấu hiệu có thể kiểm tra minh bạch như hoàn thành nhiệm vụ, cấu trúc mục tiêu, viết hoa và dấu câu. Bunny chưa giả vờ chấm chất lượng văn phong như giáo viên/AI nâng cao.</p></div></details>}<div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={onRetry} className="pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700"><RotateCcw className="h-4 w-4"/>Làm lại sau</button><button onClick={onClose} className="pressable min-h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white">Về lộ trình</button></div></div></div>
}
