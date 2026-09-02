import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, GraduationCap, LockKeyhole, Play, Route, Sparkles, X } from 'lucide-react'
import { foundationLessons, foundationChapters, getChapterLessons } from '../data/foundationCurriculum'
import { getAllProgress, isLessonPassed, markLessonsTestedOut } from '../lib/learningProgress'
import Mascot from './Mascot'
import { AssessmentRepository } from '../lib/assessmentRepository'
import { levelRoadmap } from '../data/levelRoadmap'

const chapters=foundationChapters

export default function FoundationMap({onOpenLesson,quickCheckSignal=0,onStartAssessment}){
  const [progress,setProgress]=useState(()=>getAllProgress())
  const [quickCheck,setQuickCheck]=useState(false)
  const [view,setView]=useState('levels')
  const [latestAssessment,setLatestAssessment]=useState(()=>AssessmentRepository.latest('A0'))

  useEffect(()=>{if(quickCheckSignal){setView('a0');setQuickCheck(true)}},[quickCheckSignal])
  useEffect(()=>{
    const refresh=()=>setProgress(getAllProgress())
    const refreshAssessment=()=>setLatestAssessment(AssessmentRepository.latest('A0'))
    window.addEventListener('bunny-progress-updated',refresh)
    window.addEventListener('bunny-assessment-updated',refreshAssessment)
    return()=>{window.removeEventListener('bunny-progress-updated',refresh);window.removeEventListener('bunny-assessment-updated',refreshAssessment)}
  },[])

  const completed=foundationLessons.filter(lesson=>isLessonPassed(progress[lesson.id])).length
  const percent=Math.round((completed/foundationLessons.length)*100)
  const currentLesson=foundationLessons.find(lesson=>!isLessonPassed(progress[lesson.id]))||foundationLessons.at(-1)
  const currentChapter=chapters.find(chapter=>chapter.lessonIds.includes(currentLesson.id))||chapters[0]
  const unlockMap=useMemo(()=>Object.fromEntries(foundationLessons.map((lesson,index)=>[lesson.id,index===0||isLessonPassed(progress[foundationLessons[index-1]?.id])||isLessonPassed(progress[lesson.id])])),[progress])

  if(view==='levels') return <LearningPathOverview completed={completed} percent={percent} currentLesson={currentLesson} currentChapter={currentChapter} latestAssessment={latestAssessment} onOpenA0={()=>setView('a0')} onOpenCurrent={()=>onOpenLesson(currentLesson)} onStartAssessment={onStartAssessment}/>

  return <>
    <A0Journey completed={completed} percent={percent} currentLesson={currentLesson} currentChapter={currentChapter} progress={progress} unlockMap={unlockMap} latestAssessment={latestAssessment} onBack={()=>setView('levels')} onOpenLesson={onOpenLesson} onQuickCheck={()=>setQuickCheck(true)} onStartAssessment={onStartAssessment}/>
    {quickCheck&&<QuickCheck onClose={()=>setQuickCheck(false)}/>} 
  </>
}

function LearningPathOverview({completed,percent,currentLesson,currentChapter,latestAssessment,onOpenA0,onOpenCurrent,onStartAssessment}){
  return <div className="clean-learn space-y-5 page-enter">
    <section className="clean-learn-intro">
      <p className="eyebrow primary-eyebrow">Lộ trình học của bạn</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">Từ câu tiếng Anh đầu tiên đến viết và nói ở trình độ cao.</h1>
      <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted">Học từng cấp độ. Mỗi cấp có mục tiêu rõ ràng và một bài kiểm tra để bạn biết mình đã sẵn sàng đi tiếp hay chưa.</p>
    </section>

    <section className="level-card-active rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><span className="level-pill">A0 · Starter</span><span className="text-xs font-bold text-muted">{completed}/{foundationLessons.length} bài</span></div>
          <h2 className="mt-3 text-2xl font-extrabold text-strong">Nền tảng khởi đầu</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted">Hiểu cách câu tiếng Anh cơ bản hoạt động, giao tiếp đơn giản và tự viết những câu đầu tiên.</p>
          <div className="mt-5 progress-track h-2.5 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{width:`${percent}%`}}/></div>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold"><span className="text-muted">Hiện tại: <strong className="text-strong">{currentChapter.titleVi}</strong></span><span className="text-primary">{percent}%</span></div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><button onClick={onOpenCurrent} className="primary-button pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"><Play className="h-4 w-4"/>{completed===foundationLessons.length?'Ôn bài gần nhất':'Tiếp tục A0'}</button><button onClick={onOpenA0} className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700">Xem hành trình <ChevronRight className="h-4 w-4"/></button><button onClick={onStartAssessment} className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-violet-700"><GraduationCap className="h-4 w-4"/>{latestAssessment?.passed?`A0 đã đạt · ${latestAssessment.overall}%`:'Kiểm tra A0'}</button></div>
        </div>
        <div className="hidden w-40 shrink-0 place-items-center md:grid"><Mascot size={126} mood="encouraging"/></div>
      </div>
    </section>

    <section className="surface-card overflow-hidden rounded-[26px]">
      <div className="border-b px-5 py-4"><p className="text-sm font-extrabold text-strong">Các cấp độ tiếp theo</p><p className="mt-1 text-xs font-medium text-muted">A1 → C2 sẽ dùng cùng hệ thống bài học và bài kiểm tra theo cấp độ.</p></div>
      <div className="divide-y">{levelRoadmap.slice(1).map((level,index)=><div key={level.id} className="future-level-row flex items-center gap-4 px-5 py-4"><div className="level-index grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold">{level.id}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="text-sm font-extrabold text-strong">{level.titleVi}</h3><span className="text-[10px] font-bold uppercase tracking-[.1em] text-muted">Sắp tới</span></div><p className="mt-1 text-xs font-medium leading-5 text-muted">{level.goalVi}</p></div><LockKeyhole className="h-4 w-4 shrink-0 text-slate-300"/></div>)}</div>
    </section>
  </div>
}

