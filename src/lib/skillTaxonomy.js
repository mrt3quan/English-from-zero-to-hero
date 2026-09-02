export const SKILLS = {
  alphabet: { label: 'Alphabet & print', labelVi: 'Chữ cái & chữ viết' },
  phonics: { label: 'Sounds', labelVi: 'Âm tiếng Anh' },
  listening: { label: 'Listening', labelVi: 'Nghe' },
  speaking: { label: 'Speaking', labelVi: 'Nói' },
  spelling: { label: 'Spelling & dictation', labelVi: 'Cách viết & nghe viết' },
  words: { label: 'Words', labelVi: 'Từ' },
  sentence_subject: { label: 'Sentence subject', labelVi: 'Chủ ngữ' },
  sentence_verb: { label: 'Sentence verb', labelVi: 'Động từ' },
  sentence_object: { label: 'Sentence object', labelVi: 'Tân ngữ' },
  sentence_complement: { label: 'Sentence complement', labelVi: 'Bổ ngữ' },
  be_present: { label: 'Present be', labelVi: 'am / is / are' },
  present_simple: { label: 'Present Simple', labelVi: 'Hiện tại đơn' },
  have_has: { label: 'Have / has', labelVi: 'have / has' },
  third_person_s: { label: 'Third-person -s', labelVi: 'Ngôi thứ ba -s/-es' },
  articles: { label: 'Articles', labelVi: 'Mạo từ' },
  nouns: { label: 'Nouns', labelVi: 'Danh từ' },
  plurals: { label: 'Plural nouns', labelVi: 'Danh từ số nhiều' },
  pronouns: { label: 'Pronouns', labelVi: 'Đại từ' },
  adjectives: { label: 'Adjectives', labelVi: 'Tính từ' },
  adverbs: { label: 'Adverbs', labelVi: 'Trạng từ' },
  prepositions: { label: 'Prepositions', labelVi: 'Giới từ' },
  conjunctions: { label: 'Conjunctions', labelVi: 'Liên từ' },
  negatives: { label: 'Negatives', labelVi: 'Câu phủ định' },
  yes_no_questions: { label: 'Yes/No questions', labelVi: 'Câu hỏi Có/Không' },
  sentence_expansion: { label: 'Sentence expansion', labelVi: 'Mở rộng câu' },
  sentence_complete: { label: 'Complete thought', labelVi: 'Ý trọn vẹn' },
  sentence_sva: { label: 'S + V + A', labelVi: 'Câu cần thông tin nơi chốn/thời gian' },
  sentence_svoo: { label: 'S + V + IO + DO', labelVi: 'Câu có hai tân ngữ' },
  sentence_svoc: { label: 'S + V + O + C', labelVi: 'Câu có bổ ngữ cho tân ngữ' },
  sentence_svoa: { label: 'S + V + O + A', labelVi: 'Câu có tân ngữ + nơi chốn/thời gian' },
  greetings: { label: 'Greetings', labelVi: 'Chào hỏi & giới thiệu' },
  numbers_time: { label: 'Numbers & time', labelVi: 'Số & giờ cơ bản' },
  possessives: { label: 'Possessives', labelVi: 'Cách nói sở hữu' },
  demonstratives: { label: 'Demonstratives', labelVi: 'this / that / these / those' },
  wh_questions: { label: 'WH questions', labelVi: 'Câu hỏi What / Who / Where' },
  there_is_are: { label: 'There is/are', labelVi: 'there is / there are' },
  can_cant: { label: "Can/can't", labelVi: "can / can't" },
  requests: { label: 'Requests & instructions', labelVi: 'Yêu cầu & chỉ dẫn' },
  conversation: { label: 'Short conversation', labelVi: 'Hội thoại ngắn' },
  punctuation: { label: 'Punctuation', labelVi: 'Dấu câu' },
  capitalization: { label: 'Capitalization', labelVi: 'Viết hoa' },
}

