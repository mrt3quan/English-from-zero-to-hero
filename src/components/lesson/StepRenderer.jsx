import React, { useMemo, useState } from 'react'
import { BookOpen, Brain, CheckCircle2, Circle, Eye, Languages, Lightbulb, Network, Volume2, Gauge, ChevronDown } from 'lucide-react'
import ExerciseRenderer from './ExerciseRenderer'
import Mascot from '../Mascot'
import { AudioService } from '../../lib/audioService'
import { evaluateProduction, getRequirements, splitNonEmptyLines, wordCount } from '../../lib/productionValidator'

const kindMeta={
  discover:{label:'DISCOVER',icon:Eye,cls:'text-blue-700 bg-blue-50 border-blue-100'},
  understand:{label:'UNDERSTAND',icon:Brain,cls:'text-emerald-700 bg-emerald-50 border-emerald-100'},
  visualize:{label:'VISUALIZE',icon:Network,cls:'text-violet-700 bg-violet-50 border-violet-100'},
  compare:{label:'COMPARE',icon:Languages,cls:'text-amber-800 bg-amber-50 border-amber-100'},
}

export default function StepRenderer({step,stepState={},onStepStateChange,onExerciseResult,onReviewRating}){
  const state={...stepState,stepKey:stepState.stepKey||step.id||step.promptVi||step.title}
  if(step.type==='exercise') return <ExerciseRenderer step={step} initialState={state} onStateChange={onStepStateChange} onResult={onExerciseResult}/>
  if(step.type==='production') return <ProductionStep step={step} state={state} onStateChange={onStepStateChange}/>
  if(step.type==='review') return <ReviewStep step={step} state={state} onStateChange={onStepStateChange} onReviewRating={onReviewRating}/>
  return <ContentStep step={step}/>
}

function AudioButtons({text}){
  return <div className="flex shrink-0 items-center gap-1.5"><button onClick={()=>AudioService.speak(text,{speed:'normal'})} className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 text-[11px] font-black text-blue-700" aria-label={`Nghe tốc độ bình thường: ${text}`}><Volume2 className="h-4 w-4"/> Normal</button><button onClick={()=>AudioService.speak(text,{speed:'slow'})} className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 text-[11px] font-black text-slate-600" aria-label={`Nghe chậm: ${text}`}><Gauge className="h-4 w-4"/> Slow</button></div>
}

