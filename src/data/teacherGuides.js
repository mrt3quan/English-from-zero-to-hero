import { a0TeachingCopy } from './curated/a0TeachingCopy.vi.js'

const fallbackGuide = {
  welcome: 'Hôm nay Bunny sẽ dẫn bạn đi từng bước. Chưa cần nhớ mọi thứ ngay lần đầu.',
  why: 'Mục tiêu là hiểu và tự dùng được, không phải đọc thật nhiều quy tắc.',
  checkpoint: 'Hiểu ý trước, rồi mới nhớ tên ngữ pháp.',
}

export const teacherGuides = Object.fromEntries(
  Object.entries(a0TeachingCopy).map(([lessonId, copy]) => [lessonId, { ...fallbackGuide, ...(copy.teacherGuide || {}) }]),
)

export function getTeacherGuide(lessonId){
  return teacherGuides[lessonId] || fallbackGuide
}

export function getTeacherStepTalk({lessonId, step, stepIndex=0}){
  const guide=getTeacherGuide(lessonId)
  if(step.teacherTalk) return step.teacherTalk
  if(stepIndex===0) return guide.welcome
  if(step.type==='listen') return 'Nghe trọn câu một lần trước. Nếu chưa rõ, nghe lại chậm hơn và chú ý đúng từ hoặc âm đang học.'
  if(step.type==='speak') return 'Nói thử cả câu theo mẫu. Không cần hoàn hảo ngay; nếu lúc này không tiện nói, bạn có thể bỏ qua phần nói.'
  if(step.type==='production') return 'Bây giờ đến lượt bạn tự tạo câu. Dùng mẫu vừa học để nói hoặc viết điều có thật với bạn.'
  if(step.type==='review') return 'Thử nhớ câu trả lời trước khi mở đáp án. Việc tự nhớ lại sẽ giúp bạn ghi nhớ lâu hơn.'
  if(step.type==='exercise'){
    if(step.exerciseType==='wordOrder') return 'Đọc ý nghĩa trước, rồi xếp các mảnh theo thứ tự tiếng Anh. Nếu sai, mình sẽ nhìn lại chỗ bị đảo.'
    if(step.exerciseType==='errorFix') return 'Đọc chậm cả câu và tìm chỗ chưa đúng. Sau đó sửa lại câu hoàn chỉnh.'
    if(step.exerciseType==='dictation') return 'Nghe cả câu một lần để lấy ý. Lần sau mới tập trung vào từng từ, âm cuối và cách viết.'
    return 'Thử trả lời trước. Nếu chưa đúng, Bunny sẽ chỉ đúng chỗ cần nhìn lại rồi bạn thử lần nữa.'
  }
  const byKind={
    discover:'Nhìn ví dụ trước nhé. Chưa cần nhớ quy tắc; thử đoán xem câu đang muốn nói điều gì.',
    notice:'So sánh hai ví dụ thật chậm. Từ nào thay đổi? Phần nào vẫn giữ nguyên?',
    understand:'Bây giờ mình gọi tên điều bạn vừa nhận ra và giải thích bằng cách thật đơn giản.',
    visualize:'Hãy nhìn câu như những mảnh ghép. Hiểu vai trò của từng phần trước, ký hiệu để sau.',
    compare:'Chỗ này tiếng Việt và tiếng Anh dùng khác nhau. Mình đặt hai cách cạnh nhau để bạn thấy rõ, thay vì dịch từng chữ.',
  }
  return byKind[step.kind] || guide.checkpoint
}
