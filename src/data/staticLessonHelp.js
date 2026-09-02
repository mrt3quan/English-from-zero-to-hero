import { getTeacherGuide } from './teacherGuides.js'

function examplesFor(step){
  const examples = [...(step.examples || [])]
  if (step.answer && typeof step.answer === 'string') examples.push(step.answer.replace(/\s+([?.!])/g,'$1'))
  if (Array.isArray(step.accepted)) examples.push(...step.accepted.slice(0,2))
  return [...new Set(examples.filter(Boolean))].slice(0,3)
}

export function getStaticLessonHelp({ lesson, step }) {
  const guide = getTeacherGuide(lesson.id)
  const compare = (lesson.steps || []).find(item => item.type === 'content' && item.kind === 'compare')
  const examples = examplesFor(step)
  return {
    simpler: {
      title: 'Giải thích dễ hơn',
      text: step.help?.simplerVi || `Tạm bỏ tên ngữ pháp sang một bên. ${guide.checkpoint} Hãy nhìn một ví dụ, hiểu câu đang nói gì rồi mới quay lại quy tắc.`,
    },
    examples: {
      title: 'Cho thêm ví dụ',
      text: examples.length ? 'Đọc chậm từng ví dụ và tìm phần giống nhau.' : 'Quay lại ví dụ ngay phía trên. Đọc một câu thật chậm và chỉ tìm đúng phần đang học.',
      examples,
    },
    compare: {
      title: 'So với tiếng Việt',
      text: step.help?.compareVi || compare?.bodyVi || 'Đừng dịch từng từ. Hãy hỏi: người Việt mình diễn đạt ý này thế nào, rồi xem tiếng Anh sắp xếp các phần khác ở đâu.',
    },
    practice: {
      title: 'Cho mình thử thêm',
      text: 'Đừng đọc thêm lý thuyết ngay. Hãy thử câu kế tiếp, rồi dùng phản hồi của Bunny để biết chính xác chỗ nào cần xem lại.',
    },
  }
}
