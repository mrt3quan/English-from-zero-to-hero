import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ListChecks, X } from 'lucide-react'
import Mascot from '../Mascot'
import StepRenderer from './StepRenderer'
import { markLessonComplete, markLessonStarted, saveLessonProgress } from '../../lib/learningProgress'

export default function LessonEngine({ lesson, onClose, onComplete }) {
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState({})
  const [productionDone, setProductionDone] = useState(false)
  const step = lesson.steps[index]
  const exerciseSteps = lesson.steps.map((s,i)=>({s,i})).filter(x=>x.s.type==='exercise')
  const answered = exerciseSteps.filter(x=>results[x.i] != null)
  const correct = answered.filter(x=>results[x.i]).length
  const accuracy = answered.length ? correct / answered.length : 0
  const atEnd = index === lesson.steps.length - 1
  const canFinish = atEnd && answered.length === exerciseSteps.length && accuracy >= lesson.mastery.minAccuracy && (!lesson.mastery.requiresProduction || productionDone)

  useEffect(() => { markLessonStarted(lesson.id); setIndex(0); setResults({}); setProductionDone(false) }, [lesson.id])
  useEffect(() => { saveLessonProgress(lesson.id, { lastStep: index, lastAccuracy: accuracy }) }, [index, accuracy, lesson.id])

  const finish = () => {
    if (!canFinish) return
    markLessonComplete(lesson.id, accuracy)
    onComplete?.(lesson.id)
  }

  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/40 p-0 backdrop-blur-sm sm:p-5">
    <div className="mx-auto min-h-screen max-w-6xl overflow-hidden bg-[#fffaf4] shadow-2xl sm:min-h-0 sm:rounded-[32px]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6"><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><X className="h-5 w-5"/></button><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-900">{lesson.titleEn}</p><p className="truncate text-xs font-semibold text-slate-400">{lesson.titleVi}</p></div><div className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex"><Clock3 className="h-4 w-4"/>{lesson.minutes} phút</div></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{width:`${((index+1)/lesson.steps.length)*100}%`}}/></div></div></div>
      </header>

      <div className="grid lg:grid-cols-[270px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white/70 p-5 lg:block"><div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4"><div className="flex items-center gap-3"><Mascot size={62}/><div><p className="text-xs font-black uppercase tracking-wider text-blue-600">Mục tiêu</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{lesson.objectiveVi}</p></div></div></div><div className="mt-5 space-y-1.5">{lesson.steps.map((s,i)=><button key={i} onClick={()=>i<=index && setIndex(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold ${i===index?'bg-blue-50 text-blue-700':i<index?'text-emerald-700 hover:bg-emerald-50':'cursor-default text-slate-300'}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${i<index?'bg-emerald-500 text-white':i===index?'bg-blue-600 text-white':'bg-slate-100'}`}>{i<index?<CheckCircle2 className="h-3.5 w-3.5"/>:i+1}</span>{stepLabel(s)}</button>)}</div></aside>
        <main className="p-4 sm:p-7 lg:p-10"><div className="mx-auto max-w-3xl"><div className="mb-6 lg:hidden"><p className="text-xs font-black uppercase tracking-[.16em] text-blue-600">Mục tiêu bài học</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{lesson.objectiveVi}</p></div><div className="min-h-[440px] rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><StepRenderer step={step} onExerciseResult={ok=>setResults(v=>({...v,[index]:ok}))} onProductionValid={ok=>setProductionDone(ok)}/></div>
          <div className="mt-5 flex items-center justify-between gap-3"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-30"><ArrowLeft className="h-4 w-4"/> Quay lại</button>{!atEnd ? <button onClick={()=>setIndex(i=>Math.min(lesson.steps.length-1,i+1))} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Tiếp tục <ArrowRight className="h-4 w-4"/></button> : <button disabled={!canFinish} onClick={finish} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"><ListChecks className="h-4 w-4"/> Hoàn thành bài</button>}</div>
          {atEnd && !canFinish && <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-900">Để hoàn thành: trả lời tất cả bài tập, đạt ít nhất {Math.round(lesson.mastery.minAccuracy*100)}% và hoàn thành phần tự viết. Hiện tại: {answered.length}/{exerciseSteps.length} bài đã kiểm tra · {Math.round(accuracy*100)}% chính xác · production {productionDone?'✓':'chưa xong'}.</div>}
        </div></main>
      </div>
    </div>
  </div>
}

function stepLabel(s) {
  if (s.type==='exercise') return 'Practice'
  if (s.type==='production') return 'Produce'
  if (s.type==='review') return 'Review'
  return ({discover:'Discover',understand:'Understand',visualize:'Visualize',compare:'Compare'})[s.kind] || 'Learn'
}
