import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock3, ListChecks, RotateCcw, X } from 'lucide-react'
import Mascot from '../Mascot'
import StepRenderer from './StepRenderer'
import { getLessonProgress, markLessonComplete, markLessonStarted, saveLessonSession } from '../../lib/learningProgress'
import { AttemptRepository } from '../../lib/attemptRepository'
import { ReviewQueueService } from '../../lib/reviewQueueService'
import { inferErrorTags, inferSkillIds } from '../../lib/skillTaxonomy'
import { EngagementService } from '../../lib/engagementService'
import { getTeacherGuide } from '../../data/teacherGuides'
import { SoundEffectsService } from '../../lib/soundEffectsService'
import { toReviewTask } from '../../lib/reviewTaskFactory'

export default function LessonEngine({ lesson, onClose, onComplete }) {
  const saved = useMemo(() => getLessonProgress(lesson.id), [lesson.id])
  const teacherGuide = useMemo(() => getTeacherGuide(lesson.id), [lesson.id])
  const resumeIndex = saved?.status === 'in_progress' ? Math.min(saved?.lastStep || 0, lesson.steps.length - 1) : 0
  const [index, setIndex] = useState(resumeIndex)
  const [stepStates, setStepStates] = useState(saved?.status === 'in_progress' ? (saved?.stepStates || {}) : {})
  const [maxVisited, setMaxVisited] = useState(resumeIndex)
  const [showResume, setShowResume] = useState(resumeIndex > 0)
  const [celebrating, setCelebrating] = useState(false)
  const [rewardedXp, setRewardedXp] = useState(0)

  const step = lesson.steps[index]
  const state = stepStates[index] || {}
  const exerciseIndexes = lesson.steps.map((s, i) => ({ s, i })).filter(x => x.s.type === 'exercise').map(x => x.i)
  const answered = exerciseIndexes.filter(i => stepStates[i]?.attempted)
  const correct = exerciseIndexes.filter(i => stepStates[i]?.bestCorrect || stepStates[i]?.correct).length
  const accuracy = answered.length ? correct / answered.length : 0
  const atEnd = index === lesson.steps.length - 1
  const productionIndexes = lesson.steps.map((s, i) => s.type === 'production' ? i : null).filter(i => i != null)
  const allProductionDone = productionIndexes.every(i => stepStates[i]?.completed)
  const reviewIndexes = lesson.steps.map((s, i) => s.type === 'review' ? i : null).filter(i => i != null)
  const allReviewsDone = reviewIndexes.every(i => stepStates[i]?.completed)
  const canFinish = atEnd && answered.length === exerciseIndexes.length && accuracy >= lesson.mastery.minAccuracy && (!lesson.mastery.requiresProduction || allProductionDone) && allReviewsDone
  const currentComplete = isStepComplete(step, state)
  const blockMessage = getBlockMessage(step)

  useEffect(() => {
    const p = getLessonProgress(lesson.id)
    markLessonStarted(lesson.id)
    const idx = p?.status === 'in_progress' ? Math.min(p?.lastStep || 0, lesson.steps.length - 1) : 0
    setIndex(idx)
    setMaxVisited(idx)
    setStepStates(p?.status === 'in_progress' ? (p?.stepStates || {}) : {})
    setShowResume(idx > 0)
    setCelebrating(false)
    setRewardedXp(0)
  }, [lesson.id, lesson.steps.length])

  useEffect(() => {
    saveLessonSession(lesson.id, { lastStep: index, stepStates, lastAccuracy: accuracy })
  }, [lesson.id, index, stepStates, accuracy])

  const updateStepState = patch => {
    setStepStates(prev => ({ ...prev, [index]: { ...(prev[index] || {}), ...patch } }))
  }

  const handleExerciseResult = result => {
    const baseSkills = inferSkillIds(lesson.id, step.skillIds)
    const skillIds = step.type === 'speak'
      ? ['speaking']
      : step.exerciseType === 'dictation'
        ? [...new Set([...baseSkills, 'listening', 'spelling'])]
        : baseSkills
    const prev = stepStates[index] || {}
    const attemptNumber = (prev.attemptCount || 0) + 1
    const expected = Array.isArray(result.expected) ? result.expected.join(' OR ') : String(result.expected ?? '')
    const errorTags = result.correct ? [] : inferErrorTags({ lessonId: lesson.id, answer: result.answer, expected, skillIds })
    const record = AttemptRepository.add({
      lessonId: lesson.id,
      stepId: step.id || `${lesson.id}-step-${index + 1}`,
      exerciseType: step.exerciseType || step.type,
      skillIds,
      answer: String(result.answer ?? ''),
      expected,
      correct: !!result.correct,
      attemptNumber,
      errorTags,
      hintUsed: false,
      responseTimeMs: result.responseTimeMs || null,
      pronunciation: result.pronunciation ? {
        provider: result.pronunciation.provider || 'pronounce-ai',
        overall: result.pronunciation.overall ?? null,
        phraseMatchStatus: result.pronunciation.phraseMatchStatus || '',
        scores: result.pronunciation.scores || {},
        needsWork: (result.pronunciation.needsWork || []).slice(0, 6).map(phone => ({
          phoneme: phone.phoneme || '',
          expected: phone.expected || '',
          heard: phone.heard || null,
          correct: !!phone.correct,
          score: phone.score ?? null,
        })),
      } : null,
    })

    updateStepState({
      attempted: true,
      attemptCount: attemptNumber,
      correct: !!result.correct,
      bestCorrect: prev.bestCorrect || !!result.correct,
      lastAttemptId: record.id,
    })

    if (!result.correct) {
      ReviewQueueService.addMistake({
        lessonId: lesson.id,
        stepId: record.stepId,
        skillIds,
        prompt: step.promptVi,
        answer: String(result.answer ?? ''),
        expected,
        errorTags,
        task: toReviewTask(step),
      })
    } else {
      ReviewQueueService.upsert({
        key: `success:${lesson.id}:${record.stepId}`,
        type: 'retrieval',
        lessonId: lesson.id,
        stepId: record.stepId,
        skillIds,
        prompt: step.promptVi,
        expected,
        dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastRating: 1,
        task: toReviewTask(step),
      })
    }
  }

  const handleReviewRating = ({ itemIndex, question, answer, rating, task }) => {
    const item = ReviewQueueService.upsert({
      key: `lesson-review:${lesson.id}:${index}:${itemIndex}`,
      type: 'lesson_review',
      lessonId: lesson.id,
      stepId: step.id || `${lesson.id}-step-${index + 1}`,
      itemIndex,
      skillIds: inferSkillIds(lesson.id, step.skillIds),
      prompt: question,
      expected: answer,
      task,
      dueAt: new Date().toISOString(),
    })
    ReviewQueueService.recordRating(item, rating)
    EngagementService.recordReview(item.key)
  }

  const goNext = () => {
    if (!currentComplete) return
    const next = Math.min(lesson.steps.length - 1, index + 1)
    setIndex(next)
    setMaxVisited(v => Math.max(v, next))
    setShowResume(false)
  }

  const restart = () => {
    setIndex(0)
    setMaxVisited(0)
    setStepStates({})
    setShowResume(false)
  }

  const finish = () => {
    if (!canFinish) return
    const previous = getLessonProgress(lesson.id)
    const firstCompletion = !['completed', 'tested_out'].includes(previous?.status)
    markLessonComplete(lesson.id, accuracy)
    EngagementService.recordLessonComplete(lesson.id, { firstCompletion })
    setRewardedXp(firstCompletion ? 20 : 0)
    SoundEffectsService.lessonComplete()
    setCelebrating(true)
  }

  if (celebrating) {
    return (
      <div className="fixed inset-0 z-[90] grid place-items-center p-4 backdrop-blur-sm" style={{ background: 'var(--overlay)' }}>
        <div className="completion-card surface-card w-full max-w-lg rounded-[32px] p-7 text-center" style={{ boxShadow: 'var(--shadow-floating)' }}>
          <Mascot size={160} mood="celebrating" withBook={false} className="mx-auto success-pop" />
          <p className="mt-3 text-xs font-black uppercase tracking-[.16em] text-emerald-700">Lesson complete</p>
          <h2 className="mt-2 text-3xl font-black">Bạn đã hoàn thành bài học!</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-muted">Bunny đã lưu tiến độ, những chỗ cần ôn lại và lịch ôn tiếp theo.</p>{rewardedXp > 0 && <div className="xp-reward mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold">+{rewardedXp} XP · Bài mới hoàn thành</div>}
          <button onClick={() => onComplete?.(lesson.id)} className="pressable mt-6 min-h-[52px] w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Đi tới bài tiếp theo</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto p-0 backdrop-blur-sm sm:p-5" style={{ background: 'var(--overlay)' }}>
      <div className="lesson-shell mx-auto min-h-screen max-w-6xl overflow-hidden shadow-2xl sm:min-h-0 sm:rounded-[32px]">
        <header className="lesson-header sticky top-0 z-20 border-b backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={onClose} aria-label="Đóng bài học" className="pressable grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600"><X className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-strong">{lesson.titleEn}</p>
                  <p className="truncate text-xs font-medium text-muted">Bước {index + 1}/{lesson.steps.length} · {stepLabel(step)}</p>
                </div>
                <div className="hidden items-center gap-2 text-xs font-semibold text-muted sm:flex"><Clock3 className="h-4 w-4" />{lesson.minutes} phút</div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="progress-motion h-full rounded-full bg-blue-600" style={{ width: `${((index + 1) / lesson.steps.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[270px_1fr]">
          <aside className="lesson-sidebar hidden border-r p-5 lg:block">
            <div className="teacher-sidebar-card rounded-3xl border p-4">
              <div className="flex items-start gap-3">
                <Mascot size={68} mood="explaining" />
                <div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-primary">Bunny · Giáo viên</p><p className="mt-1 text-sm font-bold leading-5 text-strong">{teacherGuide.checkpoint}</p><p className="mt-2 text-[11px] font-medium leading-5 text-muted">{lesson.objectiveVi}</p></div>
              </div>
            </div>
            <div className="mt-5 space-y-1.5">
              {lesson.steps.map((s, i) => {
                const done = isStepComplete(s, stepStates[i] || {}) || (s.type === 'content' && i < maxVisited)
                const visited = i <= maxVisited
                return (
                  <button key={i} disabled={!visited} onClick={() => visited && setIndex(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold ${i === index ? 'bg-blue-50 text-blue-700' : done ? 'text-emerald-700 hover:bg-emerald-50' : visited ? 'text-slate-600 hover:bg-slate-50' : 'cursor-default text-slate-300'}`}>
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${done ? 'bg-emerald-500 text-white' : i === index ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </span>
                    {stepLabel(s)}
                  </button>
                )
              })}
            </div>
          </aside>

          <main className="p-4 sm:p-7 lg:p-10">
            <div className="mx-auto max-w-3xl">
              {showResume && (
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-sm font-black text-blue-900">Tiếp tục từ bước {index + 1}</p><p className="mt-1 text-xs font-semibold text-blue-700">Bản nháp và những bài đã kiểm tra vẫn được giữ nguyên.</p></div>
                  <button onClick={restart} className="pressable inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-black text-blue-700"><RotateCcw className="h-4 w-4" /> Ôn lại từ đầu</button>
                </div>
              )}

              <div className="lesson-focus-note mb-4 rounded-2xl px-3 py-2.5 lg:hidden">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-primary">Mục tiêu bài học · {stepLabel(step)}</p>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-muted">{lesson.objectiveVi}</p>
              </div>

              <div className="lesson-canvas min-h-[440px] rounded-[28px] p-5 sm:p-8">
                <div key={`${lesson.id}-${index}`} className="step-enter"><StepRenderer lesson={lesson} step={step} stepIndex={index} stepState={state} onStepStateChange={updateStepState} onExerciseResult={handleExerciseResult} onReviewRating={handleReviewRating} /></div>
              </div>

              <div className="lesson-action-bar mt-5 flex items-center justify-between gap-3">
                <button disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))} className="pressable inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-30"><ArrowLeft className="h-4 w-4" /> Quay lại</button>
                {!atEnd ? (
                  <button disabled={!currentComplete} onClick={goNext} className="pressable inline-flex min-h-11 items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Tiếp tục <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button disabled={!canFinish} onClick={finish} className="pressable inline-flex min-h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"><ListChecks className="h-4 w-4" /> Hoàn thành bài</button>
                )}
              </div>

              {!atEnd && !currentComplete && <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-950">{blockMessage}</div>}
              {atEnd && !canFinish && (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950">
                  Để hoàn thành bài: thử tất cả bài tập, đạt ít nhất {Math.round(lesson.mastery.minAccuracy * 100)}%, hoàn thành phần tự viết và đánh giá thẻ ôn tập. Hiện tại: {answered.length}/{exerciseIndexes.length} bài đã thử · {Math.round(accuracy * 100)}% độ chính xác · phần tự viết {allProductionDone ? '✓' : 'chưa xong'} · phần ôn lại {allReviewsDone ? '✓' : 'chưa xong'}.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function isStepComplete(step, state) {
  if (step.type === 'content') return needsContentReveal(step) ? !!state.teacherRevealed : true
  if (step.type === 'exercise') return !!state.attempted
  if (step.type === 'listen') return !!state.completed
  if (step.type === 'speak') return !!state.completed
  if (step.type === 'production') return !!state.completed
  if (step.type === 'review') return !!state.completed
  return true
}

function needsContentReveal(step) {
  if (step.type !== 'content') return false
  const hasPreview = !!(step.examples?.length || step.chips?.length || step.tokenRoles?.length)
  return step.guidedReveal ?? ((step.kind === 'discover' || step.kind === 'notice') && hasPreview)
}

function getBlockMessage(step) {
  if (step.type === 'content' && needsContentReveal(step)) return 'Hãy nhìn ví dụ, tự đoán một chút, rồi chạm “nghe Bunny giải thích” trước khi tiếp tục.'
  if (step.type === 'exercise') return 'Kiểm tra câu trả lời trước khi tiếp tục. Sai vẫn có thể đi tiếp — mục tiêu là thử và học từ phản hồi.'
  if (step.type === 'listen') return 'Hãy nghe ít nhất một lần trước khi tiếp tục.'
  if (step.type === 'speak') return 'Hãy thử nói câu thành tiếng. Nếu lúc này bạn không thể nói hoặc trình duyệt không dùng được micro, bạn có thể bỏ qua phần nói mà không bị trừ điểm.'
  if (step.type === 'production') return 'Hãy hoàn thành phần tự viết và các tiêu chí trước khi tiếp tục.'
  if (step.type === 'review') return 'Hãy mở đáp án và đánh giá mức độ nhớ của từng thẻ.'
  return ''
}

function stepLabel(s) {
  if (s.type === 'exercise') return s.exerciseType === 'wordOrder' ? 'Xây câu' : s.exerciseType === 'dictation' ? 'Nghe & viết' : s.exerciseType === 'errorFix' ? 'Sửa lỗi' : 'Luyện thử'
  if (s.type === 'listen') return 'Nghe'
  if (s.type === 'speak') return 'Nói'
  if (s.type === 'production') return 'Tự viết'
  if (s.type === 'review') return 'Nhớ lại'
  return ({ discover: 'Khám phá', notice: 'Nhận ra mẫu', understand: 'Hiểu vì sao', visualize: 'Nhìn cấu trúc', compare: 'So với tiếng Việt' })[s.kind] || 'Học'
}
