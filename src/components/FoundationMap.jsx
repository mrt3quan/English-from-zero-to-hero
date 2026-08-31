import React, { useEffect, useState } from 'react'
import { Check, ChevronRight, Clock3, Compass, Sparkles } from 'lucide-react'
import { foundationChapters, foundationLessons, foundationUnits, getUnitLessons } from '../data/foundationCurriculum'
import { getAllProgress } from '../lib/learningProgress'

export default function FoundationMap({ onOpenLesson }) {
  const [progress, setProgress] = useState(() => getAllProgress())

  useEffect(() => {
    const refresh = () => setProgress(getAllProgress())
    window.addEventListener('apple-progress-updated', refresh)
    window.addEventListener('bunny-progress-updated', refresh)
    return () => {
      window.removeEventListener('apple-progress-updated', refresh)
      window.removeEventListener('bunny-progress-updated', refresh)
    }
  }, [])

  const completed = foundationLessons.filter(lesson => progress[lesson.id]?.status === 'completed').length
  const percent = Math.round((completed / foundationLessons.length) * 100)

  return <div className="space-y-6">
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 card-shadow sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><Sparkles className="h-3.5 w-3.5"/> FOUNDATION</div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Xây nền tảng tiếng Anh từng lớp.</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-500">Bạn sẽ đi từ chữ và âm → từ → câu → mẫu câu → Present Simple → tự viết 10 câu. Mỗi bài yêu cầu hiểu, sửa, xây và tự tạo tiếng Anh — không chỉ chọn đáp án.</p>
        </div>
        <div className="min-w-48 rounded-3xl bg-blue-50 p-5 text-center"><div className="text-4xl font-black text-blue-700">{percent}%</div><div className="mt-1 text-xs font-bold text-slate-500">{completed}/{foundationLessons.length} bài đã làm chủ</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }}/></div></div>
      </div>
    </section>

    <div className="space-y-5">{foundationChapters.map(chapter => <ChapterCard key={chapter.id} chapter={chapter} progress={progress} onOpenLesson={onOpenLesson}/>)}</div>
  </div>
}

function ChapterCard({ chapter, progress, onOpenLesson }) {
  const units = chapter.unitIds.map(id => foundationUnits.find(u => u.id === id)).filter(Boolean)
  const lessons = units.flatMap(unit => getUnitLessons(unit.id))
  const done = lessons.filter(lesson => progress[lesson.id]?.status === 'completed').length
  const palette = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
  }[chapter.color] || 'bg-blue-50 text-blue-700 border-blue-100'

  return <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white card-shadow">
    <div className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${palette}`}><Compass className="h-5 w-5"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black uppercase tracking-[.18em] text-blue-600">Chapter {chapter.id}</span><span className="text-xs font-bold text-slate-300">·</span><span className="text-xs font-bold text-slate-400">{done}/{lessons.length} complete</span></div><h2 className="mt-1 text-xl font-black">{chapter.titleEn} <span className="font-bold text-slate-400">/ {chapter.titleVi}</span></h2></div></div>
    <div>{units.map(unit => <UnitGroup key={unit.id} unit={unit} progress={progress} onOpenLesson={onOpenLesson}/>)}</div>
  </section>
}

function UnitGroup({ unit, progress, onOpenLesson }) {
  const lessons = getUnitLessons(unit.id)
  return <div className="border-b border-slate-100 last:border-b-0"><div className="bg-slate-50/60 px-5 py-3 sm:px-6"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Unit {unit.id}</span><span className="text-sm font-black text-slate-700">{unit.titleEn}</span><span className="text-xs font-semibold text-slate-400">{unit.titleVi}</span></div><p className="mt-1 text-xs font-medium text-slate-400">{unit.descriptionVi}</p></div><div className="divide-y divide-slate-100">{lessons.map(lesson => <LessonRow key={lesson.id} lesson={lesson} progress={progress[lesson.id]} onOpenLesson={onOpenLesson}/>)}</div></div>
}

function LessonRow({ lesson, progress, onOpenLesson }) {
  const status = progress?.status || 'not_started'
  const resume = status === 'in_progress' && progress?.activeRun?.stepIndex > 0
  return <button onClick={() => onOpenLesson(lesson)} className="group flex w-full items-center gap-4 p-4 text-left hover:bg-blue-50/40 sm:px-6"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : status === 'in_progress' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400'}`}>{status === 'completed' ? <Check className="h-4 w-4"/> : <span className="text-xs font-black">{lesson.order}</span>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-black text-slate-900">{lesson.titleEn}</p>{resume && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-600">Tiếp tục</span>}</div><p className="truncate text-xs font-semibold text-slate-400">{lesson.titleVi}</p></div><div className="hidden items-center gap-1 text-xs font-bold text-slate-400 sm:flex"><Clock3 className="h-3.5 w-3.5"/>{lesson.minutes}m</div><ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500"/></button>
}
