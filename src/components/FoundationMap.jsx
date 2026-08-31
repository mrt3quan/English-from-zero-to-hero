import React, { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Clock3, LockKeyhole, Map, Sparkles, X } from 'lucide-react'
import { foundationLessons, foundationUnits, foundationChapters, getChapterLessons } from '../data/foundationCurriculum'
import { getAllProgress, isLessonPassed, markLessonsTestedOut } from '../lib/learningProgress'
import Mascot from './Mascot'

const chapters = foundationChapters

const unitById = Object.fromEntries(foundationUnits.map(unit => [unit.id, unit]))

export default function FoundationMap({ onOpenLesson, quickCheckSignal = 0 }) {
  const [progress, setProgress] = useState(() => getAllProgress())
  const [quickCheck, setQuickCheck] = useState(false)

  useEffect(() => { if (quickCheckSignal) setQuickCheck(true) }, [quickCheckSignal])

  useEffect(() => {
    const refresh = () => setProgress(getAllProgress())
    window.addEventListener('bunny-progress-updated', refresh)
    return () => window.removeEventListener('bunny-progress-updated', refresh)
  }, [])

  const completed = foundationLessons.filter(lesson => isLessonPassed(progress[lesson.id])).length
  const percent = Math.round((completed / foundationLessons.length) * 100)
  const currentLesson = foundationLessons.find(lesson => !isLessonPassed(progress[lesson.id])) || foundationLessons.at(-1)
  const currentChapter = chapters.find(chapter => chapter.lessonIds.includes(currentLesson.id)) || chapters[0]
  const [expanded, setExpanded] = useState(currentChapter.id)

  useEffect(() => setExpanded(currentChapter.id), [currentChapter.id])

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
    <div className="learn-journey space-y-4 page-enter">
      <section className="journey-hero rounded-[30px] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="journey-map-icon hidden h-14 w-14 shrink-0 place-items-center rounded-2xl sm:grid"><Map className="h-6 w-6" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="eyebrow primary-eyebrow">Foundation</span><span className="journey-status">{completed}/{foundationLessons.length}</span></div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">Mỗi chặng mở thêm một khả năng tiếng Anh.</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted">Chặng hiện tại: <strong className="text-strong">{currentChapter.titleVi}</strong>. Học theo khả năng bạn có thể làm, không phải danh sách thuật ngữ grammar.</p>
          </div>
          <div className="hidden text-right md:block"><p className="text-3xl font-extrabold text-primary">{percent}%</p><p className="text-xs font-medium text-muted">Foundation</p></div>
        </div>
        <div className="progress-track mt-4 h-2.5 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${percent}%` }} /></div>
        <button onClick={() => setQuickCheck(true)} className="text-link mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold">Đã biết alphabet và cách đọc chữ cơ bản? Quick Check để bỏ qua Khởi động <ChevronRight className="h-4 w-4" /></button>
      </section>

      <div className="space-y-3">
        {chapters.map(chapter => (
          <JourneyChapter
            key={chapter.id}
            chapter={chapter}
            progress={progress}
            unlockMap={unlockMap}
            expanded={expanded === chapter.id}
            current={currentChapter.id === chapter.id}
            onToggle={() => setExpanded(expanded === chapter.id ? null : chapter.id)}
            onOpenLesson={onOpenLesson}
          />
        ))}
      </div>

      {quickCheck && <QuickCheck onClose={() => setQuickCheck(false)} />}
    </div>
  )
}

function JourneyChapter({ chapter, progress, unlockMap, expanded, current, onToggle, onOpenLesson }) {
  const lessons = getChapterLessons(chapter.id)
  const done = lessons.filter(lesson => isLessonPassed(progress[lesson.id])).length
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0
  const complete = done === lessons.length

  return (
    <section className={`journey-chapter rounded-[26px] ${current ? 'is-current' : ''} ${complete ? 'is-complete' : ''}`}>
      <button onClick={onToggle} className="journey-chapter-head pressable flex min-h-20 w-full items-center gap-3 rounded-[26px] px-4 py-4 text-left sm:px-5">
        <div className="chapter-scene grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl">{chapter.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><p className="text-base font-bold text-strong">{chapter.optional ? 'Khởi động tùy chọn' : `Chặng ${chapter.id}`}: {chapter.titleEn}</p>{current && <span className="current-badge">Bạn đang ở đây</span>}</div>
          <p className="mt-0.5 text-sm font-medium text-muted">{chapter.titleVi} · {done}/{lessons.length} bài</p>{chapter.outcomeVi && <p className="mt-1 hidden text-xs font-medium leading-5 text-muted sm:block">{chapter.outcomeVi}</p>}
        </div>
        <div className="hidden items-center gap-3 sm:flex"><div className="progress-track h-2 w-20 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${pct}%` }} /></div><ChevronDown className={`h-5 w-5 text-muted transition ${expanded ? 'rotate-180' : ''}`} /></div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition sm:hidden ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="journey-path border-t px-3 py-5 sm:px-5 sm:py-6">
          <div className="relative mx-auto max-w-3xl">
            <div className="journey-spine" aria-hidden="true" />
            <div className="space-y-3 sm:space-y-1">
              {lessons.map((lesson, index) => (
                <JourneyLesson
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  progress={progress[lesson.id]}
                  unlocked={unlockMap[lesson.id]}
                  onOpen={() => onOpenLesson(lesson)}
                />
              ))}
            </div>
          </div>
          {complete && <div className="chapter-finish mx-auto mt-5 flex max-w-xl items-center justify-center gap-3 rounded-2xl p-3 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Chặng này đã hoàn thành. Bunny đã mở chặng tiếp theo!</div>}
        </div>
      )}
    </section>
  )
}

function JourneyLesson({ lesson, index, progress, unlocked, onOpen }) {
  const passed = isLessonPassed(progress)
  const status = progress?.status || 'not_started'
  const current = status === 'in_progress'
  const side = index % 2 === 0 ? 'left' : 'right'
  const unit = unitById[lesson.unit]

  return (
    <div className={`journey-step ${side}`}>
      <div className="journey-node-wrap">
        <div className={`journey-node ${passed ? 'is-passed' : current ? 'is-current' : unlocked ? 'is-open' : 'is-locked'}`}>
          {passed ? <Check className="h-4 w-4" /> : unlocked ? <span>{lesson.order}</span> : <LockKeyhole className="h-4 w-4" />}
        </div>
      </div>
      <button disabled={!unlocked} onClick={() => unlocked && onOpen()} className={`journey-lesson pressable ${unlocked ? '' : 'is-locked'}`}>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted">{unit?.titleVi || `Unit ${lesson.unit}`}</p>
          <p className="mt-1 text-sm font-bold text-strong sm:text-base">{lesson.titleEn}</p>
          <p className="mt-0.5 text-xs font-medium text-muted">{lesson.titleVi}</p>
          {status === 'tested_out' && <p className="mt-1 text-[10px] font-bold text-success">Đã vượt qua bằng Quick Check</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted"><Clock3 className="h-3.5 w-3.5" />{lesson.minutes}m</div>
      </button>
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
      <div className="surface-card mx-auto mt-8 max-w-2xl rounded-[30px] p-5 sm:p-6" style={{ boxShadow: 'var(--shadow-floating)' }}>
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
