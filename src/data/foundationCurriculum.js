import { applyLessonTeachingCopy } from './teachingCopyOverlay.js'
import { buildSkillReviewTasks } from '../lib/reviewTaskFactory.js'
const content = (kind, title, bodyVi, extra = {}) => ({ type: 'content', kind, title, bodyVi, ...extra })
const choice = (promptVi, options, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'choice', intent: 'recognize', promptVi, options, answer, explainVi, ...extra })
const order = (promptVi, tokens, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'wordOrder', intent: 'build', punctuationRequired: false, promptVi, tokens, answer, explainVi, ...extra })
const fill = (promptVi, sentence, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'fillBlank', intent: 'choose', validationMode: 'normalizedExact', promptVi, sentence, answer, explainVi, ...extra })
const identify = (promptVi, tokens, answerIndexes, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'identify', intent: 'recognize', promptVi, tokens, answerIndexes, explainVi, ...extra })
const fix = (promptVi, incorrect, accepted, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'errorFix', intent: 'repair', validationMode: 'acceptedVariants', promptVi, incorrect, accepted, explainVi, ...extra })
const produce = (promptVi, placeholder, checks, extra = {}) => ({ type: 'production', intent: 'produce', promptVi, placeholder, checks, ...extra })
const review = (items) => ({ type: 'review', items })
const openSentence = (promptVi, starter, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'openSentence', intent: 'produce', promptVi, starter, explainVi, ...extra })

const lesson = ({ id, unit, order: lessonOrder, titleEn, titleVi, minutes = 10, focus = [], standards = [], objectiveVi, steps, mastery = {} }) => ({
  id, unit, order: lessonOrder, titleEn, titleVi, minutes, focus, standards, objectiveVi, steps,
  mastery: { minAccuracy: 0.75, requiresProduction: true, ...mastery },
})

export const foundationUnits = [
  { id: 1, titleEn: 'Welcome to English', titleVi: 'Bắt đầu với tiếng Anh', descriptionVi: 'Âm, chữ, từ và cách tiếng Anh xuất hiện trên trang.' },
  { id: 2, titleEn: 'Meet the Sentence', titleVi: 'Làm quen với câu', descriptionVi: 'Hiểu câu là một ý hoàn chỉnh có người/vật và điều xảy ra.' },
  { id: 3, titleEn: 'Nouns', titleVi: 'Danh từ', descriptionVi: 'Gọi tên người, nơi chốn, đồ vật và ý tưởng.' },
  { id: 4, titleEn: 'Pronouns', titleVi: 'Đại từ', descriptionVi: 'Dùng I, you, he, she, it, we, they để tránh lặp.' },
  { id: 5, titleEn: 'Be', titleVi: 'Động từ be', descriptionVi: 'am / is / are để nói ai là gì, như thế nào, ở đâu.' },
  { id: 6, titleEn: 'Verbs', titleVi: 'Động từ', descriptionVi: 'Hành động, trạng thái và quy tắc ngôi thứ ba.' },
  { id: 7, titleEn: 'Articles', titleVi: 'Mạo từ', descriptionVi: 'a / an / the và cách người nói xác định danh từ.' },
  { id: 8, titleEn: 'Adjectives', titleVi: 'Tính từ', descriptionVi: 'Mô tả danh từ đúng vị trí tiếng Anh.' },
  { id: 9, titleEn: 'Adverbs', titleVi: 'Trạng từ', descriptionVi: 'Nói hành động xảy ra như thế nào và thường xuyên ra sao.' },
  { id: 10, titleEn: 'Prepositions', titleVi: 'Giới từ', descriptionVi: 'Nói vị trí và mối quan hệ: in, on, at, under…' },
  { id: 11, titleEn: 'Conjunctions', titleVi: 'Liên từ', descriptionVi: 'Nối từ và nối ý bằng and, but, or, because, so.' },
  { id: 12, titleEn: 'Core Word Jobs Map', titleVi: 'Bản đồ các nhóm từ cốt lõi', descriptionVi: 'Ghép các mảnh đã học thành một hệ thống dễ nhìn.' },
  { id: 13, titleEn: 'Sentence Shapes', titleVi: 'Hình dạng câu', descriptionVi: 'Từ câu hỏi trực giác đến S/V/O/C và ba hình dạng cốt lõi.' },
  { id: 14, titleEn: 'S + V + O', titleVi: 'Mẫu câu S + V + O', descriptionVi: 'Thêm tân ngữ để nói hành động tác động lên ai/cái gì.' },
  { id: 15, titleEn: 'S + V + C', titleVi: 'Mẫu câu S + V + C', descriptionVi: 'Dùng bổ ngữ để mô tả hoặc gọi tên chủ ngữ.' },
  { id: 16, titleEn: 'Negatives', titleVi: 'Câu phủ định', descriptionVi: 'Phân biệt be + not và do/does + not.' },
  { id: 17, titleEn: 'Questions', titleVi: 'Câu hỏi', descriptionVi: 'Đưa be hoặc do/does lên đúng vị trí.' },
  { id: 18, titleEn: 'Everyday Present', titleVi: 'Hiện tại hằng ngày', descriptionVi: 'Nói thói quen, sự thật, have/has và điều ổn định.' },
  { id: 19, titleEn: 'Sentence Expansion', titleVi: 'Mở rộng câu', descriptionVi: 'Thêm chi tiết mà vẫn giữ cấu trúc rõ ràng.' },
  { id: 20, titleEn: 'Foundation Mastery', titleVi: 'Dự án tổng kết', descriptionVi: 'Viết 10 câu đúng về chính bạn.' },
  { id: 21, titleEn: 'Greetings', titleVi: 'Chào hỏi & giới thiệu', descriptionVi: 'Chào, nói tên và phản hồi trong một cuộc gặp rất ngắn.' },
  { id: 22, titleEn: 'Numbers & Age', titleVi: 'Số & tuổi', descriptionVi: 'Hiểu số cơ bản và nói tuổi/thông tin đơn giản.' },
  { id: 23, titleEn: 'Possessives', titleVi: 'my / your / his / her', descriptionVi: 'Nói đồ vật hoặc người thuộc về ai.' },
  { id: 24, titleEn: 'Pointing Words', titleVi: 'this / that / these / those', descriptionVi: 'Chỉ một hay nhiều vật ở gần hoặc xa.' },
  { id: 25, titleEn: 'WH Questions', titleVi: 'What / Who / Where', descriptionVi: 'Hỏi về vật, người và nơi chốn.' },
  { id: 26, titleEn: 'There is / are', titleVi: 'Có gì ở đây?', descriptionVi: 'Mô tả một hay nhiều thứ tồn tại ở một nơi.' },
  { id: 27, titleEn: 'Can / Can’t', titleVi: 'Khả năng', descriptionVi: 'Nói điều mình hoặc người khác có thể/không thể làm.' },
  { id: 28, titleEn: 'Requests & Instructions', titleVi: 'Yêu cầu & chỉ dẫn', descriptionVi: 'Hiểu và dùng những câu đơn giản như Please sit down.' },
  { id: 29, titleEn: 'Days & Time', titleVi: 'Ngày & giờ cơ bản', descriptionVi: 'Nói ngày, hôm nay/ngày mai và giờ đơn giản.' },
  { id: 30, titleEn: 'Short Conversation', titleVi: 'Hội thoại ngắn', descriptionVi: 'Nghe/đọc một cuộc hội thoại A0 và lấy thông tin chính.' },
  { id: 31, titleEn: 'A0 Big Review', titleVi: 'Ôn lớn A0', descriptionVi: 'Kết nối những khả năng quan trọng trước bài kiểm tra A0.' },
]

