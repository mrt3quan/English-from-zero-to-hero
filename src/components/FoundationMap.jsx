import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, ChevronRight, Clock3, Layers3, LockKeyhole, Sparkles, X } from 'lucide-react'
import { foundationChapters, foundationLessons, foundationUnits, getUnitLessons } from '../data/foundationCurriculum'
import { getAllProgress, isLessonPassed, markLessonsTestedOut } from '../lib/learningProgress'
import Mascot from './Mascot'

const chapters = foundationChapters.map(chapter => ({ ...chapter, units: chapter.unitIds }))

export default function FoundationMap({ onOpenLesson }) {
  const [progress, setProgress] = useState(() => getAllProgress())
  const [quickCheck, setQuickCheck] = useState(false)

  useEffect(() => {
    const refresh = () => setProgress(getAllProgress())
    window.addEventListener('bunny-progress-updated', refresh)
    return () => window.removeEventListener('bunny-progress-updated', refresh)
  }, [])

  const completed = foundationLessons.filter(lesson => isLessonPassed(progress[lesson.id])).length
  const percent = Math.round((completed / foundationLessons.length) * 100)
  const unlockMap = useMemo(
    () => Object.fromEntries(
      foundationLessons.map((lesson, index) => [
        lesson.id,
        index === 0 || isLessonPassed(progress[foundationLessons[index - 1]?.id]) || isLessonPassed(progress[lesson.id]),
      ])
    ),
    [progress]
  )

  return (
    <div className="space-y-5 page-enter">
      <section className="surface-card rounded-[30px] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="eyebrow success-eyebrow inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" />FOUNDATION</div>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">Hiểu nền tảng trước khi học cấu trúc khó hơn.</h1>
            <p className="mt-3 max-w-3xl text-[15px] font-medium leading-7 text-muted">
              {foundationLessons.length} bài được chia thành {chapters.length} chặng. Mỗi bài đi qua hiểu → luyện → tự viết → ôn lại.
            </p>
            <button onClick={() => setQuickCheck(true)} className="secondary-button pressable mt-4 min-h-11 rounded-2xl px-4 py-2.5 text-sm font-bold">
              Kiểm tra để bỏ qua phần rất cơ bản
            </button>
          </div>
          <div className="foundation-summary min-w-52 rounded-3xl p-5 text-center">
            <div className="text-4xl font-extrabold text-primary">{percent}%</div>
            <div className="mt-1 text-xs font-medium text-muted">{completed}/{foundationLessons.length} bài đã hoàn thành</div>
            <div className="progress-track mt-3 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${percent}%` }} /></div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {chapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} progress={progress} unlockMap={unlockMap} onOpenLesson={onOpenLesson} />
        ))}
      </div>

      {quickCheck && <QuickCheck onClose={() => setQuickCheck(false)} />}
    </div>
  )
}

function ChapterCard({ chapter, progress, unlockMap, onOpenLesson }) {
  const units = foundationUnits.filter(unit => chapter.units.includes(unit.id))
  const lessons = units.flatMap(unit => getUnitLessons(unit.id))
  const done = lessons.filter(lesson => isLessonPassed(progress[lesson.id])).length
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0

  return (
    <section className="surface-card overflow-hidden rounded-[26px]">
      <div className="chapter-header flex items-center gap-4 p-5 sm:px-6">
        <div className="chapter-number grid h-11 w-11 shrink-0 place-items-center rounded-2xl"><span className="text-sm font-extrabold">{chapter.id}</span></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-base font-bold text-strong">{chapter.titleEn}</p>
            <p className="text-sm font-medium text-subtle">{chapter.titleVi}</p>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-muted"><Layers3 className="h-3.5 w-3.5" />{done}/{lessons.length} bài · {pct}%</div>
        </div>
        <div className="hidden h-2 w-28 overflow-hidden rounded-full progress-track sm:block"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="chapter-units">
        {units.map(unit => <UnitSection key={unit.id} unit={unit} progress={progress} unlockMap={unlockMap} onOpenLesson={onOpenLesson} />)}
      </div>
    </section>
  )
}

