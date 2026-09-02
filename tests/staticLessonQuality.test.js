import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { foundationLessons } from '../src/data/foundationCurriculum.js'
import { a0TeachingCopy } from '../src/data/curated/a0TeachingCopy.vi.js'
import { getTeacherGuide } from '../src/data/teacherGuides.js'

test('all 42 A0 lessons have curated static Vietnamese teaching copy', () => {
  assert.equal(foundationLessons.length, 42)
  assert.equal(Object.keys(a0TeachingCopy).length, 42)
  for (const lesson of foundationLessons) {
    const copy = a0TeachingCopy[lesson.id]
    assert.ok(copy, `missing curated copy for ${lesson.id}`)
    assert.ok(copy.lesson?.titleVi?.trim(), `${lesson.id}: missing Vietnamese title`)
    assert.ok(copy.lesson?.objectiveVi?.trim(), `${lesson.id}: missing Vietnamese objective`)
    assert.ok(copy.teacherGuide?.welcome?.trim(), `${lesson.id}: missing teacher welcome`)
    assert.ok(copy.teacherGuide?.why?.trim(), `${lesson.id}: missing teacher purpose`)
    assert.ok(copy.teacherGuide?.checkpoint?.trim(), `${lesson.id}: missing teacher checkpoint`)
    assert.ok(Object.keys(copy.steps || {}).length >= 3, `${lesson.id}: expected at least 3 curated step rewrites`)
  }
})

test('teacher guidance comes from static curated copy', () => {
  for (const lesson of foundationLessons) {
    const guide = getTeacherGuide(lesson.id)
    assert.equal(guide.welcome, a0TeachingCopy[lesson.id].teacherGuide.welcome)
  }
})

test('runtime teacher UI has no postponed AI tutor dependency', () => {
  const source = fs.readFileSync(new URL('../src/components/lesson/TeacherGuide.jsx', import.meta.url), 'utf8')
  assert.equal(source.includes('BunnyTutorService'), false)
  assert.equal(source.includes('VITE_BUNNY_TUTOR_API_URL'), false)
  assert.equal(source.includes('giải thích cách khác'), false)
})
