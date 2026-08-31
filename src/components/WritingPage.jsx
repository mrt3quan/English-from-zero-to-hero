import React, { useEffect, useMemo, useState } from 'react'
import { Beaker, CheckCircle2, FileText, PenLine, Sparkles, Trash2 } from 'lucide-react'
import Mascot from './Mascot'
import { foundationLessonById, foundationLessons } from '../data/foundationCurriculum'
import { getAllProgress, isLessonPassed } from '../lib/learningProgress'
import { evaluateProduction } from '../lib/productionValidator'
import { WritingRepository } from '../lib/writingRepository'

const routineTask = {
  promptVi: 'Viết 3 câu về thói quen hằng ngày của bạn.',
  placeholder: 'I wake up at 7.\nI drink coffee.\nI study English every evening.',
  requirements: [
    { id: 'lines', type: 'minLines', value: 3, labelVi: 'Có ít nhất 3 câu/dòng' },
    { id: 'present', type: 'selfCheck', labelVi: 'Các câu nói về thói quen hoặc sự thật hiện tại' },
    { id: 'punct', type: 'selfCheck', labelVi: 'Tôi đã kiểm tra chữ hoa và dấu câu' },
  ],
}

export default function WritingPage({ onOpenLesson }) {
  const [tick, setTick] = useState(0)
  const [value, setValue] = useState('')
  const [manual, setManual] = useState({})
  const [savedId, setSavedId] = useState(null)
  const progress = getAllProgress()
  const evaluation = evaluateProduction(routineTask, value, manual)

  useEffect(() => {
    const refresh = () => setTick(v => v + 1)
    window.addEventListener('bunny-writing-updated', refresh)
    window.addEventListener('bunny-progress-updated', refresh)
    return () => {
      window.removeEventListener('bunny-writing-updated', refresh)
      window.removeEventListener('bunny-progress-updated', refresh)
    }
  }, [])

  const lessonDrafts = useMemo(() => foundationLessons.flatMap(lesson => {
    const p = progress[lesson.id]
    return Object.entries(p?.stepStates || {})
      .map(([idx, state]) => ({ lesson, index: Number(idx), state, step: lesson.steps[Number(idx)] }))
      .filter(x => x.step?.type === 'production' && x.state?.value?.trim())
  }).slice(-8).reverse(), [progress, tick])

  const savedWriting = useMemo(() => WritingRepository.recent(8), [tick])
  const masteryUnlocked = isLessonPassed(progress['f29-sentence-expansion']) || isLessonPassed(progress['f30-foundation-mastery'])
  const toggle = id => setManual(v => ({ ...v, [id]: !v[id] }))
  const save = () => {
    if (!evaluation.passed) return
    const record = WritingRepository.add({
      type: 'sentence_practice',
      title: 'Daily routine',
      promptVi: routineTask.promptVi,
      content: value.trim(),
      requirementResults: evaluation.requirements.map(({ id, passed }) => ({ id, passed })),
    })
    setSavedId(record.id)
  }

  return <div className="writing-simple space-y-4 page-enter">
    <section className="practice-welcome flex items-center gap-4 px-1 py-1">
      <div className="welcome-bunny grid h-16 w-16 shrink-0 place-items-center rounded-[22px]"><Mascot size={64} mood="proud" activity="writing" withBook={false} /></div>
      <div><p className="text-xs font-bold uppercase tracking-[.14em] text-warning">Writing</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">Tự viết trước. Bunny chỉ giúp bạn kiểm tra.</h1><p className="mt-1 text-sm font-medium text-muted">Bắt đầu từ câu ngắn, không cần nghĩ về bài luận lúc này.</p></div>
    </section>

    <section className="writing-stage rounded-[30px] p-5 sm:p-6">
      <div className="flex items-center gap-3"><div className="writing-icon grid h-11 w-11 place-items-center rounded-2xl"><PenLine className="h-5 w-5"/></div><div><p className="text-xs font-bold uppercase tracking-[.13em] text-warning">Bài viết hôm nay</p><h2 className="text-xl font-bold text-strong">Daily routine</h2></div></div>
      <p className="mt-4 text-sm font-semibold text-strong">{routineTask.promptVi}</p>
      <p className="mt-1 text-xs font-medium text-muted">Viết đơn giản. Mỗi dòng một câu sẽ dễ kiểm tra hơn.</p>
      <label className="sr-only" htmlFor="foundation-writing-routine">Viết ba câu về thói quen hằng ngày</label>
      <textarea id="foundation-writing-routine" value={value} onChange={e => { setValue(e.target.value); setSavedId(null) }} rows={6} placeholder={routineTask.placeholder} className="writing-input mt-4 w-full rounded-2xl border p-4 text-sm font-semibold leading-6 outline-none"/>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">{evaluation.requirements.map(r => <button key={r.id} type="button" disabled={r.type !== 'selfCheck'} onClick={() => r.type === 'selfCheck' && toggle(r.id)} className={`writing-check flex min-h-11 items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold ${r.passed ? 'is-passed' : ''} disabled:cursor-default`} aria-pressed={r.type === 'selfCheck' ? r.passed : undefined}><CheckCircle2 className="h-4 w-4 shrink-0"/>{r.labelVi}</button>)}</div>
      <button disabled={!evaluation.passed} onClick={save} className="writing-save pressable mt-4 min-h-[52px] w-full rounded-2xl px-5 text-sm font-bold disabled:opacity-40 sm:w-auto">Lưu vào My Writing</button>
      {savedId && <p className="mt-3 text-xs font-bold text-success">✓ Đã lưu. Bạn có thể xem lại phía dưới.</p>}
    </section>

    <section className="grid gap-3 sm:grid-cols-2">
      <button disabled={!masteryUnlocked} onClick={() => onOpenLesson?.(foundationLessonById['f30-foundation-mastery'])} className="writing-option pressable rounded-[22px] p-4 text-left disabled:opacity-55">
        <div className="flex items-center justify-between gap-3"><div className="quick-icon grid h-10 w-10 place-items-center rounded-xl"><Sparkles className="h-5 w-5"/></div><span className="text-[10px] font-bold uppercase tracking-[.12em] text-muted">Project</span></div>
        <h3 className="mt-3 text-base font-bold text-strong">Foundation Mastery</h3><p className="mt-1 text-xs font-medium leading-5 text-muted">Viết 10 câu về bản thân và dùng những cấu trúc đã học.</p><p className="mt-3 text-xs font-bold text-primary">{masteryUnlocked ? 'Mở dự án →' : 'Mở sau Sentence Expansion'}</p>
      </button>
      <div className="writing-option rounded-[22px] p-4">
        <div className="flex items-center justify-between gap-3"><div className="quick-icon grid h-10 w-10 place-items-center rounded-xl"><Beaker className="h-5 w-5"/></div><span className="soon-pill">Sắp ra mắt</span></div>
        <h3 className="mt-3 text-base font-bold text-strong">Sentence Lab</h3><p className="mt-1 text-xs font-medium leading-5 text-muted">Phân tích subject, verb, object và giải thích vì sao trước khi sửa.</p>
      </div>
    </section>

    <details className="quiet-details rounded-[24px]" open={savedWriting.length + lessonDrafts.length > 0}>
      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary"/><div><p className="text-sm font-bold text-strong">My Writing</p><p className="text-xs text-muted">{savedWriting.length + lessonDrafts.length} bài viết và bản nháp</p></div></div>
        <span className="text-xs font-bold text-primary">Xem</span>
      </summary>
      <div className="grid gap-3 border-t px-4 py-4 sm:grid-cols-2">
        {savedWriting.map(item => <article key={item.id} className="writing-saved rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-warning">{item.title || 'Sentence Practice'}</p><p className="mt-1 text-[10px] font-medium text-muted">{new Date(item.createdAt).toLocaleDateString()}</p></div><button onClick={() => WritingRepository.remove(item.id)} aria-label="Xóa bài viết" className="icon-quiet"><Trash2 className="h-4 w-4"/></button></div><p className="mt-2 whitespace-pre-line text-xs font-medium leading-5 text-muted">{item.content}</p></article>)}
        {lessonDrafts.map((d, i) => <button key={`${d.lesson.id}-${d.index}-${i}`} onClick={() => onOpenLesson?.(d.lesson)} className="writing-saved rounded-2xl p-4 text-left"><p className="text-xs font-bold text-primary">{d.lesson.titleEn}</p><p className="mt-1 text-[10px] font-medium text-muted">Lesson production</p><p className="mt-2 line-clamp-3 whitespace-pre-line text-xs font-medium leading-5 text-muted">{d.state.value}</p></button>)}
        {!savedWriting.length && !lessonDrafts.length && <div className="muted-row rounded-2xl p-4 text-sm font-medium text-muted">Các câu bạn tự viết và production draft trong lesson sẽ xuất hiện ở đây.</div>}
      </div>
    </details>
  </div>
}
