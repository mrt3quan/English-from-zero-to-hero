import React, { useMemo, useState } from 'react'
import { BookOpen, Brain, CheckCircle2, Eye, Languages, Lightbulb, Network, PlayCircle, Volume2 } from 'lucide-react'
import ExerciseRenderer from './ExerciseRenderer'

const kindMeta = {
  discover: { label: 'DISCOVER', icon: Eye, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
  understand: { label: 'UNDERSTAND', icon: Brain, cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  visualize: { label: 'VISUALIZE', icon: Network, cls: 'text-violet-700 bg-violet-50 border-violet-100' },
  compare: { label: 'COMPARE', icon: Languages, cls: 'text-orange-700 bg-orange-50 border-orange-100' },
}

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.88
  window.speechSynthesis.speak(u)
}

export default function StepRenderer({ step, onExerciseResult, onProductionValid }) {
  if (step.type === 'exercise') return <ExerciseRenderer step={step} onResult={onExerciseResult}/>
  if (step.type === 'production') return <ProductionStep step={step} onValid={onProductionValid}/>
  if (step.type === 'review') return <ReviewStep step={step}/>
  return <ContentStep step={step}/>
}

function ContentStep({ step }) {
  const meta = kindMeta[step.kind] || kindMeta.understand
  const Icon = meta.icon
  return <div>
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black tracking-[.14em] ${meta.cls}`}><Icon className="h-3.5 w-3.5"/>{meta.label}</div>
    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">{step.title}</h2>
    <p className="mt-3 max-w-3xl text-[15px] font-medium leading-7 text-slate-600">{step.bodyVi}</p>
    {step.callout && <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-black text-blue-900">{step.callout}</div>}
    {step.examples && <div className="mt-6 grid gap-3 sm:grid-cols-2">{step.examples.map((ex,i)=><div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="text-base font-extrabold text-slate-800">{ex}</span><button onClick={()=>speak(ex.replace(/[✓✗→]/g,' '))} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600" aria-label={`Listen to ${ex}`}><Volume2 className="h-4 w-4"/></button></div>)}</div>}
    {step.chips && <div className="mt-6 flex flex-wrap gap-2">{step.chips.map(chip=><span key={chip} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 shadow-sm">{chip}</span>)}</div>}
    {step.tokenRoles && <div className="mt-6 flex flex-wrap gap-3">{step.tokenRoles.map((t,i)=><div key={i} className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center shadow-sm"><div className="text-lg font-black text-slate-900">{t.text}</div><div className="mt-1 text-[10px] font-black uppercase tracking-wider text-blue-600">{t.role}</div></div>)}</div>}
    {step.conceptMap && <ConceptMap nodes={step.conceptMap}/>} 
  </div>
}

function ConceptMap({ nodes }) {
  return <div className="mt-6 rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-orange-50/60 p-5 sm:p-7">
    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-lg"><div><div className="text-3xl">🍎</div><div className="text-xs font-black text-red-600">APPLE</div></div></div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{nodes.map(node=><div key={node.label} className="rounded-2xl border border-white bg-white/90 p-3 text-center shadow-sm"><div className="text-xs font-black uppercase tracking-wider text-blue-600">{node.label}</div><div className="mt-1 text-sm font-extrabold text-slate-800">{node.example}</div></div>)}</div>
  </div>
}

function ProductionStep({ step, onValid }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const lines = value.split('\n').map(x=>x.trim()).filter(Boolean)
  const words = value.trim().split(/\s+/).filter(Boolean)
  const valid = words.length >= (step.minWords || 1) && lines.length >= (step.minLines || 1)
  const submit = () => { if (!valid) return; setSubmitted(true); onValid?.(true) }
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-amber-700"><Lightbulb className="h-3.5 w-3.5"/>PRODUCE</div><h2 className="mt-4 text-3xl font-black tracking-tight">Tự tạo tiếng Anh</h2><p className="mt-3 text-[15px] font-medium leading-7 text-slate-600">{step.promptVi}</p>
    <textarea value={value} onChange={e=>{setValue(e.target.value);setSubmitted(false)}} rows={step.masteryProject ? 12 : 6} placeholder={step.placeholder} className="mt-6 w-full resize-y rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{step.checks.map(c=><div key={c} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600"><CheckCircle2 className={`h-4 w-4 ${valid ? 'text-emerald-500' : 'text-slate-300'}`}/>{c}</div>)}</div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={!valid} onClick={submit} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Tôi đã viết xong</button><span className="text-xs font-bold text-slate-400">{lines.length} dòng · {words.length} từ</span></div>
    {submitted && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><strong>Tốt.</strong> Engine đã ghi nhận phần production. Ở giai đoạn AI Tutor sau này, chính khối này sẽ gửi bài viết đến feedback service thay vì tự động viết lại cho bạn.</div>}
  </div>
}

function ReviewStep({ step }) {
  const [open, setOpen] = useState({})
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-emerald-700"><BookOpen className="h-3.5 w-3.5"/>REVIEW</div><h2 className="mt-4 text-3xl font-black">Kiểm tra trí nhớ</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tự trả lời trước, rồi mở đáp án. Đây là retrieval practice, không phải chỉ đọc lại.</p><div className="mt-6 space-y-3">{step.items.map(([q,a],i)=><button key={i} onClick={()=>setOpen(v=>({...v,[i]:!v[i]}))} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"><div className="flex items-center justify-between gap-4"><span className="font-extrabold text-slate-800">{q}</span><span className="text-xs font-black text-blue-600">{open[i] ? 'Ẩn' : 'Xem đáp án'}</span></div>{open[i] && <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-emerald-700">{a}</p>}</button>)}</div></div>
}
