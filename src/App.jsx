import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  CircleUserRound,
  Flame,
  Home,
  Menu,
  Palette,
  PenLine,
  Puzzle,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import Mascot from './components/Mascot'
import FoundationMap from './components/FoundationMap'
import PracticePage from './components/PracticePage'
import WritingPage from './components/WritingPage'
import LevelAssessment from './components/LevelAssessment'
import LessonEngine from './components/lesson/LessonEngine'
import { ThemeCycleButton, ThemeSegmentedControl } from './components/ThemeProvider'
import { foundationLessons, validateFoundationCurriculum } from './data/foundationCurriculum'
import { getAllProgress, isLessonPassed, resetFoundationProgress } from './lib/learningProgress'
import { getWeakSkills } from './lib/skillMasteryService'
import { ReviewQueueService } from './lib/reviewQueueService'
import { EngagementService } from './lib/engagementService'
import { SoundEffectsService } from './lib/soundEffectsService'
import { AudioService } from './lib/audioService'
import { AssessmentRepository } from './lib/assessmentRepository'

const desktopNav = [
  { id: 'home', label: 'Trang chủ', short: 'Home', icon: Home },
  { id: 'learn', label: 'Học', short: 'Học', icon: BookOpen },
  { id: 'practice', label: 'Luyện tập', short: 'Luyện', icon: Puzzle },
  { id: 'write', label: 'Viết', short: 'Viết', icon: PenLine },
  { id: 'profile', label: 'Hồ sơ', short: 'Tôi', icon: CircleUserRound },
]

const mobileNav = desktopNav.filter(item => item.id !== 'write')

