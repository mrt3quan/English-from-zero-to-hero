import React, { useMemo, useRef, useState } from 'react'
import { BookOpen, Brain, CheckCircle2, Circle, Eye, Languages, Lightbulb, Network, Volume2, Gauge, ChevronDown, Headphones, Mic, RotateCcw, Sparkles } from 'lucide-react'
import ExerciseRenderer from './ExerciseRenderer'
import Mascot from '../Mascot'
import { AudioService } from '../../lib/audioService'
import { SpeechService, scoreTranscript } from '../../lib/speechService'
import { evaluateProduction, getRequirements, splitNonEmptyLines, wordCount } from '../../lib/productionValidator'

const kindMeta={
  discover:{label:'KHÁM PHÁ',icon:Eye,cls:'text-blue-700 bg-blue-50 border-blue-100'},
  notice:{label:'NHẬN RA MẪU',icon:Sparkles,cls:'text-violet-700 bg-violet-50 border-violet-100'},
  understand:{label:'HIỂU VÌ SAO',icon:Brain,cls:'text-emerald-700 bg-emerald-50 border-emerald-100'},
  visualize:{label:'NHÌN CẤU TRÚC',icon:Network,cls:'text-violet-700 bg-violet-50 border-violet-100'},
  compare:{label:'SO VỚI TIẾNG VIỆT',icon:Languages,cls:'text-amber-800 bg-amber-50 border-amber-100'},
}

export default function StepRenderer({step,stepState={},onStepStateChange,onExerciseResult,onReviewRating}){
  const state={...stepState,stepKey:stepState.stepKey||step.id||step.promptVi||step.title}
  if(step.type==='exercise') return <ExerciseRenderer step={step} initialState={state} onStateChange={onStepStateChange} onResult={onExerciseResult}/>
  if(step.type==='listen') return <ListenStep step={step} state={state} onStateChange={onStepStateChange}/>
  if(step.type==='speak') return <SpeakStep step={step} state={state} onStateChange={onStepStateChange} onResult={onExerciseResult}/>
  if(step.type==='production') return <ProductionStep step={step} state={state} onStateChange={onStepStateChange}/>
  if(step.type==='review') return <ReviewStep step={step} state={state} onStateChange={onStepStateChange} onReviewRating={onReviewRating}/>
  return <ContentStep step={step}/>
}

function AudioButtons({text,onPlayed}){
  const play=speed=>{const ok=AudioService.speak(text,{speed}); if(ok) onPlayed?.(speed)}
  return <div className="flex shrink-0 items-center gap-1.5"><button onClick={()=>play('normal')} className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 text-[11px] font-black text-blue-700" aria-label={`Nghe tốc độ bình thường: ${text}`}><Volume2 className="h-4 w-4"/> Nghe</button><button onClick={()=>play('slow')} className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 text-[11px] font-black text-slate-600" aria-label={`Nghe chậm: ${text}`}><Gauge className="h-4 w-4"/> Chậm</button></div>
}

