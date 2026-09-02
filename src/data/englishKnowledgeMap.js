// Curriculum backbone for Bunny English.
// Based on the professional English Knowledge Map supplied for this project.
// Learner-facing lessons should expose meaning before technical labels.

export const KERNEL_SENTENCE_PATTERNS = [
  { id: 'sv', pattern: 'S + V', meaningVi: 'Ai/cái gì + làm gì/xảy ra gì', example: 'The baby cried.', minLevel: 'A1' },
  { id: 'svo', pattern: 'S + V + O', meaningVi: 'Ai + làm gì + với ai/cái gì', example: 'We bought a car.', minLevel: 'A1' },
  { id: 'svc', pattern: 'S + V + C', meaningVi: 'Ai/cái gì + là/thế nào', example: 'He is happy.', minLevel: 'A1' },
  { id: 'sva', pattern: 'S + V + A', meaningVi: 'Ai/cái gì + ở đâu/khi nào (phần cần thiết)', example: 'The book is on the table.', minLevel: 'A1' },
  { id: 'svoo', pattern: 'S + V + IO + DO', meaningVi: 'Ai + cho/gửi + ai + cái gì', example: 'My dad gave me a bike.', minLevel: 'A2' },
  { id: 'svoc', pattern: 'S + V + O + C', meaningVi: 'Ai + làm gì + với ai/cái gì + thành/thế nào', example: 'She made me angry.', minLevel: 'B1' },
  { id: 'svoa', pattern: 'S + V + O + A', meaningVi: 'Ai + đặt/để + cái gì + ở đâu', example: 'She put the keys in her bag.', minLevel: 'A2' },
]

export const SENTENCE_GROWTH = [
  { id: 'simple', level: 'A1', labelVi: 'Câu đơn', descriptionVi: 'Một ý chính độc lập.' },
  { id: 'compound', level: 'A2', labelVi: 'Câu ghép', descriptionVi: 'Nối hai ý độc lập.' },
  { id: 'complex', level: 'B1', labelVi: 'Câu phức', descriptionVi: 'Một ý chính + một ý phụ thuộc.' },
  { id: 'compound_complex', level: 'B2', labelVi: 'Câu phức ghép', descriptionVi: 'Kết hợp nhiều ý chính và ý phụ thuộc.' },
]

export const CEFR_KNOWLEDGE_MAP = {
  A1: {
    stageVi: 'Xây móng',
    canDoVi: 'Giao tiếp rất cơ bản về bản thân, gia đình, sở thích và đời sống hằng ngày.',
    vocabularyTarget: '500–700',
    grammar: ['present_simple', 'present_continuous', 'can_cant', 'singular_plural', 'subject_pronouns', 'possessive_adjectives', 'basic_prepositions', 'there_is_are'],
    pronunciation: ['ipa_awareness', 'final_sounds', 'word_stress'],
    output: ['simple_sentences', 'short_guided_speaking'],
  },
  A2: {
    stageVi: 'Xây móng → phản xạ',
    canDoVi: 'Kể chuyện ngắn, nói kế hoạch, so sánh và xử lý các tình huống quen thuộc.',
    vocabularyTarget: '1,000–1,200',
    grammar: ['past_simple', 'future_will', 'going_to', 'comparatives', 'superlatives', 'should_must_have_to', 'countable_uncountable', 'quantifiers'],
    pronunciation: ['final_ed', 'plural_endings', 'basic_linking'],
    output: ['connected_sentences', 'short_story'],
  },
  B1: {
    stageVi: 'Tích lũy & phản xạ',
    canDoVi: 'Giải thích trải nghiệm, quan điểm và viết đoạn văn có liên kết.',
    vocabularyTarget: '2,000–2,500',
    grammar: ['present_perfect', 'past_continuous', 'passive_basic', 'conditionals_1_2', 'defining_relative_clauses', 'linking_words'],
    pronunciation: ['shadowing', 'sentence_stress', 'rhythm'],
    output: ['organized_paragraph', 'multi_minute_speaking'],
  },
  B2: {
    stageVi: 'Phản xạ → học thuật',
    canDoVi: 'Thảo luận ý phức tạp và viết bài nhiều đoạn rõ lập luận.',
    vocabularyTarget: '3,000–4,000',
    grammar: ['full_tense_system', 'conditionals_3_mixed', 'nondefining_relative_clauses', 'reduced_relative_clauses', 'reported_speech', 'gerund_infinitive'],
    pronunciation: ['advanced_shadowing', 'connected_speech', 'intonation'],
    output: ['multi_paragraph_writing', 'extended_speaking'],
  },
  C1: {
    stageVi: 'Nâng cấp học thuật',
    canDoVi: 'Viết và nói học thuật rõ ràng, chính xác, có sắc thái.',
    vocabularyTarget: '7,000–8,000',
    grammar: ['inversion', 'cleft_sentences', 'subjunctive', 'participle_clauses'],
    pronunciation: ['register_control', 'prosody'],
    output: ['academic_essay', 'argumentation', 'presentation'],
  },
  C2: {
    stageVi: 'Tinh chỉnh phong cách',
    canDoVi: 'Điều khiển ngôn ngữ linh hoạt theo mục đích, giọng điệu và bối cảnh.',
    vocabularyTarget: '10,000+',
    grammar: ['flexible_integration', 'stylistic_control'],
    pronunciation: ['nuance', 'rhetorical_delivery'],
    output: ['advanced_writing', 'professional_discourse', 'rhetorical_control'],
  },
}

export const LEARNING_PRINCIPLES = {
  sequence: ['input', 'notice', 'understand', 'guided_output', 'independent_output', 'review'],
  vietnamesePriorities: ['final_sounds', 'avoid_word_for_word_translation', 'english_word_order', 'be_omission', 'third_person_s'],
  intermediateMethods: ['shadowing', 'collocations', 'thinking_in_english'],
  advancedMethods: ['academic_reading', 'rhetorical_writing', 'tone_and_register'],
}