function UnitSection({ unit, progress, unlockMap, onOpenLesson }) {
  const lessons = getUnitLessons(unit.id)
  const done = lessons.filter(lesson => isLessonPassed(progress[lesson.id])).length
  return (
    <div className="unit-section">
      <div className="unit-heading flex items-start gap-3 px-5 py-4 sm:px-6">
        <div className="unit-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl"><BookOpen className="h-4 w-4" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Unit {unit.id}</span><span className="text-[11px] font-medium text-subtle">{done}/{lessons.length}</span></div>
          <p className="mt-0.5 text-sm font-semibold text-strong">{unit.titleEn} <span className="font-medium text-subtle">/ {unit.titleVi}</span></p>
        </div>
      </div>
      <div>
        {lessons.map(lesson => {
          const lessonProgress = progress[lesson.id]
          const passed = isLessonPassed(lessonProgress)
          const status = lessonProgress?.status || 'not_started'
          const unlocked = unlockMap[lesson.id]
          return (
            <button
              key={lesson.id}
              disabled={!unlocked}
              onClick={() => unlocked && onOpenLesson(lesson)}
              className={`lesson-row group flex w-full items-center gap-4 px-5 py-3.5 text-left sm:px-6 ${unlocked ? '' : 'is-locked'}`}
            >
              <div className={`lesson-node grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${passed ? 'is-passed' : status === 'in_progress' ? 'is-current' : unlocked ? 'is-open' : 'is-locked'}`}>
                {passed ? <Check className="h-4 w-4" /> : unlocked ? <span className="text-xs font-bold">{lesson.order}</span> : <LockKeyhole className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-strong">{lesson.titleEn}</p>
                <p className="truncate text-xs font-medium text-subtle">{lesson.titleVi}</p>
                {status === 'tested_out' && <p className="mt-1 text-[10px] font-bold text-success">Đã vượt qua bằng Quick Check</p>}
              </div>
              <div className="hidden items-center gap-1 text-xs font-medium text-subtle sm:flex"><Clock3 className="h-3.5 w-3.5" />{lesson.minutes}m</div>
              {unlocked ? <ChevronRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" /> : <span className="text-[10px] font-medium text-subtle">Hoàn thành bài trước</span>}
            </button>
          )
        })}
      </div>
    </div>
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
  const score = quickQuestions.filter((question, index) => answers[index] === question.a).length
  const submit = () => {
    setDone(true)
    if (score >= 3) markLessonsTestedOut(foundationLessons.slice(0, 4).map(lesson => lesson.id))
  }

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto p-4 backdrop-blur-sm" style={{ background: 'var(--overlay)' }}>
      <div className="surface-card mx-auto mt-8 max-w-2xl rounded-[30px] p-6" style={{ boxShadow: 'var(--shadow-floating)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><Mascot size={74} mood="thinking" /><div><p className="eyebrow primary-eyebrow">Quick Check</p><h2 className="mt-1 text-2xl font-extrabold text-strong">Bạn đã biết phần mở đầu chưa?</h2></div></div>
          <button onClick={onClose} aria-label="Đóng Quick Check" className="icon-button"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-3 text-sm font-medium leading-6 text-muted">Đạt 3/4 câu để bỏ qua 4 bài rất cơ bản. Bạn vẫn có thể mở lại chúng bất cứ lúc nào.</p>
        <div className="mt-5 space-y-5">
          {quickQuestions.map((question, index) => (
            <div key={question.q}>
              <p className="text-sm font-semibold text-strong">{index + 1}. {question.q}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {question.opts.map((option, optionIndex) => (
                  <button key={option} disabled={done} onClick={() => setAnswers(value => ({ ...value, [index]: optionIndex }))} className={`quick-option min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold ${answers[index] === optionIndex ? 'is-selected' : ''}`}>{option}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {done ? (
          <div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${score >= 3 ? 'review-success' : 'review-warning'}`}>
            {score}/4 đúng. {score >= 3 ? 'Bạn đã vượt qua phần mở đầu; 4 bài đầu được đánh dấu “tested out”.' : 'Chưa sao. Hãy bắt đầu từ bài 1 để xây nền thật chắc.'}
          </div>
        ) : (
          <button disabled={Object.keys(answers).length < quickQuestions.length} onClick={submit} className="primary-button pressable mt-5 min-h-12 w-full rounded-2xl px-4 text-sm font-bold disabled:opacity-40">Kiểm tra kết quả</button>
        )}
      </div>
    </div>
  )
}