function ContentStep({step}){
  const meta=kindMeta[step.kind]||kindMeta.understand;const Icon=meta.icon
  const cue={
    discover:'Nhìn ví dụ trước. Chưa cần học quy tắc — bạn nhận ra điều gì?',
    notice:'So sánh hai ví dụ. Chi tiết nào thay đổi, và chi tiết nào giữ nguyên?',
    understand:'Bây giờ mới đặt tên cho điều bạn vừa nhận ra.',
    visualize:'Đừng học thuộc ký hiệu — nhìn xem các phần nối với nhau thế nào.',
    compare:'So sánh để tránh dịch từng chữ từ tiếng Việt.',
  }[step.kind]
  const examples=<ExampleList examples={step.examples} speak={step.speak}/>
  return <div className="content-scene">
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[.12em] ${meta.cls}`}><Icon className="h-3.5 w-3.5"/>{meta.label}</div>
    <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-3xl">{step.title}</h2>
    {cue&&<p className="scene-cue mt-3 text-sm font-semibold">{cue}</p>}
    {(step.kind==='discover'||step.kind==='notice')&&examples}
    <p className="mt-4 max-w-3xl text-[15px] font-medium leading-7 text-slate-600">{step.bodyVi}</p>
    {step.callout&&<div className="key-idea mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-950"><span className="mr-2">💡</span>{step.callout}</div>}
    {step.kind!=='discover'&&step.kind!=='notice'&&examples}
    {step.chips&&<div className="mt-5 flex flex-wrap gap-2">{step.chips.map(chip=><span key={chip} className="lesson-chip rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">{chip}</span>)}</div>}
    {step.tokenRoles&&<div className="mt-5 flex flex-wrap gap-3">{step.tokenRoles.map((t,i)=><div key={i} className="token-role rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center"><div className="english-example text-lg font-extrabold text-slate-900">{t.text}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">{t.role}</div></div>)}</div>}
    {step.conceptMap&&<ConceptMap nodes={step.conceptMap}/>} 
  </div>
}

function ExampleList({examples,speak}){
  if(!examples?.length)return null
  return <div className="mt-5 grid gap-2.5">{examples.map((ex,i)=><div key={i} className="example-row flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><span className="english-example text-base font-extrabold text-slate-900">{ex}</span><AudioButtons text={speak?.[i] || ex}/></div>)}</div>
}

function ListenStep({step,state,onStateChange}){
  const targets=step.targets?.length?step.targets:[step.target].filter(Boolean)
  const [played,setPlayed]=useState(state.played||{})
  const play=(text,index,speed)=>{
    const ok=AudioService.speak(text,{speed})
    if(!ok)return
    const next={...played,[index]:true};setPlayed(next)
    onStateChange?.({played:next,completed:Object.keys(next).length>=Math.min(targets.length,step.requiredPlays||1)})
  }
  const complete=Object.keys(played).length>=Math.min(targets.length,step.requiredPlays||1)
  return <div className="content-scene">
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold tracking-[.12em] text-blue-700"><Headphones className="h-3.5 w-3.5"/>NGHE</div>
    <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-3xl">Nghe trước khi nói</h2>
    <p className="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-slate-600">{step.promptVi||'Nghe câu ở tốc độ bình thường. Nếu cần, nghe chậm rồi quay lại tốc độ bình thường.'}</p>
    {step.focusVi&&<div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">🎧 {step.focusVi}</div>}
    <div className="mt-5 space-y-3">{targets.map((text,index)=><div key={`${text}-${index}`} className={`rounded-2xl border p-4 ${played[index]?'border-emerald-200 bg-emerald-50':'border-slate-200 bg-white'}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="english-example text-lg font-extrabold text-slate-900">{text}</div><div className="flex gap-2"><button onClick={()=>play(text,index,'normal')} className="pressable inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white"><Volume2 className="h-4 w-4"/> Normal</button><button onClick={()=>play(text,index,'slow')} className="pressable inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"><Gauge className="h-4 w-4"/> Chậm</button></div></div>{played[index]&&<p className="mt-2 text-xs font-bold text-emerald-700">✓ Đã nghe</p>}</div>)}</div>
    {!AudioService.supported()&&<p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900">Thiết bị này không hỗ trợ phát giọng nói trong trình duyệt. Bạn vẫn có thể đọc ví dụ thành tiếng.</p>}
    {complete&&<p className="mt-4 text-xs font-bold text-emerald-700">Đã nghe. Tiếp theo: thử nói lại bằng giọng của bạn.</p>}
  </div>
}