const rawFoundationLessons = [
  lesson({
    id: 'f01-alphabet-map', unit: 1, order: 1, titleEn: 'The English Alphabet', titleVi: 'Bản đồ 26 chữ cái', minutes: 9,
    focus: ['literacy', 'pronunciation'], standards: ['CCSS RF.K.1d', 'CCSS RF.K.3a'],
    objectiveVi: 'Nhận ra 26 chữ cái, phân biệt tên chữ và âm chữ, và dùng chữ hoa/chữ thường như hai hình dạng của cùng một chữ.',
    steps: [
      content('discover', 'Một chữ có thể có hai hình dạng', 'A và a là cùng một chữ. Trong tiếng Anh, bạn cần nhận ra cả chữ hoa và chữ thường.', { examples: ['A a', 'B b', 'M m', 'T t'], speak: ['A', 'B', 'M', 'T'] }),
      content('understand', 'Tên chữ ≠ âm trong từ', 'Tên chữ B là /biː/, nhưng trong “book” chữ b biểu diễn âm /b/. Từ đầu tiên, hãy tách “tên chữ” và “âm”.', { callout: 'B → tên chữ: “bee” · trong book: /b/' }),
      content('visualize', '5 nguyên âm quan trọng', 'A, E, I, O, U là năm chữ nguyên âm chính. Các chữ còn lại chủ yếu là phụ âm. Sau này chúng ta sẽ học rằng một chữ có thể biểu diễn nhiều âm.', { chips: ['A', 'E', 'I', 'O', 'U'] }),
      choice('Chữ nào là chữ thường của “G”?', ['q', 'g', 'j', 'c'], 'g', 'G và g là hai dạng của cùng một chữ.'),
      choice('Điều nào đúng?', ['Tên chữ và âm luôn giống nhau', 'Tên chữ và âm có thể khác nhau', 'Tiếng Anh không có chữ hoa'], 'Tên chữ và âm có thể khác nhau', 'Ví dụ B có tên “bee” nhưng thường tạo âm /b/ trong từ.'),
      produce('Hãy gõ tên của bạn bằng chữ cái Latin. Sau đó viết chữ cái đầu bằng CHỮ HOA và các chữ còn lại bằng chữ thường.', 'Ví dụ: Minh', ['Có ít nhất 2 ký tự', 'Chữ đầu viết hoa'], { minWords: 1 }),
      review([['Có bao nhiêu chữ cái?', '26'], ['5 chữ nguyên âm chính?', 'A, E, I, O, U'], ['A và a có phải hai chữ khác nhau?', 'Không. Chúng là hai dạng của cùng một chữ.']]),
    ],
  }),
  lesson({
    id: 'f02-sounds-and-letters', unit: 1, order: 2, titleEn: 'Letters Make Sounds', titleVi: 'Chữ viết và âm thanh', minutes: 11,
    focus: ['phonics', 'pronunciation'], standards: ['CCSS RF.K.2d', 'CCSS RF.K.3a', 'WIDA multimodality'],
    objectiveVi: 'Hiểu rằng từ nói được tạo bởi âm, từ viết được tạo bởi chữ, và bắt đầu nghe âm đầu/cuối rõ ràng.',
    steps: [
      content('discover', 'Nghe trước, nhìn sau', '“map” có ba âm chính /m/ /æ/ /p/. Người học Việt cần chú ý âm cuối vì tiếng Anh dùng âm cuối để phân biệt từ và ngữ pháp.', { examples: ['map → /m/ /æ/ /p/', 'cat → /k/ /æ/ /t/', 'sun → /s/ /ʌ/ /n/'], speak: ['map', 'cat', 'sun'] }),
      content('compare', 'Điểm cần chú ý với người Việt', 'Trong tiếng Việt, một số phụ âm cuối hoạt động khác tiếng Anh. Khi nói “cat”, âm /t/ cuối không được biến mất, vì người nghe dùng nó để nhận biết từ.'),
      content('visualize', 'Âm đầu · âm giữa · âm cuối', 'Hãy hình dung một từ ngắn như ba ô. Với “dog”: /d/ | /ɔ/ | /g/.', { tokenRoles: [{ text: '/d/', role: 'đầu' }, { text: '/ɔ/', role: 'giữa' }, { text: '/g/', role: 'cuối' }] }),
      choice('Âm cuối của “map” là gì?', ['/m/', '/æ/', '/p/', '/b/'], '/p/', '“map” kết thúc bằng /p/.'),
      choice('Từ nào bắt đầu bằng cùng âm với “sun”?', ['cat', 'see', 'map', 'dog'], 'see', 'sun và see đều bắt đầu bằng /s/.'),
      produce('Đọc to ba từ: “map, cat, dog”. Sau đó gõ từ bạn thấy khó nhất để nhớ luyện lại.', 'Ví dụ: cat', ['Có một từ được chọn'], { minWords: 1 }),
      review([['Từ nói được tạo bởi gì?', 'Âm (sounds/phonemes)'], ['Từ viết được tạo bởi gì?', 'Chữ (letters/graphemes)'], ['Âm cuối có quan trọng không?', 'Có. Nó có thể thay đổi nghĩa và ngữ pháp.']]),
    ],
  }),
  lesson({
    id: 'f03-what-is-a-word', unit: 1, order: 3, titleEn: 'What Is a Word?', titleVi: 'Một “từ” là gì?', minutes: 9,
    focus: ['literacy', 'vocabulary'], standards: ['CCSS RF.K.1b', 'CCSS L.K.1b'],
    objectiveVi: 'Nhận ra câu được chia thành các từ bằng khoảng trắng và hiểu mỗi từ góp một phần ý nghĩa vào câu.',
    steps: [
      content('discover', 'Khoảng trắng chia câu thành từ', 'Trong “I like apples.” có ba từ: I | like | apples. Dấu chấm không phải là một từ.', { tokenRoles: [{ text: 'I', role: 'word 1' }, { text: 'like', role: 'word 2' }, { text: 'apples', role: 'word 3' }, { text: '.', role: 'punctuation' }] }),
      content('understand', 'Hiểu câu trước, tên ngữ pháp để sau', 'I = tôi. like = thích. apples = táo. Ghép lại: “I like apples.” = “Tôi thích táo.” Trước mắt chỉ cần hiểu câu đang nói gì. Tên ngữ pháp mình sẽ học khi bạn đã quen với ý nghĩa.'),
      identify('Chọn tất cả các TỪ trong câu.', ['She', 'reads', 'books', '.'], [0, 1, 2], 'Dấu chấm là punctuation, không phải từ.', { multi: true }),
      choice('“I like apples.” có bao nhiêu từ?', ['2', '3', '4', '5'], '3', 'I, like, apples = 3 từ.'),
      produce('Viết 3 từ tiếng Anh bạn đã biết. Ngăn cách chúng bằng dấu phẩy.', 'apple, school, happy', ['Có ít nhất 3 mục'], { minWords: 3 }),
      review([['Khoảng trắng có tác dụng gì?', 'Tách các từ khi viết'], ['Dấu chấm có phải từ không?', 'Không'], ['Mỗi từ có thể có gì trong câu?', 'Một vai trò/công việc.']]),
    ],
  }),
  lesson({
    id: 'f04-english-sentence-direction', unit: 1, order: 4, titleEn: 'How English Sits on the Page', titleVi: 'Tiếng Anh đi từ trái sang phải', minutes: 9,
    focus: ['literacy', 'mechanics'], standards: ['CCSS RF.K.1a', 'CCSS L.K.2a-b'],
    objectiveVi: 'Theo dõi câu từ trái sang phải, nhận ra chữ hoa đầu câu và dấu câu cuối câu.',
    steps: [
      content('discover', 'Ba tín hiệu của một câu viết', 'Câu tiếng Anh thường bắt đầu bằng chữ hoa, đi từ trái sang phải, và kết thúc bằng dấu câu.', { examples: ['She is happy.', 'Are you ready?', 'Stop!'] }),
      content('visualize', 'START → IDEA → END', 'Hãy xem câu như một đường đi: chữ hoa mở câu → các từ tạo ý → dấu câu đóng câu.', { chips: ['Capital letter', 'words', '. ? !'] }),
      choice('Câu nào được viết đúng?', ['she is happy.', 'She is happy.', 'She is happy', 'she Is Happy.'], 'She is happy.', 'Chữ đầu viết hoa và câu trần thuật kết thúc bằng dấu chấm.'),
      order('Sắp xếp thành câu đúng.', ['happy', '.', 'I', 'am'], 'I am happy .', 'Tiếng Anh đi từ trái sang phải: I + am + happy + .'),
      produce('Viết một câu rất ngắn bắt đầu bằng chữ hoa và kết thúc bằng dấu chấm.', 'I am Minh.', ['Chữ đầu viết hoa', 'Có dấu chấm cuối câu'], { minWords: 2 }),
      review([['Hướng đọc cơ bản?', 'Trái → phải'], ['Đầu câu thường có gì?', 'Chữ hoa'], ['Cuối câu có thể là gì?', '. ? !']]),
    ],
  }),
  lesson({
    id: 'f05-complete-thought', unit: 2, order: 5, titleEn: 'Meet the Sentence', titleVi: 'Câu là một ý hoàn chỉnh', minutes: 10,
    focus: ['sentence structure'], standards: ['CCSS L.K.1f', 'CCSS L.1.1j'],
    objectiveVi: 'Phân biệt câu hoàn chỉnh và nhóm từ chưa tạo thành ý hoàn chỉnh.',
    steps: [
      content('discover', 'Một câu nói điều gì đó hoàn chỉnh', '“Dogs run.” cho ta biết ai/cái gì và điều xảy ra. “The dogs” chỉ gọi tên đối tượng nhưng chưa nói điều gì xảy ra.', { examples: ['Dogs run. ✓', 'The dogs ✗', 'Runs fast ✗'] }),
      content('understand', 'Hai câu hỏi kiểm tra', '1) Câu nói về ai/cái gì? 2) Người/vật đó làm gì, là gì, hoặc như thế nào? Nếu thiếu một phần quan trọng, câu có thể chưa hoàn chỉnh.'),
      choice('Nhóm nào là câu hoàn chỉnh?', ['My friend', 'Runs every day', 'My friend runs.', 'Very happy'], 'My friend runs.', '“My friend” cho biết chủ thể và “runs” cho biết điều xảy ra.'),
      openSentence('Hoàn thành ý theo cách của bạn.', 'My brother', '“My brother” mới chỉ cho biết mình đang nói về ai. Hãy thêm điều bạn muốn nói về người đó. Nhiều đáp án khác nhau đều có thể đúng.', { requiredStart: 'My brother', minWords: 3, punctuationRequired: true, successVi: 'Đúng rồi. Câu của bạn đã có ý trọn vẹn. Đây là một đáp án hợp lệ; không cần giống câu mẫu của Bunny.', examples: ['My brother works.', 'My brother is tired.', 'My brother studies English.', 'My brother has a dog.'] }),
      produce('Viết một câu cực ngắn có người/vật + điều xảy ra.', 'Birds fly.', ['Có ít nhất 2 từ', 'Có dấu câu cuối'], { minWords: 2 }),
      review([['“The red car.” đã nói trọn một ý chưa?', 'Chưa. Người nghe vẫn chờ biết điều gì về chiếc xe.'], ['“The red car is new.” đã nói trọn một ý chưa?', 'Rồi. Câu cho biết chiếc xe thế nào.'], ['Hoàn thành: “My brother …”', 'Có nhiều đáp án đúng, ví dụ: My brother works. / My brother is tired.']]),
    ],
  }),
  lesson({
    id: 'f06-subject-who-what', unit: 2, order: 6, titleEn: 'Subject: Who or What?', titleVi: 'Chủ ngữ: câu nói về ai/cái gì?', minutes: 10,
    focus: ['grammar', 'sentence structure'], standards: ['CCSS L.K.1f', 'CCSS L.1.1c'],
    objectiveVi: 'Tìm người hoặc vật mà câu đang nói tới; sau khi hiểu ý này mới làm quen với tên “chủ ngữ (subject)”.',
    steps: [
      content('discover', 'Câu đang nói về ai hoặc cái gì?', 'Nhìn câu “The cat sleeps.” trước. Câu này đang nói về “the cat”. Phần đó được gọi là chủ ngữ (subject). Chỉ cần hiểu ý trước, chưa cần học thuộc tên ngay.', { examples: ['The cat sleeps.'], tokenRoles: [{ text: 'The cat', role: 'câu nói về ai/cái gì?' }, { text: 'sleeps', role: 'điều gì xảy ra?' }] }),
      content('compare', 'Tiếng Anh thường cần chủ ngữ hiện rõ', 'Người Việt đôi khi bỏ chủ ngữ khi ngữ cảnh đã rõ. Tiếng Anh thường không cho phép điều đó: “Is raining.” ✗ → “It is raining.” ✓'),
      identify('Chọn phần cho biết câu đang nói về ai.', ['My', 'sister', 'reads', 'books', '.'], [0, 1], 'Câu đang nói về “My sister”, nên cả cụm này là chủ ngữ.', { multi: true }),
      choice('Subject trong “The children play outside.” là gì?', ['The children', 'play', 'outside', 'play outside'], 'The children', 'Hỏi: Ai đang chơi? → The children.'),
      produce('Viết một người hoặc vật mà bạn muốn đặt ở đầu câu. Chưa cần viết cả câu.', 'My teacher', ['Gọi tên một người/vật/nhóm'], { minWords: 1 }),
      review([['Muốn tìm chủ ngữ, mình hỏi gì?', 'Câu đang nói về ai hoặc cái gì?'], ['Chủ ngữ luôn chỉ có một từ không?', 'Không. Có thể là cả một cụm từ.'], ['Trong “It is raining”, “It” làm gì?', 'Làm chủ ngữ.']]),
    ],
  }),
  lesson({
    id: 'f07-verb-what-happens', unit: 2, order: 7, titleEn: 'Verb: What Happens?', titleVi: 'Động từ: điều gì xảy ra?', minutes: 10,
    focus: ['grammar', 'sentence structure'], standards: ['CCSS L.K.1b', 'CCSS L.1.1e'],
    objectiveVi: 'Nhận ra động từ hành động và động từ trạng thái; hiểu câu tiếng Anh thường cần động từ.',
    steps: [
      content('discover', 'Tìm phần nói điều gì xảy ra', 'Nhìn ba câu: “Birds fly.” “I like music.” “She is tired.” Mỗi câu đều có một phần cho biết hành động hoặc trạng thái. Phần đó được gọi là động từ (verb).', { examples: ['Birds fly.', 'I like music.', 'She is tired.'] }),
      content('compare', 'Điểm dễ nhầm khi dịch từ tiếng Việt', '“She very tired.” nghe có thể gần nghĩa tiếng Việt, nhưng tiếng Anh cần động từ: “She is very tired.”'),
      identify('Chọn từ cho biết họ làm gì.', ['They', 'study', 'English', '.'], [1], '“study” cho biết hành động của họ, nên đây là động từ.'),
      choice('Câu nào đang thiếu động từ?', ['I work here.', 'She happy.', 'They study.', 'We like rice.'], 'She happy.', 'Cần “She is happy.”'),
      produce('Viết 3 động từ bạn thường dùng.', 'work, study, eat', ['Có 3 động từ'], { minWords: 3 }),
      review([['Động từ có thể nói về gì?', 'Hành động hoặc trạng thái.'], ['“happy” có phải động từ không?', 'Không. “happy” thường là tính từ.'], ['“is” có phải động từ không?', 'Có.']]),
    ],
  }),
  lesson({
    id: 'f08-first-sv-sentences', unit: 2, order: 8, titleEn: 'Build Your First Sentences', titleVi: 'Ghép Subject + Verb', minutes: 12,
    focus: ['sentence construction', 'writing'], standards: ['CCSS L.K.1f', 'WIDA ELD-SI.K-3.Inform'],
    objectiveVi: 'Ghép “ai/cái gì?” với “điều gì xảy ra?” để tạo câu ngắn, rồi mới làm quen với ký hiệu S + V.',
    steps: [
      content('visualize', 'Ai/cái gì? + Điều gì xảy ra?', 'Bắt đầu bằng ý nghĩa: “Birds” trả lời ai/cái gì; “fly” trả lời điều gì xảy ra. Khi đã hiểu, mình mới viết ngắn gọn là Subject + Verb, hay S + V.', { examples: ['Birds fly.', 'Babies cry.'], tokenRoles: [{ text: 'Birds', role: 'ai/cái gì?' }, { text: 'fly', role: 'điều gì xảy ra?' }] }),
      content('understand', 'Ý nghĩa trước, công thức sau', 'Đừng đọc S + V như công thức toán. Hãy nghĩ: “Ai/cái gì?” + “Điều gì xảy ra?”'),
      order('Ghép câu.', ['sleep', 'Babies', '.'], 'Babies sleep .', 'Babies là phần câu đang nói tới; sleep cho biết điều gì xảy ra.'),
      choice('Câu nào có đúng mẫu S + V?', ['The dog.', 'Runs fast.', 'Birds fly.', 'Very cold.'], 'Birds fly.', 'Birds = S, fly = V.'),
      produce('Viết 2 câu ngắn theo mẫu “ai/cái gì + làm gì”. Mỗi câu trên một dòng.', 'Birds fly.\nChildren laugh.', ['Có 2 dòng câu', 'Mỗi câu có chủ ngữ và động từ'], { minLines: 2, minWords: 4 }),
      review([['S nghĩa là?', 'Subject'], ['V nghĩa là?', 'Verb'], ['Mẫu S+V giúp trả lời hai câu hỏi nào?', 'Ai/cái gì? + Điều gì xảy ra?']]),
    ],
  }),
  lesson({
    id: 'f09-nouns-name-the-world', unit: 3, order: 9, titleEn: 'Nouns Name the World', titleVi: 'Danh từ gọi tên thế giới', minutes: 10,
    focus: ['grammar', 'vocabulary'], standards: ['CCSS L.K.1b', 'CCSS L.1.1b'],
    objectiveVi: 'Nhận ra những từ dùng để gọi tên người, nơi chốn, đồ vật hoặc ý tưởng; sau đó mới gắn tên “danh từ (noun)”.',
    steps: [
      content('discover', 'Những từ dùng để gọi tên', 'teacher gọi tên một người; school gọi tên một nơi; apple gọi tên một vật; love gọi tên một ý tưởng. Những từ như vậy được gọi là danh từ (noun).', { chips: ['người: teacher', 'nơi: school', 'vật: apple', 'ý tưởng: love'] }),
      content('understand', 'Một từ có thể vừa có “nhóm từ” vừa có vai trò trong câu', '“student” dùng để gọi tên một người, nên nó là danh từ. Trong “Students learn.”, “Students” cũng là phần mà câu đang nói tới. Trước mắt chỉ cần hiểu hai ý này, chưa cần học thuộc nhiều tên ngữ pháp cùng lúc.'),
      identify('Chọn tất cả từ dùng để gọi tên người, nơi hoặc vật.', ['teacher', 'quickly', 'city', 'happy', 'book'], [0, 2, 4], 'teacher, city và book đều dùng để gọi tên người, nơi hoặc vật.', { multi: true }),
      choice('Từ nào dùng để gọi tên một ý tưởng?', ['run', 'freedom', 'blue', 'slowly'], 'freedom', '“freedom” gọi tên một khái niệm/ý tưởng.'),
      produce('Viết 4 danh từ: một người, một nơi, một vật và một ý tưởng.', 'student, park, phone, hope', ['Có 4 danh từ'], { minWords: 4 }),
      review([['Danh từ dùng để gọi tên những gì?', 'Người, nơi, vật hoặc ý tưởng.'], ['Danh từ có luôn là chủ ngữ không?', 'Không.'], ['“school” thuộc nhóm từ nào?', 'Danh từ (noun).']]),
    ],
  }),
  lesson({
    id: 'f10-one-or-more-nouns', unit: 3, order: 10, titleEn: 'One or More', titleVi: 'Danh từ số ít và số nhiều', minutes: 12,
    focus: ['grammar', 'pronunciation'], standards: ['CCSS L.K.1c', 'CCSS L.1.1c'],
    objectiveVi: 'Tạo số nhiều thường bằng -s/-es và bắt đầu nghe ba cách phát âm /s/, /z/, /ɪz/.',
    steps: [
      content('discover', 'one book → two books', 'Danh từ đếm được thường đổi dạng khi có nhiều hơn một: book → books, box → boxes.'),
      content('visualize', 'Ba âm số nhiều', 'Chữ viết thường là -s/-es, nhưng âm cuối có thể là /s/, /z/, hoặc /ɪz/. Chưa cần thuộc hết; mục tiêu là không nuốt mất đuôi.', { chips: ['cats /s/', 'dogs /z/', 'watches /ɪz/'], speak: ['cats', 'dogs', 'watches'] }),
      choice('Số nhiều của “book” là gì?', ['bookes', 'books', 'book', 'bookies'], 'books', 'Phần lớn danh từ chỉ cần thêm -s.'),
      fill('Điền dạng số nhiều: “three ___”', 'three ___ (box)', 'boxes', 'box kết thúc bằng x → thường thêm -es.'),
      produce('Viết 3 cặp one → many.', 'one cat → two cats\none class → two classes\none dog → three dogs', ['Có ít nhất 3 dòng'], { minLines: 3, minWords: 6 }),
      review([['book → ?', 'books'], ['box → ?', 'boxes'], ['Khi nói số nhiều nên chú ý gì?', 'Phát âm âm cuối.']]),
    ],
  }),
  lesson({
    id: 'f11-personal-pronouns', unit: 4, order: 11, titleEn: 'I, You, He, She, It, We, They', titleVi: 'Đại từ chủ ngữ', minutes: 12,
    focus: ['grammar', 'speaking'], standards: ['CCSS L.1.1d', 'WIDA ELD-LA.1.Inform'],
    objectiveVi: 'Dùng I/you/he/she/it/we/they để nhắc lại người hoặc vật mà không phải lặp tên nhiều lần.',
    steps: [
      content('discover', 'Đừng lặp tên quá nhiều', 'Đọc hai câu: “Lan is my friend. Lan is kind.” Sau khi người nghe đã biết Lan là ai, tiếng Anh thường đổi lần nhắc thứ hai thành “She”: “Lan is my friend. She is kind.”'),
      content('visualize', '7 từ thay tên rất thường gặp', 'I = tôi/người đang nói; you = bạn/người nghe; he/she = một người; it = một vật/sự việc; we = tôi + người khác; they = nhiều người/vật. Những từ dùng để thay cho tên như vậy được gọi là đại từ (pronouns).', { chips: ['I = tôi', 'you = bạn', 'he = anh ấy', 'she = cô ấy', 'it = nó', 'we = chúng tôi/chúng ta', 'they = họ/chúng'] }),
      choice('“Tom and Mai” có thể thay bằng gì?', ['he', 'she', 'it', 'they'], 'they', 'Hai người → they.'),
      choice('“my phone” có thể thay bằng gì?', ['he', 'she', 'it', 'we'], 'it', 'Một đồ vật số ít → it.'),
      produce('Viết 4 cặp “tên người/vật → từ thay thế”.', 'Lan → she\nmy parents → they\nmy car → it\nTom → he', ['Có 4 dòng'], { minLines: 4, minWords: 8 }),
      review([['Lan → ?', 'she'], ['Tom and Mai → ?', 'they'], ['my sister and I → ?', 'we']]),
    ],
  }),
  lesson({
    id: 'f12-be-am-is-are', unit: 5, order: 12, titleEn: 'Be: am / is / are', titleVi: 'am / is / are', minutes: 13,
    focus: ['grammar', 'sentence structure'], standards: ['CCSS L.1.1c-e'],
    objectiveVi: 'Dùng am/is/are để nói mình/người khác là ai, như thế nào hoặc đang ở đâu.',
    steps: [
      content('discover', 'Ba câu rất hữu ích để nói về người', '“I am a student.” nói mình là ai. “She is tired.” nói cô ấy như thế nào. “They are at home.” nói họ ở đâu. Điểm chung: tiếng Anh cần am/is/are ở giữa.'),
      content('visualize', 'I → am · he/she/it → is · you/we/they → are', 'Đây là một trong các mẫu nền tảng quan trọng nhất.', { tokenRoles: [{ text: 'I', role: 'am' }, { text: 'he/she/it', role: 'is' }, { text: 'you/we/they', role: 'are' }] }),
      content('compare', 'Tiếng Việt thường không cần từ tương đương trực tiếp', '“Cô ấy mệt” không có từ đứng giữa “cô ấy” và “mệt”. Tiếng Anh bắt buộc: “She is tired.”'),
      fill('Điền be đúng.', 'I ___ ready.', 'am', 'I luôn đi với am ở hiện tại.'),
      choice('Câu nào đúng?', ['They is home.', 'They are home.', 'They am home.', 'They be home.'], 'They are home.', 'they → are.'),
      produce('Viết 3 câu: 1 câu với am, 1 với is, 1 với are.', 'I am ready.\nMy friend is kind.\nWe are students.', ['Có 3 dòng', 'Có am, is, are'], { minLines: 3, minWords: 6, requirements: [{ id:'lines', type:'minLines', value:3, labelVi:'Có ít nhất 3 dòng' }, { id:'be_forms', type:'containsAll', values:['am','is','are'], labelVi:'Có am, is và are' }] }),
      review([['I → ?', 'am'], ['he/she/it → ?', 'is'], ['you/we/they → ?', 'are']]),
    ],
  }),
  lesson({
    id: 'f13-be-negative-questions', unit: 5, order: 13, titleEn: 'Be: Negative & Questions', titleVi: 'be trong phủ định và câu hỏi', minutes: 13,
    focus: ['grammar', 'questions'], standards: ['CCSS L.1.1j'],
    objectiveVi: 'Biến câu với be thành phủ định và câu hỏi mà không dùng do/does.',
    steps: [
      content('visualize', 'Khẳng định → Phủ định → Câu hỏi', 'She is tired. → She is not tired. → Is she tired?', { examples: ['They are ready.', 'They are not ready.', 'Are they ready?'] }),
      content('understand', 'Với be, không cần do/does', 'Khi câu dùng am/is/are, chỉ cần thêm not để phủ định hoặc đưa am/is/are lên trước chủ ngữ để hỏi. Không dùng do/does trong mẫu này.'),
      choice('Phủ định đúng của “He is busy.”?', ['He does not busy.', 'He is not busy.', 'He not is busy.', 'He do not be busy.'], 'He is not busy.', 'be + not.'),
      order('Sắp xếp thành câu hỏi.', ['you', 'ready', 'Are', '?'], 'Are you ready?', 'Đưa are lên trước “you”. Nhớ dấu ? ở cuối câu.', { punctuationRequired: true }),
      fix('Sửa lỗi.', 'Do you are tired?', ['Are you tired?'], 'Với be, không thêm do.', { flexible: false }),
      produce('Viết 1 câu với be, rồi biến nó thành câu hỏi ở dòng 2.', 'She is happy.\nIs she happy?', ['Có 2 dòng', 'Dòng 2 là câu hỏi'], { minLines: 2, minWords: 4, requirements: [{ id:'lines', type:'minLines', value:2, labelVi:'Có ít nhất 2 dòng' }, { id:'question_line', type:'lineIsQuestion', line:2, labelVi:'Dòng 2 là câu hỏi đúng dạng' }] }),
      review([['Phủ định với be làm thế nào?', 'Thêm not sau am/is/are.'], ['Câu hỏi với be làm thế nào?', 'Đưa am/is/are lên trước chủ ngữ.'], ['Có dùng do trong “Are you…?” không?', 'Không.']]),
    ],
  }),
  lesson({
    id: 'f14-action-verbs', unit: 6, order: 14, titleEn: 'Action & State Verbs', titleVi: 'Động từ hành động và trạng thái', minutes: 11,
    focus: ['grammar', 'vocabulary'], standards: ['CCSS L.K.1b', 'CCSS L.1.1e'],
    objectiveVi: 'Hiểu rằng động từ không chỉ nói hành động; những từ như like, know, need và be cũng có thể là động từ.',
    steps: [
      content('discover', 'Động từ có thể nói hành động hoặc trạng thái', 'run, eat, write nói hành động. like, know, need nói cảm xúc, suy nghĩ hoặc trạng thái. be cũng là một động từ.'),
      content('understand', 'Tại sao điều này quan trọng?', 'Nếu chỉ nghĩ động từ là “hành động nhìn thấy được”, bạn rất dễ bỏ quên be, like hoặc know và tạo câu thiếu động từ.'),
      identify('Chọn tất cả động từ.', ['eat', 'happy', 'know', 'book', 'is'], [0, 2, 4], 'eat, know và is đều là động từ.', { multi: true }),
      choice('Từ nào nói về trạng thái hoặc suy nghĩ?', ['jump', 'know', 'write', 'walk'], 'know', 'know diễn tả trạng thái nhận thức.'),
      produce('Viết 2 động từ nói hành động và 2 động từ nói trạng thái/suy nghĩ.', 'run, cook; like, know', ['Có 4 động từ'], { minWords: 4 }),
      review([['Động từ chỉ nói về hành động thôi?', 'Không. Động từ còn có thể nói về trạng thái, cảm xúc hoặc suy nghĩ.'], ['Ví dụ động từ nói trạng thái/suy nghĩ?', 'like / know / need / be'], ['“is” có phải động từ không?', 'Có.']]),
    ],
  }),
  lesson({
    id: 'f15-third-person-s', unit: 6, order: 15, titleEn: 'He Works / She Studies', titleVi: 'Ngôi thứ ba thêm -s/-es', minutes: 14,
    focus: ['grammar', 'pronunciation'], standards: ['CCSS L.1.1c', 'CCSS L.3.1e'],
    objectiveVi: 'Dùng -s/-es với he/she/it trong Present Simple và chú ý phát âm đuôi.',
    steps: [
      content('discover', 'So sánh: I work → He works', 'Đọc chậm hai câu: “I work every day.” và “He works every day.” Ý vẫn là thói quen, nhưng khi chủ thể là he/she/it, động từ thường có thêm -s/-es.'),
      content('compare', 'Lỗi rất phổ biến với người Việt', 'Tiếng Việt không đổi động từ theo chủ ngữ. Vì vậy “He work every day.” rất dễ xuất hiện. Tiếng Anh cần “He works every day.”'),
      content('visualize', 'I/you/we/they → động từ dạng gốc · he/she/it → V-s/es', 'Hãy kiểm tra subject trước khi chọn dạng verb.', { chips: ['I work', 'you work', 'we work', 'they work', 'he works', 'she works', 'it works'] }),
      fill('Điền verb đúng.', 'She ___ English every day. (study)', 'studies', 'Phụ âm + y: study → studies.'),
      choice('Câu nào đúng?', ['He watch TV.', 'He watches TV.', 'He watching TV.', 'He watchs TV.'], 'He watches TV.', 'watch → watches với he.'),
      fix('Sửa lỗi.', 'My brother work at a hospital.', ['My brother works at a hospital.'], 'My brother = he → works.'),
      produce('Viết 2 câu với he/she/it ở Present Simple.', 'She reads every night.\nMy phone works well.', ['Có 2 dòng', 'Có động từ thêm -s/-es phù hợp'], { minLines: 2, minWords: 6, requirements: [{ id:'lines', type:'minLines', value:2, labelVi:'Có ít nhất 2 dòng' }, { id:'third_s', type:'containsThirdPersonS', count:1, labelVi:'Có ít nhất một động từ thêm -s/-es với he/she/it' }] }),
      review([['He work hay he works?', 'He works'], ['study với she?', 'studies'], ['Vì sao người Việt hay quên -s?', 'Tiếng Việt không chia động từ theo chủ ngữ theo cách này.']]),
    ],
  }),
  lesson({
    id: 'f16-a-an', unit: 7, order: 16, titleEn: 'a / an: One, Not Specific', titleVi: 'a / an: một đối tượng chưa xác định', minutes: 12,
    focus: ['grammar', 'pronunciation'], standards: ['CCSS L.1.1h'],
    objectiveVi: 'Dùng a/an trước danh từ đếm được số ít và chọn theo âm đầu, không chỉ theo chữ cái.',
    steps: [
      content('discover', 'Hãy nghe cách tiếng Anh giới thiệu “một” thứ', 'a book, a teacher, an apple, an idea. Khi nhắc một người/vật lần đầu và chưa nói chính xác cái nào, tiếng Anh thường đặt a/an phía trước.'),
      content('understand', 'Chọn theo ÂM', 'an hour nhưng a university. “hour” bắt đầu bằng âm nguyên âm; “university” bắt đầu bằng âm /j/ như “y”.'),
      choice('Cụm nào đúng?', ['an university', 'a university', 'a apple', 'an book'], 'a university', '“university” bắt đầu bằng âm /j/, nên dùng a.'),
      fill('Điền a hoặc an.', '___ apple', 'an', 'apple bắt đầu bằng âm nguyên âm.'),
      fix('Sửa lỗi.', 'She is teacher.', ['She is a teacher.'], 'Nghề nghiệp số ít thường cần a/an.'),
      produce('Viết 4 cụm: 2 với a và 2 với an.', 'a car, a student, an apple, an engineer', ['Có a và an', 'Có ít nhất 4 cụm'], { minWords: 8 }),
      review([['a/an thường đứng trước loại danh từ nào?', 'Danh từ đếm được số ít'], ['Chọn a/an theo chữ hay âm?', 'Theo âm'], ['hour dùng a hay an?', 'an hour']]),
    ],
  }),
  lesson({
    id: 'f17-the-and-zero', unit: 7, order: 17, titleEn: 'the vs. General Meaning', titleVi: 'the và ý nghĩa “đã xác định”', minutes: 13,
    focus: ['grammar', 'meaning'], standards: ['CCSS L.1.1h'],
    objectiveVi: 'Hiểu khác biệt cơ bản giữa a/an (mới/chưa xác định), the (đã xác định) và danh từ số nhiều nói chung.',
    steps: [
      content('discover', 'a dog → the dog', '“I have a dog. The dog is friendly.” Lần đầu: a dog. Sau khi cả hai biết con chó nào: the dog.'),
      content('understand', 'the là tín hiệu “bạn biết tôi đang nói cái nào”', 'Không phải mọi noun đều cần the. “Dogs are friendly.” có thể nói về chó nói chung.'),
      choice('Điền hợp lý: “I have ___ book. ___ book is about space.”', ['a / The', 'the / A', 'a / A', 'the / The'], 'a / The', 'Giới thiệu mới bằng a, nhắc lại bằng the.'),
      choice('Câu nào nói về coffee nói chung?', ['I like the coffee.', 'I like coffee.', 'I like a coffee.', 'I like an coffee.'], 'I like coffee.', 'Danh từ không đếm được nói chung thường không dùng article.'),
      produce('Viết một cặp 2 câu: giới thiệu bằng a/an, sau đó nhắc lại bằng the.', 'I have a cat. The cat is black.', ['Có 2 câu', 'Có a/an và the'], { minWords: 7 }),
      review([['a/an thường làm gì?', 'Giới thiệu một đối tượng chưa xác định'], ['the thường làm gì?', 'Chỉ đối tượng đã xác định/đã biết'], ['“Books are useful.” nói chung có cần the?', 'Không.']]),
    ],
  }),
  lesson({
    id: 'f18-adjectives', unit: 8, order: 18, titleEn: 'Adjectives Describe Nouns', titleVi: 'Tính từ mô tả danh từ', minutes: 12,
    focus: ['grammar', 'word order'], standards: ['CCSS L.1.1f', 'WIDA ELD-LA.1.Inform'],
    objectiveVi: 'Đặt tính từ trước danh từ, hoặc sau be; tránh trật tự kiểu Việt “xe đỏ” → “car red”.',
    steps: [
      content('discover', 'Táo như thế nào?', 'apple → red apple → big apple → sweet apple. Mỗi từ thêm vào cho biết quả táo trông hoặc nếm ra sao.', { chips: ['apple', 'red apple', 'big apple', 'sweet apple'] }),
      content('compare', 'Việt: quả táo đỏ · Anh: red apple', 'Trong tiếng Việt, từ mô tả thường đứng sau: quả táo đỏ. Trong tiếng Anh, từ mô tả đứng trước: red apple.', { tokenRoles: [{ text: 'red', role: 'mô tả' }, { text: 'apple', role: 'tên gọi' }] }),
      content('understand', 'Những từ mô tả này gọi là gì?', 'red, big, sweet cho biết vật đó như thế nào. Tên gọi của chúng là adjective — tính từ. Có thể đứng trước danh từ (a happy child) hoặc sau be (The child is happy).'),
      order('Sắp xếp đúng.', ['car', 'a', 'red'], 'a red car', 'article + adjective + noun.'),
      choice('Câu nào đúng?', ['The flower beautiful.', 'The beautiful flower.', 'The flower is beautiful.', 'Cả B và C'], 'Cả B và C', 'Adjective có thể trước noun hoặc sau be.'),
      fix('Sửa lỗi kiểu trật tự tiếng Việt.', 'It is a phone new.', ['It is a new phone.'], 'new phải đứng trước phone.'),
      produce('Viết 3 cụm adjective + noun.', 'a small house, a blue bag, an interesting book', ['Có ít nhất 3 cụm'], { minWords: 6 }),
      review([['Adjective trả lời câu hỏi?', 'What is it like?'], ['red apple hay apple red?', 'red apple'], ['Sau be có thể dùng adjective?', 'Có. “She is happy.”']]),
    ],
  }),
  lesson({
    id: 'f19-adverbs', unit: 9, order: 19, titleEn: 'Adverbs: How & How Often', titleVi: 'Trạng từ: như thế nào, thường xuyên ra sao', minutes: 12,
    focus: ['grammar', 'meaning'], standards: ['CCSS L.2.1e', 'CCSS L.2.6'],
    objectiveVi: 'Phân biệt adjective và adverb cơ bản; dùng adverb để mô tả verb.',
    steps: [
      content('discover', 'She speaks slowly.', '“slowly” cho biết cô ấy nói như thế nào. Trạng từ thường bổ sung thông tin về cách, thời gian hoặc mức độ thường xuyên của hành động.'),
      content('compare', 'good vs well', 'She is a good singer. (good mô tả singer) · She sings well. (well mô tả sings).'),
      identify('Chọn adverb.', ['She', 'speaks', 'slowly', '.'], [2], 'slowly mô tả cách cô ấy nói.'),
      choice('Câu nào đúng?', ['He drives careful.', 'He drives carefully.', 'He careful drives.', 'He is drives carefully.'], 'He drives carefully.', 'carefully là adverb mô tả drives.'),
      produce('Viết 2 câu: một câu nói hành động xảy ra như thế nào, một câu nói việc xảy ra thường xuyên ra sao.', 'She speaks softly.\nI usually study at night.', ['Có 2 câu', 'Có trạng từ'], { minLines: 2, minWords: 6 }),
      review([['Tính từ thường mô tả gì?', 'Danh từ hoặc đại từ'], ['Trạng từ thường bổ sung ý cho gì?', 'Động từ, tính từ, trạng từ khác hoặc cả câu'], ['good singer / sings well?', 'Cả hai đều đúng, nhưng “good” mô tả singer còn “well” mô tả cách sings xảy ra.']]),
    ],
  }),
  lesson({
    id: 'f20-prepositions-place', unit: 10, order: 20, titleEn: 'Where Is It?', titleVi: 'Giới từ nơi chốn', minutes: 12,
    focus: ['grammar', 'vocabulary'], standards: ['CCSS L.K.1e', 'CCSS L.1.1i'],
    objectiveVi: 'Dùng in, on, at, under, next to để biểu diễn quan hệ vị trí.',
    steps: [
      content('discover', 'Prepositions show relationships', 'The book is on the table. The keys are in the bag. The cat is under the chair.'),
      content('visualize', 'Không dịch từng giới từ 1:1', 'Hãy học giới từ bằng hình ảnh/quan hệ. “on” = tiếp xúc bề mặt; “in” = bên trong; “under” = thấp hơn/bên dưới.', { chips: ['in = inside', 'on = surface', 'under = below', 'next to = beside'] }),
      choice('Điền: “The phone is ___ the table.”', ['in', 'on', 'under', 'from'], 'on', 'Trên bề mặt bàn → on.'),
      choice('“The keys are ___ my pocket.”', ['in', 'on', 'at', 'to'], 'in', 'Bên trong túi → in.'),
      produce('Viết 3 câu mô tả đồ vật quanh bạn bằng in/on/under/next to.', 'My phone is on the desk.\nMy bag is under the chair.\nMy cup is next to the laptop.', ['Có 3 câu', 'Có giới từ nơi chốn'], { minLines: 3, minWords: 9 }),
      review([['on thường diễn tả?', 'Trên bề mặt'], ['in thường diễn tả?', 'Bên trong'], ['next to nghĩa cơ bản?', 'Bên cạnh']]),
    ],
  }),
  lesson({
    id: 'f21-conjunctions', unit: 11, order: 21, titleEn: 'Connect Ideas', titleVi: 'Nối ý bằng liên từ', minutes: 14,
    focus: ['grammar', 'sentence connection'], standards: ['CCSS L.1.1g', 'CCSS L.1.6'],
    objectiveVi: 'Dùng and/but/or/because/so theo ý nghĩa và tránh “because…so…” cùng lúc trong một cấu trúc cơ bản.',
    steps: [
      content('discover', 'Từ nối giống như chiếc cầu', 'and dùng để thêm ý; but để đối lập; or để đưa ra lựa chọn; because để nêu lý do; so để nói kết quả.', { chips: ['and +', 'but ↔', 'or ?', 'because ← reason', 'so → result'] }),
      content('compare', 'Một điểm dễ nhầm khi dịch từ tiếng Việt', 'Tiếng Việt thường dùng cặp “vì… nên…”. Trong tiếng Anh, ở mẫu cơ bản này mình thường chọn một trong hai cách: “Because I was tired, I went home.” hoặc “I was tired, so I went home.”'),
      choice('Chọn từ nối: “I was hungry, ___ I ate.”', ['because', 'so', 'but', 'or'], 'so', 'Đói là nguyên nhân; ăn là kết quả → so.'),
      choice('Chọn từ nối: “I stayed home ___ I was sick.”', ['because', 'so', 'or', 'and'], 'because', 'because mở phần lý do.'),
      fix('Sửa câu.', 'Because I was tired, so I went home.', ['Because I was tired, I went home.', 'I was tired, so I went home.'], 'Không cần dùng cả because và so trong mẫu này.', { flexible: true }),
      produce('Viết 2 câu nối ý: một câu với because, một câu với so.', 'I study English because I need it for school.\nI was tired, so I went to bed.', ['Có 2 câu', 'Có because và so'], { minLines: 2, minWords: 10, requirements: [{ id:'lines', type:'minLines', value:2, labelVi:'Có ít nhất 2 câu' }, { id:'connectors', type:'containsAll', values:['because','so'], labelVi:'Có cả because và so (ở hai cấu trúc phù hợp)' }] }),
      review([['because giới thiệu gì?', 'Lý do'], ['so giới thiệu gì?', 'Kết quả'], ['Because..., so... cùng lúc?', 'Tránh trong cấu trúc cơ bản tiếng Anh chuẩn.']]),
    ],
  }),
  lesson({
    id: 'f22-parts-of-speech-map', unit: 12, order: 22, titleEn: '9 Core Word Jobs', titleVi: '9 nhóm từ cốt lõi', minutes: 15,
    focus: ['concept map', 'grammar'], standards: ['CCSS L.3.1a', 'WIDA language features'],
    objectiveVi: 'Nhìn lại 9 nhóm từ đã gặp và hiểu mỗi nhóm giúp câu làm gì, thay vì học thuộc các tên rời rạc.',
    steps: [
      content('discover', 'Một quả táo, nhiều cách dùng', 'Thay vì học thuộc 9 định nghĩa, mình dùng cùng một ví dụ là “apple” để xem các nhóm từ thay đổi ý nghĩa của câu như thế nào.', { examples: ['apple', 'an apple', 'a red apple', 'eat an apple', 'eat quickly', 'six apples', 'in the box', 'it is red', 'an apple and a banana'] }),
      content('visualize', 'Một quả táo, chín nhóm từ', '“apple” nằm ở giữa. Mỗi nhánh cho bạn thấy một nhóm từ có thể gọi tên, mô tả, nối ý hoặc bổ sung thông tin như thế nào.', { conceptMap: [
        { label: 'Noun', labelVi: 'Danh từ', example: 'apple' }, { label: 'Article', labelVi: 'Mạo từ', example: 'an apple' }, { label: 'Adjective', labelVi: 'Tính từ', example: 'a red apple' }, { label: 'Quantifier', labelVi: 'Từ chỉ lượng', example: 'six apples' }, { label: 'Pronoun', labelVi: 'Đại từ', example: 'it' }, { label: 'Verb', labelVi: 'Động từ', example: 'eat an apple' }, { label: 'Adverb', labelVi: 'Trạng từ', example: 'eat quickly' }, { label: 'Preposition', labelVi: 'Giới từ', example: 'in the box' }, { label: 'Conjunction', labelVi: 'Liên từ', example: 'an apple and a banana' },
      ] }),
      identify('Chọn từ mô tả trong cụm.', ['a', 'red', 'apple'], [1], 'red mô tả apple.'),
      identify('Chọn động từ trong câu.', ['They', 'eat', 'apples', 'quickly', '.'], [1], 'eat nói hành động.'),
      choice('Trong câu này, “quickly” thuộc nhóm nào?', ['Danh từ (noun)', 'Trạng từ (adverb)', 'Mạo từ (article)', 'Đại từ (pronoun)'], 'Trạng từ (adverb)', '“quickly” cho biết hành động “eat” diễn ra như thế nào.'),
      produce('Tạo một “mini map” với noun khác. Viết ít nhất 4 biến thể.', 'book\na book\na useful book\nread a book\nread quietly', ['Có ít nhất 4 dòng'], { minLines: 4, minWords: 8 }),
      review([['Danh từ thường gọi tên gì?', 'Người, nơi, vật hoặc ý tưởng'], ['Tính từ thường giúp trả lời câu hỏi nào?', 'Người/vật đó như thế nào?'], ['Trạng từ thường cho biết điều gì?', 'Như thế nào, khi nào hoặc thường xuyên ra sao'], ['Liên từ dùng để làm gì?', 'Nối từ, cụm từ hoặc ý.']]),
    ],
  }),
  lesson({
    id: 'f23-sv-pattern', unit: 13, order: 23, titleEn: 'Three Core Sentence Shapes', titleVi: 'Ba hình dạng câu cốt lõi', minutes: 14,
    focus: ['sentence pattern', 'writing'], standards: ['CCSS L.K.1f', 'CCSS L.1.1j'],
    objectiveVi: 'Nhận ra ba hình dạng câu nền tảng bằng câu hỏi trực giác trước khi dùng ký hiệu S/V/O/C.',
    steps: [
      content('discover', 'Ba câu — ba cách hoàn thành ý', 'Birds fly. | I like coffee. | She is happy. Trước tiên chỉ hỏi: câu nói về ai/cái gì, điều gì xảy ra, và ý còn cần gì để hoàn chỉnh?', { examples: ['Birds fly.', 'I like coffee.', 'She is happy.'] }),
      content('notice', 'Đặt tên cho từng phần', 'Mỗi câu hỏi bên dưới trỏ tới một phần của câu bạn vừa đọc.', { tokenRoles: [{ text: 'Ai/cái gì?', role: 'Chủ ngữ' }, { text: 'Điều gì xảy ra?', role: 'Động từ' }, { text: 'Nhận hành động là gì?', role: 'Tân ngữ' }, { text: 'Mô tả lại chủ ngữ?', role: 'Bổ ngữ' }] }),
      content('understand', 'Viết tắt bằng tiếng Anh', 'Chủ ngữ = Subject = S. Động từ = Verb = V. Tân ngữ = Object = O. Bổ ngữ = Complement = C. Đây chỉ là cách viết ngắn cho những gì bạn vừa hiểu — không cần học thuộc trước.', { chips: ['S = Subject', 'V = Verb', 'O = Object', 'C = Complement'] }),
      choice('Câu nào có hình dạng “Who + does what + what?”', ['Birds fly.', 'I like coffee.', 'She is happy.', 'Babies sleep.'], 'I like coffee.', 'I = người làm; like = hành động/trạng thái; coffee = điều được thích.'),
      order('Xây câu có người làm + hành động + vật nhận hành động.', ['books', 'reads', 'She', '.'], 'She reads books .', 'She = S; reads = V; books = O.'),
      produce('Viết 3 câu: một câu rất ngắn, một câu có object, và một câu mô tả subject sau be.', 'Birds fly.\nI like coffee.\nMy room is quiet.', ['Có 3 dòng', 'Có ba hình dạng câu khác nhau'], { minLines: 3, minWords: 8 }),
      review([['Who/what? gọi là gì?', 'Subject (S)'], ['What receives the action?', 'Object (O)'], ['Complement làm gì?', 'Mô tả hoặc gọi tên lại chủ ngữ, sau be.']]),
    ],
  }),
  lesson({
    id: 'f24-svo-pattern', unit: 14, order: 24, titleEn: 'Core Pattern: S + V + O', titleVi: 'Mẫu cốt lõi S + V + O', minutes: 13,
    focus: ['sentence pattern', 'writing'], standards: ['CCSS L.1.1j', 'WIDA ELD-LA.1.Inform'],
    objectiveVi: 'Tìm phần nhận hành động bằng câu hỏi “làm gì với ai/cái gì?” rồi tự tạo câu theo mẫu S + V + O.',
    steps: [
      content('discover', 'I read books.', 'Câu này có ba phần: I là người làm, read là hành động, books là thứ được đọc. Sau khi hiểu ý này, mình mới gọi chúng là S, V và O.'),
      content('visualize', 'S → V → O', 'Hãy hình dung mũi tên từ người làm hành động đến thứ nhận hành động.', { tokenRoles: [{ text: 'She', role: 'S' }, { text: 'likes', role: 'V' }, { text: 'coffee', role: 'O' }] }),
      content('compare', 'Thứ tự từ làm đổi nghĩa', 'Tiếng Anh dựa nhiều vào vị trí của từ. “The dog bites the man” và “The man bites the dog” dùng gần như cùng từ, nhưng người làm và người nhận hành động đã đổi chỗ.'),
      identify('Chọn phần nhận hành động.', ['My', 'brother', 'plays', 'soccer', '.'], [3], 'Hỏi “plays what?” — chơi gì? → soccer.'),
      order('Ghép câu theo mẫu S + V + O.', ['music', 'likes', 'She', '.'], 'She likes music .', 'Người/vật chính đứng trước, rồi đến động từ và phần nhận hành động.'),
      produce('Viết 3 câu S + V + O về điều bạn thích/làm.', 'I like coffee.\nI study English.\nI play games.', ['Có 3 dòng', 'Mỗi câu có object'], { minLines: 3, minWords: 9 }),
      review([['O là viết tắt của gì?', 'Object — tân ngữ'], ['Tìm tân ngữ bằng câu hỏi nào?', 'Làm gì với ai/cái gì?'], ['Trong “I like coffee”, tân ngữ là gì?', 'coffee']]),
    ],
  }),
  lesson({
    id: 'f25-svc-pattern', unit: 15, order: 25, titleEn: 'Core Pattern: S + V + C', titleVi: 'Mẫu cốt lõi S + V + C', minutes: 13,
    focus: ['sentence pattern', 'be'], standards: ['CCSS L.1.1j'],
    objectiveVi: 'Hiểu phần đứng sau be có thể mô tả hoặc gọi tên chủ ngữ, và phân biệt phần này với tân ngữ nhận hành động.',
    steps: [
      content('discover', 'She is tired.', '“tired” không phải thứ nhận một hành động. Nó cho biết She đang như thế nào. Phần này được gọi là bổ ngữ (complement).'),
      content('visualize', 'Bổ ngữ nói thêm về chủ ngữ', 'Trong “Tom is a teacher”, “a teacher” nói Tom là ai. Trong “The soup smells good”, “good” mô tả món súp. Cả hai đều bổ sung thông tin về chủ ngữ.', { tokenRoles: [{ text: 'Tom', role: 'S' }, { text: 'is', role: 'V' }, { text: 'a teacher', role: 'C' }] }),
      choice('Bổ ngữ trong “The room is quiet.” là gì?', ['The room', 'is', 'quiet', 'room'], 'quiet', 'quiet mô tả chủ ngữ “The room”.'),
      choice('Câu nào là S + V + C?', ['I read books.', 'Birds fly.', 'She is happy.', 'They play soccer.'], 'She is happy.', 'happy mô tả chủ ngữ sau “is”, nên đây là bổ ngữ.'),
      produce('Viết 3 câu dùng be để nói: một câu về danh tính, một câu mô tả đặc điểm và một câu nói vị trí.', 'I am a student.\nMy room is quiet.\nMy keys are on the desk.', ['Có 3 dòng', 'Có be + complement'], { minLines: 3, minWords: 9 }),
      review([['Bổ ngữ khác tân ngữ thế nào?', 'Bổ ngữ mô tả/gọi tên chủ ngữ; tân ngữ là phần nhận hành động.'], ['Trong “She is happy”, bổ ngữ là gì?', 'happy'], ['Trong “Tom is a teacher”, “a teacher” nói về ai?', 'Tom.']]),
    ],
  }),
  lesson({
    id: 'f26-negatives', unit: 16, order: 26, titleEn: 'Make a Sentence Negative', titleVi: 'Tạo câu phủ định', minutes: 14,
    focus: ['grammar', 'transformation'], standards: ['CCSS L.1.1j'],
    objectiveVi: 'Biết khi nào chỉ cần thêm not sau be và khi nào cần do/does + not với động từ thường.',
    steps: [
      content('visualize', 'Hai cách tạo câu phủ định', 'Với be: She is tired → She is not tired. Với động từ thường: She likes tea → She does not like tea.'),
      content('understand', 'Sau does, động từ trở về dạng gốc', 'does đã mang dấu hiệu của he/she/it, nên động từ phía sau không thêm -s nữa: “She doesn’t likes” ✗ → “She doesn’t like” ✓.'),
      choice('Phủ định đúng: “They are busy.”', ['They do not busy.', 'They are not busy.', 'They does not busy.', 'They not are busy.'], 'They are not busy.', 'Có be → be + not.'),
      choice('Phủ định đúng: “He works here.”', ['He not works here.', 'He does not works here.', 'He does not work here.', 'He is not work here.'], 'He does not work here.', 'Với he và động từ thường: does not + động từ dạng gốc.'),
      fix('Sửa lỗi.', 'She does not likes coffee.', ['She does not like coffee.', "She doesn't like coffee."], 'Sau does/doesn’t, dùng động từ dạng gốc “like”.', { flexible: true }),
      produce('Viết 2 câu khẳng định rồi đổi sang phủ định: một câu với be và một câu với động từ thường.', 'I am tired. → I am not tired.\nHe likes tea. → He does not like tea.', ['Có be-negative', 'Có do/does-negative'], { minLines: 2, minWords: 10, requirements: [{ id:'be_neg', type:'containsBeNegative', count:1, labelVi:'Có một câu phủ định với be' }, { id:'do_neg', type:'containsDoNegative', count:1, labelVi:'Có một câu phủ định với do/does' }] }),
      review([['Phủ định với be?', 'be + not'], ['Phủ định hiện tại với động từ thường?', 'do/does + not + động từ dạng gốc'], ['“does not likes” có đúng không?', 'Không. Đúng là “does not like”.']]),
    ],
  }),
  lesson({
    id: 'f27-questions', unit: 17, order: 27, titleEn: 'Ask Yes/No Questions', titleVi: 'Đặt câu hỏi Có/Không', minutes: 14,
    focus: ['grammar', 'questions'], standards: ['CCSS L.K.1d', 'CCSS L.1.1j'],
    objectiveVi: 'Đổi câu khẳng định thành câu hỏi Có/Không bằng be hoặc do/does, và nhớ dùng động từ dạng gốc sau does.',
    steps: [
      content('visualize', 'Nhìn vị trí của be và do/does', 'She is ready. → Is she ready? | You like coffee. → Do you like coffee? | He likes coffee. → Does he like coffee?'),
      content('understand', 'Câu hỏi không chỉ thêm dấu ?', 'Tiếng Anh còn đổi thứ tự từ. Với động từ thường, do/does đứng trước chủ ngữ: “You like coffee.” → “Do you like coffee?”'),
      order('Sắp xếp câu hỏi.', ['you', 'Do', 'English', 'study', '?'], 'Do you study English?', 'Do + chủ ngữ + động từ dạng gốc + phần còn lại + ?.', { punctuationRequired: true }),
      order('Sắp xếp câu hỏi.', ['she', 'Is', 'ready', '?'], 'Is she ready?', 'Với be, đưa am/is/are lên trước chủ ngữ và giữ dấu ?.', { punctuationRequired: true }),
      fix('Sửa lỗi.', 'Does he likes pizza?', ['Does he like pizza?'], 'Sau does dùng động từ dạng gốc “like”.'),
      produce('Viết 3 câu hỏi Có/Không: một câu với be, một câu với do và một câu với does.', 'Are you ready?\nDo you work here?\nDoes she study English?', ['Có 3 câu hỏi', 'Có be/do/does'], { minLines: 3, minWords: 9, requirements: [{ id:'questions', type:'containsQuestion', count:3, labelVi:'Có ít nhất 3 câu hỏi' }, { id:'frames', type:'containsAll', values:['be-question','do-question','does-question'], labelVi:'Có câu hỏi với be, do và does' }] }),
      review([['Câu hỏi với be bắt đầu thế nào?', 'Be + chủ ngữ + ...?'], ['Câu hỏi với động từ thường bắt đầu thế nào?', 'Do/Does + chủ ngữ + động từ dạng gốc + ...?'], ['“Does he likes?” có đúng không?', 'Không → “Does he like?”']]),
    ],
  }),
  lesson({
    id: 'f28-present-simple-meaning', unit: 18, order: 28, titleEn: 'Present Simple Means “Usually / Generally”', titleVi: 'Hiện tại đơn: thói quen và sự thật', minutes: 15,
    focus: ['tense', 'meaning'], standards: ['CCSS L.1.1e', 'CCSS L.3.1e'],
    objectiveVi: 'Biết khi nào dùng thì hiện tại đơn để nói thói quen, sự thật, lịch trình hoặc trạng thái ổn định.',
    steps: [
      content('discover', 'Câu này đang nói về lúc nào?', '“I study every day.” không có nghĩa là tôi đang học ngay lúc này. Câu này nói về một việc lặp lại thường xuyên.'),
      content('visualize', 'Nhìn thói quen trên dòng thời gian', 'Thì hiện tại đơn thường dùng cho việc lặp lại hoặc điều đúng nói chung.', { chips: ['thói quen', 'sự thật', 'trạng thái ổn định', 'lịch trình'] }),
      content('understand', 'Hỏi ý nghĩa trước khi chọn thì', 'Việc này có phải thói quen, sự thật, lịch trình hoặc trạng thái ổn định không? Nếu có, thì hiện tại đơn thường là lựa chọn phù hợp.'),
      choice('Câu nào mô tả thói quen?', ['I study every evening.', 'I am studying right now.', 'I studied yesterday.', 'I will study tomorrow.'], 'I study every evening.', 'every evening cho thấy đây là việc lặp lại.'),
      fill('Điền dạng đúng.', 'I ___ coffee every morning. (drink)', 'drink', 'Với I, dùng động từ dạng gốc “drink”. Ở bài tiếp theo bạn sẽ học vì sao he/she/it làm động từ thay đổi.'),
      fix('Sửa lỗi.', 'I am study English every day.', ['I study English every day.'], 'Khi nói thói quen, dùng động từ “study” trực tiếp: I study. Không thêm be trước study.'),
      produce('Viết 4 câu hiện tại đơn về thói quen hoặc sự thật của bạn.', 'I wake up at 7.\nI drink coffee.\nI study English every day.\nI live in Washington.', ['Có 4 câu', 'Nói thói quen/sự thật'], { minLines: 4, minWords: 16 }),
      review([['Thì hiện tại đơn thường nói về gì?', 'Thói quen, sự thật, lịch trình hoặc trạng thái ổn định.'], ['“every day” cho biết điều gì?', 'Việc lặp lại / thói quen.'], ['Với he/she/it, bài tiếp theo cần chú ý gì?', 'Động từ thường thêm -s/-es.']]),
    ],
  }),
  lesson({
    id: 'f29-sentence-expansion', unit: 19, order: 29, titleEn: 'Grow a Sentence', titleVi: 'Mở rộng câu từng lớp', minutes: 16,
    focus: ['sentence expansion', 'writing'], standards: ['CCSS L.K.1f', 'CCSS L.1.1j', 'CCSS L.2.1f'],
    objectiveVi: 'Biết bắt đầu từ một câu ngắn rồi thêm từ mô tả, cách thức, nơi chốn và thời gian mà vẫn giữ câu rõ ràng.',
    steps: [
      content('discover', 'Bắt đầu nhỏ rồi thêm lớp', 'Dogs run. → The dogs run. → The small dogs run. → The small dogs run quickly. → The small dogs run quickly in the park. → …every morning.'),
      content('visualize', 'Câu lõi trước, chi tiết sau', 'Giữ phần chính của câu thật rõ. Sau đó mới thêm từ mô tả, cách thức, nơi chốn hoặc thời gian.', { tokenRoles: [{ text: 'The small dogs', role: 'expanded S' }, { text: 'run', role: 'V' }, { text: 'quickly', role: 'how' }, { text: 'in the park', role: 'where' }, { text: 'every morning', role: 'when' }] }),
      choice('Lõi của “The small dogs run quickly in the park.” là gì?', ['small dogs', 'dogs run', 'run quickly', 'in the park'], 'dogs run', 'Bỏ các chi tiết bổ sung, phần chính còn lại là “dogs run”.'),
      order('Tạo câu tự nhiên.', ['every morning', 'The small dogs', 'run', 'in the park', 'quickly', '.'], 'The small dogs run quickly in the park every morning .', 'Một thứ tự tự nhiên là: ai/cái gì + hành động + cách thức + nơi chốn + thời gian.'),
      produce('Bắt đầu với “I study.” rồi mở rộng qua ít nhất 4 dòng. Mỗi dòng thêm một chi tiết.', 'I study.\nI study English.\nI study English carefully.\nI study English carefully at home.\nI study English carefully at home every night.', ['Có ít nhất 4 dòng', 'Mỗi dòng phát triển từ câu trước'], { minLines: 4, minWords: 14 }),
      review([['Mở rộng câu nên bắt đầu từ đâu?', 'Từ câu lõi / phần chính.'], ['Thêm chi tiết có được làm mất chủ ngữ hoặc động từ không?', 'Không.'], ['Có thể hỏi gì để thêm chi tiết?', 'Loại nào? Như thế nào? Ở đâu? Khi nào? Vì sao?']]),
    ],
  }),
  lesson({
    id: 'f31-have-has', unit: 18, order: 31, titleEn: 'I Have / She Has', titleVi: 'have / has: nói về điều mình có', minutes: 13,
    focus: ['grammar', 'everyday English'], standards: ['CCSS L.1.1e', 'WIDA ELD-SI.1.Inform'],
    objectiveVi: 'Dùng have/has để nói về đồ vật, gia đình và những điều thuộc về cuộc sống hằng ngày.',
    steps: [
      content('discover', 'I have → She has', 'have rất hữu ích để nói về điều bạn có: I have a car. We have two dogs. Với he/she/it, have đổi thành has.', { examples: ['I have a book.', 'She has a brother.', 'They have two dogs.'] }),
      content('notice', 'Chỉ he/she/it đổi dạng', 'I/you/we/they → have. He/she/it → has. Đây là cùng ý tưởng ngôi thứ ba bạn đã thấy ở works/studies.', { examples: ['I have', 'you have', 'he has', 'she has', 'we have', 'they have'] }),
      content('compare', 'Dùng để nói về cuộc sống thật', 'Bạn có thể dùng have/has để nói về gia đình, đồ vật, thú cưng, lớp học hoặc lịch trình. Điều này giúp bài viết “10 câu về bản thân” tự nhiên hơn.'),
      fill('Điền have hoặc has.', 'My sister ___ a new phone.', 'has', 'My sister = she → has.'),
      choice('Câu nào đúng?', ['They has two cats.', 'They have two cats.', 'She have a dog.', 'He have a car.'], 'They have two cats.', 'they → have; he/she/it → has.'),
      order('Xây câu tự nhiên.', ['has', 'My friend', 'a small dog', '.'], 'My friend has a small dog .', 'My friend = he/she → has.'),
      produce('Viết 3 câu thật về bạn hoặc người quen: ít nhất một câu với have và một câu với has.', 'I have a laptop.\nWe have a small family.\nMy friend has a dog.', ['Có ít nhất 3 dòng', 'Có have và has'], { minLines: 3, minWords: 9, requirements: [{ id:'lines', type:'minLines', value:3, labelVi:'Có ít nhất 3 câu' }, { id:'forms', type:'containsAll', values:['have','has'], labelVi:'Có cả have và has' }] }),
      review([['I/you/we/they dùng gì?', 'have'], ['he/she/it dùng gì?', 'has'], ['have/has giúp nói về gì?', 'Đồ vật, gia đình, quan hệ và những điều mình có.']]),
    ],
  }),


  lesson({
    id: 'f32-hello-introduce-yourself', unit: 21, order: 32, titleEn: 'Hello! Introduce Yourself', titleVi: 'Chào và giới thiệu bản thân', minutes: 12,
    focus: ['speaking','listening','conversation'], objectiveVi: 'Chào một người, nói tên của mình và đáp lại một lời chào cơ bản.',
    steps: [
      content('discover','Một cuộc gặp rất ngắn','Nghe/đọc: “Hi! I’m Mai.” — “Hi, Mai. I’m Tom.” Không cần biết mọi quy tắc; trước tiên chỉ cần hiểu hai người đang chào và nói tên.',{examples:['Hi! I’m Mai.','Hello. My name is Tom.']}),
      content('notice','Bạn thấy hai cách nói tên','“I’m Mai.” và “My name is Mai.” đều giúp người nghe biết tên. I’m = I am.',{examples:['I’m Mai.','My name is Mai.']}),
      content('understand','Mẫu giao tiếp đầu tiên','Khi mới gặp: chào → nói tên → đáp lại. Hãy coi đây là một “khung hội thoại” để dùng ngay, không phải một bảng ngữ pháp.',{callout:'Hi/Hello → I’m… / My name is… → Nice to meet you.'}),
      choice('Bạn muốn nói “Tên tôi là Lan.” Câu nào phù hợp?', ['My name is Lan.','I name Lan.','Me Lan name.','Lan is my.'], 'My name is Lan.', '“My name is Lan.” là mẫu tự nhiên để nói tên.'),
      order('Xây câu chào.', ['Hello,','I’m','Minh','.'], 'Hello, I’m Minh .', 'Chào trước, rồi giới thiệu tên.'),
      produce('Viết 2 dòng như một cuộc gặp: dòng 1 chào; dòng 2 nói tên của bạn.', 'Hello!\nI’m Minh.', ['Có lời chào','Có tên'], {minLines:2,minWords:3,requirements:[{id:'hello',type:'containsAny',values:['hi','hello'],count:1,labelVi:'Có Hi hoặc Hello'},{id:'name',type:'containsAny',values:["i'm",'i am','my name is'],count:1,labelVi:'Có cách nói tên'}]}),
      review([['Hai lời chào cơ bản?','Hi / Hello'],['Hai cách nói tên?','I’m… / My name is…'],['Mục tiêu quan trọng nhất?','Có thể dùng mẫu trong một cuộc gặp thật.']]),
    ],
  }),
  lesson({
    id: 'f33-numbers-age-info', unit: 22, order: 33, titleEn: 'Numbers, Age & Basic Information', titleVi: 'Số, tuổi & thông tin cơ bản', minutes: 13,
    focus: ['numbers','listening','speaking'], objectiveVi: 'Hiểu các số cơ bản và nói tuổi bằng cấu trúc “I am … years old.”',
    steps: [
      content('discover','Số xuất hiện trong giao tiếp','Nghe những câu như “I am twenty years old.” hoặc “Room 12.” Số không chỉ để làm toán — chúng cho biết tuổi, giờ, số phòng, số điện thoại.',{examples:['I am twenty years old.','Room 12.','It is 7 o’clock.']}),
      content('understand','Tuổi dùng be','Tiếng Anh nói “I am 20 years old.” Không nói “I have 20 years” theo kiểu một số ngôn ngữ khác.',{callout:'I am + number + years old.'}),
      choice('Câu nào nói “Tôi 25 tuổi”?', ['I have 25 years.','I am 25 years old.','I 25 old.','My age have 25.'], 'I am 25 years old.', 'Tuổi dùng be: I am … years old.'),
      fill('Điền số.', 'I am ___ years old.', '30', 'Câu hoàn chỉnh: I am 30 years old.', {accepted:['30','thirty']}),
      produce('Viết tuổi của bạn. Nếu không muốn dùng tuổi thật, chọn một số bất kỳ để luyện.', 'I am 30 years old.', ['Có am','Có years old'], {minWords:5,requirements:[{id:'be',type:'containsAny',values:['am'],count:1,labelVi:'Có am'},{id:'old',type:'containsAny',values:['years old'],count:1,labelVi:'Có years old'}]}),
      review([['Tuổi dùng have hay be?','be'],['Khung cơ bản?','I am + number + years old.'],['Số dùng ở đâu ngoài tuổi?','Giờ, phòng, điện thoại, số lượng…']]),
    ],
  }),
  lesson({
    id: 'f34-possessive-adjectives', unit: 23, order: 34, titleEn: 'My, Your, His, Her', titleVi: 'Nói “của ai”', minutes: 14,
    focus: ['possessives','family','noun phrases'], objectiveVi: 'Dùng my/your/his/her trước danh từ để nói một người/vật thuộc về ai.',
    steps: [
      content('discover','Tên đồ vật + người sở hữu','So sánh: “my book”, “your phone”, “his car”, “her bag”. Từ đầu tiên giúp người nghe biết “của ai”.',{examples:['my book','your phone','his car','her bag']}),
      content('compare','Khác trật tự tiếng Việt','Tiếng Việt thường nói “sách của tôi”. Tiếng Anh đặt từ sở hữu trước danh từ: “my book”.',{examples:['sách của tôi → my book','điện thoại của cô ấy → her phone']}),
      choice('“quyển sách của tôi” là gì?', ['book my','my book','I book','me book'], 'my book', 'my đứng trước noun.'),
      choice('Lan có một chiếc túi. Chọn cụm đúng để nói “túi của cô ấy”.', ['his bag','her bag','your bag','my bag'], 'her bag', 'Lan → she → her bag.'),
      produce('Viết 3 cụm: một thứ của bạn, một thứ của một người nam, một thứ của một người nữ.', 'my phone\nhis car\nher book', ['Có 3 dòng','Có my/his/her'], {minLines:3,minWords:6,requirements:[{id:'my',type:'containsAny',values:['my'],count:1,labelVi:'Có my'},{id:'his_her',type:'containsAny',values:['his','her'],count:1,labelVi:'Có his hoặc her'}]}),
      review([['my đứng ở đâu?','Trước danh từ'],['he → từ sở hữu?','his'],['she → từ sở hữu?','her']]),
    ],
  }),
  lesson({
    id: 'f35-this-that-these-those', unit: 24, order: 35, titleEn: 'This, That, These, Those', titleVi: 'Chỉ vật gần và xa', minutes: 14,
    focus: ['demonstratives','singular_plural'], objectiveVi: 'Chọn this/that cho một vật và these/those cho nhiều vật, đồng thời phân biệt gần/xa.',
    steps: [
      content('discover','Một hay nhiều? Gần hay xa?','Hãy hình dung Bunny đang chỉ đồ vật. this = một vật gần; that = một vật xa; these = nhiều vật gần; those = nhiều vật xa.',{examples:['this book','that house','these shoes','those cars']}),
      content('visualize','Hai câu hỏi trước khi chọn','1) Một hay nhiều? 2) Gần hay xa? Trả lời hai câu này trước, rồi mới chọn từ.',{chips:['1 + near → this','1 + far → that','many + near → these','many + far → those']}),
      choice('Nhiều chiếc giày ở gần: ___ shoes', ['this','that','these','those'], 'these', 'many + near → these.'),
      choice('Một ngôi nhà ở xa: ___ house', ['this','that','these','those'], 'that', 'one + far → that.'),
      produce('Viết 4 cụm, mỗi cụm dùng một từ: this, that, these, those.', 'this book\nthat house\nthese shoes\nthose cars', ['Có 4 dòng'], {minLines:4,minWords:8,requirements:[{id:'all',type:'selfCheck',labelVi:'Tôi đã dùng đủ this / that / these / those'}]}),
      review([['this?','một vật gần'],['those?','nhiều vật xa'],['Trước khi chọn, hỏi gì?','Một/nhiều và gần/xa.']]),
    ],
  }),
  lesson({
    id: 'f36-wh-what-who-where', unit: 25, order: 36, titleEn: 'What? Who? Where?', titleVi: 'Hỏi về vật, người và nơi', minutes: 15,
    focus: ['questions','wh_words'], objectiveVi: 'Dùng What, Who và Where để hỏi loại thông tin mình thật sự cần.',
    steps: [
      content('discover','Câu hỏi bắt đầu bằng điều bạn muốn biết','What hỏi “cái gì”; Who hỏi “ai”; Where hỏi “ở đâu”. Đừng học ba từ rời rạc — hãy nghĩ về loại thông tin bạn đang thiếu.',{examples:['What is this?','Who is she?','Where is the book?']}),
      content('understand','Từ hỏi + khung câu','Với be, bạn có thể dùng: What/Who/Where + is/are + …? Hãy nghe ý nghĩa trước rồi mới chú ý thứ tự.',{callout:'Where + is + the book?'}),
      choice('Bạn muốn hỏi “Cuốn sách ở đâu?”', ['What is the book?','Who is the book?','Where is the book?','Where the book is?'], 'Where is the book?', 'Hỏi nơi chốn → Where.'),
      order('Xây câu hỏi.', ['Who','is','she','?'], 'Who is she ?', 'Who hỏi người; với be, is đứng trước subject.' , {punctuationRequired:true}),
      produce('Viết 3 câu hỏi: một câu What, một câu Who, một câu Where.', 'What is this?\nWho is he?\nWhere is my phone?', ['Có 3 câu hỏi'], {minLines:3,minWords:8,requirements:[{id:'what',type:'containsAny',values:['what'],count:1,labelVi:'Có What'},{id:'who',type:'containsAny',values:['who'],count:1,labelVi:'Có Who'},{id:'where',type:'containsAny',values:['where'],count:1,labelVi:'Có Where'},{id:'q',type:'containsQuestion',count:3,labelVi:'Có 3 câu hỏi'}]}),
      review([['What hỏi?','cái gì/thông tin gì'],['Who hỏi?','ai'],['Where hỏi?','ở đâu']]),
    ],
  }),
  lesson({
    id: 'f37-there-is-are', unit: 26, order: 37, titleEn: 'There Is / There Are', titleVi: 'Nói “có” ở một nơi', minutes: 15,
    focus: ['there_is_are','singular_plural','places'], objectiveVi: 'Dùng there is cho một thứ và there are cho nhiều thứ khi mô tả một nơi.',
    steps: [
      content('discover','Nhìn vào một căn phòng','“There is a chair.” = có một chiếc ghế. “There are two books.” = có hai cuốn sách. Mẫu này giới thiệu thứ đang tồn tại ở một nơi.',{examples:['There is a chair in the room.','There are two books on the table.']}),
      content('notice','Một hay nhiều quyết định is/are','one → there is; plural/many → there are.',{chips:['one → There is','many → There are']}),
      choice('Chọn câu đúng.', ['There is two books.','There are two books.','There two books are.','There have two books.'], 'There are two books.', 'two books là plural → are.'),
      fill('Điền is/are.', 'There ___ a cat under the chair.', 'is', 'a cat = một → There is.'),
      produce('Mô tả phòng bạn hoặc một căn phòng tưởng tượng bằng 3 câu there is/there are.', 'There is a desk.\nThere are two chairs.\nThere is a book on the desk.', ['Có 3 câu'], {minLines:3,minWords:12,requirements:[{id:'there',type:'containsAny',values:['there is','there are'],count:2,labelVi:'Có there is / there are'}]}),
      review([['Một vật?','There is'],['Nhiều vật?','There are'],['Mẫu này dùng để làm gì?','Giới thiệu/mô tả thứ tồn tại ở một nơi.']]),
    ],
  }),
  lesson({
    id: 'f38-can-cant', unit: 27, order: 38, titleEn: 'Can / Can’t', titleVi: 'Nói khả năng', minutes: 14,
    focus: ['modals','ability','speaking'], objectiveVi: 'Dùng can/can’t + động từ gốc để nói điều mình hoặc người khác có thể/không thể làm.',
    steps: [
      content('discover','Một từ nhỏ thay đổi ý nghĩa','“I swim.” nói hành động. “I can swim.” nói khả năng. “I can’t swim.” nói không có khả năng.',{examples:['I can swim.','She can drive.','He can’t cook.']}),
      content('understand','Sau can dùng động từ gốc','can + swim, can + drive. Không thêm to và không thêm -s sau can.',{callout:'She can swim. ✓ · She can swims. ✗ · She can to swim. ✗'}),
      choice('Câu nào đúng?', ['He can drives.','He can drive.','He can to drive.','He cans drive.'], 'He can drive.', 'Sau can dùng động từ dạng gốc.'),
      choice('Câu nào nghĩa là “Tôi không thể bơi”?', ['I do not can swim.','I can’t swim.','I am not swim.','I no can swim.'], 'I can’t swim.', 'can’t = cannot.'),
      produce('Viết 3 câu: 2 điều bạn có thể làm và 1 điều bạn không thể làm.', 'I can cook.\nI can drive.\nI can’t sing.', ['Có 3 câu'], {minLines:3,minWords:8,requirements:[{id:'can',type:'containsPattern',pattern:'\\bcan\\b',count:2,labelVi:'Có ít nhất 2 câu can'},{id:'cant',type:'containsAny',values:["can't",'cannot'],count:1,labelVi:'Có một câu can’t/cannot'}]}),
      review([['Sau can dùng dạng nào?','động từ dạng gốc'],['can’t nghĩa là?','cannot / không thể'],['Có thêm -s sau can không?','Không.']]),
    ],
  }),
  lesson({
    id: 'f39-simple-requests-instructions', unit: 28, order: 39, titleEn: 'Simple Requests & Instructions', titleVi: 'Yêu cầu & chỉ dẫn đơn giản', minutes: 14,
    focus: ['imperatives','survival_english','listening'], objectiveVi: 'Hiểu và dùng một số câu chỉ dẫn/yêu cầu cơ bản bắt đầu bằng động từ.',
    steps: [
      content('discover','Đôi khi tiếng Anh bắt đầu thẳng bằng hành động','“Sit down.” “Open the book.” “Please wait.” Đây là những câu chỉ dẫn/yêu cầu; subject thường không cần nói ra.',{examples:['Please sit down.','Open the book.','Please wait here.']}),
      content('understand','Động từ đứng đầu','Trong một instruction đơn giản, bắt đầu bằng verb gốc. Thêm please để lịch sự hơn.',{callout:'Please + verb…'}),
      choice('Câu nào là một yêu cầu lịch sự?', ['Please open the door.','You opening door.','Door please opens.','Please to open door.'], 'Please open the door.', 'Please + verb gốc.'),
      choice('Bạn nghe “Please wait here.” Bạn nên làm gì?', ['đi ngay','chờ ở đây','mở cửa','ngồi xuống'], 'chờ ở đây', 'wait here = chờ ở đây.'),
      produce('Viết 3 yêu cầu/chỉ dẫn đơn giản mà bạn có thể nghe ở lớp học hoặc nơi công cộng.', 'Please sit down.\nOpen the book.\nPlease wait here.', ['Có 3 dòng'], {minLines:3,minWords:7,requirements:[{id:'please',type:'containsAny',values:['please'],count:1,labelVi:'Có ít nhất một câu với please'}]}),
      review([['Câu chỉ dẫn đơn giản thường bắt đầu bằng gì?','Động từ dạng gốc.'],['Thêm gì để câu lịch sự hơn?','please'],['Có cần nói “you” ở đầu câu chỉ dẫn không?','Thường không cần.']]),
    ],
  }),
  lesson({
    id: 'f40-days-basic-time', unit: 29, order: 40, titleEn: 'Days & Basic Time', titleVi: 'Ngày và giờ cơ bản', minutes: 15,
    focus: ['time','days','listening'], objectiveVi: 'Hiểu today/tomorrow, các ngày trong tuần và nói một giờ đơn giản.',
    steps: [
      content('discover','Thời gian giúp câu có bối cảnh','“I study on Monday.” “It is 7 o’clock.” “I work tomorrow.” Những từ thời gian nói khi nào điều gì xảy ra.',{examples:['I study on Monday.','It is 7 o’clock.','I work tomorrow.']}),
      content('understand','Ngày trong tuần dùng on','Foundation chỉ cần một khung quan trọng: on + Monday/Tuesday…; còn giờ cơ bản dùng at + time.',{callout:'on Monday · at 7 o’clock'}),
      choice('Cụm nào đúng?', ['in Monday','on Monday','at Monday','Monday on'], 'on Monday', 'Ngày trong tuần dùng on.'),
      choice('“at 7 o’clock” nói về gì?', ['nơi chốn','giờ','người','số nhiều'], 'giờ', 'at + giờ cụ thể.'),
      produce('Viết 3 câu về lịch đơn giản của bạn. Dùng một ngày và một giờ.', 'I study on Monday.\nI work at 8 o’clock.\nI rest on Sunday.', ['Có 3 câu'], {minLines:3,minWords:10,requirements:[{id:'on',type:'containsAny',values:['on monday','on tuesday','on wednesday','on thursday','on friday','on saturday','on sunday'],count:1,labelVi:'Có on + ngày'},{id:'at',type:'selfCheck',labelVi:'Tôi đã dùng at + giờ cụ thể'}]}),
      review([['Ngày trong tuần thường dùng giới từ?','on'],['Giờ cụ thể thường dùng?','at'],['today / tomorrow nói gì?','thời điểm hiện tại / ngày kế tiếp.']]),
    ],
  }),
  lesson({
    id: 'f41-short-conversation', unit: 30, order: 41, titleEn: 'Understand a Short Conversation', titleVi: 'Hiểu một cuộc hội thoại ngắn', minutes: 18,
    focus: ['listening','reading','conversation'], objectiveVi: 'Nghe/đọc một hội thoại A0 và lấy được tên, nơi ở, hoạt động và thông tin đơn giản.',
    steps: [
      content('discover','Đừng cố dịch từng từ','Hội thoại: “Hi, I’m Anna.” — “Hello, I’m Minh. Where do you live?” — “I live in Seattle. I study English.” Hãy tìm thông tin chính trước.',{examples:['Hi, I’m Anna.','Where do you live?','I live in Seattle.','I study English.']}),
      content('understand','Nghe theo mục tiêu','Khi nghe, hãy hỏi: Ai? Ở đâu? Làm gì? Không cần bắt được 100% từng từ mới hiểu được ý chính.',{callout:'Who? → Where? → What does the person do?'}),
      choice('Anna/Minh hỏi loại thông tin nào bằng “Where do you live?”', ['tên','nơi sống','tuổi','khả năng'], 'nơi sống', 'Where hỏi nơi chốn.'),
      choice('“I study English.” cho biết điều gì?', ['nơi ở','hoạt động','tuổi','số lượng'], 'hoạt động', 'study English = hoạt động.'),
      produce('Viết một hội thoại 4 dòng giữa bạn và Bunny: chào, nói tên, hỏi nơi sống, trả lời.', 'Bunny: Hello!\nYou: Hi, I’m Minh.\nBunny: Where do you live?\nYou: I live in Bellingham.', ['Có 4 dòng'], {minLines:4,minWords:10,requirements:[{id:'hello',type:'containsAny',values:['hi','hello'],count:1,labelVi:'Có lời chào'},{id:'where',type:'containsAny',values:['where'],count:1,labelVi:'Có câu hỏi Where'},{id:'live',type:'containsAny',values:['live'],count:1,labelVi:'Có câu trả lời về nơi sống'}]}),
      review([['Khi nghe hội thoại A0, có cần dịch từng từ không?','Không'],['Ba câu hỏi lấy ý chính?','Ai? Ở đâu? Làm gì?'],['Where do you live? hỏi gì?','Nơi sống.']]),
    ],
  }),
  lesson({
    id: 'f42-a0-big-review', unit: 31, order: 42, titleEn: 'A0 Big Review', titleVi: 'Ôn lớn trước kiểm tra A0', minutes: 22,
    focus: ['review','integration','mastery'], objectiveVi: 'Kết nối các cấu trúc A0 thành những việc bạn thật sự làm được: giới thiệu, hỏi/đáp, mô tả, nói về thói quen và hiểu đoạn ngắn.', mastery:{minAccuracy:.7,requiresProduction:true},
    steps: [
      content('discover','A0 không phải 42 quy tắc rời rạc','Bunny muốn bạn nhìn thấy 5 khả năng: giới thiệu bản thân, mô tả người/vật, nói về thói quen, hỏi thông tin và hiểu một đoạn tiếng Anh ngắn.',{chips:['Introduce yourself','Describe','Routine','Ask','Understand']}),
      content('understand','Ôn bằng việc sử dụng','Thay vì đọc lại toàn bộ lý thuyết, hãy trả lời các tình huống nhỏ. Nếu một phần còn yếu, Bunny sẽ đưa nó trở lại Practice.'),
      choice('Chọn câu đúng.', ['She can swims.','She can swim.','She cans swim.','She can to swim.'], 'She can swim.', 'Sau can dùng động từ dạng gốc.'),
      choice('Chọn câu đúng.', ['There is two chairs.','There are two chairs.','There two chairs.','There have two chairs.'], 'There are two chairs.', 'two chairs → are.'),
      fix('Sửa câu.', 'Where you live?', ['Where do you live?'], 'Với động từ thường “live”, câu hỏi cần có “do”.'),
      choice('Chọn câu đúng.', ['This are my book.','These is my books.','This is my book.','This my book is.'], 'This is my book.', 'one + near → this; be với singular → is.'),
      produce('Viết 6–8 câu giới thiệu ngắn về bạn: tên/tuổi (có thể dùng thông tin giả), nơi ở, một thứ bạn có, một điều bạn có thể làm, một thói quen và một câu phủ định.', 'I’m Minh.\nI am 30 years old.\nI live in Washington.\nI have a small car.\nI can cook.\nI study English every day.\nI do not work on Sunday.', ['Có ít nhất 6 câu'], {minLines:6,minWords:25,requirements:[{id:'be',type:'containsPattern',pattern:'be',count:1,labelVi:'Có am/is/are'},{id:'have',type:'containsAny',values:['have','has'],count:1,labelVi:'Có have/has'},{id:'can',type:'containsAny',values:['can'],count:1,labelVi:'Có can'},{id:'negative',type:'containsNegative',count:1,labelVi:'Có câu phủ định'}]}),
      review([['A0 cần chứng minh điều gì?','Bạn có thể hiểu và tự tạo tiếng Anh rất cơ bản.'],['Nếu một cấu trúc còn yếu thì sao?','Bunny đưa phần đó trở lại để ôn đúng chỗ.'],['Sau bài này là gì?','Dự án viết A0 rồi bài kiểm tra cuối A0.']]),
    ],
  }),

  lesson({
    id: 'f30-foundation-mastery', unit: 20, order: 30, titleEn: 'A0 Mastery Project', titleVi: 'Dự án A0: 10 câu về bản thân', minutes: 22,
    focus: ['writing', 'mastery'], standards: ['CCSS L.1.1', 'CCSS W.1.2', 'WIDA ELD-SI.K-3.Inform'],
    objectiveVi: 'Chứng minh nền tảng bằng cách tự tạo 10 câu có cấu trúc đúng, thay vì chỉ nhận diện đáp án.', mastery: { minAccuracy: 0.7, requiresProduction: true },
    steps: [
      content('discover', 'Mastery = tự tạo được tiếng Anh', 'Bạn không “qua A0” chỉ vì chọn đúng nhiều câu trắc nghiệm. Dự án này yêu cầu bạn tự tạo tiếng Anh trước khi làm bài kiểm tra cuối A0.'),
      content('understand', 'Yêu cầu cho 10 câu', 'Hãy cố gắng có: 2 câu với am/is/are, 3 câu hiện tại đơn, ít nhất 1 câu với have/has, 1 câu với can/can’t, 1 câu phủ định, 1 câu hỏi, 1 câu có tính từ, 1 câu có giới từ và 1 câu nối bằng because hoặc so. Một câu có thể đáp ứng nhiều yêu cầu.', { chips: ['be ×2', 'Present Simple ×3', 'have/has ×1', 'can/can’t ×1', 'negative ×1', 'question ×1', 'tính từ ×1', 'preposition ×1', 'because/so ×1'] }),
      choice('Câu nào có lỗi?', ['I am a student.', 'She is kind.', 'He work every day.', 'We live here.'], 'He work every day.', 'he → works.'),
      fix('Sửa lỗi.', 'Because I like English, so I study every day.', ['Because I like English, I study every day.', 'I like English, so I study every day.'], 'Chọn because hoặc so trong cấu trúc cơ bản này.', { flexible: true }),
      produce('Viết 10 câu về bản thân. Sau khi viết, tự đọc lại xem câu đã có người/vật chính, động từ, a/an/the khi cần, đuôi -s/-es và dấu câu chưa.', 'I am Minh.\nI am a student.\nI live in Washington.\nI study English every day.\nI like coffee.\nI can cook simple food.\nI do not work on Sunday.\nDo I need more practice?\nI have a small car.\nMy phone is on the desk.\nI study English because I want to write better.', ['Có đúng 10 dòng câu hoặc nhiều hơn', 'Có ít nhất 2 câu với be', 'Có một negative', 'Có một question', 'Có because hoặc so'], { minLines: 10, minWords: 35, masteryProject: true, requirements: [
        { id:'min_lines', type:'minLines', value:10, labelVi:'Có ít nhất 10 câu/dòng' },
        { id:'min_words', type:'minWords', value:35, labelVi:'Có đủ nội dung để tạo 10 câu có ý nghĩa (ít nhất 35 từ)' },
        { id:'be_sentences', type:'containsPattern', pattern:'be', count:2, labelVi:'Có ít nhất 2 câu với am/is/are' },
        { id:'present_simple', type:'selfCheck', labelVi:'Có ít nhất 3 câu hiện tại đơn về thói quen hoặc sự thật' },
        { id:'have_has', type:'containsAny', values:['have','has'], count:1, labelVi:'Có ít nhất một câu với have hoặc has' },
        { id:'can', type:'containsAny', values:['can',"can't",'cannot'], count:1, labelVi:'Có ít nhất một câu với can/can’t' },
        { id:'negative', type:'containsNegative', count:1, labelVi:'Có ít nhất một câu phủ định' },
        { id:'question', type:'containsQuestion', count:1, labelVi:'Có ít nhất một câu hỏi' },
        { id:'adjective', type:'selfCheck', labelVi:'Có ít nhất một câu dùng tính từ để mô tả danh từ' },
        { id:'preposition', type:'containsPreposition', count:1, labelVi:'Có ít nhất một preposition cơ bản' },
        { id:'connector', type:'containsAny', values:['because','so'], count:1, labelVi:'Có because hoặc so' },
        { id:'self_review', type:'selfCheck', labelVi:'Tôi đã tự kiểm tra chủ ngữ, động từ, a/an/the, -s/-es và dấu câu' },
      ] }),
      review([['A0 không chỉ kiểm tra điều gì?', 'Không chỉ chọn đáp án đúng.'], ['Khi tự sửa bài, nên kiểm tra gì?', 'Chủ ngữ, động từ, a/an/the, sự hòa hợp và dấu câu.'], ['Sau A0 là gì?', 'A1 Everyday English, rồi A2 và các cấp độ cao hơn.']]),
    ],
  }),
]

