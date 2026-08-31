import React, { useEffect, useRef, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { normalizeCase, validateTextAnswer, validateWordOrder } from '../../lib/textValidation'

function Feedback({ correct, text }) {
  if (correct == null) return null
  return <div aria-live="polite" className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${correct ? 'success-pop border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
    <div className="flex gap-2"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${correct ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>{correct ? <Check className="h-4 w-4"/> : <X className="h-4 w-4"/>}</span><div><strong>{correct ? 'Đúng rồi.' : 'Chưa đúng.'}</strong> {text}</div></div>
  </div>
}

export default function ExerciseRenderer({ step, onResult, initialState = {}, onStateChange }) {
  const common={step,onResult,initialState,onStateChange}
  if (step.exerciseType === 'choice') return <ChoiceExercise {...common}/>
  if (step.exerciseType === 'wordOrder') return <OrderExercise {...common}/>
  if (step.exerciseType === 'fillBlank') return <TextExercise {...common} mode="fill"/>
  if (step.exerciseType === 'errorFix') return <TextExercise {...common} mode="fix"/>
  if (step.exerciseType === 'identify') return <IdentifyExercise {...common}/>
  return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">Exercise type not supported yet.</div>
}

function useAttemptClock(){ const ref=useRef(Date.now()); useEffect(()=>{ref.current=Date.now()},[]); return ()=>Date.now()-ref.current }
function pushState(onStateChange, patch){ onStateChange?.(patch) }

function ChoiceExercise({ step, onResult, initialState, onStateChange }) {
  const [picked,setPicked]=useState(initialState.answer ?? null)
  const [checked,setChecked]=useState(!!initialState.checked)
  const [correct,setCorrect]=useState(initialState.correct ?? null)
  const elapsed=useAttemptClock()
  useEffect(()=>{ setPicked(initialState.answer ?? null); setChecked(!!initialState.checked); setCorrect(initialState.correct ?? null) },[step, initialState.stepKey])
  const check=()=>{ if(picked==null)return; const ok=normalizeCase(picked)===normalizeCase(step.answer); setChecked(true);setCorrect(ok); const state={attempted:true,checked:true,correct:ok,bestCorrect:initialState.bestCorrect||ok,answer:picked}; pushState(onStateChange,state); onResult?.({...state,expected:step.answer,responseTimeMs:elapsed()}) }
  const reset=()=>{setPicked(null);setChecked(false);setCorrect(null);pushState(onStateChange,{attempted:initialState.attempted||checked,checked:false,correct:null,answer:null})}
  return <ExerciseFrame step={step}>
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={step.promptVi}>{step.options.map(opt=><button key={opt} role="radio" aria-checked={picked===opt} disabled={checked} onClick={()=>!checked&&setPicked(opt)} className={`pressable min-h-12 rounded-2xl border p-4 text-left text-sm font-extrabold transition ${picked===opt?'border-blue-400 bg-blue-50 text-blue-800':'border-slate-200 bg-white text-slate-700 hover:border-blue-200'} disabled:cursor-default`}>{opt}</button>)}</div>
    <ActionRow checked={checked} canCheck={picked!=null} onCheck={check} onReset={reset}/><Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function OrderExercise({ step, onResult, initialState, onStateChange }) {
  const initialBuilt=Array.isArray(initialState.built) ? initialState.built : []
  const all=step.tokens.map((text,i)=>({id:i,text}))
  const [built,setBuilt]=useState(initialBuilt)
  const [pool,setPool]=useState(all.filter(x=>!initialBuilt.some(b=>b.id===x.id)))
  const [checked,setChecked]=useState(!!initialState.checked)
  const [correct,setCorrect]=useState(initialState.correct ?? null)
  const elapsed=useAttemptClock()
  useEffect(()=>{ const b=Array.isArray(initialState.built)?initialState.built:[]; setBuilt(b);setPool(all.filter(x=>!b.some(y=>y.id===x.id)));setChecked(!!initialState.checked);setCorrect(initialState.correct??null) },[step, initialState.stepKey])
  const sync=(b,p)=>pushState(onStateChange,{built:b,pool:p,attempted:initialState.attempted||false,checked:false,correct:null})
  const add=item=>{if(checked)return;const b=[...built,item],p=pool.filter(x=>x.id!==item.id);setBuilt(b);setPool(p);sync(b,p)}
  const remove=item=>{if(checked)return;const b=built.filter(x=>x.id!==item.id),p=[...pool,item].sort((a,b)=>a.id-b.id);setBuilt(b);setPool(p);sync(b,p)}
  const answer=built.map(x=>x.text).join(' ')
  const check=()=>{if(built.length!==step.tokens.length)return;const ok=validateWordOrder(answer,step);setChecked(true);setCorrect(ok);const state={attempted:true,checked:true,correct:ok,bestCorrect:initialState.bestCorrect||ok,answer,built};pushState(onStateChange,state);onResult?.({...state,expected:step.answer,responseTimeMs:elapsed()})}
  const reset=()=>{setBuilt([]);setPool(all);setChecked(false);setCorrect(null);pushState(onStateChange,{attempted:initialState.attempted||checked,checked:false,correct:null,built:[],answer:''})}
  return <ExerciseFrame step={step}>
    <div className="min-h-20 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-3" aria-label="Câu đang xây"><div className="flex flex-wrap gap-2">{built.length?built.map((item,i)=><button key={item.id} disabled={checked} onClick={()=>remove(item)} aria-label={`Bỏ ${item.text} khỏi vị trí ${i+1}`} className="pressable rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm">{item.text}</button>):<span className="p-2 text-sm font-semibold text-slate-400">Dùng Tab + Enter hoặc chạm các từ bên dưới để xây câu…</span>}</div></div>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Từ có thể chọn">{pool.map(item=><button key={item.id} disabled={checked} onClick={()=>add(item)} aria-label={`Thêm ${item.text}`} className="pressable rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300">{item.text}</button>)}</div>
    <ActionRow checked={checked} canCheck={built.length===step.tokens.length} onCheck={check} onReset={reset}/><Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function TextExercise({ step,onResult,mode,initialState,onStateChange }){
  const [value,setValue]=useState(initialState.answer||'');const [checked,setChecked]=useState(!!initialState.checked);const [correct,setCorrect]=useState(initialState.correct??null);const elapsed=useAttemptClock()
  useEffect(()=>{setValue(initialState.answer||'');setChecked(!!initialState.checked);setCorrect(initialState.correct??null)},[step,initialState.stepKey])
  const check=()=>{if(!value.trim())return;const ok=validateTextAnswer(value,step);setChecked(true);setCorrect(ok);const state={attempted:true,checked:true,correct:ok,bestCorrect:initialState.bestCorrect||ok,answer:value};pushState(onStateChange,state);onResult?.({...state,expected:Array.isArray(step.accepted)?step.accepted:step.answer,responseTimeMs:elapsed()})}
  const reset=()=>{setValue('');setChecked(false);setCorrect(null);pushState(onStateChange,{attempted:initialState.attempted||checked,checked:false,correct:null,answer:''})}
  return <ExerciseFrame step={step}>{mode==='fix'&&<div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-red-600">Câu cần sửa</p><p className="mt-1 text-lg font-black text-slate-900">{step.incorrect}</p></div>}{mode==='fill'&&<div className="mb-4 rounded-2xl bg-slate-50 p-4 text-lg font-black text-slate-800">{step.sentence}</div>}
    <label className="sr-only" htmlFor={`text-ex-${step.promptVi}`}>{step.promptVi}</label><input id={`text-ex-${step.promptVi}`} value={value} disabled={checked} onChange={e=>{setValue(e.target.value);pushState(onStateChange,{answer:e.target.value,checked:false,correct:null,attempted:initialState.attempted||false})}} onKeyDown={e=>{if(e.key==='Enter')check()}} placeholder={mode==='fix'?'Viết toàn bộ câu đã sửa…':'Nhập đáp án…'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
    <ActionRow checked={checked} canCheck={!!value.trim()} onCheck={check} onReset={reset}/><Feedback correct={correct} text={step.explainVi}/>
  </ExerciseFrame>
}

function IdentifyExercise({step,onResult,initialState,onStateChange}){
  const [selected,setSelected]=useState(initialState.selected||[]);const [checked,setChecked]=useState(!!initialState.checked);const [correct,setCorrect]=useState(initialState.correct??null);const elapsed=useAttemptClock()
  useEffect(()=>{setSelected(initialState.selected||[]);setChecked(!!initialState.checked);setCorrect(initialState.correct??null)},[step,initialState.stepKey])
  const toggle=i=>{if(checked)return;const next=step.multi?(selected.includes(i)?selected.filter(x=>x!==i):[...selected,i]):[i];setSelected(next);pushState(onStateChange,{selected:next,checked:false,correct:null,attempted:initialState.attempted||false})}
  const expected=[...step.answerIndexes].sort((a,b)=>a-b),got=[...selected].sort((a,b)=>a-b)
  const check=()=>{if(!selected.length)return;const ok=JSON.stringify(expected)===JSON.stringify(got);setChecked(true);setCorrect(ok);const answer=selected.map(i=>step.tokens[i]).join(' ');const expectedText=step.answerIndexes.map(i=>step.tokens[i]).join(' ');const state={attempted:true,checked:true,correct:ok,bestCorrect:initialState.bestCorrect||ok,selected,answer};pushState(onStateChange,state);onResult?.({...state,expected:expectedText,responseTimeMs:elapsed()})}
  const reset=()=>{setSelected([]);setChecked(false);setCorrect(null);pushState(onStateChange,{attempted:initialState.attempted||checked,selected:[],checked:false,correct:null})}
  return <ExerciseFrame step={step}><div className="flex flex-wrap gap-2" role={step.multi?'group':'radiogroup'}>{step.tokens.map((token,i)=><button key={`${token}-${i}`} disabled={checked} onClick={()=>toggle(i)} aria-pressed={selected.includes(i)} className={`pressable rounded-xl border px-3 py-2.5 text-sm font-extrabold ${selected.includes(i)?'border-violet-400 bg-violet-50 text-violet-800':'border-slate-200 bg-white text-slate-700'}`}>{token}</button>)}</div><ActionRow checked={checked} canCheck={selected.length>0} onCheck={check} onReset={reset}/><Feedback correct={correct} text={step.explainVi}/></ExerciseFrame>
}

function ExerciseFrame({step,children}){return <div><p className="text-xs font-black uppercase tracking-[.16em] text-violet-600">Luyện tập chủ động</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{step.promptVi}</h2><div className="mt-6">{children}</div></div>}
function ActionRow({checked,canCheck,onCheck,onReset}){return <div className="mt-5 flex items-center gap-3">{!checked?<button disabled={!canCheck} onClick={onCheck} className="pressable min-h-11 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Kiểm tra</button>:<button onClick={onReset} className="pressable inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"><RotateCcw className="h-4 w-4"/> Thử lại</button>}</div>}
