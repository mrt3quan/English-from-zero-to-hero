import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, ChevronRight, Clock3, LockKeyhole, Sparkles, X } from 'lucide-react'
import { foundationLessons, foundationUnits, getUnitLessons } from '../data/foundationCurriculum'
import { getAllProgress, isLessonPassed, markLessonsTestedOut } from '../lib/learningProgress'
import Mascot from './Mascot'

export default function FoundationMap({ onOpenLesson }) {
  const [progress, setProgress] = useState(() => getAllProgress())
  const [quickCheck, setQuickCheck] = useState(false)

  useEffect(() => {
    const refresh = () => setProgress(getAllProgress())
    window.addEventListener('bunny-progress-updated', refresh)
    return () => window.removeEventListener('bunny-progress-updated', refresh)
  }, [])

  const completed = foundationLessons.filter(l => isLessonPassed(progress[l.id])).length
  const percent = Math.round((completed / foundationLessons.length) * 100)
  const unlockMap = useMemo(
    () => Object.fromEntries(
      foundationLessons.map((lesson, i) => [
        lesson.id,
        i === 0 || isLessonPassed(progress[foundationLessons[i - 1]?.id]) || isLessonPassed(progress[lesson.id]),
      ])
    ),
    [progress]
  )

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 card-shadow sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> FOUNDATION
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Hiểu nền tảng trước khi học cấu trúc khó hơn.</h1>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              {foundationLessons.length} bài giúp bạn hiểu cách từ và câu tiếng Anh hoạt động. Mỗi bài đi qua hiểu → luyện → tự viết → ôn lại.
            </p>
            <button onClick={() => setQuickCheck(true)} className="pressable mt-4 min-h-11 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700">
              Kiểm tra để bỏ qua phần rất cơ bản
            </button>
          </div>
          <div className="min-w-48 rounded-3xl bg-blue-50 p-5 text-center">
            <div className="text-4xl font-black text-blue-700">{percent}%</div>
            <div className="mt-1 text-xs font-bold text-slate-500">{completed}/{foundationLessons.length} bài đã hoàn thành</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
              <div className="progress-motion h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {foundationUnits.map(unit => (
          <UnitCard key={unit.id} unit={unit} progress={progress} unlockMap={unlockMap} onOpenLesson={onOpenLesson} />
        ))}
      </div>

      {quickCheck && <QuickCheck onClose={() => setQuickCheck(false)} />}
    </div>
  )
}

function UnitCard({ unit, progress, unlockMap, onOpenLesson }) {
  const lessons = getUnitLessons(unit.id)
  const done = lessons.filter(l => isLessonPassed(progress[l.id])).length

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white card-shadow">
      <div className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600"><BookOpen className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[.18em] text-blue-700">Unit {unit.id}</span>
            <span className="text-xs font-bold text-slate-300">·</span>
            <span className="text-xs font-bold text-slate-400">{done}/{lessons.length} hoàn thành</span>
          </div>
          <h2 className="mt-1 text-xl font-black">{unit.titleEn} <span className="font-bold text-slate-400">/ {unit.titleVi}</span></h2>
          <p className="mt-1 text-sm text-slate-500">{unit.descriptionVi}</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {lessons.map(lesson => {
          const p = progress[lesson.id]
          const passed = isLessonPassed(p)
          const status = p?.status || 'not_started'
          const unlocked = unlockMap[lesson.id]
          return (
            <button
              key={lesson.id}
              disabled={!unlocked}
              onClick={() => unlocked && onOpenLesson(lesson)}
              className={`group flex w-full items-center gap-4 p-4 text-left sm:px-6 ${unlocked ? 'hover:bg-blue-50/40' : 'cursor-not-allowed bg-slate-50/60 opacity-70'}`}
            >
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${passed ? 'border-emerald-500 bg-emerald-500 text-white' : status === 'in_progress' ? 'border-blue-500 bg-blue-50 text-blue-600' : unlocked ? 'border-slate-200 bg-white text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-400'}`}>
                {passed ? <Check className="h-4 w-4" /> : unlocked ? <span className="text-xs font-black">{lesson.order}</span> : <LockKeyhole className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900">{lesson.titleEn}</p>
                <p className="truncate text-xs font-semibold text-slate-400">{lesson.titleVi}</p>
                {status === 'tested_out' && <p className="mt-1 text-[10px] font-black text-emerald-600">Đã vượt qua bằng Quick Check</p>}
              </div>
              <div className="hidden items-center gap-1 text-xs font-bold text-slate-400 sm:flex"><Clock3 className="h-3.5 w-3.5" />{lesson.minutes}m</div>
              {unlocked ? <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" /> : <span className="text-[10px] font-bold text-slate-400">Hoàn thành bài trước</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

const quickQuestions = [
  { q: 'Câu nào bắt đầu bằng chữ hoa và kết thúc đúng?', opts: ['i am ready.', 'I am ready.', 'I am ready', 'i am ready'], a: 1 },
  { q: 'Đâu là một từ tiếng Anh?', opts: ['apple', 'apple school', 'I am ready.', '?'], a: 0 },
  { q: 'Tiếng Anh được đọc theo hướng nào?', opts: ['Phải → trái', 'Trái → phải', 'Tùy ý', 'Từ dưới lên'], a: 1 },
  { q: 'Câu nào là một câu hoàn chỉnh cơ bản?', opts: ['My teacher', 'Runs fast', 'Birds fly.', 'Very happy'], a: 2 },
]

function QuickCheck({ onClose }) {
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const score = quickQuestions.filter((q, i) => answers[i] === q.a).length
  const submit = () => {
    setDone(true)
    if (score >= 3) markLessonsTestedOut(foundationLessons.slice(0, 4).map(l => l.id))
  }

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="mx-auto mt-8 max-w-2xl rounded-[30px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mascot size={74} mood="thinking" />
            <div><p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Quick Check</p><h2 className="text-2xl font-black">Bạn đã biết phần mở đầu chưa?</h2></div>
          </div>
          <button onClick={onClose} aria-label="Đóng Quick Check" className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">Đạt 3/4 câu để bỏ qua 4 bài rất cơ bản. Bạn vẫn có thể mở lại chúng bất cứ lúc nào.</p>
        <div className="mt-5 space-y-5">
          {quickQuestions.map((q, i) => (
            <div key={q.q}>
              <p className="text-sm font-black text-slate-900">{i + 1}. {q.q}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {q.opts.map((opt, j) => (
                  <button key={opt} disabled={done} onClick={() => setAnswers(v => ({ ...v, [i]: j }))} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-bold ${answers[i] === j ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {done ? (
          <div className={`mt-5 rounded-2xl border p-4 text-sm font-bold ${score >= 3 ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-amber-100 bg-amber-50 text-amber-900'}`}>
            {score}/4 đúng. {score >= 3 ? 'Bạn đã vượt qua phần mở đầu; 4 bài đầu được đánh dấu “tested out”.' : 'Chưa sao. Hãy bắt đầu từ bài 1 để xây nền thật chắc.'}
          </div>
        ) : (
          <button disabled={Object.keys(answers).length < quickQuestions.length} onClick={submit} className="pressable mt-5 min-h-12 w-full rounded-2xl bg-blue-600 px-4 text-sm font-black text-white disabled:opacity-40">Kiểm tra kết quả</button>
        )}
      </div>
    </div>
  )
}
