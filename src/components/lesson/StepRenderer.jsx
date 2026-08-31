import React, { useMemo, useState } from 'react'
import { BookOpen, Brain, CheckCircle2, Circle, Eye, Languages, Lightbulb, Network, ShieldCheck, Volume2 } from 'lucide-react'
import ExerciseRenderer from './ExerciseRenderer'
import { evaluateProduction } from '../../lib/productionValidation'

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
  u.lang = 'en-US'
  u.rate = 0.88
  window.speechSynthesis.speak(u)
}

export default function StepRenderer({ step, stepState, productionDraft, onExerciseResult, onProductionState, onProductionDraft }) {
  if (step.type === 'exercise') return <ExerciseRenderer step={step} state={stepState} onResult={onExerciseResult}/>
  if (step.type === 'production') return <ProductionStep step={step} existingState={stepState} initialValue={productionDraft || ''} onState={onProductionState} onDraft={onProductionDraft}/>
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

const mapPositions = [
  ['50%','5%'], ['79%','15%'], ['90%','42%'], ['82%','72%'], ['58%','84%'],
  ['31%','84%'], ['9%','67%'], ['8%','31%'], ['27%','11%'],
]

function ConceptMap({ nodes }) {
  const [active, setActive] = useState(0)
  return <div className="mt-6 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-orange-50/60 p-4 sm:p-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-blue-600">Bản đồ kết nối</p><p className="mt-1 text-sm font-semibold text-slate-500">Chạm từng nhánh để xem một từ có thể đổi vai trò trong câu như thế nào.</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">{active + 1}/{nodes.length}</span></div>
    <div className="relative hidden h-[470px] sm:block">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.map((_, i) => {
          const [left, top] = mapPositions[i % mapPositions.length]
          return <line key={i} x1="50" y1="50" x2={parseFloat(left)} y2={parseFloat(top)} stroke={i === active ? '#3b82f6' : '#cbd5e1'} strokeWidth={i === active ? '0.8' : '0.45'} strokeDasharray={i === active ? '0' : '2 2'}/>
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 z-10 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-red-50 text-center shadow-xl"><div><div className="text-4xl">🍎</div><div className="text-xs font-black text-red-600">APPLE</div></div></div>
      {nodes.map((node, i) => {
        const [left, top] = mapPositions[i % mapPositions.length]
        const selected = i === active
        return <button key={`${node.label}-${i}`} onClick={()=>setActive(i)} style={{left, top}} className={`absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-3 text-center shadow-sm transition ${selected ? 'scale-105 border-blue-300 bg-blue-50 ring-4 ring-blue-100' : 'border-white bg-white/95 hover:border-blue-200'}`}><div className={`text-[10px] font-black uppercase tracking-wider ${selected ? 'text-blue-700' : 'text-slate-400'}`}>{node.label}</div><div className="mt-1 text-sm font-extrabold text-slate-800">{node.example}</div></button>
      })}
    </div>
    <div className="grid gap-2 sm:hidden">{nodes.map((node,i)=><button key={`${node.label}-${i}`} onClick={()=>setActive(i)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${i===active?'border-blue-300 bg-blue-50':'border-slate-200 bg-white'}`}><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm shadow-sm">🍎</span><div><div className="text-[10px] font-black uppercase tracking-wider text-blue-600">{node.label}</div><div className="text-sm font-extrabold text-slate-800">{node.example}</div></div></button>)}</div>
  </div>
}

function ProductionStep({ step, existingState, initialValue, onState, onDraft }) {
  const [value, setValue] = useState(initialValue)
  const [submitted, setSubmitted] = useState(!!existingState?.passed)
  const [manualChecks, setManualChecks] = useState(existingState?.manualChecks || {})
  const evaluation = useMemo(() => evaluateProduction(value, step, manualChecks), [value, step, manualChecks])

  const updateValue = next => {
    setValue(next)
    setSubmitted(false)
    onDraft?.(next)
    onState?.({ passed: false, evaluation: evaluateProduction(next, step, manualChecks), submitted: false, manualChecks })
  }

  const toggleManual = index => {
    const next = { ...manualChecks, [index]: !manualChecks[index] }
    setManualChecks(next)
    const nextEval = evaluateProduction(value, step, next)
    setSubmitted(false)
    onState?.({ passed: false, evaluation: nextEval, submitted: false, manualChecks: next })
  }

  const submit = () => {
    if (!evaluation.passed) return
    setSubmitted(true)
    onState?.({ passed: true, evaluation, submitted: true, manualChecks })
  }

  return <div>
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-amber-700"><Lightbulb className="h-3.5 w-3.5"/>PRODUCE</div>
    <h2 className="mt-4 text-3xl font-black tracking-tight">Tự tạo tiếng Anh</h2>
    <p className="mt-3 text-[15px] font-medium leading-7 text-slate-600">{step.promptVi}</p>
    <textarea value={value} onChange={e=>updateValue(e.target.value)} rows={step.masteryProject ? 12 : 6} placeholder={step.placeholder} className="mt-6 w-full resize-y rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold leading-7 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>

    <div className="mt-4 grid gap-2 sm:grid-cols-2">{evaluation.checks.map((check, index)=><button type="button" key={`${check.label}-${index}`} onClick={()=>check.manual && toggleManual(index)} className={`flex items-start gap-2 rounded-2xl border px-3 py-3 text-left text-xs font-bold ${check.passed ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : check.manual ? 'border-amber-100 bg-amber-50 text-amber-900' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
      {check.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"/> : <Circle className={`mt-0.5 h-4 w-4 shrink-0 ${check.manual ? 'text-amber-400' : 'text-slate-300'}`}/>}<span className="flex-1">{check.label}{check.manual && <span className="mt-1 block text-[10px] font-black uppercase tracking-wider opacity-60">Tự kiểm tra · chạm để xác nhận</span>}</span>
    </button>)}</div>

    <div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={!evaluation.passed} onClick={submit} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Kiểm tra phần tự viết</button><span className="text-xs font-bold text-slate-400">{evaluation.stats.lines} dòng · {evaluation.stats.words} từ</span></div>
    {!evaluation.passed && value.trim() && <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">Các dấu ✓ bên trên là điều kiện thật. Những mục mang nhãn “Tự kiểm tra” là yêu cầu về ý nghĩa mà bản kiểm tra cục bộ chưa nên đoán thay bạn.</p>}
    {submitted && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><div className="flex gap-2"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0"/><div><strong>Đạt yêu cầu production.</strong> Bạn đã tự tạo câu và vượt qua các kiểm tra của bài. AI feedback sau này có thể phân tích sâu hơn, nhưng app không giả vờ rằng heuristic cục bộ hiểu mọi câu tiếng Anh.</div></div></div>}
  </div>
}

function ReviewStep({ step }) {
  const [open, setOpen] = useState({})
  return <div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-emerald-700"><BookOpen className="h-3.5 w-3.5"/>REVIEW</div><h2 className="mt-4 text-3xl font-black">Kiểm tra trí nhớ</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tự trả lời trước, rồi mở đáp án. Đây là retrieval practice, không phải chỉ đọc lại.</p><div className="mt-6 space-y-3">{step.items.map(([q,a],i)=><button key={i} onClick={()=>setOpen(v=>({...v,[i]:!v[i]}))} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"><div className="flex items-center justify-between gap-4"><span className="font-extrabold text-slate-800">{q}</span><span className="text-xs font-black text-blue-600">{open[i] ? 'Ẩn' : 'Xem đáp án'}</span></div>{open[i] && <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-emerald-700">{a}</p>}</button>)}</div></div>
}