// The learner-facing path is intentionally ability-first rather than grammar-book-first.
// Lesson IDs remain stable so existing local progress is preserved across this reordering.
export const FOUNDATION_PATH_IDS = [
  // Optional English Starter
  'f01-alphabet-map','f02-sounds-and-letters','f03-what-is-a-word','f04-english-sentence-direction',
  // My First English
  'f05-complete-thought','f06-subject-who-what','f07-verb-what-happens','f08-first-sv-sentences','f11-personal-pronouns','f12-be-am-is-are','f13-be-negative-questions',
  // Name & Describe Things
  'f09-nouns-name-the-world','f10-one-or-more-nouns','f16-a-an','f18-adjectives','f20-prepositions-place',
  // Talk About Everyday Life
  'f14-action-verbs','f28-present-simple-meaning','f15-third-person-s','f19-adverbs','f31-have-has','f26-negatives','f27-questions',
  // Build Better Sentences
  'f23-sv-pattern','f24-svo-pattern','f25-svc-pattern','f21-conjunctions','f29-sentence-expansion',
  // See the System
  'f22-parts-of-speech-map','f17-the-and-zero',
  // Everyday Starter Communication
  'f32-hello-introduce-yourself','f33-numbers-age-info','f34-possessive-adjectives','f35-this-that-these-those','f36-wh-what-who-where','f37-there-is-are','f38-can-cant','f39-simple-requests-instructions','f40-days-basic-time',
  // Understand & Integrate
  'f41-short-conversation','f42-a0-big-review',
  // Use Your English
  'f30-foundation-mastery',
]

