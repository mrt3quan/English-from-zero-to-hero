import React from 'react'
import { GraduationCap, Lightbulb } from 'lucide-react'
import Mascot from '../Mascot'
import { getTeacherGuide, getTeacherStepTalk } from '../../data/teacherGuides'

export default function TeacherGuide({lesson,step,stepIndex=0,compact=false}){
  const guide=getTeacherGuide(lesson?.id)
  const talk=getTeacherStepTalk({lessonId:lesson?.id,step,stepIndex})
  const mood=teacherMood(step)

  return <div className={`teacher-guide ${compact?'teacher-guide-compact':''} mb-5 rounded-[24px] border p-3.5 sm:p-4`}>
    <div className="flex items-start gap-3">
      <div className="teacher-avatar shrink-0 rounded-2xl p-1"><Mascot size={compact?48:62} mood={mood} withBook={step?.type!=='production'} activity={step?.type==='production'?'writing':null}/></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.13em] text-primary"><GraduationCap className="h-3.5 w-3.5"/> Bunny · Giáo viên</span>{stepIndex===0&&<span className="teacher-badge rounded-full px-2 py-1 text-[9px] font-bold">Bài {lesson?.order}</span>}</div>
        <p className="mt-1.5 text-[14px] font-semibold leading-6 text-strong sm:text-[15px]">{talk}</p>
        {stepIndex===0&&!compact&&<div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-xs font-medium leading-5 text-muted teacher-why"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"/><span><strong className="text-strong">Bài này giúp bạn làm được gì?</strong> {guide.why}</span></div>}
      </div>
    </div>
  </div>
}

function teacherMood(step){
  if(step?.type==='exercise') return 'thinking'
  if(step?.type==='production') return 'encouraging'
  if(step?.type==='review') return 'proud'
  if(step?.type==='speak') return 'encouraging'
  if(step?.kind==='discover'||step?.kind==='notice') return 'thinking'
  return 'explaining'
}
