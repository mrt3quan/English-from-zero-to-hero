import React, { useMemo, useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Headphones, Mic, RotateCcw, Trophy, Volume2, X } from 'lucide-react'
import Mascot from './Mascot'
import { a0Assessment } from '../data/a0Assessment'
import { AudioService } from '../lib/audioService'
import { SpeechService, scoreTranscript } from '../lib/speechService'
import { normalizeCase } from '../lib/textValidation'
import { AssessmentRepository } from '../lib/assessmentRepository'
import { SoundEffectsService } from '../lib/soundEffectsService'

export default function LevelAssessment({ assessment=a0Assessment, onClose }){
  const [sectionIndex,setSectionIndex]=useState(0)
  const [answers,setAnswers]=useState({})
  const [submitted,setSubmitted]=useState(false)
  const [result,setResult]=useState(null)
  const [speaking,setSpeaking]=useState({})
  const section=assessment.sections[sectionIndex]
  const progress=Math.round(((sectionIndex+1)/assessment.sections.length)*100)

  const answer=(id,value)=>setAnswers(prev=>({...prev,[id]:value}))
  const sectionReady=section.optional ? true : section.items.every(item=>{
    const value=answers[item.id]
    if(item.type==='writing') return String(value||'').trim().split(/\n+/).filter(Boolean).length>=item.minLines
    return String(value??'').trim().length>0
  })

  const finish=()=>{
    const scored=scoreAssessment(assessment,answers)
    const record=AssessmentRepository.save(scored)
    setResult(record);setSubmitted(true)
    if(record.passed) SoundEffectsService.levelComplete()
  }

  if(submitted&&result) return <Result assessment={assessment} result={result} onClose={onClose} onRetry={()=>{setSectionIndex(0);setAnswers({});setSubmitted(false);setResult(null);setSpeaking({})}}/>

  return <div className="fixed inset-0 z-[110] overflow-y-auto p-0 backdrop-blur-sm sm:p-5" style={{background:'var(--overlay)'}}>
    <div className="assessment-shell surface-card mx-auto min-h-screen max-w-4xl overflow-hidden sm:min-h-0 sm:rounded-[32px]" style={{boxShadow:'var(--shadow-floating)'}}>
      <header className="sticky top-0 z-20 border-b bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} aria-label="Đóng bài kiểm tra" className="icon-button"><X className="h-5 w-5"/></button>
          <div className="min-w-0 flex-1"><p className="text-sm font-extrabold text-strong">{assessment.titleVi}</p><p className="text-xs font-medium text-muted">{assessment.label} · phần {sectionIndex+1}/{assessment.sections.length}</p><div className="progress-track mt-2 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{width:`${progress}%`}}/></div></div>
        </div>
      </header>
      <main className="p-4 sm:p-7">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-start gap-3 rounded-[24px] border border-blue-100 bg-blue-50 p-4"><Mascot size={62} mood="explaining"/><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-blue-700">Bunny · Giám khảo thân thiện</p><p className="mt-1 text-sm font-semibold leading-6 text-blue-950">Trong bài kiểm tra, Bunny không báo đúng/sai ngay. Hãy làm bằng khả năng của bạn; cuối bài Bunny mới chỉ rõ phần mạnh và phần cần ôn.</p></div></div>
          <div className="mb-6"><p className="eyebrow primary-eyebrow">{section.labelVi}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-strong">{sectionHeading(section.id)}</h1>{section.passage&&<div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 text-[15px] font-medium leading-7 text-slate-700"><p className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-violet-600">Đọc đoạn văn</p>{section.passage}</div>}</div>
          <div className="space-y-5">{section.items.map((item,index)=><AssessmentItem key={item.id} item={item} index={index} value={answers[item.id]} onChange={value=>answer(item.id,value)} speaking={speaking[item.id]} onSpeaking={value=>setSpeaking(prev=>({...prev,[item.id]:value}))}/>)}</div>
          <div className="mt-7 flex items-center justify-between gap-3 border-t pt-5">
            <button disabled={sectionIndex===0} onClick={()=>setSectionIndex(i=>Math.max(0,i-1))} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 disabled:opacity-30"><ChevronLeft className="h-4 w-4"/>Quay lại</button>
            {sectionIndex<assessment.sections.length-1?<button disabled={!sectionReady} onClick={()=>setSectionIndex(i=>i+1)} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white disabled:bg-slate-300">Phần tiếp theo <ChevronRight className="h-4 w-4"/></button>:<button disabled={!sectionReady} onClick={finish} className="pressable inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:bg-slate-300"><Trophy className="h-4 w-4"/>Xem kết quả A0</button>}
          </div>
        </div>
      </main>
    </div>
  </div>
}

function AssessmentItem({item,index,value,onChange,speaking,onSpeaking}){
  if(item.type==='listenChoice') return <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold text-strong">{index+1}. {item.promptVi}</p><button onClick={()=>AudioService.speak(item.audio,{speed:'normal'})} className="pressable mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white"><Volume2 className="h-4 w-4"/>Nghe câu</button><ChoiceOptions item={item} value={value} onChange={onChange}/></div>
  if(item.type==='choice') return <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold leading-6 text-strong">{index+1}. {item.promptVi}</p><ChoiceOptions item={item} value={value} onChange={onChange}/></div>
  if(item.type==='text') return <div className="rounded-3xl border border-slate-200 bg-white p-5"><label className="text-sm font-bold leading-6 text-strong">{index+1}. {item.promptVi}</label><input value={value||''} onChange={e=>onChange(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Viết toàn bộ câu…"/></div>
  if(item.type==='writing') return <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5"><label className="text-sm font-bold leading-6 text-strong">{item.promptVi}</label><textarea rows={10} value={value||''} onChange={e=>onChange(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Mỗi câu một dòng…"/><p className="mt-2 text-xs font-semibold text-muted">Mục tiêu: {item.minLines}–10 câu · ít nhất {item.minWords} từ.</p></div>
  if(item.type==='speaking') return <SpeakingItem item={item} state={speaking} onChange={onSpeaking}/>
  return null
}
function ChoiceOptions({item,value,onChange}){return <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.options.map(option=><button key={option} onClick={()=>onChange(option)} className={`pressable min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${value===option?'border-blue-500 bg-blue-50 text-blue-800':'border-slate-200 bg-white text-slate-700'}`}>{option}</button>)}</div>}
function SpeakingItem({item,state={},onChange}){const [busy,setBusy]=useState(false);const start=()=>{if(!SpeechService.supported())return;setBusy(true);SpeechService.listen({locale:'en-US',onResult:({transcript})=>{setBusy(false);onChange({...state,completed:true,transcript,score:scoreTranscript(transcript,item.target)})},onError:()=>setBusy(false)})};return <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><p className="text-sm font-bold text-strong">{item.promptVi}</p><p className="mt-2 text-lg font-extrabold">{item.target}</p><div className="mt-3 flex flex-wrap gap-2"><button disabled={!SpeechService.supported()} onClick={start} className="pressable inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40"><Mic className="h-4 w-4"/>{busy?'Đang nghe…':'Thử microphone'}</button><button onClick={()=>onChange({...state,completed:true,selfConfirmed:true})} className="pressable min-h-11 rounded-xl border border-violet-200 bg-white px-4 text-sm font-bold text-violet-700">Tôi đã nói thành tiếng</button></div>{state.transcript&&<p className="mt-3 text-xs font-semibold text-muted">Bunny nghe: “{state.transcript}”</p>}{!SpeechService.supported()&&<p className="mt-2 text-xs font-semibold text-amber-800">Trình duyệt không hỗ trợ speech recognition. Bạn vẫn có thể luyện nói bằng nút tự xác nhận.</p>}</div>}

function scoreAssessment(assessment,answers){
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
function scoreItem(item,value){
  if(item.type==='choice'||item.type==='listenChoice') return normalizeCase(value)===normalizeCase(item.answer)?1:0
  if(item.type==='text') return (item.accepted||[]).some(answer=>normalizeCase(value)===normalizeCase(answer))?1:0
  if(item.type==='writing'){
    const text=String(value||'').trim();const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);const words=text.split(/\s+/).filter(Boolean)
    if(lines.length<item.minLines||words.length<item.minWords)return .25
    const hasBe=/\b(am|is|are)\b/i.test(text),hasVerb=/\b(live|work|study|like|want|need|play|eat|go|have|has|do|does)\b/i.test(text),hasEnd=lines.filter(l=>/[.!?]$/.test(l)).length>=Math.ceil(lines.length*.6),capital=lines.filter(l=>/^[A-Z]/.test(l)).length>=Math.ceil(lines.length*.6)
    return [hasBe,hasVerb,hasEnd,capital].filter(Boolean).length/4
  }
  return 0
}
function sectionHeading(id){return ({listening:'Nghe để hiểu ý chính',meaning:'Hiểu từ trong ngữ cảnh',sentence:'Tự chọn và sửa cấu trúc',reading:'Đọc một đoạn tiếng Anh ngắn',speaking:'Nói thành tiếng',writing:'Tự tạo tiếng Anh của bạn'})[id]||'Kiểm tra khả năng'}

function Result({assessment,result,onClose,onRetry}){
  const weak=Object.values(result.sections).filter(x=>x.score<70).map(x=>x.labelVi)
  return <div className="fixed inset-0 z-[110] overflow-y-auto p-4 backdrop-blur-sm" style={{background:'var(--overlay)'}}><div className="surface-card mx-auto mt-6 max-w-3xl rounded-[32px] p-6 sm:p-8" style={{boxShadow:'var(--shadow-floating)'}}><div className="text-center"><Mascot size={132} mood={result.passed?'celebrating':'encouraging'} withBook={false} className="mx-auto"/><p className="mt-2 text-xs font-black uppercase tracking-[.16em] text-primary">{assessment.label}</p><h2 className="mt-2 text-3xl font-extrabold text-strong">{result.passed?'Bạn đã sẵn sàng cho A1!':'A0 chưa vững hoàn toàn — và Bunny biết nên ôn gì.'}</h2><div className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full border-8 border-blue-100 bg-blue-50 text-2xl font-black text-blue-700">{result.overall}%</div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(result.sections).map(([id,s])=><div key={id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><span className="text-sm font-bold text-strong">{s.labelVi}</span><span className={`text-sm font-black ${s.score>=70?'text-emerald-700':'text-amber-700'}`}>{s.score}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${s.score>=70?'bg-emerald-500':'bg-amber-400'}`} style={{width:`${s.score}%`}}/></div></div>)}</div><div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">{result.passed?'Bạn đã chứng minh khả năng nghe, đọc, xây câu và tự viết ở mức Starter. Khi A1 mở, bạn có thể đi tiếp và Bunny vẫn sẽ ôn lại các lỗi cũ theo review queue.':weak.length?`Ưu tiên ôn lại: ${weak.join(', ')}. Đây là dữ liệu để bạn biết nên ôn phần nào trước, không phải một lời phán xét.`:'Hãy ôn lại các bài gần đây rồi thử lại.'}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={onRetry} className="pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700"><RotateCcw className="h-4 w-4"/>Làm lại sau</button><button onClick={onClose} className="pressable min-h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white">Về lộ trình</button></div></div></div>
}