function A0Journey({completed,percent,currentLesson,currentChapter,progress,unlockMap,latestAssessment,onBack,onOpenLesson,onQuickCheck,onStartAssessment}){
  const [expanded,setExpanded]=useState(currentChapter.id)
  useEffect(()=>setExpanded(currentChapter.id),[currentChapter.id])
  return <div className="clean-learn space-y-5 page-enter">
    <button onClick={onBack} className="pressable inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-bold text-muted"><ArrowLeft className="h-4 w-4"/>Tất cả cấp độ</button>
    <section className="surface-card rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow primary-eyebrow">Hành trình A0</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-strong">Starter Foundation</h1><p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted">Học từng bài một. Mỗi bài chỉ có vài bước ngắn: quan sát, nghe Bunny giải thích, luyện tập, nói hoặc viết và ôn lại.</p></div><div className="text-left sm:text-right"><p className="text-2xl font-extrabold text-primary">{completed}/{foundationLessons.length}</p><p className="text-xs font-medium text-muted">bài hoàn thành</p></div></div>
      <div className="progress-track mt-5 h-2.5 rounded-full"><div className="progress-motion progress-primary h-full rounded-full" style={{width:`${percent}%`}}/></div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><button onClick={()=>onOpenLesson(currentLesson)} className="primary-button pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"><Play className="h-4 w-4"/>{isLessonPassed(progress[currentLesson.id])?'Ôn bài gần nhất':'Tiếp tục bài tiếp theo'}</button><button onClick={onQuickCheck} className="pressable min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">Kiểm tra nhanh phần khởi động</button><button onClick={onStartAssessment} className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-violet-700"><GraduationCap className="h-4 w-4"/>{latestAssessment?.passed?'Xem / làm lại kiểm tra A0':'Làm kiểm tra cuối A0'}</button></div>
    </section>

    <div className="space-y-3">{chapters.map((chapter,index)=><CleanChapter key={chapter.id} chapter={chapter} index={index} progress={progress} unlockMap={unlockMap} currentLessonId={currentLesson.id} expanded={expanded===chapter.id} current={currentChapter.id===chapter.id} onToggle={()=>setExpanded(expanded===chapter.id?null:chapter.id)} onOpenLesson={onOpenLesson}/>)}</div>
    <div className="finish-note flex items-start gap-3 rounded-2xl p-4"><Route className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><div><p className="text-sm font-bold text-strong">Sau A0, Bunny sẽ chuyển sang A1 Everyday English.</p><p className="mt-1 text-xs font-medium leading-5 text-muted">Các cấp sau sẽ tiếp tục cùng nguyên tắc: hiểu ý nghĩa trước, dùng tiếng Anh thật, rồi kiểm tra khả năng ở cuối cấp.</p></div></div>
  </div>
}

function CleanChapter({chapter,index,progress,unlockMap,currentLessonId,expanded,current,onToggle,onOpenLesson}){
  const lessons=getChapterLessons(chapter.id)
  const done=lessons.filter(lesson=>isLessonPassed(progress[lesson.id])).length
  const pct=lessons.length?Math.round((done/lessons.length)*100):0
  const complete=done===lessons.length
  return <section className={`clean-unit rounded-[26px] ${current?'is-current':''} ${complete?'is-complete':''}`}>
    <button onClick={onToggle} className="pressable flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5">
      <div className="unit-number grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-extrabold">{chapter.optional?'0':index}</div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[.1em] text-muted">{chapter.optional?'Khởi động tùy chọn':`Chặng ${index}`}</p>{current&&<span className="up-next-badge">Bạn đang ở đây</span>}{complete&&<span className="complete-badge"><Check className="h-3 w-3"/>Hoàn thành</span>}</div><h2 className="mt-1 text-lg font-extrabold text-strong">{chapter.titleVi}</h2><p className="mt-1 text-xs font-medium leading-5 text-muted">{chapter.outcomeVi}</p></div>
      <div className="hidden shrink-0 text-right sm:block"><p className="text-xs font-extrabold text-strong">{done}/{lessons.length}</p><p className="text-[10px] font-medium text-muted">{pct}%</p></div><ChevronDown className={`h-5 w-5 shrink-0 text-muted transition ${expanded?'rotate-180':''}`}/>
    </button>
    {expanded&&<div className="clean-unit-body border-t px-3 py-3 sm:px-5 sm:py-4"><div className="divide-y divide-slate-100">{lessons.map(lesson=><CleanLesson key={lesson.id} lesson={lesson} progress={progress[lesson.id]} unlocked={unlockMap[lesson.id]} upNext={lesson.id===currentLessonId&&!isLessonPassed(progress[lesson.id])} onOpen={()=>onOpenLesson(lesson)}/>)}</div>{complete&&<div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><Sparkles className="h-4 w-4"/>Bạn đã hoàn thành chặng này.</div>}</div>}
  </section>
}

