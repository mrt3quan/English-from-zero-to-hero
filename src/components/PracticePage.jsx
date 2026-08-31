import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowRight, Brain, Clock3, PenLine, Play, Target, X } from 'lucide-react'
import Mascot from './Mascot'
import { AttemptRepository } from '../lib/attemptRepository'
import { getWeakSkills } from '../lib/skillMasteryService'
import { ReviewQueueService } from '../lib/reviewQueueService'
import { ERROR_TAGS } from '../lib/skillTaxonomy'
import { foundationLessonById } from '../data/foundationCurriculum'
import { EngagementService } from '../lib/engagementService'

export default function PracticePage({ onOpenLesson, onOpenWriting }) {
  const [tick, setTick] = useState(0)
  const [session, setSession] = useState(false)
  useEffect(() => {
    const refresh = () => setTick(v => v + 1)
    window.addEventListener('bunny-attempt-updated', refresh)
    window.addEventListener('bunny-review-updated', refresh)
    return () => {
      window.removeEventListener('bunny-attempt-updated', refresh)
      window.removeEventListener('bunny-review-updated', refresh)
    }
  }, [])

  const due = useMemo(() => ReviewQueueService.due(), [tick])
  const weak = useMemo(() => getWeakSkills(5), [tick])
  const mistakes = useMemo(() => AttemptRepository.recent(30).filter(a => !a.correct).slice(0, 6), [tick])

  return (
    <div className="practice-simple space-y-4 page-enter">
      <section className="practice-welcome flex items-center gap-4 px-1 py-1">
        <div className="welcome-bunny grid h-16 w-16 shrink-0 place-items-center rounded-[22px]"><Mascot size={64} mood="encouraging" withBook={false} /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Practice</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">Ôn đúng thứ bạn cần.</h1>
          <p className="mt-1 text-sm font-medium text-muted">Không cần chọn từ hàng chục mục — Bunny ưu tiên giúp bạn.</p>
        </div>
      </section>

      <section className="review-stage rounded-[30px] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Hôm nay</p>
            <h2 className="mt-2 text-3xl font-extrabold text-strong">{due.length ? `${due.length} mục cần nhớ lại` : 'Bạn đã ôn xong hôm nay'}</h2>
            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-muted">{due.length ? `Khoảng ${Math.max(1, Math.ceil(due.length * .65))} phút. Tự nhớ trước, rồi mới xem đáp án.` : 'Bạn vẫn có thể luyện câu hoặc viết thêm nếu muốn.'}</p>
          </div>
          <div className="review-clock hidden h-14 w-14 shrink-0 place-items-center rounded-2xl sm:grid"><Clock3 className="h-6 w-6" /></div>
        </div>
        {due.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {due.slice(0, 3).map(item => <span key={item.key} className="review-preview-chip">{(item.skillIds?.[0] || 'review').replaceAll('_', ' ')}</span>)}
            {due.length > 3 && <span className="review-preview-chip">+{due.length - 3}</span>}
          </div>
        )}
        <button disabled={!due.length} onClick={() => setSession(true)} className="primary-button pressable mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-bold disabled:opacity-40 sm:w-auto">
          <Play className="h-5 w-5" /> {due.length ? 'Bắt đầu ôn' : 'Đã hoàn thành'}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <QuickCard title="Sentence Builder" text="Xây câu từng lớp" icon={Brain} onClick={() => onOpenLesson?.(foundationLessonById['f29-sentence-expansion'])} />
        <QuickCard title="Questions" text="Luyện be / do / does" icon={Target} onClick={() => onOpenLesson?.(foundationLessonById['f27-questions'])} />
        <QuickCard title="Writing" text="Tự viết câu của bạn" icon={PenLine} onClick={onOpenWriting} />
      </section>

      <details className="quiet-details rounded-[24px]" open={weak.some(skill => skill.masteryScore < 50)}>
        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3"><Target className="h-5 w-5 text-warning" /><div><p className="text-sm font-bold text-strong">Điểm cần luyện thêm</p><p className="text-xs text-muted">{weak.length ? `${weak.length} kỹ năng từ dữ liệu thật` : 'Chưa đủ dữ liệu'}</p></div></div>
          <ArrowRight className="h-4 w-4 text-muted" />
        </summary>
        <div className="grid gap-2 border-t px-4 py-4 sm:grid-cols-2">
          {weak.length ? weak.map(skill => (
            <div key={skill.skillId} className="muted-row rounded-2xl p-3">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-strong">{skill.labelVi}</p><span className="text-xs font-bold text-warning">{skill.masteryScore}%</span></div>
              <p className="mt-1 text-xs text-muted">{skill.attempts} lượt · {skill.incorrect} lỗi</p>
            </div>
          )) : <EmptySmall text="Hãy học vài bài; Bunny sẽ dùng lỗi thật để tìm điểm cần ôn." />}
        </div>
      </details>

      <details className="quiet-details rounded-[24px]">
        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-error" /><div><p className="text-sm font-bold text-strong">Lỗi gần đây</p><p className="text-xs text-muted">Chạm để xem và quay lại bài liên quan</p></div></div>
          <ArrowRight className="h-4 w-4 text-muted" />
        </summary>
        <div className="space-y-2 border-t px-4 py-4">
          {mistakes.length ? mistakes.map(a => (
            <button key={a.id} onClick={() => onOpenLesson?.(foundationLessonById[a.lessonId])} className="mistake-row pressable w-full rounded-2xl p-3 text-left">
              <p className="text-sm font-semibold text-strong">{a.answer || 'No answer'}</p>
              <p className="mt-1 text-xs font-semibold text-success">→ {a.expected}</p>
              <p className="mt-1 text-[11px] font-bold text-error">{(a.errorTags || []).map(t => ERROR_TAGS[t] || t).join(' · ') || 'Cần ôn lại'}</p>
            </button>
          )) : <EmptySmall text="Chưa có lỗi gần đây." />}
        </div>
      </details>

      {session && <ReviewSession items={due} onClose={() => setSession(false)} />}
    </div>
  )
}

