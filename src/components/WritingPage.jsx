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

  return <div className="space-y-6">
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 card-shadow sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Writing</p><h1 className="mt-2 text-3xl font-black">Bắt đầu từ câu bạn tự viết.</h1><p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">Foundation Writing tập trung vào tạo câu, tự kiểm tra và sửa — Bunny không viết thay bạn.</p></div>
        <Mascot size={124} mood="proud" activity="writing" withBook={false} />
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-[28px] border border-amber-100 bg-amber-50/50 p-5 card-shadow">
        <div className="flex items-center gap-3"><PenLine className="h-5 w-5 text-amber-700"/><div><p className="text-xs font-black uppercase tracking-[.14em] text-amber-700">Sentence Practice</p><h2 className="text-xl font-black">Daily routine</h2></div></div>
        <p className="mt-3 text-sm font-semibold text-slate-600">{routineTask.promptVi}</p>
        <label className="sr-only" htmlFor="foundation-writing-routine">Viết ba câu về thói quen hằng ngày</label>
        <textarea id="foundation-writing-routine" value={value} onChange={e => { setValue(e.target.value); setSavedId(null) }} rows={6} placeholder={routineTask.placeholder} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
        <div className="mt-3 space-y-2">{evaluation.requirements.map(r => <button key={r.id} type="button" disabled={r.type !== 'selfCheck'} onClick={() => r.type === 'selfCheck' && toggle(r.id)} className={`flex min-h-11 w-full items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold ${r.passed ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600'} disabled:cursor-default`} aria-pressed={r.type === 'selfCheck' ? r.passed : undefined}><CheckCircle2 className={`h-4 w-4 ${r.passed ? 'text-emerald-600' : 'text-slate-300'}`}/>{r.labelVi}</button>)}</div>
        <button disabled={!evaluation.passed} onClick={save} className="pressable mt-4 min-h-11 rounded-2xl bg-amber-500 px-5 text-sm font-black text-white disabled:opacity-40">Lưu vào My Writing</button>
        {savedId && <p className="mt-3 text-xs font-bold text-emerald-700">✓ Đã lưu. Bạn có thể xem lại bài này trong My Writing.</p>}
      </div>

      <div className="space-y-5">
        <div className="rounded-[28px] border border-violet-100 bg-violet-50/60 p-5 card-shadow"><div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-violet-700"/><h2 className="text-xl font-black">Foundation Mastery Project</h2></div><p className="mt-3 text-sm font-semibold leading-6 text-slate-600">Viết 10 câu về bản thân và dùng những cấu trúc đã học.</p><button disabled={!masteryUnlocked} onClick={() => onOpenLesson?.(foundationLessonById['f30-foundation-mastery'])} className="pressable mt-4 min-h-11 w-full rounded-2xl bg-violet-600 px-4 text-sm font-black text-white disabled:bg-slate-300">{masteryUnlocked ? 'Mở dự án' : 'Hoàn thành Sentence Expansion trước'}</button></div>
        <div className="rounded-[28px] border border-blue-100 bg-blue-50/60 p-5 card-shadow"><div className="flex items-center gap-3"><Beaker className="h-5 w-5 text-blue-700"/><h2 className="text-xl font-black">Sentence Lab</h2></div><p className="mt-3 text-sm font-semibold leading-6 text-slate-600">Sắp tới: phân tích subject, verb, object, tense và lỗi thường gặp — giải thích vì sao trước khi sửa.</p><span className="mt-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black text-blue-700">Coming soon</span></div>
      </div>
    </section>

    <section className="rounded-[28px] border border-slate-200 bg-white p-5 card-shadow">
      <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-blue-700"/><h2 className="text-xl font-black">My Writing</h2></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {savedWriting.map(item => <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-amber-700">{item.title || 'Sentence Practice'}</p><p className="mt-1 text-[10px] font-semibold text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p></div><button onClick={() => WritingRepository.remove(item.id)} aria-label="Xóa bài viết" className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-white hover:text-red-600"><Trash2 className="h-4 w-4"/></button></div><p className="mt-2 whitespace-pre-line text-xs font-semibold leading-5 text-slate-600">{item.content}</p></article>)}
        {lessonDrafts.map((d, i) => <button key={`${d.lesson.id}-${d.index}-${i}`} onClick={() => onOpenLesson?.(d.lesson)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left"><p className="text-xs font-black text-blue-700">{d.lesson.titleEn}</p><p className="mt-1 text-[10px] font-semibold text-slate-400">Lesson production</p><p className="mt-2 line-clamp-3 whitespace-pre-line text-xs font-semibold leading-5 text-slate-600">{d.state.value}</p></button>)}
        {!savedWriting.length && !lessonDrafts.length && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Các câu bạn tự viết và production draft trong lesson sẽ xuất hiện ở đây.</div>}
      </div>
    </section>
  </div>
}
