import test from 'node:test'
import assert from 'node:assert/strict'
import { foundationLessons } from '../src/data/foundationCurriculum.js'
import { getTeacherGuide, getTeacherStepTalk, teacherGuides } from '../src/data/teacherGuides.js'

test('every Foundation lesson has a lesson-specific Bunny teacher guide',()=>{
  const missing=foundationLessons.filter(l=>!teacherGuides[l.id]).map(l=>l.id)
  assert.deepEqual(missing,[])
})

test('teacher guide has welcome, why and checkpoint for every lesson',()=>{
  for(const lesson of foundationLessons){
    const guide=getTeacherGuide(lesson.id)
    assert.ok(guide.welcome?.length>20,lesson.id)
    assert.ok(guide.why?.length>20,lesson.id)
    assert.ok(guide.checkpoint?.length>10,lesson.id)
  }
})

test('teacher step talk covers every major step type',()=>{
  const lesson=foundationLessons.find(l=>l.id==='f12-be-am-is-are')
  for(const [stepIndex,step] of lesson.steps.entries()){
    const talk=getTeacherStepTalk({lessonId:lesson.id,step,stepIndex})
    assert.ok(talk?.length>10,`${lesson.id}:${stepIndex}`)
  }
})

test('early word lesson no longer introduces pronoun verb noun before meaning',()=>{
  const lesson=foundationLessons.find(l=>l.id==='f03-what-is-a-word')
  const text=lesson.steps.map(s=>`${s.title||''} ${s.bodyVi||''}`).join(' ')
  assert.match(text,/I = tôi/)
  assert.doesNotMatch(text,/Sau này bạn sẽ học tên chính thức/)
})