export const ERROR_TAGS = {
  missing_be: 'Thiếu be',
  unnecessary_be: 'Dùng be không cần thiết',
  third_person_s: 'Quên / sai -s ngôi thứ ba',
  does_plus_inflected_verb: 'Sau does vẫn chia động từ',
  article_missing: 'Thiếu mạo từ',
  article_wrong: 'Sai mạo từ',
  plural_missing: 'Thiếu số nhiều',
  subject_missing: 'Thiếu chủ ngữ',
  object_missing: 'Thiếu tân ngữ',
  adjective_word_order: 'Sai vị trí tính từ',
  adjective_vs_adverb: 'Nhầm tính từ / trạng từ',
  preposition: 'Sai giới từ',
  because_plus_so: 'Dùng because + so cùng lúc',
  question_word_order: 'Sai trật tự câu hỏi',
  negative_word_order: 'Sai trật tự phủ định',
  sentence_fragment: 'Câu chưa hoàn chỉnh',
  punctuation: 'Dấu câu',
  capitalization: 'Viết hoa',
}

const lessonSkillMap = {
  'f01': ['alphabet', 'capitalization'], 'f02': ['phonics'], 'f03': ['words'], 'f04': ['capitalization', 'punctuation'],
  'f05': ['sentence_complete','sentence_subject', 'sentence_verb'], 'f06': ['sentence_subject'], 'f07': ['sentence_verb'], 'f08': ['sentence_subject','sentence_verb'],
  'f09': ['nouns'], 'f10': ['nouns','plurals'], 'f11': ['pronouns'], 'f12': ['be_present'], 'f13': ['be_present','negatives','yes_no_questions'],
  'f14': ['sentence_verb'], 'f15': ['present_simple','third_person_s'], 'f16': ['articles'], 'f17': ['articles'], 'f18': ['adjectives'],
  'f19': ['adverbs'], 'f20': ['prepositions'], 'f21': ['conjunctions'], 'f22': ['nouns','pronouns','sentence_verb','adjectives','adverbs','articles','prepositions','conjunctions'],
  'f23': ['sentence_subject','sentence_verb'], 'f24': ['sentence_subject','sentence_verb','sentence_object'], 'f25': ['sentence_subject','be_present','sentence_complement'],
  'f26': ['negatives','be_present','present_simple'], 'f27': ['yes_no_questions','be_present','present_simple'], 'f28': ['present_simple','third_person_s'],
  'f29': ['sentence_expansion'], 'f31': ['have_has','present_simple','third_person_s'],
  'f32': ['greetings','be_present'], 'f33': ['numbers_time','be_present'], 'f34': ['possessives'], 'f35': ['demonstratives','be_present'],
  'f36': ['wh_questions','be_present'], 'f37': ['there_is_are','prepositions'], 'f38': ['can_cant','sentence_verb'], 'f39': ['requests','sentence_verb'],
  'f40': ['numbers_time','prepositions','present_simple'], 'f41': ['conversation','wh_questions','listening'], 'f42': ['conversation','present_simple','be_present','can_cant'], 'f30': ['be_present','present_simple','negatives','yes_no_questions','articles','adjectives','prepositions','conjunctions','punctuation','capitalization'],
}

export function inferSkillIds(lessonId, explicit = []) {
  if (explicit?.length) return explicit
  const prefix = String(lessonId).match(/^f\d+/)?.[0]
  return lessonSkillMap[prefix] || []
}

export function inferErrorTags({ lessonId, answer = '', expected = '', skillIds = [] }) {
  const text = String(answer).toLowerCase()
  const exp = String(expected).toLowerCase()
  const tags = []
  if (skillIds.includes('third_person_s')) tags.push('third_person_s')
  if (skillIds.includes('articles')) tags.push(/\b(a|an|the)\b/.test(text) ? 'article_wrong' : 'article_missing')
  if (skillIds.includes('plurals')) tags.push('plural_missing')
  if (skillIds.includes('prepositions')) tags.push('preposition')
  if (skillIds.includes('adjectives')) tags.push('adjective_word_order')
  if (skillIds.includes('adverbs')) tags.push('adjective_vs_adverb')
  if (skillIds.includes('yes_no_questions')) tags.push('question_word_order')
  if (skillIds.includes('negatives')) tags.push('negative_word_order')
  if (skillIds.includes('be_present') && !/\b(am|is|are)\b/.test(text) && /\b(am|is|are)\b/.test(exp)) tags.push('missing_be')
  if (/because[^.!?]*\bso\b/.test(text)) tags.push('because_plus_so')
  if (expected && /[.!?]$/.test(String(expected).trim()) && !/[.!?]$/.test(String(answer).trim())) tags.push('punctuation')
  if (String(answer).trim() && /^[a-z]/.test(String(answer).trim()) && /^[A-Z]/.test(String(expected).trim())) tags.push('capitalization')
  return [...new Set(tags)].slice(0, 3)
}