export const foundationChapters = [
  { id: 0, emoji: '🔤', titleEn: 'English Starter', titleVi: 'Khởi động tiếng Anh', optional: true, outcomeVi: 'Dành cho người cần ôn chữ, âm, từ và cách câu xuất hiện trên trang.', lessonIds: ['f01-alphabet-map','f02-sounds-and-letters','f03-what-is-a-word','f04-english-sentence-direction'] },
  { id: 1, emoji: '🐰', titleEn: 'My First English', titleVi: 'Tiếng Anh đầu tiên của tôi', outcomeVi: 'Tôi có thể hiểu một câu cơ bản, nói ai/cái gì và dùng am/is/are.', lessonIds: ['f05-complete-thought','f06-subject-who-what','f07-verb-what-happens','f08-first-sv-sentences','f11-personal-pronouns','f12-be-am-is-are','f13-be-negative-questions'] },
  { id: 2, emoji: '🍎', titleEn: 'Name & Describe Things', titleVi: 'Gọi tên và mô tả', outcomeVi: 'Tôi có thể gọi tên, nói số lượng cơ bản và mô tả đồ vật/người.', lessonIds: ['f09-nouns-name-the-world','f10-one-or-more-nouns','f16-a-an','f18-adjectives','f20-prepositions-place'] },
  { id: 3, emoji: '🚶', titleEn: 'Everyday Life', titleVi: 'Nói về cuộc sống hằng ngày', outcomeVi: 'Tôi có thể nói về thói quen, điều mình có, câu phủ định và câu hỏi Có/Không.', lessonIds: ['f14-action-verbs','f28-present-simple-meaning','f15-third-person-s','f19-adverbs','f31-have-has','f26-negatives','f27-questions'] },
  { id: 4, emoji: '🧩', titleEn: 'Build Better Sentences', titleVi: 'Xây câu tốt hơn', outcomeVi: 'Tôi có thể nhìn các hình dạng câu, nối ý và thêm chi tiết mà không phá cấu trúc.', lessonIds: ['f23-sv-pattern','f24-svo-pattern','f25-svc-pattern','f21-conjunctions','f29-sentence-expansion'] },
  { id: 5, emoji: '🗺️', titleEn: 'See the System', titleVi: 'Nhìn thấy cả hệ thống', outcomeVi: 'Tôi có thể nối các nhóm từ thành một bản đồ và hiểu the ở mức Foundation.', lessonIds: ['f22-parts-of-speech-map','f17-the-and-zero'] },
  { id: 6, emoji: '💬', titleEn: 'Starter Communication', titleVi: 'Giao tiếp A0 thực tế', outcomeVi: 'Tôi có thể chào hỏi, nói tuổi/sở hữu, hỏi thông tin, mô tả nơi chốn, khả năng và lịch đơn giản.', lessonIds: ['f32-hello-introduce-yourself','f33-numbers-age-info','f34-possessive-adjectives','f35-this-that-these-those','f36-wh-what-who-where','f37-there-is-are','f38-can-cant','f39-simple-requests-instructions','f40-days-basic-time'] },
  { id: 7, emoji: '🎧', titleEn: 'Understand Short English', titleVi: 'Hiểu tiếng Anh ngắn', outcomeVi: 'Tôi có thể lấy ý chính từ hội thoại ngắn và kết nối các cấu trúc A0.', lessonIds: ['f41-short-conversation','f42-a0-big-review'] },
  { id: 8, emoji: '🏆', titleEn: 'Use Your English', titleVi: 'Dùng tiếng Anh của bạn', outcomeVi: 'Tôi có thể tự viết 10 câu về bản thân và chuẩn bị cho bài kiểm tra A0.', lessonIds: ['f30-foundation-mastery'] },
]

