import React, { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Brain,
  ChevronRight,
  CircleUserRound,
  Home,
  Menu,
  Palette,
  PenLine,
  Puzzle,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import Mascot from './components/Mascot'
import FoundationMap from './components/FoundationMap'
import PracticePage from './components/PracticePage'
import WritingPage from './components/WritingPage'
import LessonEngine from './components/lesson/LessonEngine'
import { ThemeCycleButton, ThemeSegmentedControl } from './components/ThemeProvider'
import { foundationLessons, validateFoundationCurriculum } from './data/foundationCurriculum'
import { getAllProgress, isLessonPassed, resetFoundationProgress } from './lib/learningProgress'
import { getWeakSkills } from './lib/skillMasteryService'
import { ReviewQueueService } from './lib/reviewQueueService'

const nav = [
  { id: 'home', label: 'Trang chủ', short: 'Home', icon: Home },
  { id: 'learn', label: 'Học', short: 'Học', icon: BookOpen },
  { id: 'practice', label: 'Luyện tập', short: 'Luyện', icon: Puzzle },
  { id: 'write', label: 'Viết', short: 'Viết', icon: PenLine },
  { id: 'profile', label: 'Hồ sơ', short: 'Hồ sơ', icon: CircleUserRound },
]

export default function App() {
  const [active, setActive] = useState('home')
  const [drawer, setDrawer] = useState(false)
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(() => getAllProgress())
  const [dataTick, setDataTick] = useState(0)

  useEffect(() => {
    const refreshProgress = () => setProgress(getAllProgress())
    const refreshData = () => setDataTick(value => value + 1)
    window.addEventListener('bunny-progress-updated', refreshProgress)
    window.addEventListener('bunny-attempt-updated', refreshData)
    window.addEventListener('bunny-review-updated', refreshData)
    return () => {
      window.removeEventListener('bunny-progress-updated', refreshProgress)
      window.removeEventListener('bunny-attempt-updated', refreshData)
      window.removeEventListener('bunny-review-updated', refreshData)
    }
  }, [])

  const errors = useMemo(() => validateFoundationCurriculum(), [])
  useEffect(() => {
    if (errors.length) console.error('Curriculum validation errors', errors)
  }, [errors])

  const completed = foundationLessons.filter(lessonItem => isLessonPassed(progress[lessonItem.id])).length
  const firstUnfinished = foundationLessons.find(lessonItem => !isLessonPassed(progress[lessonItem.id])) || foundationLessons.at(-1)
  const openLesson = lessonItem => lessonItem && setLesson(lessonItem)

  return (
    <div className="app-shell min-h-screen hero-glow">
      <Sidebar active={active} setActive={setActive} completed={completed} />
      <MobileHeader onMenu={() => setDrawer(true)} />
      {drawer && <Drawer active={active} setActive={setActive} onClose={() => setDrawer(false)} />}

      <main className="page-frame mx-auto w-full max-w-[1540px] px-4 pb-28 pt-5 sm:px-6 lg:pl-[280px] lg:pr-8 lg:pt-8">
        {active === 'home' && (
          <HomePage
            completed={completed}
            progress={progress}
            current={firstUnfinished}
            onContinue={() => openLesson(firstUnfinished)}
            onLearn={() => setActive('learn')}
            onPractice={() => setActive('practice')}
            dataTick={dataTick}
          />
        )}
        {active === 'learn' && <FoundationMap onOpenLesson={openLesson} />}
        {active === 'practice' && <PracticePage onOpenLesson={openLesson} />}
        {active === 'write' && <WritingPage onOpenLesson={openLesson} />}
        {active === 'profile' && (
          <Profile
            completed={completed}
            dataTick={dataTick}
            onReset={() => {
              if (confirm('Reset all Foundation progress, attempts, and review data?')) resetFoundationProgress()
            }}
          />
        )}
      </main>

      <BottomNav active={active} setActive={setActive} />
      {lesson && (
        <LessonEngine
          lesson={lesson}
          onClose={() => setLesson(null)}
          onComplete={() => {
            setLesson(null)
            setActive('learn')
          }}
        />
      )}
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="brand-mark grid h-10 w-10 place-items-center rounded-2xl">
        <Mascot size={38} withBook={false} />
      </div>
      <div className="leading-none">
        <div className="text-lg font-extrabold tracking-tight">
          <span className="brand-bunny">Bunny</span> <span className="brand-english">English</span>
        </div>
        <div className="brand-tagline mt-1 text-[10px] font-bold uppercase tracking-[.16em]">Learn with clarity</div>
      </div>
    </div>
  )
}

function Sidebar({ active, setActive, completed }) {
  const total = foundationLessons.length
  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-[248px] p-5 backdrop-blur-xl lg:flex lg:flex-col">
      <Logo />
      <div className="foundation-mini mt-7 rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <Mascot size={54} mood="encouraging" />
          <div>
            <p className="text-xs font-semibold text-muted">Foundation</p>
            <p className="mt-0.5 text-xl font-extrabold text-strong">{completed}/{total}</p>
          </div>
        </div>
        <div className="progress-track mt-3 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${(completed / total) * 100}%` }} /></div>
      </div>

      <nav className="mt-6 space-y-2" aria-label="Điều hướng chính">
        {nav.map(item => {
          const Icon = item.icon
          const selected = active === item.id
          return (
            <button key={item.id} onClick={() => setActive(item.id)} className={`nav-item pressable flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${selected ? 'is-active' : ''}`}>
              <span className="nav-icon grid h-9 w-9 place-items-center rounded-xl"><Icon className="h-4.5 w-4.5" /></span>
              {item.label}
              {selected && <ChevronRight className="ml-auto h-4 w-4" />}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl px-1">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted">Giao diện</p>
          <ThemeSegmentedControl compact />
        </div>
        <div className="learning-method rounded-3xl p-4">
          <div className="flex items-center gap-3"><Brain className="h-5 w-5" /><p className="text-sm font-bold">Cách bạn học</p></div>
          <p className="mt-2 text-xs leading-5">Hiểu → Luyện → Tự viết → Nhận phản hồi → Ôn lại.</p>
        </div>
      </div>
    </aside>
  )
}

function MobileHeader({ onMenu }) {
  return (
    <header className="mobile-header sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-xl lg:hidden">
      <button onClick={onMenu} aria-label="Mở menu" className="icon-button pressable"><Menu className="h-5 w-5" /></button>
      <Logo />
      <ThemeCycleButton />
    </header>
  )
}

function Drawer({ active, setActive, onClose }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button onClick={onClose} aria-label="Đóng menu" className="drawer-overlay absolute inset-0" />
      <div className="drawer-panel absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col p-5 shadow-2xl">
        <div className="flex justify-between"><Logo /><button onClick={onClose} aria-label="Đóng menu" className="icon-button"><X className="h-5 w-5" /></button></div>
        <nav className="mt-7 space-y-2">
          {nav.map(item => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => { setActive(item.id); onClose() }} className={`nav-item flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${active === item.id ? 'is-active' : ''}`}>
                <Icon className="h-5 w-5" />{item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs font-bold text-muted">Giao diện</p>
          <ThemeSegmentedControl />
        </div>
      </div>
    </div>
  )
}

function BottomNav({ active, setActive }) {
  return (
    <nav className="bottom-nav fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] p-1.5 backdrop-blur-xl lg:hidden" aria-label="Điều hướng dưới">
      {nav.map(item => {
        const Icon = item.icon
        const selected = active === item.id
        return (
          <button key={item.id} onClick={() => setActive(item.id)} className={`bottom-nav-item pressable flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold ${selected ? 'is-active' : ''}`}>
            <Icon className="h-5 w-5" /><span>{item.short}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomePage({ completed, progress, current, onContinue, onLearn, onPractice, dataTick }) {
  const total = foundationLessons.length
  const percent = Math.round((completed / total) * 100)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const currentProgress = progress[current.id]
  const lessonPercent = currentProgress?.status === 'in_progress' ? Math.round(((currentProgress.lastStep + 1) / current.steps.length) * 100) : 0
  const weak = useMemo(() => getWeakSkills(3), [dataTick])
  const due = useMemo(() => ReviewQueueService.due().length, [dataTick])

  return (
    <div className="space-y-5 page-enter">
      <section className="hero-card surface-card overflow-hidden rounded-[30px]">
        <div className="grid gap-5 p-5 md:grid-cols-[1.25fr_.75fr] md:p-7">
          <div className="flex flex-col justify-center">
            <div className="eyebrow success-eyebrow inline-flex w-fit items-center gap-2"><Sparkles className="h-3.5 w-3.5" />{greeting}</div>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">Sẵn sàng học tiếp không?</h1>
            <p className="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-muted">Học tiếng Anh từng bước, hiểu rõ từ nền tảng. Từ câu đầu tiên đến đoạn văn và bài luận hoàn chỉnh.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onContinue} className="primary-button pressable min-h-12 rounded-2xl px-5 py-3 text-sm font-bold">{completed ? 'Tiếp tục học' : 'Bắt đầu Foundation'}</button>
              <button onClick={onLearn} className="secondary-button pressable min-h-12 rounded-2xl px-5 py-3 text-sm font-bold">Xem lộ trình</button>
            </div>
          </div>
          <div className="hero-illustration relative grid min-h-44 place-items-center rounded-[26px] sm:min-h-52">
            <Mascot size={160} mood="encouraging" />
            <div className="teacher-note absolute bottom-3 right-3 max-w-[185px] rounded-2xl px-3 py-2 text-xs font-semibold">Hiểu rõ rồi mới tiến tiếp.</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="surface-card rounded-[26px] p-5">
          <p className="eyebrow primary-eyebrow">Continue Learning</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div><h2 className="text-2xl font-extrabold text-strong">{current.titleEn}</h2><p className="mt-1 text-sm font-medium text-subtle">Lesson {current.order} · {current.titleVi}</p></div>
            <span className="status-pill primary-pill">{lessonPercent}%</span>
          </div>
          <div className="progress-track mt-4 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${lessonPercent}%` }} /></div>
          <button onClick={onContinue} className="primary-button pressable mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold">Tiếp tục <ChevronRight className="h-4 w-4" /></button>
        </div>

        <div className="surface-card rounded-[26px] p-5">
          <p className="eyebrow warning-eyebrow">Today's Goal</p>
          <div className="mt-4 grid grid-cols-2 gap-3"><Goal value="1" label="lesson" /><Goal value={String(Math.max(5, due))} label="review items" /></div>
          <p className="mt-4 text-xs font-medium leading-5 text-muted">Không có energy system. Học theo nhịp của bạn và nghỉ mắt khi cần.</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-[26px] p-5">
          <div className="flex items-center justify-between gap-4"><div><p className="eyebrow success-eyebrow">Foundation Progress</p><h2 className="mt-1 text-2xl font-extrabold text-strong">{completed} / {total}</h2></div><span className="text-3xl font-extrabold text-success">{percent}%</span></div>
          <div className="progress-track mt-4 h-2 rounded-full"><div className="progress-motion progress-success h-full rounded-full" style={{ width: `${percent}%` }} /></div>
          <div className="mt-5 flex flex-wrap gap-2">{['Foundation', 'Sentence Builder', 'Everyday English', 'Intermediate', 'Writing', 'Academic English', 'College English'].map((item, index) => <span key={item} className={`path-pill ${index === 0 ? 'is-current' : ''}`}>{item}{index > 0 ? ' · later' : ''}</span>)}</div>
        </div>

        <div className="surface-card rounded-[26px] p-5">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Target className="h-5 w-5 text-error" /><p className="eyebrow error-eyebrow">Needs Review</p></div>{due > 0 && <button onClick={onPractice} className="text-link text-xs font-bold">Ôn ngay</button>}</div>
          <div className="mt-4 space-y-3">
            {weak.length ? weak.map(skill => (
              <div key={skill.skillId} className="muted-row flex items-center justify-between rounded-2xl p-3">
                <div><p className="text-sm font-semibold text-strong">{skill.labelVi}</p><p className="mt-1 text-[11px] font-medium text-subtle">{skill.incorrect} lỗi gần đây</p></div>
                <span className="text-xs font-bold text-warning">{skill.masteryScore}%</span>
              </div>
            )) : <div className="muted-row rounded-2xl p-4 text-xs font-medium leading-5 text-muted">Hãy hoàn thành vài bài; Bunny sẽ dùng lỗi thật để tìm điểm cần ôn.</div>}
          </div>
        </div>
      </section>
    </div>
  )
}

function Goal({ value, label }) {
  return <div className="muted-row rounded-2xl p-4 text-center"><p className="text-2xl font-extrabold text-strong">{value}</p><p className="mt-1 text-[11px] font-medium text-muted">{label}</p></div>
}

function Profile({ completed, onReset, dataTick }) {
  const total = foundationLessons.length
  const weak = useMemo(() => getWeakSkills(5), [dataTick])
  return (
    <div className="space-y-5 page-enter">
      <div className="surface-card rounded-[30px] p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="mascot-tile grid h-24 w-24 place-items-center rounded-[28px]"><Mascot size={88} mood="proud" /></div>
          <div><p className="eyebrow primary-eyebrow">Foundation learner</p><h1 className="mt-1 text-3xl font-extrabold text-strong">Your learning profile</h1><p className="mt-2 text-sm text-muted">{completed}/{total} bài đã hoàn thành hoặc test out.</p></div>
        </div>
      </div>

      <div className="surface-card rounded-[28px] p-5">
        <div className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-strong">Appearance</h2></div>
        <p className="mt-2 text-sm font-medium leading-6 text-muted">Chọn giao diện dễ chịu cho mắt. “Theo thiết bị” tự chuyển theo cài đặt hệ thống.</p>
        <div className="mt-4 max-w-xl"><ThemeSegmentedControl /></div>
      </div>

      <div className="surface-card rounded-[28px] p-5">
        <h2 className="text-xl font-bold text-strong">Weakness profile</h2>
        <p className="mt-2 text-xs font-medium leading-5 text-muted">Mastery dùng prior đơn giản để một câu trả lời không tạo cảm giác chính xác giả.</p>
        <div className="mt-4 space-y-2">
          {weak.length ? weak.map(skill => <div key={skill.skillId} className="muted-row flex items-center justify-between rounded-xl p-3"><span className="text-sm font-semibold text-strong">{skill.labelVi}</span><span className="text-xs font-bold text-muted">{skill.masteryScore}% · {skill.attempts} attempts</span></div>) : <p className="muted-row rounded-xl p-3 text-sm text-muted">Chưa đủ dữ liệu để hiển thị điểm yếu.</p>}
        </div>
      </div>

      <button onClick={onReset} className="danger-outline-button pressable inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Reset learning data</button>
    </div>
  )
}