export default function App() {
  const [active, setActive] = useState('home')
  const [drawer, setDrawer] = useState(false)
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(() => getAllProgress())
  const [dataTick, setDataTick] = useState(0)
  const [quickCheckSignal, setQuickCheckSignal] = useState(0)
  const [assessmentOpen, setAssessmentOpen] = useState(false)

  useEffect(() => {
    const refreshProgress = () => setProgress(getAllProgress())
    const refreshData = () => setDataTick(value => value + 1)
    window.addEventListener('bunny-progress-updated', refreshProgress)
    window.addEventListener('bunny-attempt-updated', refreshData)
    window.addEventListener('bunny-review-updated', refreshData)
    window.addEventListener('bunny-engagement-updated', refreshData)
    window.addEventListener('bunny-assessment-updated', refreshData)
    return () => {
      window.removeEventListener('bunny-progress-updated', refreshProgress)
      window.removeEventListener('bunny-attempt-updated', refreshData)
      window.removeEventListener('bunny-review-updated', refreshData)
      window.removeEventListener('bunny-engagement-updated', refreshData)
      window.removeEventListener('bunny-assessment-updated', refreshData)
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

      <main className="page-frame mx-auto w-full max-w-[1460px] px-4 pb-28 pt-4 sm:px-6 lg:pl-[274px] lg:pr-8 lg:pt-7">
        {active === 'home' && (
          <HomePage
            completed={completed}
            progress={progress}
            current={firstUnfinished}
            onContinue={() => openLesson(firstUnfinished)}
            onLearn={() => setActive('learn')}
            onPractice={() => setActive('practice')}
            onQuickCheck={() => { setActive('learn'); setQuickCheckSignal(value => value + 1) }}
            dataTick={dataTick}
          />
        )}
        {active === 'learn' && <FoundationMap onOpenLesson={openLesson} quickCheckSignal={quickCheckSignal} onStartAssessment={() => setAssessmentOpen(true)} />}
        {active === 'practice' && <PracticePage onOpenLesson={openLesson} onOpenWriting={() => setActive('write')} />}
        {active === 'write' && <WritingPage onOpenLesson={openLesson} />}
        {active === 'profile' && (
          <Profile
            completed={completed}
            dataTick={dataTick}
            onReset={() => {
              if (confirm('Xóa toàn bộ tiến độ A0, lịch sử làm bài, phần ôn tập và dữ liệu động lực?')) resetFoundationProgress()
            }}
          />
        )}
      </main>

      <BottomNav active={active} setActive={setActive} />
      {assessmentOpen && <LevelAssessment onClose={() => setAssessmentOpen(false)} />}
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

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`brand-mark grid place-items-center rounded-2xl ${compact ? 'h-9 w-9' : 'h-10 w-10'}`}>
        <Mascot size={compact ? 34 : 38} withBook={false} />
      </div>
      <div className="leading-none">
        <div className={`${compact ? 'text-base' : 'text-lg'} font-extrabold tracking-tight`}>
          <span className="brand-bunny">Bunny</span> <span className="brand-english">English</span>
        </div>
        {!compact && <div className="brand-tagline mt-1 text-[10px] font-bold uppercase tracking-[.16em]">Learn with clarity</div>}
      </div>
    </div>
  )
}

function Sidebar({ active, setActive, completed }) {
  const total = foundationLessons.length
  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-[244px] p-5 backdrop-blur-xl lg:flex lg:flex-col">
      <Logo />
      <div className="foundation-mini mt-7 rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <Mascot size={54} mood="encouraging" />
          <div>
            <p className="text-xs font-semibold text-muted">A0 · Starter</p>
            <p className="mt-0.5 text-xl font-extrabold text-strong">{completed}/{total}</p>
          </div>
        </div>
        <div className="progress-track mt-3 h-2 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${(completed / total) * 100}%` }} /></div>
      </div>

      <nav className="mt-6 space-y-1.5" aria-label="Điều hướng chính">
        {desktopNav.map(item => {
          const Icon = item.icon
          const selected = active === item.id
          return (
            <button key={item.id} onClick={() => setActive(item.id)} className={`nav-item pressable flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold ${selected ? 'is-active' : ''}`}>
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
          <p className="mt-2 text-xs leading-5">Khám phá → Nhận ra → Hiểu → Nghe → Nói → Xây → Tự viết → Ôn lại.</p>
        </div>
      </div>
    </aside>
  )
}

function MobileHeader({ onMenu }) {
  return (
    <header className="mobile-header sticky top-0 z-30 flex items-center justify-between px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <button onClick={onMenu} aria-label="Mở menu" className="icon-button pressable"><Menu className="h-5 w-5" /></button>
      <Logo compact />
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
          {desktopNav.map(item => {
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
    <nav className="bottom-nav fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-[22px] p-1.5 backdrop-blur-xl lg:hidden" aria-label="Điều hướng dưới">
      {mobileNav.map(item => {
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

function HomePage({ completed, progress, current, onContinue, onLearn, onPractice, onQuickCheck, dataTick }) {
  const total = foundationLessons.length
  const percent = Math.round((completed / total) * 100)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const currentProgress = progress[current.id]
  const hasStarted = Object.values(progress || {}).some(item => item && item.status && item.status !== 'not_started')
  const lessonPercent = currentProgress?.status === 'in_progress' ? Math.round(((currentProgress.lastStep + 1) / current.steps.length) * 100) : 0
  const weak = useMemo(() => getWeakSkills(2), [dataTick])
  const due = useMemo(() => ReviewQueueService.due().length, [dataTick])
  const engagement = useMemo(() => EngagementService.summary(), [dataTick, completed, due])

  return (
    <div className="home-simple space-y-4 page-enter">
      <section className="welcome-line flex items-center gap-3 px-1 py-1 sm:gap-4">
        <div className="welcome-bunny grid h-16 w-16 shrink-0 place-items-center rounded-[22px]"><Mascot size={64} mood="happy" withBook={false} /></div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">{greeting} 👋</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">Mỗi ngày một bước rõ ràng.</h1>
          <p className="mt-1 hidden text-sm font-medium text-muted sm:block">Bunny sẽ đưa bạn đến đúng hoạt động tiếp theo.</p>
        </div>
      </section>

      <section className="continue-stage overflow-hidden rounded-[30px]">
        <div className="grid gap-2 p-5 sm:p-6 md:grid-cols-[1fr_230px] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-primary"><Sparkles className="h-4 w-4" />Tiếp tục ở đây</div>
            <p className="mt-4 text-xs font-semibold text-muted">Lesson {current.order} · {Math.max(lessonPercent, 0)}% hoàn thành</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">{current.titleEn}</h2>
            <p className="mt-1 text-base font-semibold text-muted">{current.titleVi}</p>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted">{current.objectiveVi}</p>
            <div className="progress-track mt-5 h-2.5 max-w-xl rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{ width: `${lessonPercent}%` }} /></div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button onClick={onContinue} className="primary-button pressable inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold sm:w-auto">
                {!hasStarted ? 'Tôi hoàn toàn mới — bắt đầu' : 'Tiếp tục học'} <ArrowRight className="h-5 w-5" />
              </button>
              {!hasStarted && <button onClick={onQuickCheck} className="pressable inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 sm:w-auto">Tôi đã biết bảng chữ cái · Kiểm tra nhanh</button>}
            </div>
            {!hasStarted && <p className="mt-3 text-xs font-medium leading-5 text-muted">Nếu bạn đã biết bảng chữ cái và cách đọc chữ cơ bản, hãy làm Kiểm tra nhanh để đi thẳng tới phần phù hợp.</p>}
          </div>
          <div className="continue-mascot relative hidden min-h-52 place-items-center md:grid">
            <Mascot size={160} mood="encouraging" />
            <div className="speech-chip absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">Một bước rõ ràng mỗi lần ✨</div>
          </div>
        </div>
      </section>

      <section className="momentum-strip grid grid-cols-3 gap-2 rounded-[24px] p-2.5 sm:gap-3 sm:p-3">
        <Momentum icon={Flame} value={engagement.streak ? `${engagement.streak}` : '—'} label="ngày streak" tone="warm" />
        <Momentum icon={Star} value={String(engagement.xp)} label="XP đã kiếm" tone="gold" />
        <Momentum icon={Target} value={`${Number(engagement.goal.lessonDone) + Number(engagement.goal.reviewDone)}/2`} label="mục tiêu hôm nay" tone="blue" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button onClick={onPractice} className="home-action review-action pressable rounded-[24px] p-4 text-left sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.13em] text-warning">Ôn nhanh</p>
              <h3 className="mt-1 text-xl font-bold text-strong">{due ? `${due} mục đang chờ` : 'Trí nhớ đang ổn'}</h3>
              <p className="mt-1 text-sm font-medium leading-5 text-muted">{due ? 'Ôn những gì Bunny biết bạn dễ quên.' : 'Bạn có thể luyện nhanh bất cứ lúc nào.'}</p>
            </div>
            <div className="action-orb"><Puzzle className="h-5 w-5" /></div>
          </div>
        </button>

        <button onClick={onLearn} className="home-action path-action pressable rounded-[24px] p-4 text-left sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.13em] text-primary">Lộ trình</p>
              <h3 className="mt-1 text-xl font-bold text-strong">A0 Starter {completed}/{total}</h3>
              <p className="mt-1 text-sm font-medium leading-5 text-muted">{percent}% hoàn thành · xem hành trình tiếp theo.</p>
            </div>
            <div className="action-orb"><BookOpen className="h-5 w-5" /></div>
          </div>
        </button>
      </section>

      {weak.length > 0 && (
        <details className="quiet-details rounded-[22px]">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-muted">
            <span>Bunny nhận thấy {weak.length} điểm nên luyện thêm</span><ChevronRight className="h-4 w-4" />
          </summary>
          <div className="grid gap-2 border-t px-4 py-3 sm:grid-cols-2">
            {weak.map(skill => <div key={skill.skillId} className="muted-row rounded-xl p-3"><p className="text-sm font-semibold text-strong">{skill.labelVi}</p><p className="mt-1 text-xs text-muted">{skill.incorrect} lỗi gần đây · {skill.masteryScore}% nắm vững</p></div>)}
          </div>
        </details>
      )}
    </div>
  )
}

function Momentum({ icon: Icon, value, label, tone }) {
  return (
    <div className={`momentum-item ${tone} flex min-w-0 items-center justify-center gap-2 rounded-[18px] px-2 py-3 sm:px-3`}>
      <Icon className="h-4 w-4 shrink-0" />
      <div className="min-w-0"><p className="text-sm font-extrabold leading-none text-strong sm:text-base">{value}</p><p className="mt-1 truncate text-[10px] font-semibold text-muted sm:text-[11px]">{label}</p></div>
    </div>
  )
}


function SoundSettings() {
  const [settings, setSettings] = useState(() => SoundEffectsService.getSettings())
  useEffect(() => {
    const refresh = () => setSettings(SoundEffectsService.getSettings())
    window.addEventListener('bunny-sound-settings-updated', refresh)
    return () => window.removeEventListener('bunny-sound-settings-updated', refresh)
  }, [])
  const toggle = () => SoundEffectsService.setEnabled(!settings.enabled)
  const volume = value => { SoundEffectsService.setVolume(value); setTimeout(() => SoundEffectsService.correct(), 30) }
  return (
    <div className="surface-card rounded-[28px] p-5">
      <div className="flex items-center gap-2">{settings.enabled ? <Volume2 className="h-5 w-5 text-primary"/> : <VolumeX className="h-5 w-5 text-muted"/>}<h2 className="text-xl font-bold text-strong">Âm thanh phản hồi</h2></div>
      <p className="mt-2 text-sm font-medium leading-6 text-muted">Âm đúng/sai ngắn giúp bài học có nhịp và vui hơn. Âm sai được giữ nhẹ để không biến lỗi thành hình phạt.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button onClick={toggle} className={`pressable min-h-11 rounded-2xl border px-4 text-sm font-bold ${settings.enabled ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}>{settings.enabled ? 'Đang bật' : 'Đang tắt'}</button>
        <div className="grid flex-1 grid-cols-3 gap-2 sm:max-w-sm" aria-label="Âm lượng">
          {[['low','Nhỏ'],['medium','Vừa'],['high','Lớn']].map(([value,label]) => <button key={value} disabled={!settings.enabled} onClick={() => volume(value)} className={`pressable min-h-11 rounded-xl border text-xs font-bold ${settings.volume === value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'} disabled:opacity-40`}>{label}</button>)}
        </div>
        <button disabled={!settings.enabled} onClick={() => SoundEffectsService.preview('correct')} className="pressable min-h-11 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 disabled:opacity-40">Nghe thử ✓</button>
      </div>
    </div>
  )
}


function VoiceSettings() {
  const [settings,setSettings]=useState(()=>AudioService.getSettings())
  const [status,setStatus]=useState(()=>AudioService.getStatus())
  const [previewing,setPreviewing]=useState(null)
  useEffect(()=>{
    const refresh=()=>setSettings(AudioService.getSettings())
    const refreshStatus=e=>setStatus(e?.detail||AudioService.getStatus())
    window.addEventListener('bunny-voice-settings-updated',refresh)
    window.addEventListener('bunny-voice-status-updated',refreshStatus)
    return()=>{window.removeEventListener('bunny-voice-settings-updated',refresh);window.removeEventListener('bunny-voice-status-updated',refreshStatus)}
  },[])
  const chooseProvider=value=>{AudioService.stop();AudioService.setProvider(value);setSettings(AudioService.getSettings())}
  const chooseVoice=voice=>{AudioService.setTeacherVoice(voice);setSettings(AudioService.getSettings())}
  const preview=async voice=>{if(previewing)return;setPreviewing(voice);await AudioService.preview(voice);setPreviewing(null);setStatus(AudioService.getStatus())}
  const statusText=status.state==='loading'?'Đang tải giọng chất lượng cao lần đầu…':status.state==='ready'?'Giọng Kokoro đã sẵn sàng trên thiết bị này.':status.state==='error'?'Không tải được Kokoro; Bunny sẽ tự dùng giọng trình duyệt để bài học không bị chặn.':'Kokoro sẽ được tải khi bạn nghe lần đầu.'
  return <div className="surface-card rounded-[28px] p-5">
    <div className="flex items-center gap-2"><Volume2 className="h-5 w-5 text-primary"/><h2 className="text-xl font-bold text-strong">Giọng đọc bài học</h2></div>
    <p className="mt-2 text-sm font-medium leading-6 text-muted">Kokoro cho giọng tự nhiên hơn và chạy ngay trong trình duyệt. Lần đầu dùng cần tải mô hình khoảng 90–100 MB; sau đó trình duyệt có thể dùng lại từ bộ nhớ đệm.</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <button onClick={()=>chooseProvider('kokoro')} className={`pressable min-h-12 rounded-2xl border px-4 text-left text-sm font-bold ${settings.provider==='kokoro'?'border-blue-400 bg-blue-50 text-blue-800':'border-slate-200 bg-white text-slate-700'}`}><span className="block">✨ Giọng tự nhiên · Kokoro</span><span className="mt-1 block text-[11px] font-medium opacity-70">Mặc định · chất lượng cao</span></button>
      <button onClick={()=>chooseProvider('browser')} className={`pressable min-h-12 rounded-2xl border px-4 text-left text-sm font-bold ${settings.provider==='browser'?'border-blue-400 bg-blue-50 text-blue-800':'border-slate-200 bg-white text-slate-700'}`}><span className="block">🔊 Giọng trình duyệt</span><span className="mt-1 block text-[11px] font-medium opacity-70">Nhanh hơn · dùng khi thiết bị yếu</span></button>
    </div>
    {settings.provider==='kokoro'&&<>
      <p className="mt-5 text-xs font-black uppercase tracking-[.12em] text-muted">Giọng Bunny giáo viên</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{AudioService.voices.teacher.map(item=><div key={item.id} className={`flex items-center gap-2 rounded-2xl border p-2 ${settings.teacherVoice===item.id?'border-blue-300 bg-blue-50':'border-slate-200 bg-white'}`}><button onClick={()=>chooseVoice(item.id)} className="min-h-10 flex-1 rounded-xl px-2 text-left text-xs font-bold text-strong">{item.label}</button><button onClick={()=>preview(item.id)} disabled={!!previewing} className="pressable min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-blue-700 disabled:opacity-50">{previewing===item.id?'Đang tải…':'Nghe thử'}</button></div>)}</div>
      <div className={`mt-4 rounded-2xl border p-3 text-xs font-semibold leading-5 ${status.state==='error'?'border-amber-200 bg-amber-50 text-amber-900':'border-blue-100 bg-blue-50 text-blue-900'}`}>{statusText}<span className="mt-1 block font-medium opacity-75">Bài nghe dùng thêm Bella và Michael để người học không quen chỉ một giọng.</span></div>
    </>}
  </div>
}

function Profile({ completed, onReset, dataTick }) {
  const total = foundationLessons.length
  const weak = useMemo(() => getWeakSkills(5), [dataTick])
  const engagement = useMemo(() => EngagementService.summary(), [dataTick, completed])
  const latestA0 = useMemo(() => AssessmentRepository.latest('A0'), [dataTick])
  return (
    <div className="space-y-5 page-enter">
      <div className="surface-card rounded-[30px] p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="mascot-tile grid h-24 w-24 place-items-center rounded-[28px]"><Mascot size={88} mood="proud" /></div>
          <div><p className="eyebrow primary-eyebrow">Người học A0 · Khởi đầu</p><h1 className="mt-1 text-3xl font-extrabold text-strong">Tiến độ của bạn</h1><p className="mt-2 text-sm text-muted">{completed}/{total} bài đã hoàn thành hoặc vượt qua kiểm tra nhanh · {engagement.xp} XP · chuỗi {engagement.streak} ngày.</p></div>
        </div>
      </div>

      <div className="surface-card rounded-[28px] p-5">
        <div className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-strong">Giao diện</h2></div>
        <p className="mt-2 text-sm font-medium leading-6 text-muted">Chọn giao diện dễ chịu cho mắt. “Theo thiết bị” tự chuyển theo cài đặt hệ thống.</p>
        <div className="mt-4 max-w-xl"><ThemeSegmentedControl /></div>
      </div>

      <SoundSettings />

      <VoiceSettings />

      <div className="surface-card rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.13em] text-primary">Kiểm tra trình độ</p><h2 className="mt-1 text-xl font-bold text-strong">Kết quả A0 gần nhất</h2></div>{latestA0&&<span className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${latestA0.passed?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{latestA0.overall}%</span>}</div>
        {latestA0 ? <p className="mt-2 text-sm font-medium leading-6 text-muted">{latestA0.passed ? 'Đã đạt A0 · bạn sẵn sàng học A1 khi cấp tiếp theo mở.' : 'Chưa đạt A0. Kết quả bên dưới cho biết phần nào nên ôn trước.'}</p> : <p className="mt-2 text-sm font-medium leading-6 text-muted">Chưa có kết quả. Bạn có thể mở Học → Kiểm tra trình độ A0.</p>}
      </div>

      <div className="surface-card rounded-[28px] p-5">
        <h2 className="text-xl font-bold text-strong">Điểm cần luyện thêm</h2>
        <p className="mt-2 text-xs font-medium leading-5 text-muted">Mức độ nắm vững được tính từ nhiều lần luyện, không coi một câu đúng là đã thành thạo.</p>
        <div className="mt-4 space-y-2">
          {weak.length ? weak.map(skill => <div key={skill.skillId} className="muted-row flex items-center justify-between rounded-xl p-3"><span className="text-sm font-semibold text-strong">{skill.labelVi}</span><span className="text-xs font-bold text-muted">{skill.masteryScore}% · {skill.attempts} lượt</span></div>) : <p className="muted-row rounded-xl p-3 text-sm text-muted">Chưa đủ dữ liệu để hiển thị điểm yếu.</p>}
        </div>
      </div>

      <button onClick={onReset} className="danger-outline-button pressable inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Xóa dữ liệu học tập</button>
    </div>
  )
}