const cycleConfigs = {
  'f02-sounds-and-letters': {
    notice: ['map → /m/ /æ/ /p/', 'cat → /k/ /æ/ /t/'],
    noticeVi: 'Hai từ đều có âm đầu, âm giữa và âm cuối. Với người Việt, hãy đặc biệt để ý âm cuối không biến mất.',
    target: 'cat', focusVi: 'Kết thúc rõ âm /t/.', dictation: 'cat',
  },
  'f05-complete-thought': {
    notice: ['My brother.', 'My brother works.'], noticeVi: 'Cụm đầu chỉ gọi tên. Cụm sau cho biết điều xảy ra nên đã tạo một ý cơ bản hoàn chỉnh.',
    target: 'My brother works.', build: { tokens:['My brother','works','.'], answer:'My brother works .' },
  },
  'f08-first-sv-sentences': {
    notice: ['Birds fly.', 'Babies sleep.'], noticeVi: 'Mỗi câu có một phần “ai/cái gì?” và một phần “điều gì xảy ra?”. Đó là lõi bạn sẽ dùng lại rất nhiều.',
    target: 'Birds fly.', build: { tokens:['Birds','fly','.'], answer:'Birds fly .' },
  },
  'f11-personal-pronouns': {
    notice: ['Lan is kind.', 'She is kind.'], noticeVi: 'Ý không đổi, nhưng “She” giúp tránh lặp tên Lan.',
    target: 'She is kind.', build: { tokens:['She','is','kind','.'], answer:'She is kind .' },
  },
  'f12-be-am-is-are': {
    notice: ['I am ready.', 'She is ready.', 'They are ready.'], noticeVi: 'Từ “ready” giữ nguyên; am/is/are thay đổi theo người hoặc vật mà câu đang nói tới.',
    target: 'She is tired.', focusVi: 'Đừng bỏ “is”.', dictation: 'She is tired.', build: { tokens:['She','is','tired','.'], answer:'She is tired .' },
  },
  'f13-be-negative-questions': {
    notice: ['She is tired.', 'She is not tired.', 'Is she tired?'], noticeVi: 'Với am/is/are, phủ định chỉ cần thêm not; câu hỏi đưa am/is/are lên trước chủ ngữ.',
    target: 'Are you ready?', build: { tokens:['Are','you','ready','?'], answer:'Are you ready ?', punctuationRequired:true },
  },
  'f09-nouns-name-the-world': {
    notice: ['teacher', 'city', 'book', 'freedom'], noticeVi: 'Các từ rất khác nhau nhưng cùng làm một việc: gọi tên người, nơi, vật hoặc ý tưởng.',
    target: 'book',
  },
  'f10-one-or-more-nouns': {
    notice: ['one cat', 'two cats', 'one box', 'two boxes'], noticeVi: 'Khi ý nghĩa đổi từ một sang nhiều, danh từ thường cũng đổi hình dạng.',
    target: 'two cats', focusVi: 'Nghe âm cuối của cats.',
  },
  'f16-a-an': {
    notice: ['a book', 'an apple', 'a university', 'an hour'], noticeVi: 'a/an phụ thuộc vào âm mở đầu bạn nghe, không chỉ chữ cái đầu bạn nhìn thấy.',
    target: 'an apple', focusVi: 'Nối nhẹ an + apple như một cụm.', build: { tokens:['an','apple'], answer:'an apple' },
  },
  'f18-adjectives': {
    notice: ['a red apple', 'a small house'], noticeVi: 'Trong các cụm này, từ mô tả đứng trước danh từ — khác với trật tự quen thuộc trong tiếng Việt.',
    target: 'a red apple', build: { tokens:['a','red','apple'], answer:'a red apple' },
  },
  'f20-prepositions-place': {
    notice: ['in the box', 'on the table', 'under the chair'], noticeVi: 'Giới từ như in/on/under đứng trước cụm danh từ để giúp người nghe hình dung vị trí.',
    target: 'The book is on the table.', build: { tokens:['The book','is','on the table','.'], answer:'The book is on the table .' },
  },
  'f14-action-verbs': {
    notice: ['I work.', 'I like coffee.'], noticeVi: 'work nói về một hành động; like nói về một trạng thái/cảm xúc. Cả hai đều là động từ.',
    target: 'I work every day.', build: { tokens:['I','work','every day','.'], answer:'I work every day .' },
  },
  'f28-present-simple-meaning': {
    notice: ['I study every evening.', 'The sun rises in the east.'], noticeVi: 'Một câu nói về việc lặp lại; câu kia nói một sự thật chung. Cả hai đều dùng thì hiện tại đơn.',
    target: 'I study every evening.', dictation: 'I study every evening.', build: { tokens:['I','study','every evening','.'], answer:'I study every evening .' },
  },
  'f15-third-person-s': {
    notice: ['I work every day.', 'She works every day.'], noticeVi: 'Ý nghĩa và thời gian không đổi. Chỉ khi đổi sang she, động từ thêm -s.',
    target: 'She works every day.', focusVi: 'Chú ý âm cuối của “works”.', dictation: 'She works every day.', build: { tokens:['She','works','every day','.'], answer:'She works every day .' },
  },
  'f19-adverbs': {
    notice: ['I study.', 'I usually study.', 'I study carefully.'], noticeVi: 'Trạng từ có thể cho biết hành động xảy ra thường xuyên ra sao hoặc theo cách nào mà không làm đổi phần chính của câu.',
    target: 'I usually study at night.', build: { tokens:['I','usually','study','at night','.'], answer:'I usually study at night .' },
  },
  'f31-have-has': {
    notice: ['I have a dog.', 'She has a dog.'], noticeVi: 'Ý “có” vẫn giữ nguyên; he/she/it dùng has, còn I/you/we/they dùng have.',
    target: 'She has a dog.', dictation: 'She has a dog.', build: { tokens:['She','has','a dog','.'], answer:'She has a dog .' },
  },
  'f26-negatives': {
    notice: ['She is tired. → She is not tired.', 'She likes tea. → She does not like tea.'], noticeVi: 'Với be, chỉ cần thêm not. Với động từ thường, dùng do/does + not và đưa động từ chính về dạng gốc.',
    target: 'She does not like coffee.', build: { tokens:['She','does not','like','coffee','.'], answer:'She does not like coffee .' },
  },
  'f27-questions': {
    notice: ['She is ready. → Is she ready?', 'She studies English. → Does she study English?'], noticeVi: 'Câu hỏi làm thay đổi thứ tự câu. Với động từ thường, do/does đứng trước chủ ngữ.',
    target: 'Does she study English?', dictation: 'Does she study English?', build: { tokens:['Does','she','study','English','?'], answer:'Does she study English ?', punctuationRequired:true },
  },
  'f23-sv-pattern': {
    target: 'I like coffee.', build: { tokens:['I','like','coffee','.'], answer:'I like coffee .' },
  },
  'f24-svo-pattern': {
    notice: ['I read books.', 'She likes coffee.'], noticeVi: 'Sau một động từ hành động, tân ngữ thường trả lời câu hỏi “làm gì với ai/cái gì?”.',
    target: 'She likes coffee.', build: { tokens:['She','likes','coffee','.'], answer:'She likes coffee .' },
  },
  'f25-svc-pattern': {
    notice: ['She is happy.', 'Tom is a teacher.'], noticeVi: 'Phần sau be không nhận hành động; nó mô tả hoặc gọi tên lại chủ ngữ.',
    target: 'She is happy.', build: { tokens:['She','is','happy','.'], answer:'She is happy .' },
  },
  'f21-conjunctions': {
    notice: ['I am tired, so I rest.', 'I rest because I am tired.'], noticeVi: 'Hai câu diễn tả quan hệ nguyên nhân/kết quả theo hai cách. Đừng ghép because và so vào cùng một khung cơ bản.',
    target: 'I rest because I am tired.', build: { tokens:['I rest','because','I am tired','.'], answer:'I rest because I am tired .' },
  },
  'f29-sentence-expansion': {
    notice: ['Dogs run.', 'The small dogs run quickly in the park every morning.'], noticeVi: 'Câu dài vẫn giữ một lõi nhỏ. Các lớp mới trả lời: loại nào, như thế nào, ở đâu, khi nào.',
    target: 'The small dogs run quickly in the park every morning.',
  },
  'f22-parts-of-speech-map': {
    target: 'I eat a red apple.', build: { tokens:['I','eat','a red apple','.'], answer:'I eat a red apple .' },
  },
  'f17-the-and-zero': {
    notice: ['I have a book.', 'The book is new.', 'Books are useful.'], noticeVi: 'a giới thiệu một thứ; the trỏ lại thứ đã xác định; plural không article có thể nói về cả nhóm nói chung.',
    target: 'The book is new.', build: { tokens:['The book','is','new','.'], answer:'The book is new .' },
  },

  'f32-hello-introduce-yourself': {
    notice:['Hi! I’m Mai.','Hello. My name is Tom.'], noticeVi:'Hai câu khác nhau nhưng cùng mục đích: chào và cho người nghe biết tên.',
    target:'Hello. My name is Tom.', dictation:'My name is Tom.', build:{tokens:['My name','is','Tom','.'],answer:'My name is Tom .'},
  },
  'f33-numbers-age-info': {
    notice:['I am twenty years old.','It is 7 o’clock.'], noticeVi:'Số mang thông tin cụ thể: tuổi hoặc thời gian.',
    target:'I am twenty years old.', dictation:'I am twenty years old.', build:{tokens:['I','am','twenty years old','.'],answer:'I am twenty years old .'},
  },
  'f34-possessive-adjectives': {
    notice:['my book','your phone','his car','her bag'], noticeVi:'Từ đứng trước thay đổi để cho biết “của ai”, còn danh từ chính vẫn giữ nguyên.',
    target:'This is my book.', build:{tokens:['This','is','my book','.'],answer:'This is my book .'},
  },
  'f35-this-that-these-those': {
    notice:['this book','that house','these shoes','those cars'], noticeVi:'Bạn luôn giải hai câu hỏi: một/nhiều và gần/xa.',
    target:'These are my shoes.', build:{tokens:['These','are','my shoes','.'],answer:'These are my shoes .'},
  },
  'f36-wh-what-who-where': {
    notice:['What is this?','Who is she?','Where is the book?'], noticeVi:'Từ hỏi thay đổi theo loại thông tin bạn muốn nhận.',
    target:'Where is my phone?', dictation:'Where is my phone?', build:{tokens:['Where','is','my phone','?'],answer:'Where is my phone ?',punctuationRequired:true},
  },
  'f37-there-is-are': {
    notice:['There is a chair.','There are two chairs.'], noticeVi:'Số lượng quyết định is hay are.',
    target:'There are two books on the table.', build:{tokens:['There are','two books','on the table','.'],answer:'There are two books on the table .'},
  },
  'f38-can-cant': {
    notice:['I can swim.','She can drive.','He can’t cook.'], noticeVi:'can/can’t đứng trước động từ dạng gốc để nói về khả năng.',
    target:'I can swim.', dictation:'I can swim.', build:{tokens:['I','can','swim','.'],answer:'I can swim .'},
  },
  'f39-simple-requests-instructions': {
    notice:['Please sit down.','Open the book.','Please wait here.'], noticeVi:'Câu chỉ dẫn đơn giản thường bắt đầu bằng động từ dạng gốc; thêm please để câu lịch sự hơn.',
    target:'Please open the book.', dictation:'Please open the book.', build:{tokens:['Please','open','the book','.'],answer:'Please open the book .'},
  },
  'f40-days-basic-time': {
    notice:['on Monday','at 7 o’clock'], noticeVi:'Ngày và giờ dùng những preposition khác nhau trong các mẫu cơ bản.',
    target:'I study on Monday.', build:{tokens:['I','study','on Monday','.'],answer:'I study on Monday .'},
  },
  'f41-short-conversation': {
    notice:['Where do you live?','I live in Seattle.'], noticeVi:'Một câu hỏi nhắm vào nơi chốn; câu trả lời giữ lại động từ live và thêm địa điểm.',
    target:'Where do you live?', dictation:'Where do you live?', build:{tokens:['Where','do','you','live','?'],answer:'Where do you live ?',punctuationRequired:true},
  },
  'f42-a0-big-review': {
    notice:['I’m Anna.','I live in Seattle.','I can swim.','I study every day.'], noticeVi:'A0 là khả năng kết hợp nhiều mẫu nhỏ để nói những điều thật về một người.',
    target:'I study English every day.', dictation:'I study English every day.',
  },

  'f30-foundation-mastery': {
    target: 'I study English every day.',
  },
}