function QuickCard({ title, text, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className="quick-practice-card pressable flex min-h-28 items-center justify-between gap-3 rounded-[22px] p-4 text-left">
      <div><div className="quick-icon mb-3 grid h-9 w-9 place-items-center rounded-xl"><Icon className="h-4.5 w-4.5" /></div><p className="text-sm font-bold text-strong">{title}</p><p className="mt-1 text-xs font-medium text-muted">{text}</p></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
    </button>
  )
}

function EmptySmall({ text }) {
  return <div className="muted-row rounded-2xl p-4 text-xs font-medium leading-5 text-muted">{text}</div>
}

function ReviewSession({ items, onClose }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const item = items[index]
  if (!item) return <div />
  const rate = rating => {
    ReviewQueueService.recordRating(item, rating)
    EngagementService.recordReview(item.key)
    if (index >= items.length - 1) onClose()
    else { setIndex(i => i + 1); setOpen(false) }
  }
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center p-4 backdrop-blur-sm" style={{ background: 'var(--overlay)' }}>
      <div className="review-session surface-card w-full max-w-xl rounded-[30px] p-5 sm:p-6" style={{ boxShadow: 'var(--shadow-floating)' }}>
        <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Review {index + 1}/{items.length}</p><button onClick={onClose} className="icon-button" aria-label="Đóng review"><X className="h-5 w-5" /></button></div>
        <div className="mt-6 text-center"><Mascot size={84} mood={open ? 'encouraging' : 'thinking'} withBook={false} className="mx-auto" /><h2 className="mt-3 text-2xl font-extrabold text-strong">{item.prompt}</h2><p className="mt-2 text-sm text-muted">{open ? 'So với câu bạn vừa nhớ trong đầu.' : 'Đừng mở đáp án ngay — thử nhớ trước.'}</p></div>
        {!open ? (
          <button onClick={() => setOpen(true)} className="primary-button pressable mt-6 min-h-[52px] w-full rounded-2xl px-4 text-sm font-bold">Tôi đã nghĩ xong — xem đáp án</button>
        ) : (
          <>
            <div className="review-answer mt-6 rounded-2xl p-4"><p className="text-xs font-bold uppercase tracking-wider text-success">Đáp án</p><p className="mt-2 text-base font-bold text-strong">{item.expected}</p></div>
            <p className="mt-5 text-center text-xs font-semibold text-muted">Bạn nhớ được đến đâu?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button onClick={() => rate(0)} className="rating-danger min-h-12 rounded-xl px-2 text-xs font-bold">Chưa nhớ</button>
              <button onClick={() => rate(.5)} className="rating-warning min-h-12 rounded-xl px-2 text-xs font-bold">Gần đúng</button>
              <button onClick={() => rate(1)} className="rating-success min-h-12 rounded-xl px-2 text-xs font-bold">Nhớ rồi</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