function SpeakStep({step,state,onStateChange,onResult}){
  const [listening,setListening]=useState(false)
  const [transcript,setTranscript]=useState(state.transcript||'')
  const [analysis,setAnalysis]=useState(state.analysis||null)
  const [error,setError]=useState('')
  const controller=useRef(null)
  const supported=SpeechService.supported()
  const target=step.target

  const start=()=>{
    setError('');setListening(true)
    controller.current=SpeechService.listen({
      locale:step.locale||'en-US',
      onResult:({transcript:heard})=>{
        const scored=scoreTranscript(heard,target)
        setTranscript(heard);setAnalysis(scored);setListening(false)
        onStateChange?.({completed:true,attempted:true,transcript:heard,analysis:scored})
        onResult?.({answer:heard,expected:target,correct:scored.exact||scored.score>=0.8,responseTimeMs:null})
      },
      onError:message=>{setError(message==='not-allowed'?'Microphone đang bị chặn. Hãy cấp quyền microphone hoặc dùng chế độ tự luyện.':'Không nghe rõ. Bạn có thể thử lại hoặc dùng chế độ tự luyện.');setListening(false)},
      onEnd:()=>setListening(false),
    })
    if(!controller.current.started)setListening(false)
  }
  const manual=()=>{onStateChange?.({completed:true,attempted:true,manualPractice:true,transcript:''});setError('')}
  const retry=()=>{setTranscript('');setAnalysis(null);setError('');onStateChange?.({completed:false,attempted:state.attempted||false,transcript:'',analysis:null});start()}

  return <div className="content-scene">
    <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[10px] font-bold tracking-[.12em] text-rose-700"><Mic className="h-3.5 w-3.5"/>NÓI</div>
    <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-3xl">Nói lại bằng giọng của bạn</h2>
    <p className="mt-3 text-[15px] font-medium leading-7 text-slate-600">{step.promptVi||'Nghe mẫu nếu cần, sau đó nói cả câu. Bunny dùng nhận dạng giọng nói để kiểm tra từ nghe được — đây chưa phải là chấm phát âm theo từng âm.'}</p>
    <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Mục tiêu</p><p className="english-example mt-1 text-xl font-extrabold text-slate-900">{target}</p>{step.focusVi&&<p className="mt-2 text-xs font-semibold text-violet-700">👄 {step.focusVi}</p>}</div><AudioButtons text={target}/></div></div>
    <div className="mt-5 flex flex-wrap gap-3">{supported?<button onClick={listening?()=>controller.current?.stop():start} className={`pressable inline-flex min-h-[52px] items-center gap-2 rounded-2xl px-5 text-sm font-bold text-white ${listening?'bg-rose-600':'bg-blue-600'}`}><Mic className="h-5 w-5"/>{listening?'Đang nghe… chạm để dừng':'Bắt đầu nói'}</button>:<button onClick={manual} className="pressable inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white"><Mic className="h-5 w-5"/> Tôi đã nói thành tiếng</button>}{(transcript||state.completed)&&<button onClick={retry} className="pressable inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"><RotateCcw className="h-4 w-4"/> Thử lại</button>}</div>
    {!supported&&<p className="mt-3 text-xs font-semibold leading-5 text-slate-500">Trình duyệt này chưa hỗ trợ SpeechRecognition. Bài học vẫn hoạt động: nghe mẫu, nói thành tiếng, rồi tự xác nhận. Không cần API để dùng chế độ cơ bản.</p>}
    {error&&<p aria-live="polite" className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-semibold text-amber-900">{error}</p>}
    {transcript&&<div aria-live="polite" className={`mt-4 rounded-2xl border p-4 ${analysis?.exact?'border-emerald-200 bg-emerald-50':'border-blue-100 bg-blue-50'}`}><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Bunny nghe được</p><p className="mt-1 text-lg font-extrabold text-slate-900">“{transcript}”</p>{analysis?.exact?<p className="mt-2 text-sm font-bold text-emerald-700">✓ Các từ khớp với câu mục tiêu.</p>:<p className="mt-2 text-sm font-semibold leading-6 text-blue-900">Gần rồi. So sánh từ Bunny nghe được với câu mẫu và thử lại nếu muốn.{analysis?.missing?.length?` Có thể chú ý: ${analysis.missing.join(', ')}.`:''}</p>}<p className="mt-2 text-[11px] font-medium leading-5 text-slate-500">Lưu ý: speech-to-text chỉ cho biết từ hệ thống nghe được; nó không thể đánh giá chính xác từng âm /s/, /z/, /t/… như một dịch vụ pronunciation assessment chuyên dụng.</p></div>}
    {state.completed&&!transcript&&<p className="mt-4 text-xs font-bold text-emerald-700">✓ Đã luyện nói thành tiếng.</p>}
  </div>
}

const viLabels={Noun:'Danh từ',Article:'Mạo từ',Adjective:'Tính từ',Verb:'Động từ',Adverb:'Trạng từ',Pronoun:'Đại từ',Preposition:'Giới từ',Conjunction:'Liên từ',Quantifier:'Từ chỉ lượng'}
const nodeExplainers={Noun:'Tên của người, nơi, vật hoặc ý tưởng.',Article:'Đứng trước danh từ để giúp xác định cách ta nói về danh từ đó.',Adjective:'Mô tả danh từ: nó như thế nào?',Verb:'Cho biết hành động hoặc trạng thái.',Adverb:'Bổ sung cách, thời gian hoặc mức độ cho hành động.',Pronoun:'Thay cho noun/noun group để tránh lặp.',Preposition:'Cho biết quan hệ về nơi chốn, thời gian hoặc hướng.',Conjunction:'Nối từ, cụm từ hoặc ý.',Quantifier:'Cho biết số lượng hoặc lượng.'}
function ConceptMap({nodes}){
  const [selected,setSelected]=useState(nodes[0])
  const points=useMemo(()=>nodes.map((node,i)=>{const angle=(-90+(360/nodes.length)*i)*Math.PI/180;return{node,x:50+Math.cos(angle)*39,y:50+Math.sin(angle)*40}}),[nodes])
  return <div className="concept-map-surface mt-6 overflow-hidden rounded-[28px] p-4 sm:p-6">
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/85 p-3"><Mascot size={68} mood="explaining" withBook/><div><p className="text-sm font-black text-slate-900">Một quả táo có thể làm bao nhiêu “công việc” trong câu?</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-500">“Chạm từng nhánh. Mỗi lần chỉ cần hiểu một công việc thôi!”</p></div></div>
    <div className="sm:hidden"><div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-lg"><div><div className="text-4xl">🍎</div><div className="text-xs font-black text-red-700">apple</div><div className="text-[9px] font-bold text-slate-400">ví dụ đang phân tích</div></div></div><div className="space-y-2">{nodes.map(node=><button key={node.label} onClick={()=>setSelected(selected?.label===node.label?null:node)} className="concept-node w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-blue-700">{node.label} <span className="font-bold text-slate-400">· {node.labelVi||viLabels[node.label]}</span></p><p className="mt-1 english-example text-sm font-extrabold text-slate-900">{node.example}</p></div><ChevronDown className={`h-4 w-4 text-slate-400 transition ${selected?.label===node.label?'rotate-180':''}`}/></div>{selected?.label===node.label&&<p className="mt-3 border-t border-slate-100 pt-3 text-xs font-semibold leading-5 text-slate-600">{node.explanationVi||nodeExplainers[node.label]}</p>}</button>)}</div></div>
    <div className="relative hidden h-[590px] sm:block" aria-label="Bản đồ 9 nhóm từ cốt lõi"><svg className="absolute inset-0 h-full w-full" aria-hidden="true"><g className="concept-lines" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6">{points.map(({x,y},i)=><line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}/>)}</g></svg><div className="absolute left-1/2 top-1/2 z-10 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-xl"><div><div className="text-5xl">🍎</div><div className="text-sm font-black text-red-700">apple</div><div className="text-[9px] font-bold text-slate-400">ví dụ trung tâm</div></div></div>{points.map(({node,x,y})=><button key={node.label} onClick={()=>setSelected(node)} style={{left:`${x}%`,top:`${y}%`}} className={`concept-node absolute z-20 w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-3 text-center shadow-sm ${selected?.label===node.label?'border-blue-400 ring-4 ring-blue-100':'border-slate-200'}`}><p className="text-xs font-black text-blue-700">{node.label}</p><p className="text-[10px] font-bold text-slate-400">{node.labelVi||viLabels[node.label]}</p><p className="mt-1 english-example text-sm font-extrabold text-slate-900">{node.example}</p></button>)}</div>
    {selected&&<div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-violet-700">{selected.label} · {selected.labelVi||viLabels[selected.label]}</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{selected.explanationVi||nodeExplainers[selected.label]}</p></div>}
  </div>
}

function ProductionStep({step,state,onStateChange}){
  const [value,setValue]=useState(state.value||'');const [manualChecks,setManualChecks]=useState(state.manualChecks||{});const [submitted,setSubmitted]=useState(!!state.completed)
  const evaluation=useMemo(()=>evaluateProduction(step,value,manualChecks),[step,value,manualChecks])
  const changeValue=next=>{setValue(next);setSubmitted(false);onStateChange?.({value:next,manualChecks,completed:false,passed:evaluateProduction(step,next,manualChecks).passed})}
  const toggleManual=id=>{const next={...manualChecks,[id]:!manualChecks[id]};setManualChecks(next);setSubmitted(false);onStateChange?.({value,manualChecks:next,completed:false,passed:evaluateProduction(step,value,next).passed})}
  const submit=()=>{if(!evaluation.passed)return;setSubmitted(true);onStateChange?.({value,manualChecks,completed:true,passed:true,submittedAt:new Date().toISOString()})}
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-amber-800"><Lightbulb className="h-3.5 w-3.5"/>TỰ VIẾT</div><h2 className="mt-4 text-[28px] font-extrabold tracking-tight">Tạo câu của chính bạn</h2><p className="mt-3 text-[15px] font-medium leading-7 text-slate-600">{step.promptVi}</p>
    <label htmlFor="production-draft" className="sr-only">Bài viết của bạn</label><textarea id="production-draft" value={value} onChange={e=>changeValue(e.target.value)} rows={step.masteryProject?12:6} placeholder={step.placeholder} className="mt-6 w-full resize-y rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{evaluation.requirements.map(req=>{const manual=req.type==='selfCheck';return <button key={req.id} type="button" disabled={!manual} onClick={()=>manual&&toggleManual(req.id)} className={`flex min-h-12 items-start gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-bold ${req.passed?'border-emerald-100 bg-emerald-50 text-emerald-800':'border-slate-200 bg-slate-50 text-slate-600'} ${manual?'cursor-pointer hover:border-blue-200':'cursor-default'}`}><span className="mt-0.5">{req.passed?<CheckCircle2 className="h-4 w-4 text-emerald-600"/>:<Circle className="h-4 w-4 text-slate-400"/>}</span><span>{req.labelVi}{req.detail&&<span className="ml-1 text-[10px] text-slate-400">({req.detail})</span>}{manual&&<span className="mt-1 block text-[10px] font-semibold text-slate-400">Tự kiểm tra · chạm để xác nhận</span>}</span></button>})}</div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={!evaluation.passed} onClick={submit} className="pressable min-h-11 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Tôi đã viết xong</button><span className="text-xs font-bold text-slate-400">{splitNonEmptyLines(value).length} dòng · {wordCount(value)} từ</span></div>
    {!evaluation.passed&&<p className="mt-3 text-xs font-semibold text-amber-800">Hoàn thành từng mục phía trên trước khi tiếp tục. Bunny chỉ tự chấm những điều có thể kiểm tra đáng tin cậy.</p>}
    {submitted&&<div aria-live="polite" className="success-pop mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><strong>Tốt lắm.</strong> Bản nháp đã được lưu. Nếu bạn sai ở phần luyện tập, Bunny sẽ đưa lỗi đó trở lại Practice sau.</div>}
  </div>
}

function ReviewStep({step,state,onStateChange,onReviewRating}){
  const [open,setOpen]=useState(state.open||{});const [ratings,setRatings]=useState(state.ratings||{})
  const reveal=i=>{const next={...open,[i]:true};setOpen(next);onStateChange?.({open:next,ratings,completed:Object.keys(ratings).length===step.items.length})}
  const rate=(i,rating)=>{const next={...ratings,[i]:rating};setRatings(next);const completed=Object.keys(next).length===step.items.length;onStateChange?.({open,ratings:next,completed});onReviewRating?.({itemIndex:i,question:step.items[i][0],answer:step.items[i][1],rating})}
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-emerald-700"><BookOpen className="h-3.5 w-3.5"/>ÔN LẠI</div><h2 className="mt-4 text-[28px] font-extrabold">Nhớ lại — không nhìn đáp án trước</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tự trả lời trong đầu trước. Sau khi mở đáp án, đánh giá trí nhớ. Câu bạn quên hoặc làm sai sẽ quay lại trong Practice theo lịch ôn.</p><div className="mt-6 space-y-3">{step.items.map(([q,a],i)=><div key={i} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-4"><span className="font-extrabold text-slate-900">{q}</span>{!open[i]&&<button onClick={()=>reveal(i)} className="pressable min-h-10 rounded-xl bg-blue-50 px-3 text-xs font-black text-blue-700">Tôi đã nghĩ xong</button>}</div>{open[i]&&<><p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-emerald-800">{a}</p><div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={`Đánh giá trí nhớ cho ${q}`}><RatingButton active={ratings[i]===0} onClick={()=>rate(i,0)}>Chưa nhớ</RatingButton><RatingButton active={ratings[i]===0.5} onClick={()=>rate(i,0.5)}>Gần đúng</RatingButton><RatingButton active={ratings[i]===1} onClick={()=>rate(i,1)}>Nhớ rồi</RatingButton></div></>}</div>)}</div><p className="mt-4 text-xs font-bold text-slate-400">Đã đánh giá {Object.keys(ratings).length}/{step.items.length} thẻ.</p></div>
}
function RatingButton({active,onClick,children}){return <button onClick={onClick} className={`pressable min-h-11 rounded-xl border px-2 text-[11px] font-black ${active?'border-blue-500 bg-blue-50 text-blue-700':'border-slate-200 bg-white text-slate-600'}`}>{children}</button>}