function enrichWithLearningCycle(lesson) {
  const config = cycleConfigs[lesson.id]
  if (!config) return lesson
  const original = [...lesson.steps]
  const firstExercise = original.findIndex(step => step.type === 'exercise')
  const insertAt = firstExercise < 0 ? Math.max(0, original.length - 2) : firstExercise
  const before = original.slice(0, insertAt)
  const after = original.slice(insertAt)
  const extra = []

  if (config.noticeVi && !before.some(step => step.type === 'content' && step.kind === 'notice')) {
    const discoverIndex = before.findIndex(step => step.type === 'content' && step.kind === 'discover')
    const notice = content('notice', 'Bạn nhận ra gì?', config.noticeVi, { examples: config.notice || [] })
    if (discoverIndex >= 0) before.splice(discoverIndex + 1, 0, notice)
    else before.push(notice)
  }

  // For multisensory lessons, keep the learner-facing rhythm predictable:
  // discover → notice → understand → visualize/compare → hear → say → practice/build → produce → review.
  const contentRank = { discover: 0, notice: 1, understand: 2, visualize: 3, compare: 4 }
  before.sort((a, b) => (contentRank[a.kind] ?? 9) - (contentRank[b.kind] ?? 9))

  if (config.target) {
    extra.push({
      type: 'listen',
      id: `${lesson.id}-listen`,
      targets: [config.target],
      promptVi: 'Nghe một lần ở tốc độ thường. Nếu chưa rõ, bạn có thể nghe lại ở tốc độ Chậm.',
      focusVi: config.focusVi,
    })
    extra.push({
      type: 'speak',
      id: `${lesson.id}-speak`,
      target: config.target,
      promptVi: 'Đến lượt bạn. Hãy nói cả câu theo mẫu. Nếu lúc này không tiện nói, chọn “Tôi không thể nói lúc này” để tiếp tục bài.',
      focusVi: config.focusVi,
    })
  }

  if (config.dictation) {
    extra.push({
      type: 'exercise', exerciseType: 'dictation', intent: 'listen_write', id: `${lesson.id}-dictation`,
      promptVi: 'Nghe rồi viết lại câu bạn nghe được.', audioText: config.dictation, answer: config.dictation,
      validationMode: 'normalizedExact', explainVi: 'Nếu chưa chắc, nghe lại và để ý từng từ, cách viết và dấu câu.',
    })
  }

  const alreadyHasBuild = original.some(step => step.type === 'exercise' && step.exerciseType === 'wordOrder')
  if (config.build && !alreadyHasBuild) {
    extra.push({
      type: 'exercise', exerciseType: 'wordOrder', intent: 'build', id: `${lesson.id}-build`, promptVi: 'Ghép các mảnh thành một câu tự nhiên.',
      tokens: config.build.tokens, answer: config.build.answer, punctuationRequired: !!config.build.punctuationRequired,
      explainVi: 'Đọc ý nghĩa trước, rồi xếp các từ theo thứ tự tiếng Anh.',
    })
  }

  return { ...lesson, steps: [...before, ...extra, ...after] }
}


