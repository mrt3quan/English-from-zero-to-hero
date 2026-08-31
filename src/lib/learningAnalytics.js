const CATEGORY_LABELS = {
  literacy: 'Đọc & chữ viết',
  pronunciation: 'Phát âm',
  vocabulary: 'Từ vựng',
  mechanics: 'Dấu câu & chữ hoa',
  sentence_structure: 'Cấu trúc câu',
  subject: 'Chủ ngữ',
  verb: 'Động từ',
  nouns: 'Danh từ',
  plurality: 'Số nhiều',
  pronouns: 'Đại từ',
  be: 'Động từ be',
  agreement: 'Hòa hợp chủ-vị',
  articles: 'Mạo từ',
  adjectives: 'Tính từ',
  adverbs: 'Trạng từ',
  prepositions: 'Giới từ',
  conjunctions: 'Liên từ',
  negatives: 'Câu phủ định',
  questions: 'Câu hỏi',
  tense: 'Thì động từ',
  word_order: 'Trật tự từ',
  grammar: 'Ngữ pháp',
}

export function errorCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || 'Ngữ pháp'
}

export function inferErrorCategory(lesson, step) {
  if (step?.errorCategory) return step.errorCategory
  const text = [lesson?.titleEn, lesson?.titleVi, ...(lesson?.focus || []), step?.promptVi, step?.explainVi].filter(Boolean).join(' ').toLowerCase()
  if (/third-person|third person|-s\/-es|he\/she\/it|agreement|ngôi thứ ba/.test(text)) return 'agreement'
  if (/article|mạo từ|\ba \/ an\b|\bthe\b/.test(text)) return 'articles'
  if (/preposition|giới từ/.test(text)) return 'prepositions'
  if (/adjective|tính từ/.test(text)) return 'adjectives'
  if (/adverb|trạng từ/.test(text)) return 'adverbs'
  if (/conjunction|liên từ|because|\bso\b/.test(text)) return 'conjunctions'
  if (/pronoun|đại từ/.test(text)) return 'pronouns'
  if (/plural|số nhiều/.test(text)) return 'plurality'
  if (/noun|danh từ/.test(text)) return 'nouns'
  if (/question|câu hỏi/.test(text)) return 'questions'
  if (/negative|phủ định/.test(text)) return 'negatives'
  if (/present simple|tense|thì/.test(text)) return 'tense'
  if (/\bbe\b|am \/ is \/ are|động từ be/.test(text)) return 'be'
  if (/word order|trật tự|sắp xếp/.test(text)) return 'word_order'
  if (/subject|chủ ngữ/.test(text)) return 'subject'
  if (/sentence|s \+ v|object|complement|cấu trúc câu|mẫu câu/.test(text)) return 'sentence_structure'
  if (/punctuation|capital|dấu câu|chữ hoa|mechanics/.test(text)) return 'mechanics'
  if (/sound|phon|pronunciation|âm/.test(text)) return 'pronunciation'
  if (/letter|alphabet|literacy|chữ cái/.test(text)) return 'literacy'
  if (/verb|động từ/.test(text)) return 'verb'
  return 'grammar'
}
