import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ListChecks, RefreshCw, X } from 'lucide-react'
import Mascot from '../Mascot'
import StepRenderer from './StepRenderer'
import { getLessonProgress, markLessonComplete, markLessonStarted, recordExerciseAttempt, saveActiveRun } from '../../lib/learningProgress'
import { inferErrorCategory } from '../../lib/learningAnalytics'

const freshRun = () => ({ stepIndex: 0, stepStates: {}, productionDrafts: {}, startedAt: new Date().toISOString() })
const scoreForAttempt = attempts => attempts <= 1 ? 1 : attempts === 2 ? 0.9 : attempts === 3 ? 0.82 : attempts === 4 ? 0.76 : 0.7

export default function LessonEngine({ lesson, onClose, onComplete }) {
  const [index, setIndex] = useState(0)
  const [run, setRun] = useState(freshRun)
  const [ready, setReady] = useState(false)

  const step = lesson.steps[index]
  const exerciseIndexes = useMemo(() => lesson.steps.map((s,i)=>s.type === 'exercise' ? i : -1).filter(i=>i>=0), [lesson])
  const productionIndexes = useMemo(() => lesson.steps.map((s,i)=>s.type === 'production' ? i : -1).filter(i=>i>=0), [lesson])
  const resolvedExercises = exerciseIndexes.filter(i => run.stepStates?.[i]?.resolved)
  const exerciseScores = exerciseIndexes.map(i => run.stepStates?.[i]?.score || 0)
  const masteryScore = exerciseScores.length ? exerciseScores.reduce((a,b)=>a+b,0) / exerciseScores.length : 1
  const productionDone = productionIndexes.every(i => run.stepStates?.[i]?.passed)
  const allExercisesResolved = resolvedExercises.length === exerciseIndexes.length
  const atEnd = index === lesson.steps.length - 1
  const canFinish = atEnd && allExercisesResolved && masteryScore >= lesson.mastery.minAccuracy && (!lesson.mastery.requiresProduction || productionDone)

  const maxUnlocked = useMemo(() => {
    for (let i = 0; i < lesson.steps.length; i++) {
      if (!run.stepStates?.[i]?.completed) return i
    }
    return lesson.steps.length - 1
  }, [lesson.steps.length, run.stepStates])

  useEffect(() => {
    setReady(false)
    const started = markLessonStarted(lesson.id)
    const restored = started?.activeRun || getLessonProgress(lesson.id)?.activeRun || freshRun()
    const safeIndex = Math.max(0, Math.min(lesson.steps.length - 1, restored.stepIndex || 0))
    setRun({ ...freshRun(), ...restored, stepStates: restored.stepStates || {}, productionDrafts: restored.productionDrafts || {} })
    setIndex(safeIndex)
    setReady(true)
  }, [lesson.id, lesson.steps.length])

  useEffect(() => {
    if (!ready) return
    saveActiveRun(lesson.id, { ...run, stepIndex: index })
  }, [run, index, lesson.id, ready])

  const patchStep = (stepIndex, patch) => setRun(prev => ({
    ...prev,
    stepStates: { ...prev.stepStates, [stepIndex]: { ...(prev.stepStates?.[stepIndex] || {}), ...patch } },
  }))

  const handleExerciseResult = payload => {
    const previous = run.stepStates?.[index] || {}
    const attempts = (previous.attempts || 0) + 1
    const resolved = previous.resolved || payload.correct
    const score = payload.correct ? Math.max(previous.score || 0, scoreForAttempt(attempts)) : (previous.score || 0)
    patchStep(index, {
      attempts,
      resolved,
      completed: resolved,
      score,
      lastCorrect: payload.correct,
      lastAnswer: payload.answer,
      expected: payload.expected,
    })
    recordExerciseAttempt({
      lessonId: lesson.id,
      lessonTitle: lesson.titleEn,
      stepIndex: index,
      exerciseType: payload.exerciseType,
      answer: payload.answer,
      expected: payload.expected,
      correct: payload.correct,
      errorCategory: payload.errorCategory || inferErrorCategory(lesson, step),
      conceptId: payload.conceptId || lesson.focus?.[0] || null,
      promptVi: payload.promptVi,
      explainVi: payload.explainVi,
    })
  }

  const handleProductionState = state => {
    patchStep(index, { passed: !!state.passed, completed: !!state.passed, productionEvaluation: state.evaluation, submitted: !!state.submitted, manualChecks: state.manualChecks || {} })
  }

  const handleProductionDraft = value => setRun(prev => ({ ...prev, productionDrafts: { ...prev.productionDrafts, [index]: value } }))

  const canAdvanceCurrent = () => {
    if (step.type === 'exercise') return !!run.stepStates?.[index]?.resolved
    if (step.type === 'production') return !!run.stepStates?.[index]?.passed
    if (step.type === 'review') return false
    return true
  }

  const next = () => {
    if (!canAdvanceCurrent()) return
    if (step.type === 'content') patchStep(index, { completed: true })
    setIndex(i => Math.min(lesson.steps.length - 1, i + 1))
  }

  const goTo = target => {
    if (target === index || target <= maxUnlocked || run.stepStates?.[target]?.completed) setIndex(target)
  }

  const redoWeak = () => {
    const weak = exerciseIndexes.filter(i => (run.stepStates?.[i]?.score || 0) < 1)
    if (!weak.length) return
    setRun(prev => {
      const nextStates = { ...prev.stepStates }
      weak.forEach(i => { nextStates[i] = { ...(nextStates[i] || {}), attempts: 0, resolved: false, completed: false, score: 0, lastCorrect: null } })
      for (let i = Math.min(...weak) + 1; i < lesson.steps.length; i++) {
        if (lesson.steps[i].type === 'content') nextStates[i] = { ...(nextStates[i] || {}), completed: false }
      }
      return { ...prev, stepStates: nextStates }
    })
    setIndex(Math.min(...weak))
  }

  const finish = () => {
    if (!canFinish) return
    patchStep(index, { completed: true })
    markLessonComplete(lesson.id, masteryScore)
    onComplete?.(lesson.id)
  }

  if (!ready) return null

  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/40 p-0 backdrop-blur-sm sm:p-5">
    <div className="mx-auto min-h-screen max-w-6xl overflow-hidden bg-[#fffaf4] shadow-2xl sm:min-h-0 sm:rounded-[32px]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6"><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><X className="h-5 w-5"/></button><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-900">{lesson.titleEn}</p><p className="truncate text-xs font-semibold text-slate-400">{lesson.titleVi}</p></div><div className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex"><Clock3 className="h-4 w-4"/>{lesson.minutes} phút</div></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{width:`${((index+1)/lesson.steps.length)*100}%`}}/></div></div></div>
      </header>

      <div className="grid lg:grid-cols-[270px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white/70 p-5 lg:block"><div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4"><div className="flex items-center gap-3"><Mascot size={62}/><div><p className="text-xs font-black uppercase tracking-wider text-blue-600">Mục tiêu</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{lesson.objectiveVi}</p></div></div><div className="mt-3 flex gap-2"><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500">{resolvedExercises.length}/{exerciseIndexes.length} practice</span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500">{Math.round(masteryScore*100)}% mastery</span></div></div><div className="mt-5 space-y-1.5">{lesson.steps.map((s,i)=>{const completed=!!run.stepStates?.[i]?.completed; const enabled=i===index || i<=maxUnlocked || completed; return <button key={i} disabled={!enabled} onClick={()=>goTo(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold ${i===index?'bg-blue-50 text-blue-700':completed?'text-emerald-700 hover:bg-emerald-50':enabled?'text-slate-500 hover:bg-slate-50':'cursor-default text-slate-300'}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${completed?'bg-emerald-500 text-white':i===index?'bg-blue-600 text-white':'bg-slate-100'}`}>{completed?<CheckCircle2 className="h-3.5 w-3.5"/>:i+1}</span>{stepLabel(s)}</button>})}</div></aside>
        <main className="p-4 sm:p-7 lg:p-10"><div className="mx-auto max-w-3xl"><div className="mb-6 lg:hidden"><p className="text-xs font-black uppercase tracking-[.16em] text-blue-600">Mục tiêu bài học</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{lesson.objectiveVi}</p></div><div className="min-h-[440px] rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><StepRenderer step={step} stepState={run.stepStates?.[index]} productionDraft={run.productionDrafts?.[index]} onExerciseResult={handleExerciseResult} onProductionState={handleProductionState} onProductionDraft={handleProductionDraft}/></div>
          <div className="mt-5 flex items-center justify-between gap-3"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-30"><ArrowLeft className="h-4 w-4"/> Quay lại</button>{!atEnd ? <button disabled={!canAdvanceCurrent()} onClick={next} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">Tiếp tục <ArrowRight className="h-4 w-4"/></button> : <button disabled={!canFinish} onClick={finish} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"><ListChecks className="h-4 w-4"/> Hoàn thành bài</button>}</div>
          {!atEnd && !canAdvanceCurrent() && <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs font-semibold leading-5 text-blue-900">{step.type === 'exercise' ? 'Hãy kiểm tra và sửa bài cho đến khi đúng trước khi đi tiếp. App phân biệt “đã xem” và “đã nắm”.' : 'Phần tự viết cần vượt qua các kiểm tra thật ở phía trên trước khi đi tiếp.'}</div>}
          {atEnd && !canFinish && <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-900"><p>Để hoàn thành: sửa đúng tất cả bài tập, đạt ít nhất {Math.round(lesson.mastery.minAccuracy*100)}% mastery và hoàn thành phần tự viết. Hiện tại: {resolvedExercises.length}/{exerciseIndexes.length} bài đã nắm · {Math.round(masteryScore*100)}% mastery · production {productionDone?'✓':'chưa xong'}.</p>{allExercisesResolved && masteryScore < lesson.mastery.minAccuracy && <button onClick={redoWeak} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-black text-amber-800 shadow-sm"><RefreshCw className="h-3.5 w-3.5"/> Ôn lại những câu đã sai</button>}</div>}
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