function upgradeLessonLearningEngine(lesson) {
  const reviewTasks = buildSkillReviewTasks(lesson, 3)
  const steps = (lesson.steps || []).map(step => {
    if (step.type !== 'review') return step
    return {
      ...step,
      mode: 'skillRetrieval',
      tasks: reviewTasks,
      titleVi: 'Dùng lại điều vừa học',
      introVi: 'Không cần nhớ lời giải thích của Bunny. Hãy làm vài câu ngắn để xem bạn có dùng được tiếng Anh hay chưa.',
    }
  })
  const skills = [...new Set((lesson.focus || []).map(x => String(x).toLowerCase().replace(/[^a-z0-9]+/g,'_')).filter(Boolean))]
  return {
    ...lesson,
    canDoVi: lesson.canDoVi || lesson.objectiveVi,
    learningDesign: {
      cycle: ['discover','notice','understand','listen','speak_optional','recognize','build','repair','produce','review'],
      inputBeforeOutput: true,
      meaningBeforeTerminology: true,
      reviewTestsEnglish: true,
    },
    skillTags: skills,
    steps,
  }
}

const pathIndex = new Map(FOUNDATION_PATH_IDS.map((id, index) => [id, index]))

export const foundationLessons = rawFoundationLessons
  .map(enrichWithLearningCycle)
  .map(applyLessonTeachingCopy)
  .map(upgradeLessonLearningEngine)
  .filter(lesson => pathIndex.has(lesson.id))
  .sort((a, b) => pathIndex.get(a.id) - pathIndex.get(b.id))
  .map((lesson, index) => ({ ...lesson, order: index + 1 }))