function CleanLesson({lesson,progress,unlocked,upNext,onOpen}){
  const passed=isLessonPassed(progress)
  const inProgress=progress?.status==='in_progress'
  const status=passed?'Hoàn thành':upNext?(inProgress?'Đang học':'Tiếp theo'):unlocked?'Có thể học':'Khóa'
  return <button disabled={!unlocked} onClick={()=>unlocked&&onOpen()} className={`clean-lesson-row pressable flex w-full items-center gap-3 py-3 text-left ${!unlocked?'is-locked':''} ${upNext?'is-up-next':''}`}>
    <div className={`lesson-status-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl ${passed?'is-passed':upNext?'is-next':unlocked?'is-open':'is-locked'}`}>{passed?<Check className="h-4 w-4"/>:unlocked?<span className="text-xs font-extrabold">{lesson.order}</span>:<LockKeyhole className="h-3.5 w-3.5"/>}</div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-sm font-extrabold text-strong">{lesson.titleEn}</p>{upNext&&<span className="up-next-badge">{status}</span>}</div><p className="mt-0.5 text-xs font-medium text-muted">{lesson.titleVi}</p><div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{lesson.minutes} phút</span><span>{lesson.steps?.length||0} bước ngắn</span>{passed&&!upNext&&<span className="text-emerald-700">{status}</span>}</div></div>
    {unlocked&&<ChevronRight className="h-4 w-4 shrink-0 text-slate-300"/>}
  </button>
}

const quickQuestions=[
  {q:'Câu nào bắt đầu bằng chữ hoa và kết thúc đúng?',opts:['i am ready.','I am ready.','I am ready','i am ready'],a:1},
  {q:'Đâu là một từ tiếng Anh?',opts:['apple','apple school','I am ready.','?'],a:0},
  {q:'Tiếng Anh được đọc theo hướng nào?',opts:['Phải → trái','Trái → phải','Tùy ý','Từ dưới lên'],a:1},
  {q:'Câu nào là một câu hoàn chỉnh cơ bản?',opts:['My teacher','Runs fast','Birds fly.','Very happy'],a:2},
]
function QuickCheck({onClose}){
  const [answers,setAnswers]=useState({})
  const [done,setDone]=useState(false)
  const score=quickQuestions.filter((question,index)=>answers[index]===question.a).length
  const submit=()=>{setDone(true);if(score>=3)markLessonsTestedOut(foundationLessons.slice(0,4).map(lesson=>lesson.id))}
  return <div className="fixed inset-0 z-[95] overflow-y-auto p-4 backdrop-blur-sm" style={{background:'var(--overlay)'}}><div className="surface-card mx-auto mt-8 max-w-2xl rounded-[30px] p-5 sm:p-6" style={{boxShadow:'var(--shadow-floating)'}}><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><Mascot size={74} mood="thinking"/><div><p className="eyebrow primary-eyebrow">Kiểm tra nhanh</p><h2 className="mt-1 text-2xl font-extrabold text-strong">Bạn đã biết phần mở đầu chưa?</h2></div></div><button onClick={onClose} aria-label="Đóng kiểm tra nhanh" className="icon-button"><X className="h-5 w-5"/></button></div><p className="mt-3 text-sm font-medium leading-6 text-muted">Đạt 3/4 câu để bỏ qua 4 bài rất cơ bản. Bạn vẫn có thể mở lại chúng bất cứ lúc nào.</p><div className="mt-5 space-y-5">{quickQuestions.map((question,index)=><div key={question.q}><p className="text-sm font-semibold text-strong">{index+1}. {question.q}</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{question.opts.map((option,optionIndex)=><button key={option} disabled={done} onClick={()=>setAnswers(value=>({...value,[index]:optionIndex}))} className={`quick-option min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold ${answers[index]===optionIndex?'is-selected':''}`}>{option}</button>)}</div></div>)}</div>{done?<div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${score>=3?'review-success':'review-warning'}`}>{score}/4 đúng. {score>=3?'Bạn đã vượt qua phần mở đầu; 4 bài đầu được đánh dấu “tested out”.':'Hãy bắt đầu từ bài 1 để xây nền thật chắc.'}</div>:<button disabled={Object.keys(answers).length<quickQuestions.length} onClick={submit} className="primary-button pressable mt-5 min-h-12 w-full rounded-2xl px-4 text-sm font-bold disabled:opacity-40">Kiểm tra kết quả</button>}</div></div>
}
