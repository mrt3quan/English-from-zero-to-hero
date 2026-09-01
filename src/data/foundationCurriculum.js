const content = (kind, title, bodyVi, extra = {}) => ({ type: 'content', kind, title, bodyVi, ...extra })
const choice = (promptVi, options, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'choice', promptVi, options, answer, explainVi, ...extra })
const order = (promptVi, tokens, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'wordOrder', punctuationRequired: false, promptVi, tokens, answer, explainVi, ...extra })
const fill = (promptVi, sentence, answer, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'fillBlank', validationMode: 'normalizedExact', promptVi, sentence, answer, explainVi, ...extra })
const identify = (promptVi, tokens, answerIndexes, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'identify', promptVi, tokens, answerIndexes, explainVi, ...extra })
const fix = (promptVi, incorrect, accepted, explainVi, extra = {}) => ({ type: 'exercise', exerciseType: 'errorFix', validationMode: 'acceptedVariants', promptVi, incorrect, accepted, explainVi, ...extra })
const produce = (promptVi, placeholder, checks, extra = {}) => ({ type: 'production', promptVi, placeholder, checks, ...extra })
const review = (items) => ({ type: 'review', items })

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
  { id: 12, titleEn: 'Core Word Jobs Map', titleVi: 'Bản đồ 9 nhóm từ cốt lõi', descriptionVi: 'Ghép các mảnh đã học thành một hệ thống dễ nhìn.' },
  { id: 13, titleEn: 'Sentence Shapes', titleVi: 'Hình dạng câu', descriptionVi: 'Từ câu hỏi trực giác đến S/V/O/C và ba hình dạng cốt lõi.' },
  { id: 14, titleEn: 'S + V + O', titleVi: 'Mẫu câu S + V + O', descriptionVi: 'Thêm tân ngữ để nói hành động tác động lên ai/cái gì.' },
  { id: 15, titleEn: 'S + V + C', titleVi: 'Mẫu câu S + V + C', descriptionVi: 'Dùng bổ ngữ để mô tả hoặc gọi tên chủ ngữ.' },
  { id: 16, titleEn: 'Negatives', titleVi: 'Câu phủ định', descriptionVi: 'Phân biệt be + not và do/does + not.' },
  { id: 17, titleEn: 'Questions', titleVi: 'Câu hỏi', descriptionVi: 'Đưa be hoặc do/does lên đúng vị trí.' },
  { id: 18, titleEn: 'Everyday Present', titleVi: 'Hiện tại hằng ngày', descriptionVi: 'Nói thói quen, sự thật, have/has và điều ổn định.' },
  { id: 19, titleEn: 'Sentence Expansion', titleVi: 'Mở rộng câu', descriptionVi: 'Thêm chi tiết mà vẫn giữ cấu trúc rõ ràng.' },
  { id: 20, titleEn: 'Foundation Mastery', titleVi: 'Dự án tổng kết', descriptionVi: 'Viết 10 câu đúng về chính bạn.' },
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
    objectiveVi: 'Nhận biết ranh giới từ bằng khoảng trắng và hiểu mỗi từ mang một công việc/ý nghĩa trong câu.',
    steps: [
      content('discover', 'Khoảng trắng chia câu thành từ', 'Trong “I like apples.” có ba từ: I | like | apples. Dấu chấm không phải là một từ.', { tokenRoles: [{ text: 'I', role: 'word 1' }, { text: 'like', role: 'word 2' }, { text: 'apples', role: 'word 3' }, { text: '.', role: 'punctuation' }] }),
      content('understand', 'Hiểu câu trước, tên ngữ pháp để sau', 'I = tôi. like = thích. apples = táo. Ghép lại: “I like apples.” = “Tôi thích táo.” Trước mắt chỉ cần hiểu câu đang nói gì. Tên ngữ pháp mình sẽ học khi bạn đã quen với ý nghĩa.', { tokenRoles: [{ text: 'I', role: 'ai?' }, { text: 'like', role: 'thích gì?' }, { text: 'apples', role: 'cái gì?' }] }),
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
      fix('Biến nhóm từ này thành câu hoàn chỉnh.', 'My brother', ['My brother works.', 'My brother studies.', 'My brother is kind.'], 'Cần thêm điều gì đó về “my brother”, thường là một động từ.', { flexible: true }),
      produce('Viết một câu cực ngắn có người/vật + điều xảy ra.', 'Birds fly.', ['Có ít nhất 2 từ', 'Có dấu câu cuối'], { minWords: 2 }),
      review([['Câu hoàn chỉnh cần truyền đạt gì?', 'Một ý hoàn chỉnh'], ['“The red car” đã là câu chưa?', 'Chưa'], ['Câu cơ bản thường cần gì?', 'Chủ thể + động từ/ý nói về chủ thể.']]),
    ],
  }),
  lesson({
    id: 'f06-subject-who-what', unit: 2, order: 6, titleEn: 'Subject: Who or What?', titleVi: 'Chủ ngữ: câu nói về ai/cái gì?', minutes: 10,
    focus: ['grammar', 'sentence structure'], standards: ['CCSS L.K.1f', 'CCSS L.1.1c'],
    objectiveVi: 'Tìm phần cho biết câu đang nói về ai hoặc cái gì; sau đó mới học tên “subject / chủ ngữ”.',
    steps: [
      content('discover', 'Câu đang nói về ai hoặc cái gì?', 'Nhìn “The cat sleeps.” trước. Câu này đang nói về “the cat”. Khi bạn đã thấy được phần đó, Bunny mới cho bạn tên ngữ pháp: subject — chủ ngữ.', { examples: ['The cat sleeps.'], tokenRoles: [{ text: 'The cat', role: 'câu nói về ai/cái gì?' }, { text: 'sleeps', role: 'điều gì xảy ra?' }] }),
      content('compare', 'Tiếng Anh thường cần chủ ngữ hiện rõ', 'Người Việt đôi khi bỏ chủ ngữ khi ngữ cảnh đã rõ. Tiếng Anh thường không cho phép điều đó: “Is raining.” ✗ → “It is raining.” ✓'),
      identify('Chọn subject.', ['My', 'sister', 'reads', 'books', '.'], [0, 1], 'Subject đầy đủ là “My sister”.', { multi: true }),
      choice('Subject trong “The children play outside.” là gì?', ['The children', 'play', 'outside', 'play outside'], 'The children', 'Hỏi: Ai đang chơi? → The children.'),
      produce('Viết một subject có 1–3 từ. Chưa cần viết cả câu.', 'My teacher', ['Gọi tên một người/vật/nhóm'], { minWords: 1 }),
      review([['Câu hỏi tìm subject?', 'Who or what is the sentence about?'], ['Subject luôn chỉ là 1 từ?', 'Không. Có thể là một cụm từ.'], ['“It” trong “It is raining” làm gì?', 'Làm subject.']]),
    ],
  }),
  lesson({
    id: 'f07-verb-what-happens', unit: 2, order: 7, titleEn: 'Verb: What Happens?', titleVi: 'Động từ: điều gì xảy ra?', minutes: 10,
    focus: ['grammar', 'sentence structure'], standards: ['CCSS L.K.1b', 'CCSS L.1.1e'],
    objectiveVi: 'Nhận ra động từ hành động và động từ trạng thái; hiểu câu tiếng Anh thường cần động từ.',
    steps: [
      content('discover', 'Tìm phần nói điều gì xảy ra', 'Nhìn ba câu: “Birds fly.” “I like music.” “She is tired.” Trong mỗi câu có một phần cho biết hành động hoặc trạng thái. Sau khi bạn nhận ra phần đó, Bunny mới gọi tên nó là verb — động từ.', { examples: ['Birds fly.', 'I like music.', 'She is tired.'] }),
      content('compare', 'Lỗi người Việt: thiếu be', '“She very tired.” nghe có thể gần nghĩa tiếng Việt, nhưng tiếng Anh cần động từ: “She is very tired.”'),
      identify('Chọn verb.', ['They', 'study', 'English', '.'], [1], '“study” nói điều họ làm.'),
      choice('Câu nào THIẾU verb?', ['I work here.', 'She happy.', 'They study.', 'We like rice.'], 'She happy.', 'Cần “She is happy.”'),
      produce('Viết 3 động từ bạn thường dùng.', 'work, study, eat', ['Có 3 động từ'], { minWords: 3 }),
      review([['Verb có thể nói gì?', 'Hành động hoặc trạng thái'], ['“happy” là verb không?', 'Không. Thường là adjective.'], ['“is” có phải verb?', 'Có.']]),
    ],
  }),
  lesson({
    id: 'f08-first-sv-sentences', unit: 2, order: 8, titleEn: 'Build Your First Sentences', titleVi: 'Ghép Subject + Verb', minutes: 12,
    focus: ['sentence construction', 'writing'], standards: ['CCSS L.K.1f', 'WIDA ELD-SI.K-3.Inform'],
    objectiveVi: 'Tự ghép “ai/cái gì?” + “điều gì xảy ra?” thành câu ngắn; sau đó mới nối chúng với tên Subject + Verb.',
    steps: [
      content('discover', 'Ghép hai phần lại', '“Birds fly.” “Babies cry.” Ai/cái gì đang được nói tới? Điều gì đang xảy ra? Ghép hai phần đó lại là bạn có một câu.', { examples: ['Birds fly.', 'Babies cry.', 'Babies sleep.'] }),
      content('visualize', 'Ai/cái gì? + Điều gì xảy ra?', 'Bắt đầu bằng ý nghĩa: “Birds” trả lời ai/cái gì; “fly” trả lời điều gì xảy ra. Khi đã hiểu, mình mới viết ngắn gọn là Subject + Verb, hay S + V.', { tokenRoles: [{ text: 'Birds', role: 'ai/cái gì?' }, { text: 'fly', role: 'điều gì xảy ra?' }] }),
      content('understand', 'Ý nghĩa trước, công thức sau', 'Đừng đọc S + V như công thức toán. Hãy nghĩ: “Ai/cái gì?” + “Điều gì xảy ra?”'),
      order('Ghép câu.', ['sleep', 'Babies', '.'], 'Babies sleep .', 'Babies = subject; sleep = verb.'),
      choice('Câu nào có đúng mẫu S + V?', ['The dog.', 'Runs fast.', 'Birds fly.', 'Very cold.'], 'Birds fly.', 'Birds = S, fly = V.'),
      produce('Viết 2 câu theo mẫu S + V. Mỗi câu trên một dòng.', 'Birds fly.\nChildren laugh.', ['Có 2 dòng câu', 'Mỗi câu có subject + verb'], { minLines: 2, minWords: 4 }),
      review([['S nghĩa là?', 'Subject'], ['V nghĩa là?', 'Verb'], ['Mẫu S+V giúp trả lời hai câu hỏi nào?', 'Ai/cái gì? + Điều gì xảy ra?']]),
    ],
  }),
  lesson({
    id: 'f09-nouns-name-the-world', unit: 3, order: 9, titleEn: 'Nouns Name the World', titleVi: 'Danh từ gọi tên thế giới', minutes: 10,
    focus: ['grammar', 'vocabulary'], standards: ['CCSS L.K.1b', 'CCSS L.1.1b'],
    objectiveVi: 'Nhận ra noun là từ gọi tên người, nơi, vật hoặc ý tưởng.',
    steps: [
      content('discover', 'Những từ dùng để gọi tên', 'teacher gọi tên một người; school gọi tên một nơi; apple gọi tên một vật; love gọi tên một ý tưởng. Sau khi bạn hiểu điểm chung, Bunny mới cho tên ngữ pháp: noun — danh từ.', { chips: ['người: teacher', 'nơi: school', 'vật: apple', 'ý tưởng: love'] }),
      content('understand', 'Tên của từ và vị trí trong câu là hai chuyện khác nhau', '“student” là từ dùng để gọi tên một người, nên nó thuộc nhóm noun. Trong “Students learn.”, “Students” đồng thời là phần câu đang nói tới. Chưa cần thuộc hai tên này cùng lúc — trước tiên chỉ cần phân biệt ý nghĩa.'),
      identify('Chọn tất cả nouns.', ['teacher', 'quickly', 'city', 'happy', 'book'], [0, 2, 4], 'teacher, city, book gọi tên người/nơi/vật.', { multi: true }),
      choice('Từ nào là noun chỉ ý tưởng?', ['run', 'freedom', 'blue', 'slowly'], 'freedom', '“freedom” gọi tên một khái niệm/ý tưởng.'),
      produce('Viết 4 nouns: 1 người, 1 nơi, 1 vật, 1 ý tưởng.', 'student, park, phone, hope', ['Có 4 danh từ'], { minWords: 4 }),
      review([['Noun gọi tên những gì?', 'Người, nơi, vật, ý tưởng'], ['Noun có luôn là subject không?', 'Không'], ['“school” là loại từ gì?', 'Noun']]),
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
      content('discover', 'Đừng lặp tên quá nhiều', 'Đọc hai câu: “Lan is my friend. Lan is kind.” Sau khi người nghe đã biết Lan là ai, tiếng Anh thường đổi lần nhắc thứ hai thành “She”: “Lan is my friend. She is kind.”', { examples: ['Lan is my friend.', 'She is kind.'] }),
      content('visualize', '7 từ thay tên rất thường gặp', 'I = tôi/người đang nói; you = bạn/người nghe; he/she = một người; it = một vật/sự việc; we = tôi + người khác; they = nhiều người/vật. Nhóm từ này sau đó được gọi là pronouns — đại từ.', { chips: ['I = tôi', 'you = bạn', 'he = anh ấy', 'she = cô ấy', 'it = nó', 'we = chúng tôi/chúng ta', 'they = họ/chúng'] }),
      choice('“Tom and Mai” có thể thay bằng gì?', ['he', 'she', 'it', 'they'], 'they', 'Hai người → they.'),
      choice('“my phone” có thể thay bằng gì?', ['he', 'she', 'it', 'we'], 'it', 'Một đồ vật số ít → it.'),
      produce('Viết 4 cặp noun → pronoun.', 'Lan → she\nmy parents → they\nmy car → it\nTom → he', ['Có 4 dòng'], { minLines: 4, minWords: 8 }),
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
      content('visualize', 'Statement → Negative → Question', 'She is tired. → She is not tired. → Is she tired?', { examples: ['They are ready.', 'They are not ready.', 'Are they ready?'] }),
      content('understand', 'be tự lo hết, không cần thêm gì', 'Khi câu đã có be, chỉ cần thêm not để phủ định, hoặc đưa be lên trước chủ ngữ để hỏi. Không cần thêm “do”.'),
      choice('Phủ định đúng của “He is busy.”?', ['He does not busy.', 'He is not busy.', 'He not is busy.', 'He do not be busy.'], 'He is not busy.', 'be + not.'),
      order('Sắp xếp thành câu hỏi.', ['you', 'ready', 'Are', '?'], 'Are you ready?', 'Đưa are lên trước subject “you”. Dấu ? là một phần của câu hỏi.', { punctuationRequired: true }),
      fix('Sửa lỗi.', 'Do you are tired?', ['Are you tired?'], 'Với be, không thêm do.', { flexible: false }),
      produce('Viết 1 câu với be, rồi biến nó thành câu hỏi ở dòng 2.', 'She is happy.\nIs she happy?', ['Có 2 dòng', 'Dòng 2 là câu hỏi'], { minLines: 2, minWords: 4, requirements: [{ id:'lines', type:'minLines', value:2, labelVi:'Có ít nhất 2 dòng' }, { id:'question_line', type:'lineIsQuestion', line:2, labelVi:'Dòng 2 là câu hỏi đúng dạng' }] }),
      review([['Phủ định với be?', 'be + not'], ['Câu hỏi với be?', 'Be + subject + ...?'], ['Có dùng do với “Are you…?” không?', 'Không.']]),
    ],
  }),
  lesson({
    id: 'f14-action-verbs', unit: 6, order: 14, titleEn: 'Action & State Verbs', titleVi: 'Động từ hành động và trạng thái', minutes: 11,
    focus: ['grammar', 'vocabulary'], standards: ['CCSS L.K.1b', 'CCSS L.1.1e'],
    objectiveVi: 'Phân biệt động từ hành động và một số động từ trạng thái cơ bản để hiểu verb không chỉ là “hành động”.',
    steps: [
      content('discover', 'Verbs tell action OR state', 'run, eat, write = action. like, know, need = state/mental relation. be cũng là verb.'),
      content('understand', 'Tại sao điều này quan trọng?', 'Nếu nghĩ verb chỉ là “hành động”, bạn dễ bỏ quên be, like, know và tạo câu thiếu động từ.'),
      identify('Chọn tất cả verbs.', ['eat', 'happy', 'know', 'book', 'is'], [0, 2, 4], 'eat, know, is đều là verbs.', { multi: true }),
      choice('Từ nào là state verb?', ['jump', 'know', 'write', 'walk'], 'know', 'know diễn tả trạng thái nhận thức.'),
      produce('Viết 2 action verbs và 2 state verbs.', 'run, cook; like, know', ['Có 4 verbs'], { minWords: 4 }),
      review([['Verb chỉ hành động thôi?', 'Không. Có cả trạng thái.'], ['Ví dụ state verb?', 'like/know/need/be'], ['“is” là verb?', 'Có.']]),
    ],
  }),
  lesson({
    id: 'f15-third-person-s', unit: 6, order: 15, titleEn: 'He Works / She Studies', titleVi: 'Ngôi thứ ba thêm -s/-es', minutes: 14,
    focus: ['grammar', 'pronunciation'], standards: ['CCSS L.1.1c', 'CCSS L.3.1e'],
    objectiveVi: 'Dùng -s/-es với he/she/it trong Present Simple và chú ý phát âm đuôi.',
    steps: [
      content('discover', 'So sánh: I work → He works', 'Đọc chậm hai câu: “I work every day.” và “He works every day.” Ý vẫn là thói quen, nhưng khi chủ thể là he/she/it, động từ thường có thêm -s/-es.'),
      content('compare', 'Lỗi rất phổ biến với người Việt', 'Tiếng Việt không đổi động từ theo chủ ngữ. Vì vậy “He work every day.” rất dễ xuất hiện. Tiếng Anh cần “He works every day.”'),
      content('visualize', 'I/you/we/they → base verb · he/she/it → V-s/es', 'Hãy kiểm tra subject trước khi chọn dạng verb.', { chips: ['I work', 'you work', 'we work', 'they work', 'he works', 'she works', 'it works'] }),
      fill('Điền verb đúng.', 'She ___ English every day. (study)', 'studies', 'Phụ âm + y: study → studies.'),
      choice('Câu nào đúng?', ['He watch TV.', 'He watches TV.', 'He watching TV.', 'He watchs TV.'], 'He watches TV.', 'watch → watches với he.'),
      fix('Sửa lỗi.', 'My brother work at a hospital.', ['My brother works at a hospital.'], 'My brother = he → works.'),
      produce('Viết 2 câu với he/she/it ở Present Simple.', 'She reads every night.\nMy phone works well.', ['Có 2 dòng', 'Có verb -s/-es phù hợp'], { minLines: 2, minWords: 6, requirements: [{ id:'lines', type:'minLines', value:2, labelVi:'Có ít nhất 2 dòng' }, { id:'third_s', type:'containsThirdPersonS', count:1, labelVi:'Có ít nhất một verb -s/-es với he/she/it' }] }),
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
      review([['a/an dùng với loại noun nào?', 'Danh từ đếm được số ít'], ['Chọn a/an theo chữ hay âm?', 'Theo âm'], ['hour dùng a hay an?', 'an hour']]),
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
      content('discover', 'She speaks slowly.', 'slowly mô tả cách hành động speaks xảy ra. Adverb thường trả lời How? When? How often?'),
      content('compare', 'good vs well', 'She is a good singer. (good mô tả singer) · She sings well. (well mô tả sings).'),
      identify('Chọn adverb.', ['She', 'speaks', 'slowly', '.'], [2], 'slowly mô tả cách cô ấy nói.'),
      choice('Câu nào đúng?', ['He drives careful.', 'He drives carefully.', 'He careful drives.', 'He is drives carefully.'], 'He drives carefully.', 'carefully là adverb mô tả drives.'),
      produce('Viết 2 câu có adverb: một câu “how”, một câu “how often”.', 'She speaks softly.\nI usually study at night.', ['Có 2 câu', 'Có adverb'], { minLines: 2, minWords: 6 }),
      review([['Adjective thường mô tả gì?', 'Noun'], ['Adverb thường mô tả gì?', 'Verb/adjective/adverb/cả câu'], ['good singer / sings well?', 'Cả hai đúng, nhưng vai trò khác nhau.']]),
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
      content('discover', 'Conjunctions are bridges', 'and = thêm; but = tương phản; or = lựa chọn; because = lý do; so = kết quả.', { chips: ['and +', 'but ↔', 'or ?', 'because ← reason', 'so → result'] }),
      content('compare', 'Lỗi người Việt: Because…, so…', 'Tiếng Việt thường dùng cặp “vì… nên…”. Trong tiếng Anh chuẩn cơ bản, chọn một hướng: “Because I was tired, I went home.” HOẶC “I was tired, so I went home.”'),
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
    objectiveVi: 'Kết nối noun, pronoun, verb, adjective, adverb, article/determiner, preposition, conjunction, quantifier trong một ví dụ chung.',
    steps: [
      content('discover', 'Một quả táo, nhiều “công việc”', 'Thay vì học 9 định nghĩa rời rạc, ta xoay quanh một đối tượng: apple.', { examples: ['apple', 'an apple', 'a red apple', 'eat an apple', 'eat quickly', 'six apples', 'in the box', 'it is red', 'an apple and a banana'] }),
      content('visualize', 'Một apple, chín công việc của từ', 'Apple là vật liệu học ở trung tâm; Bunny đứng bên cạnh để hướng dẫn. Mỗi nhánh cho thấy một nhóm từ thay đổi hoặc mở rộng ý nghĩa.', { conceptMap: [
        { label: 'Noun', labelVi: 'Danh từ', example: 'apple' }, { label: 'Article', labelVi: 'Mạo từ', example: 'an apple' }, { label: 'Adjective', labelVi: 'Tính từ', example: 'a red apple' }, { label: 'Quantifier', labelVi: 'Từ chỉ lượng', example: 'six apples' }, { label: 'Pronoun', labelVi: 'Đại từ', example: 'it' }, { label: 'Verb', labelVi: 'Động từ', example: 'eat an apple' }, { label: 'Adverb', labelVi: 'Trạng từ', example: 'eat quickly' }, { label: 'Preposition', labelVi: 'Giới từ', example: 'in the box' }, { label: 'Conjunction', labelVi: 'Liên từ', example: 'an apple and a banana' },
      ] }),
      identify('Chọn adjective trong cụm.', ['a', 'red', 'apple'], [1], 'red mô tả apple.'),
      identify('Chọn verb trong câu.', ['They', 'eat', 'apples', 'quickly', '.'], [1], 'eat nói hành động.'),
      choice('“quickly” đang làm công việc gì?', ['Noun', 'Adverb', 'Article', 'Pronoun'], 'Adverb', 'Nó mô tả cách “eat” xảy ra.'),
      produce('Tạo một “mini map” với noun khác. Viết ít nhất 4 biến thể.', 'book\na book\na useful book\nread a book\nread quietly', ['Có ít nhất 4 dòng'], { minLines: 4, minWords: 8 }),
      review([['Noun hỏi gì?', 'Who or what?'], ['Adjective hỏi gì?', 'What is it like?'], ['Adverb thường hỏi gì?', 'How/when/how often?'], ['Conjunction làm gì?', 'Nối từ/cụm/ý.']]),
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
    objectiveVi: 'Tìm object bằng câu hỏi “verb tác động lên ai/cái gì?” và tạo câu SVO.',
    steps: [
      content('discover', 'I read books.', 'I = subject; read = verb; books = object. Object nhận/hoàn tất ý của action verb.'),
      content('visualize', 'S → V → O', 'Hãy hình dung mũi tên từ người làm hành động đến thứ nhận hành động.', { tokenRoles: [{ text: 'She', role: 'S' }, { text: 'likes', role: 'V' }, { text: 'coffee', role: 'O' }] }),
      content('compare', 'Word order quan trọng', 'English thường dựa mạnh vào vị trí. “The dog bites the man” và “The man bites the dog” có cùng từ nhưng đổi nghĩa hoàn toàn.'),
      identify('Chọn object.', ['My', 'brother', 'plays', 'soccer', '.'], [3], 'plays what? → soccer.'),
      order('Ghép S + V + O.', ['music', 'likes', 'She', '.'], 'She likes music .', 'Subject trước, verb sau, object sau verb.'),
      produce('Viết 3 câu S + V + O về điều bạn thích/làm.', 'I like coffee.\nI study English.\nI play games.', ['Có 3 dòng', 'Mỗi câu có object'], { minLines: 3, minWords: 9 }),
      review([['O nghĩa là?', 'Object'], ['Câu hỏi tìm object?', 'Verb tác động lên ai/cái gì?'], ['I like coffee: object?', 'coffee']]),
    ],
  }),
  lesson({
    id: 'f25-svc-pattern', unit: 15, order: 25, titleEn: 'Core Pattern: S + V + C', titleVi: 'Mẫu cốt lõi S + V + C', minutes: 13,
    focus: ['sentence pattern', 'be'], standards: ['CCSS L.1.1j'],
    objectiveVi: 'Hiểu bổ ngữ mô tả/gọi tên lại chủ ngữ sau be, khác với tân ngữ (nhận hành động).',
    steps: [
      content('discover', 'She is tired.', 'She = chủ ngữ. is = be. tired = bổ ngữ — mô tả lại She, không nhận hành động gì cả.'),
      content('visualize', 'S và C nói về cùng một thứ', 'Trong “Tom is a teacher”, Tom và a teacher là cùng một người. Trong “The soup smells good”, good mô tả soup.', { tokenRoles: [{ text: 'Tom', role: 'S' }, { text: 'is', role: 'V' }, { text: 'a teacher', role: 'C' }] }),
      choice('Complement trong “The room is quiet.” là gì?', ['The room', 'is', 'quiet', 'room'], 'quiet', 'quiet mô tả subject “The room”.'),
      choice('Câu nào là S + V + C?', ['I read books.', 'Birds fly.', 'She is happy.', 'They play soccer.'], 'She is happy.', 'happy là bổ ngữ (complement) đứng sau be — nó mô tả lại “She”.'),
      produce('Viết 3 câu S + be + C: danh tính, tính chất, vị trí.', 'I am a student.\nMy room is quiet.\nMy keys are on the desk.', ['Có 3 dòng', 'Có be + complement'], { minLines: 3, minWords: 9 }),
      review([['C khác O thế nào?', 'C mô tả/gọi tên lại chủ ngữ; O nhận hành động.'], ['She is happy: C là gì?', 'happy'], ['Tom is a teacher: Tom và teacher có phải cùng một người/vật?', 'Có.']]),
    ],
  }),
  lesson({
    id: 'f26-negatives', unit: 16, order: 26, titleEn: 'Make a Sentence Negative', titleVi: 'Tạo câu phủ định', minutes: 14,
    focus: ['grammar', 'transformation'], standards: ['CCSS L.1.1j'],
    objectiveVi: 'Chọn đúng hệ phủ định: be + not hoặc do/does + not + base verb.',
    steps: [
      content('visualize', 'Hai đường phủ định', 'BE: She is tired → She is not tired. NORMAL VERB: She likes tea → She does not like tea.'),
      content('understand', 'Sau does, verb trở về nguyên mẫu', 'does mang dấu hiệu ngôi thứ ba, nên main verb không còn -s: “She doesn’t likes” ✗ → “She doesn’t like” ✓.'),
      choice('Phủ định đúng: “They are busy.”', ['They do not busy.', 'They are not busy.', 'They does not busy.', 'They not are busy.'], 'They are not busy.', 'Có be → be + not.'),
      choice('Phủ định đúng: “He works here.”', ['He not works here.', 'He does not works here.', 'He does not work here.', 'He is not work here.'], 'He does not work here.', 'Normal verb + he → does not + base verb.'),
      fix('Sửa lỗi.', 'She does not likes coffee.', ['She does not like coffee.', "She doesn't like coffee."], 'Sau does/doesn’t dùng base verb “like”.', { flexible: true }),
      produce('Viết 2 câu khẳng định rồi phủ định chúng: một câu với be, một câu với normal verb.', 'I am tired. → I am not tired.\nHe likes tea. → He does not like tea.', ['Có be-negative', 'Có do/does-negative'], { minLines: 2, minWords: 10, requirements: [{ id:'be_neg', type:'containsBeNegative', count:1, labelVi:'Có một câu phủ định với be' }, { id:'do_neg', type:'containsDoNegative', count:1, labelVi:'Có một câu phủ định với do/does' }] }),
      review([['be negative?', 'be + not'], ['normal verb negative present?', 'do/does + not + base verb'], ['does not likes đúng không?', 'Không. does not like.']]),
    ],
  }),
  lesson({
    id: 'f27-questions', unit: 17, order: 27, titleEn: 'Ask Yes/No Questions', titleVi: 'Đặt câu hỏi Yes/No', minutes: 14,
    focus: ['grammar', 'questions'], standards: ['CCSS L.K.1d', 'CCSS L.1.1j'],
    objectiveVi: 'Biến statement thành câu hỏi bằng be hoặc do/does và giữ main verb ở base form sau does.',
    steps: [
      content('visualize', 'BE moves · DO appears', 'She is ready. → Is she ready? | You like coffee. → Do you like coffee? | He likes coffee. → Does he like coffee?'),
      content('understand', 'Question = thay đổi “khung”, không chỉ thêm dấu ?', 'Word order là một phần của grammar. Với normal verb, English cần do/does đứng trước subject.'),
      order('Sắp xếp câu hỏi.', ['you', 'Do', 'English', 'study', '?'], 'Do you study English?', 'Do + subject + base verb + object + ?. ', { punctuationRequired: true }),
      order('Sắp xếp câu hỏi.', ['she', 'Is', 'ready', '?'], 'Is she ready?', 'Với be, đưa be lên trước subject và giữ dấu ?.', { punctuationRequired: true }),
      fix('Sửa lỗi.', 'Does he likes pizza?', ['Does he like pizza?'], 'Sau does dùng base verb “like”.'),
      produce('Viết 3 Yes/No questions: 1 với be, 1 với do, 1 với does.', 'Are you ready?\nDo you work here?\nDoes she study English?', ['Có 3 câu hỏi', 'Có be/do/does'], { minLines: 3, minWords: 9, requirements: [{ id:'questions', type:'containsQuestion', count:3, labelVi:'Có ít nhất 3 câu hỏi' }, { id:'frames', type:'containsAll', values:['be-question','do-question','does-question'], labelVi:'Có câu hỏi với be, do và does' }] }),
      review([['Question với be?', 'Be + subject + ...?'], ['Question với normal verb?', 'Do/Does + subject + base verb...?'], ['Does he likes?', 'Sai → Does he like?']]),
    ],
  }),
  lesson({
    id: 'f28-present-simple-meaning', unit: 18, order: 28, titleEn: 'Present Simple Means “Usually / Generally”', titleVi: 'Hiện tại đơn: thói quen và sự thật', minutes: 15,
    focus: ['tense', 'meaning'], standards: ['CCSS L.1.1e', 'CCSS L.3.1e'],
    objectiveVi: 'Chọn Present Simple dựa trên ý nghĩa: thói quen, sự thật, trạng thái ổn định; không chỉ dựa vào công thức.',
    steps: [
      content('discover', 'What kind of time?', '“I study every day.” không có nghĩa là tôi đang học ngay giây này. Nó mô tả thói quen/lặp lại.'),
      content('visualize', 'Timeline: ● · ● · ● · NOW · ●', 'Present Simple thường nhìn thời gian như pattern lặp lại hoặc điều đúng nói chung.', { chips: ['habit', 'fact', 'stable state', 'schedule'] }),
      content('understand', '4 câu hỏi trước khi chọn tense', 'Việc này là thói quen? sự thật? trạng thái ổn định? lịch trình? Nếu có, Present Simple thường phù hợp.'),
      choice('Câu nào mô tả thói quen?', ['I study every evening.', 'I am studying right now.', 'I studied yesterday.', 'I will study tomorrow.'], 'I study every evening.', 'every evening cho thấy pattern lặp lại.'),
      fill('Điền dạng đúng.', 'I ___ coffee every morning. (drink)', 'drink', 'I + base verb. Ở bài tiếp theo bạn sẽ học vì sao he/she/it đổi dạng.'),
      fix('Sửa lỗi.', 'I am study English every day.', ['I study English every day.'], 'Với routine dùng normal verb trực tiếp: I study. Không thêm be trước study.'),
      produce('Viết 4 câu Present Simple về routine/sự thật của bạn.', 'I wake up at 7.\nI drink coffee.\nI study English every day.\nI live in Washington.', ['Có 4 câu', 'Nói thói quen/sự thật'], { minLines: 4, minWords: 16 }),
      review([['Present Simple thường diễn tả?', 'Habit/fact/stable state/schedule'], ['every day là tín hiệu gì?', 'Thói quen/lặp lại'], ['Bài tiếp theo sẽ thêm cơ chế nào?', 'Cách he/she/it làm verb đổi dạng -s/-es.']]),
    ],
  }),
  lesson({
    id: 'f29-sentence-expansion', unit: 19, order: 29, titleEn: 'Grow a Sentence', titleVi: 'Mở rộng câu từng lớp', minutes: 16,
    focus: ['sentence expansion', 'writing'], standards: ['CCSS L.K.1f', 'CCSS L.1.1j', 'CCSS L.2.1f'],
    objectiveVi: 'Mở rộng câu bằng determiner, adjective, adverb, prepositional phrase và time phrase mà không phá cấu trúc lõi.',
    steps: [
      content('discover', 'Bắt đầu nhỏ rồi thêm lớp', 'Dogs run. → The dogs run. → The small dogs run. → The small dogs run quickly. → The small dogs run quickly in the park. → …every morning.'),
      content('visualize', 'CORE trước, DETAILS sau', 'Giữ S + V rõ ràng. Sau đó thêm chi tiết vào noun hoặc vào toàn hành động.', { tokenRoles: [{ text: 'The small dogs', role: 'expanded S' }, { text: 'run', role: 'V' }, { text: 'quickly', role: 'how' }, { text: 'in the park', role: 'where' }, { text: 'every morning', role: 'when' }] }),
      choice('Lõi của “The small dogs run quickly in the park.” là gì?', ['small dogs', 'dogs run', 'run quickly', 'in the park'], 'dogs run', 'Bỏ modifier, core S+V là dogs run.'),
      order('Tạo câu tự nhiên.', ['every morning', 'The small dogs', 'run', 'in the park', 'quickly', '.'], 'The small dogs run quickly in the park every morning .', 'Một trật tự tự nhiên: S + V + manner + place + time.'),
      produce('Bắt đầu với “I study.” rồi mở rộng qua ít nhất 4 dòng. Mỗi dòng thêm một chi tiết.', 'I study.\nI study English.\nI study English carefully.\nI study English carefully at home.\nI study English carefully at home every night.', ['Có ít nhất 4 dòng', 'Mỗi dòng phát triển từ câu trước'], { minLines: 4, minWords: 14 }),
      review([['Mở rộng câu nên bắt đầu từ đâu?', 'Core sentence'], ['Chi tiết có được làm mất subject/verb không?', 'Không'], ['Các câu hỏi mở rộng?', 'What kind? How? Where? When? Why?']]),
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
    id: 'f30-foundation-mastery', unit: 20, order: 30, titleEn: 'Foundation Mastery Project', titleVi: 'Dự án: 10 câu về bản thân', minutes: 22,
    focus: ['writing', 'mastery'], standards: ['CCSS L.1.1', 'CCSS W.1.2', 'WIDA ELD-SI.K-3.Inform'],
    objectiveVi: 'Chứng minh nền tảng bằng cách tự tạo 10 câu có cấu trúc đúng, thay vì chỉ nhận diện đáp án.', mastery: { minAccuracy: 0.7, requiresProduction: true },
    steps: [
      content('discover', 'Mastery = tạo được ngôn ngữ', 'Bạn không “qua Foundation” chỉ vì chọn đúng nhiều câu trắc nghiệm. Bài cuối yêu cầu bạn tự viết.'),
      content('understand', 'Yêu cầu 10 câu', 'Hãy viết: 2 câu với be, 3 câu Present Simple, ít nhất 1 câu với have/has, 1 câu phủ định, 1 câu hỏi, 1 câu có adjective, 1 câu có preposition, 1 câu nối bằng because/so. Một câu có thể đáp ứng nhiều yêu cầu.', { chips: ['be ×2', 'Present Simple ×3', 'have/has ×1', 'negative ×1', 'question ×1', 'adjective ×1', 'preposition ×1', 'because/so ×1'] }),
      choice('Câu nào có lỗi?', ['I am a student.', 'She is kind.', 'He work every day.', 'We live here.'], 'He work every day.', 'he → works.'),
      fix('Sửa lỗi.', 'Because I like English, so I study every day.', ['Because I like English, I study every day.', 'I like English, so I study every day.'], 'Chọn because hoặc so trong cấu trúc cơ bản này.', { flexible: true }),
      produce('Viết 10 câu về bản thân. Mỗi câu trên một dòng. Sau khi viết, tự đọc lại subject, verb, article, -s/-es và dấu câu.', 'I am Minh.\nI am a student.\nI live in Washington.\nI study English every day.\nI like coffee.\nI do not work on Sunday.\nDo I need more practice?\nI have a small car.\nMy phone is on the desk.\nI study English because I want to write better.', ['Có đúng 10 dòng câu hoặc nhiều hơn', 'Có ít nhất 2 câu với be', 'Có một negative', 'Có một question', 'Có because hoặc so'], { minLines: 10, minWords: 35, masteryProject: true, requirements: [
        { id:'min_lines', type:'minLines', value:10, labelVi:'Có ít nhất 10 câu/dòng' },
        { id:'min_words', type:'minWords', value:35, labelVi:'Có đủ nội dung để tạo 10 câu có ý nghĩa (ít nhất 35 từ)' },
        { id:'be_sentences', type:'containsPattern', pattern:'be', count:2, labelVi:'Có ít nhất 2 câu với am/is/are' },
        { id:'present_simple', type:'selfCheck', labelVi:'Có ít nhất 3 câu Present Simple về thói quen/sự thật' },
        { id:'have_has', type:'containsAny', values:['have','has'], count:1, labelVi:'Có ít nhất một câu với have hoặc has' },
        { id:'negative', type:'containsNegative', count:1, labelVi:'Có ít nhất một câu phủ định' },
        { id:'question', type:'containsQuestion', count:1, labelVi:'Có ít nhất một câu hỏi' },
        { id:'adjective', type:'selfCheck', labelVi:'Có ít nhất một câu dùng adjective để mô tả noun' },
        { id:'preposition', type:'containsPreposition', count:1, labelVi:'Có ít nhất một preposition cơ bản' },
        { id:'connector', type:'containsAny', values:['because','so'], count:1, labelVi:'Có because hoặc so' },
        { id:'self_review', type:'selfCheck', labelVi:'Tôi đã tự kiểm tra subject, verb, article, -s/-es và dấu câu' },
      ] }),
      review([['Foundation không chỉ kiểm tra gì?', 'Không chỉ recognition/multiple choice'], ['Bước tự sửa quan trọng?', 'Kiểm tra subject, verb, article, agreement, punctuation'], ['Bước tiếp theo sau Foundation?', 'Sentence Foundation sâu hơn rồi paragraph/writing.']]),
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
  // Use Your English
  'f30-foundation-mastery',
]

export const foundationChapters = [
  { id: 0, emoji: '🔤', titleEn: 'English Starter', titleVi: 'Khởi động tiếng Anh', optional: true, outcomeVi: 'Dành cho người cần ôn chữ, âm, từ và cách câu xuất hiện trên trang.', lessonIds: ['f01-alphabet-map','f02-sounds-and-letters','f03-what-is-a-word','f04-english-sentence-direction'] },
  { id: 1, emoji: '🐰', titleEn: 'My First English', titleVi: 'Tiếng Anh đầu tiên của tôi', outcomeVi: 'Tôi có thể hiểu một câu cơ bản, nói ai/cái gì và dùng am/is/are.', lessonIds: ['f05-complete-thought','f06-subject-who-what','f07-verb-what-happens','f08-first-sv-sentences','f11-personal-pronouns','f12-be-am-is-are','f13-be-negative-questions'] },
  { id: 2, emoji: '🍎', titleEn: 'Name & Describe Things', titleVi: 'Gọi tên và mô tả', outcomeVi: 'Tôi có thể gọi tên, nói số lượng cơ bản và mô tả đồ vật/người.', lessonIds: ['f09-nouns-name-the-world','f10-one-or-more-nouns','f16-a-an','f18-adjectives','f20-prepositions-place'] },
  { id: 3, emoji: '🚶', titleEn: 'Everyday Life', titleVi: 'Nói về cuộc sống hằng ngày', outcomeVi: 'Tôi có thể nói routine, điều mình có, câu phủ định và câu hỏi Yes/No.', lessonIds: ['f14-action-verbs','f28-present-simple-meaning','f15-third-person-s','f19-adverbs','f31-have-has','f26-negatives','f27-questions'] },
  { id: 4, emoji: '🧩', titleEn: 'Build Better Sentences', titleVi: 'Xây câu tốt hơn', outcomeVi: 'Tôi có thể nhìn các hình dạng câu, nối ý và thêm chi tiết mà không phá cấu trúc.', lessonIds: ['f23-sv-pattern','f24-svo-pattern','f25-svc-pattern','f21-conjunctions','f29-sentence-expansion'] },
  { id: 5, emoji: '🗺️', titleEn: 'See the System', titleVi: 'Nhìn thấy cả hệ thống', outcomeVi: 'Tôi có thể nối các nhóm từ thành một bản đồ và hiểu the ở mức Foundation.', lessonIds: ['f22-parts-of-speech-map','f17-the-and-zero'] },
  { id: 6, emoji: '🏆', titleEn: 'Use Your English', titleVi: 'Dùng tiếng Anh của bạn', outcomeVi: 'Tôi có thể tự viết 10 câu về bản thân và tự kiểm tra nền tảng.', lessonIds: ['f30-foundation-mastery'] },
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
    notice: ['I am ready.', 'She is ready.', 'They are ready.'], noticeVi: 'Thông tin “ready” giữ nguyên; dạng be thay đổi theo subject.',
    target: 'She is tired.', focusVi: 'Đừng bỏ “is”.', dictation: 'She is tired.', build: { tokens:['She','is','tired','.'], answer:'She is tired .' },
  },
  'f13-be-negative-questions': {
    notice: ['She is tired.', 'She is not tired.', 'Is she tired?'], noticeVi: 'Với be, phủ định chỉ thêm not; câu hỏi đưa be lên trước subject.',
    target: 'Are you ready?', build: { tokens:['Are','you','ready','?'], answer:'Are you ready ?', punctuationRequired:true },
  },
  'f09-nouns-name-the-world': {
    notice: ['teacher', 'city', 'book', 'freedom'], noticeVi: 'Các từ rất khác nhau nhưng cùng làm một việc: gọi tên người, nơi, vật hoặc ý tưởng.',
    target: 'book',
  },
  'f10-one-or-more-nouns': {
    notice: ['one cat', 'two cats', 'one box', 'two boxes'], noticeVi: 'Khi nghĩa đổi từ một sang nhiều, hình dạng noun thường đổi theo.',
    target: 'two cats', focusVi: 'Nghe âm cuối của cats.',
  },
  'f16-a-an': {
    notice: ['a book', 'an apple', 'a university', 'an hour'], noticeVi: 'a/an phụ thuộc vào âm mở đầu bạn nghe, không chỉ chữ cái đầu bạn nhìn thấy.',
    target: 'an apple', focusVi: 'Nối nhẹ an + apple như một cụm.', build: { tokens:['an','apple'], answer:'an apple' },
  },
  'f18-adjectives': {
    notice: ['a red apple', 'a small house'], noticeVi: 'Trong các cụm này, từ mô tả đứng trước noun — khác trật tự quen thuộc trong tiếng Việt.',
    target: 'a red apple', build: { tokens:['a','red','apple'], answer:'a red apple' },
  },
  'f20-prepositions-place': {
    notice: ['in the box', 'on the table', 'under the chair'], noticeVi: 'Preposition đứng trước một noun phrase và giúp người nghe hình dung quan hệ vị trí.',
    target: 'The book is on the table.', build: { tokens:['The book','is','on the table','.'], answer:'The book is on the table .' },
  },
  'f14-action-verbs': {
    notice: ['I work.', 'I like coffee.'], noticeVi: 'work là action; like là state. Cả hai đều có thể là verb nên “verb” không chỉ có nghĩa là hành động nhìn thấy được.',
    target: 'I work every day.', build: { tokens:['I','work','every day','.'], answer:'I work every day .' },
  },
  'f28-present-simple-meaning': {
    notice: ['I study every evening.', 'The sun rises in the east.'], noticeVi: 'Một câu nói pattern lặp lại; một câu nói sự thật chung. Cả hai dùng Present Simple vì cách ta nhìn thời gian.',
    target: 'I study every evening.', dictation: 'I study every evening.', build: { tokens:['I','study','every evening','.'], answer:'I study every evening .' },
  },
  'f15-third-person-s': {
    notice: ['I work every day.', 'She works every day.'], noticeVi: 'Thời gian và hành động không đổi. Chỉ subject đổi sang she và verb nhận -s.',
    target: 'She works every day.', focusVi: 'Chú ý âm cuối của “works”.', dictation: 'She works every day.', build: { tokens:['She','works','every day','.'], answer:'She works every day .' },
  },
  'f19-adverbs': {
    notice: ['I study.', 'I usually study.', 'I study carefully.'], noticeVi: 'Adverb có thể thêm tần suất hoặc cách hành động xảy ra mà không đổi lõi subject + verb.',
    target: 'I usually study at night.', build: { tokens:['I','usually','study','at night','.'], answer:'I usually study at night .' },
  },
  'f31-have-has': {
    notice: ['I have a dog.', 'She has a dog.'], noticeVi: 'Nghĩa “có” giữ nguyên; he/she/it dùng has, các subject khác dùng have.',
    target: 'She has a dog.', dictation: 'She has a dog.', build: { tokens:['She','has','a dog','.'], answer:'She has a dog .' },
  },
  'f26-negatives': {
    notice: ['She is tired. → She is not tired.', 'She likes tea. → She does not like tea.'], noticeVi: 'be tự thêm not; normal verb cần do/does + not và main verb trở về dạng gốc.',
    target: 'She does not like coffee.', build: { tokens:['She','does not','like','coffee','.'], answer:'She does not like coffee .' },
  },
  'f27-questions': {
    notice: ['She is ready. → Is she ready?', 'She studies English. → Does she study English?'], noticeVi: 'Câu hỏi thay đổi khung câu. Với normal verb, do/does xuất hiện trước subject.',
    target: 'Does she study English?', dictation: 'Does she study English?', build: { tokens:['Does','she','study','English','?'], answer:'Does she study English ?', punctuationRequired:true },
  },
  'f23-sv-pattern': {
    target: 'I like coffee.', build: { tokens:['I','like','coffee','.'], answer:'I like coffee .' },
  },
  'f24-svo-pattern': {
    notice: ['I read books.', 'She likes coffee.'], noticeVi: 'Sau action verb, object trả lời “ai/cái gì nhận hoặc hoàn tất hành động?”.',
    target: 'She likes coffee.', build: { tokens:['She','likes','coffee','.'], answer:'She likes coffee .' },
  },
  'f25-svc-pattern': {
    notice: ['She is happy.', 'Tom is a teacher.'], noticeVi: 'Phần sau be không nhận hành động. Nó mô tả hoặc gọi tên lại subject.',
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
      promptVi: 'Nghe câu mẫu. Trước tiên nghe tốc độ bình thường; dùng Chậm nếu cần.',
      focusVi: config.focusVi,
    })
    extra.push({
      type: 'speak',
      id: `${lesson.id}-speak`,
      target: config.target,
      promptVi: 'Nói cả câu thành tiếng. Mục tiêu đầu tiên là để hệ thống nghe đúng từ; chấm từng âm sẽ là lớp pronunciation nâng cao sau.',
      focusVi: config.focusVi,
    })
  }

  if (config.dictation) {
    extra.push({
      type: 'exercise', exerciseType: 'dictation', id: `${lesson.id}-dictation`,
      promptVi: 'Nghe rồi viết lại chính xác.', audioText: config.dictation, answer: config.dictation,
      validationMode: 'normalizedExact', explainVi: 'Nghe lại từng từ, chú ý spelling và dấu câu nếu có.',
    })
  }

  const alreadyHasBuild = original.some(step => step.type === 'exercise' && step.exerciseType === 'wordOrder')
  if (config.build && !alreadyHasBuild) {
    extra.push({
      type: 'exercise', exerciseType: 'wordOrder', id: `${lesson.id}-build`, promptVi: 'Xây lại câu từ các mảnh.',
      tokens: config.build.tokens, answer: config.build.answer, punctuationRequired: !!config.build.punctuationRequired,
      explainVi: 'Giữ trật tự theo ý nghĩa: ai/cái gì trước, rồi điều xảy ra và phần còn lại.',
    })
  }

  return { ...lesson, steps: [...before, ...extra, ...after] }
}

const pathIndex = new Map(FOUNDATION_PATH_IDS.map((id, index) => [id, index]))

export const foundationLessons = rawFoundationLessons
  .map(enrichWithLearningCycle)
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