export const foundationLessonById = Object.fromEntries(foundationLessons.map(l => [l.id, l]))

export function getUnitLessons(unitId) {
  return foundationLessons.filter(l => l.unit === unitId).sort((a, b) => a.order - b.order)
}

export function getChapterLessons(chapterId) {
  const chapter = foundationChapters.find(item => item.id === chapterId)
  if (!chapter) return []
  return chapter.lessonIds.map(id => foundationLessonById[id]).filter(Boolean)
}

export function validateFoundationCurriculum() {
  const errors = []
  const seen = new Set()
  foundationLessons.forEach((l, index) => {
    if (!l.id || seen.has(l.id)) errors.push(`Lesson ${index + 1}: missing/duplicate id`)
    seen.add(l.id)
    if (!l.titleEn || !l.titleVi || !l.objectiveVi) errors.push(`${l.id}: missing title/objective`)
    if (!Array.isArray(l.steps) || l.steps.length < 5) errors.push(`${l.id}: needs at least 5 steps`)
    if (!l.steps.some(s => s.type === 'exercise')) errors.push(`${l.id}: needs an exercise`)
    if (l.mastery.requiresProduction && !l.steps.some(s => s.type === 'production')) errors.push(`${l.id}: needs production`)
    if (l.steps.some(s => s.type === 'speak') && !l.steps.some(s => s.type === 'listen')) errors.push(`${l.id}: speak step should follow listening support`)
  })
  FOUNDATION_PATH_IDS.forEach(id => { if (!seen.has(id)) errors.push(`Path references missing lesson: ${id}`) })
  return errors
}
