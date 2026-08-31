import React, { useEffect, useMemo, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'

const normalize = (v) => String(v ?? '').trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+([?.!,])/g, '$1').replace(/\s+/g, ' ')
const normalizeLoose = (v) => normalize(v).replace(/[?.!,]/g, '')

function Feedback({ correct, text }) {
  if (correct == null) return null
  return <div className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}><div className="flex gap-2"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${correct ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>{correct ? <Check className="h-4 w-4"/> : <X className="h-4 w-4"/>}</span><div><strong>{correct ? 'Đúng rồi.' : 'Chưa đúng.'}</strong> {text}</div></div></div>
}

export default function ExerciseRenderer({ step, onResult }) {
  if (step.exerciseType === 'choice') return <ChoiceExercise step={step} onResult={onResult}/>
  if (step.exerciseType === 'wordOrder') return <OrderExercise step={step} onResult={onResult}/>
  if (step.exerciseType === 'fillBlank') return <TextExercise step={step} onResult={onResult} mode="fill"/>
  if (step.exerciseType === 'errorFix') return <TextExercise step={step} onResult={onResult} mode="fix"/>
  if (step.exerciseType === 'identify') return <IdentifyExercise step={step} onResult={onResult}/>
  return <div>Exercise type not supported yet.</div>
}

function ChoiceExercise({ step, onResult }) {
  const [picked, setPicked] = useState(null)
  const [checked, setChecked] = useState(false)
  const correct = checked ? normalize(picked) === normalize(step.answer) : null
  useEffect(() => { setPicked(null); setChecked(false) }, [step])
  const check = () => { if (picked == null) return; const ok = normalize(picked) === normalize(step.answer); setChecked(true); onResult?.(ok) }
  return <ExerciseFrame step={step}>
    <div className="grid gap-3 sm:grid-cols-2">{step.options.map(opt => <button key={opt} onClick={() => !checked && setPicked(opt)} className={`rounded-2xl border p-4 text-left text-sm font-extrabold transition ${picked === opt ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'}`}>{opt}</button>)}</div>
    <ActionRow checked={checked} canCheck={picked != null} onCheck={check} onReset={() => { setPicked(null); setChecked(false) }}/>
    <Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function OrderExercise({ step, onResult }) {
  const [pool, setPool] = useState(step.tokens.map((text, i) => ({ id: i, text })))
  const [built, setBuilt] = useState([])
  const [checked, setChecked] = useState(false)
  useEffect(() => { setPool(step.tokens.map((text, i) => ({ id: i, text }))); setBuilt([]); setChecked(false) }, [step])
  const add = item => { if (checked) return; setBuilt(v => [...v, item]); setPool(v => v.filter(x => x.id !== item.id)) }
  const remove = item => { if (checked) return; setPool(v => [...v, item].sort((a,b)=>a.id-b.id)); setBuilt(v => v.filter(x => x.id !== item.id)) }
  const answer = built.map(x => x.text).join(' ')
  const correct = checked ? normalizeLoose(answer) === normalizeLoose(step.answer) : null
  const check = () => { if (!built.length) return; const ok = normalizeLoose(answer) === normalizeLoose(step.answer); setChecked(true); onResult?.(ok) }
  return <ExerciseFrame step={step}>
    <div className="min-h-20 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-3"><div className="flex flex-wrap gap-2">{built.length ? built.map(item => <button key={item.id} onClick={() => remove(item)} className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm">{item.text}</button>) : <span className="p-2 text-sm font-semibold text-slate-400">Chạm các từ bên dưới để xây câu…</span>}</div></div>
    <div className="mt-4 flex flex-wrap gap-2">{pool.map(item => <button key={item.id} onClick={() => add(item)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300">{item.text}</button>)}</div>
    <ActionRow checked={checked} canCheck={built.length === step.tokens.length} onCheck={check} onReset={() => { setPool(step.tokens.map((text,i)=>({id:i,text}))); setBuilt([]); setChecked(false) }}/>
    <Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function TextExercise({ step, onResult, mode }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  useEffect(() => { setValue(''); setChecked(false) }, [step])
  const accepted = Array.isArray(step.accepted) ? step.accepted : [step.answer]
  const correct = checked ? accepted.some(a => step.flexible ? normalizeLoose(value).includes(normalizeLoose(a).replace(/[?.!]/g,'')) : normalizeLoose(value) === normalizeLoose(a)) : null
  const check = () => { if (!value.trim()) return; const ok = accepted.some(a => step.flexible ? normalizeLoose(value).includes(normalizeLoose(a).replace(/[?.!]/g,'')) : normalizeLoose(value) === normalizeLoose(a)); setChecked(true); onResult?.(ok) }
  return <ExerciseFrame step={step}>
    {mode === 'fix' && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-red-500">Câu cần sửa</p><p className="mt-1 text-lg font-black text-slate-900">{step.incorrect}</p></div>}
    {mode === 'fill' && <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-lg font-black text-slate-800">{step.sentence}</div>}
    <input value={value} disabled={checked} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') check()}} placeholder={mode === 'fix' ? 'Viết câu đã sửa…' : 'Nhập đáp án…'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
    <ActionRow checked={checked} canCheck={!!value.trim()} onCheck={check} onReset={() => { setValue(''); setChecked(false) }}/>
    <Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function IdentifyExercise({ step, onResult }) {
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  useEffect(() => { setSelected([]); setChecked(false) }, [step])
  const toggle = i => { if (checked) return; if (step.multi) setSelected(v => v.includes(i) ? v.filter(x=>x!==i) : [...v,i]); else setSelected([i]) }
  const expected = [...step.answerIndexes].sort((a,b)=>a-b)
  const got = [...selected].sort((a,b)=>a-b)
  const correct = checked ? JSON.stringify(expected) === JSON.stringify(got) : null
  const check = () => { if (!selected.length) return; const ok = JSON.stringify(expected) === JSON.stringify(got); setChecked(true); onResult?.(ok) }
  return <ExerciseFrame step={step}>
    <div className="flex flex-wrap gap-2">{step.tokens.map((token,i)=><button key={`${token}-${i}`} onClick={()=>toggle(i)} className={`rounded-xl border px-3 py-2.5 text-sm font-extrabold ${selected.includes(i) ? 'border-violet-400 bg-violet-50 text-violet-800' : 'border-slate-200 bg-white text-slate-700'}`}>{token}</button>)}</div>
    <ActionRow checked={checked} canCheck={selected.length>0} onCheck={check} onReset={()=>{setSelected([]);setChecked(false)}}/>
    <Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function ExerciseFrame({ step, children }) {
  return <div><p className="text-xs font-black uppercase tracking-[.16em] text-violet-600">Luyện tập chủ động</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{step.promptVi}</h2><div className="mt-6">{children}</div></div>
}

function ActionRow({ checked, canCheck, onCheck, onReset }) {
  return <div className="mt-5 flex items-center gap-3">{!checked ? <button disabled={!canCheck} onClick={onCheck} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Kiểm tra</button> : <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"><RotateCcw className="h-4 w-4"/> Thử lại</button>}</div>
}