function ContentStep({step}){
  const meta=kindMeta[step.kind]||kindMeta.understand;const Icon=meta.icon
  return <div><div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black tracking-[.14em] ${meta.cls}`}><Icon className="h-3.5 w-3.5"/>{meta.label}</div><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">{step.title}</h2><p className="mt-3 max-w-3xl text-[15px] font-medium leading-7 text-slate-600">{step.bodyVi}</p>
    {step.callout&&<div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-black text-blue-950">{step.callout}</div>}
    {step.examples&&<div className="mt-6 grid gap-3">{step.examples.map((ex,i)=><div key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><span className="english-example text-base font-extrabold text-slate-900">{ex}</span><AudioButtons text={step.speak?.[i] || ex}/></div>)}</div>}
    {step.chips&&<div className="mt-6 flex flex-wrap gap-2">{step.chips.map(chip=><span key={chip} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 shadow-sm">{chip}</span>)}</div>}
    {step.tokenRoles&&<div className="mt-6 flex flex-wrap gap-3">{step.tokenRoles.map((t,i)=><div key={i} className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center shadow-sm"><div className="english-example text-lg font-black text-slate-900">{t.text}</div><div className="mt-1 text-[10px] font-black uppercase tracking-wider text-blue-700">{t.role}</div></div>)}</div>}
    {step.conceptMap&&<ConceptMap nodes={step.conceptMap}/>} 
  </div>
}

const viLabels={Noun:'Danh từ',Article:'Mạo từ',Adjective:'Tính từ',Verb:'Động từ',Adverb:'Trạng từ',Pronoun:'Đại từ',Preposition:'Giới từ',Conjunction:'Liên từ',Quantifier:'Từ chỉ lượng'}
const nodeExplainers={Noun:'Tên của người, nơi, vật hoặc ý tưởng.',Article:'Đứng trước danh từ để giúp xác định cách ta nói về danh từ đó.',Adjective:'Mô tả danh từ: nó như thế nào?',Verb:'Cho biết hành động hoặc trạng thái.',Adverb:'Bổ sung cách, thời gian hoặc mức độ cho hành động.',Pronoun:'Thay cho noun/noun group để tránh lặp.',Preposition:'Cho biết quan hệ về nơi chốn, thời gian hoặc hướng.',Conjunction:'Nối từ, cụm từ hoặc ý.',Quantifier:'Cho biết số lượng hoặc lượng.'}
function ConceptMap({nodes}){
  const [selected,setSelected]=useState(nodes[0])
  const points=useMemo(()=>nodes.map((node,i)=>{const angle=(-90+(360/nodes.length)*i)*Math.PI/180;return{node,x:50+Math.cos(angle)*39,y:50+Math.sin(angle)*40}}),[nodes])
  return <div className="mt-6 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-amber-50/60 p-4 sm:p-6">
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/85 p-3"><Mascot size={68} mood="explaining" withBook/><div><p className="text-sm font-black text-slate-900">Bunny là giáo viên. Quả táo là vật liệu học.</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-500">“Hãy xem chỉ một quả táo có thể dạy ta 9 công việc của từ như thế nào!”</p></div></div>
    <div className="sm:hidden"><div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-lg"><div><div className="text-4xl">🍎</div><div className="text-xs font-black text-red-700">apple</div><div className="text-[9px] font-bold text-slate-400">ví dụ đang phân tích</div></div></div><div className="space-y-2">{nodes.map(node=><button key={node.label} onClick={()=>setSelected(selected?.label===node.label?null:node)} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-blue-700">{node.label} <span className="font-bold text-slate-400">· {node.labelVi||viLabels[node.label]}</span></p><p className="mt-1 english-example text-sm font-extrabold text-slate-900">{node.example}</p></div><ChevronDown className={`h-4 w-4 text-slate-400 transition ${selected?.label===node.label?'rotate-180':''}`}/></div>{selected?.label===node.label&&<p className="mt-3 border-t border-slate-100 pt-3 text-xs font-semibold leading-5 text-slate-600">{node.explanationVi||nodeExplainers[node.label]}</p>}</button>)}</div></div>
    <div className="relative hidden h-[590px] sm:block" aria-label="Bản đồ 9 nhóm từ cốt lõi"><svg className="absolute inset-0 h-full w-full" aria-hidden="true"><g stroke="rgb(147 197 253)" strokeWidth="1.5" strokeDasharray="5 6">{points.map(({x,y},i)=><line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}/>)}</g></svg><div className="absolute left-1/2 top-1/2 z-10 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-xl"><div><div className="text-5xl">🍎</div><div className="text-sm font-black text-red-700">apple</div><div className="text-[9px] font-bold text-slate-400">learning material</div></div></div>{points.map(({node,x,y})=><button key={node.label} onClick={()=>setSelected(node)} style={{left:`${x}%`,top:`${y}%`}} className={`absolute z-20 w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-3 text-center shadow-sm transition hover:-translate-y-[54%] hover:shadow-md ${selected?.label===node.label?'border-blue-400 ring-4 ring-blue-100':'border-slate-200'}`}><p className="text-xs font-black text-blue-700">{node.label}</p><p className="text-[10px] font-bold text-slate-400">{node.labelVi||viLabels[node.label]}</p><p className="mt-1 english-example text-sm font-extrabold text-slate-900">{node.example}</p></button>)}</div>
    {selected&&<div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-violet-700">{selected.label} · {selected.labelVi||viLabels[selected.label]}</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{selected.explanationVi||nodeExplainers[selected.label]}</p></div>}
  </div>
}

function ProductionStep({step,state,onStateChange}){
  const [value,setValue]=useState(state.value||'');const [manualChecks,setManualChecks]=useState(state.manualChecks||{});const [submitted,setSubmitted]=useState(!!state.completed)
  const evaluation=useMemo(()=>evaluateProduction(step,value,manualChecks),[step,value,manualChecks])
  const requirements=getRequirements(step)
  const changeValue=next=>{setValue(next);setSubmitted(false);onStateChange?.({value:next,manualChecks,completed:false,passed:evaluateProduction(step,next,manualChecks).passed})}
  const toggleManual=id=>{const next={...manualChecks,[id]:!manualChecks[id]};setManualChecks(next);setSubmitted(false);onStateChange?.({value,manualChecks:next,completed:false,passed:evaluateProduction(step,value,next).passed})}
  const submit=()=>{if(!evaluation.passed)return;setSubmitted(true);onStateChange?.({value,manualChecks,completed:true,passed:true,submittedAt:new Date().toISOString()})}
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-amber-800"><Lightbulb className="h-3.5 w-3.5"/>PRODUCE</div><h2 className="mt-4 text-3xl font-black tracking-tight">Tự tạo tiếng Anh</h2><p className="mt-3 text-[15px] font-medium leading-7 text-slate-600">{step.promptVi}</p>
    <label htmlFor="production-draft" className="sr-only">Bài viết của bạn</label><textarea id="production-draft" value={value} onChange={e=>changeValue(e.target.value)} rows={step.masteryProject?12:6} placeholder={step.placeholder} className="mt-6 w-full resize-y rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{evaluation.requirements.map(req=>{const manual=req.type==='selfCheck';return <button key={req.id} type="button" disabled={!manual} onClick={()=>manual&&toggleManual(req.id)} className={`flex min-h-12 items-start gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-bold ${req.passed?'border-emerald-100 bg-emerald-50 text-emerald-800':'border-slate-200 bg-slate-50 text-slate-600'} ${manual?'cursor-pointer hover:border-blue-200':'cursor-default'}`}><span className="mt-0.5">{req.passed?<CheckCircle2 className="h-4 w-4 text-emerald-600"/>:<Circle className="h-4 w-4 text-slate-400"/>}</span><span>{req.labelVi}{req.detail&&<span className="ml-1 text-[10px] text-slate-400">({req.detail})</span>}{manual&&<span className="mt-1 block text-[10px] font-semibold text-slate-400">Tự kiểm tra · chạm để xác nhận</span>}</span></button>})}</div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={!evaluation.passed} onClick={submit} className="pressable min-h-11 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Tôi đã viết xong</button><span className="text-xs font-bold text-slate-400">{splitNonEmptyLines(value).length} dòng · {wordCount(value)} từ</span></div>
    {!evaluation.passed&&<p className="mt-3 text-xs font-semibold text-amber-800">Hoàn thành từng mục phía trên trước khi tiếp tục. Bunny chỉ tự chấm những điều có thể kiểm tra đáng tin cậy.</p>}
    {submitted&&<div aria-live="polite" className="success-pop mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><strong>Tốt lắm.</strong> Bản nháp đã được lưu và các yêu cầu Foundation đã được kiểm tra riêng từng mục.</div>}
  </div>
}

function ReviewStep({step,state,onStateChange,onReviewRating}){
  const [open,setOpen]=useState(state.open||{});const [ratings,setRatings]=useState(state.ratings||{})
  const reveal=i=>{const next={...open,[i]:true};setOpen(next);onStateChange?.({open:next,ratings,completed:Object.keys(ratings).length===step.items.length})}
  const rate=(i,rating)=>{const next={...ratings,[i]:rating};setRatings(next);const completed=Object.keys(next).length===step.items.length;onStateChange?.({open,ratings:next,completed});onReviewRating?.({itemIndex:i,question:step.items[i][0],answer:step.items[i][1],rating})}
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-emerald-700"><BookOpen className="h-3.5 w-3.5"/>REVIEW</div><h2 className="mt-4 text-3xl font-black">Kiểm tra trí nhớ</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tự trả lời trong đầu trước. Sau khi mở đáp án, đánh giá trí nhớ để Bunny lên lịch ôn lại.</p><div className="mt-6 space-y-3">{step.items.map(([q,a],i)=><div key={i} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-4"><span className="font-extrabold text-slate-900">{q}</span>{!open[i]&&<button onClick={()=>reveal(i)} className="pressable min-h-10 rounded-xl bg-blue-50 px-3 text-xs font-black text-blue-700">Xem đáp án</button>}</div>{open[i]&&<><p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-emerald-800">{a}</p><div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={`Đánh giá trí nhớ cho ${q}`}><RatingButton active={ratings[i]===0} onClick={()=>rate(i,0)}>Chưa nhớ</RatingButton><RatingButton active={ratings[i]===0.5} onClick={()=>rate(i,0.5)}>Gần đúng</RatingButton><RatingButton active={ratings[i]===1} onClick={()=>rate(i,1)}>Nhớ rồi</RatingButton></div></>}</div>)}</div><p className="mt-4 text-xs font-bold text-slate-400">Đã đánh giá {Object.keys(ratings).length}/{step.items.length} thẻ.</p></div>
}
function RatingButton({active,onClick,children}){return <button onClick={onClick} className={`pressable min-h-11 rounded-xl border px-2 text-[11px] font-black ${active?'border-blue-500 bg-blue-50 text-blue-700':'border-slate-200 bg-white text-slate-600'}`}>{children}</button>}
