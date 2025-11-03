export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'translation';
  question: string; // Gujarati word or English meaning
  correctAnswer: string;
  options?: string[]; // For multiple choice
  vocabularyId: string; // Reference to vocabulary item
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: { questionId: string; answer: string; isCorrect: boolean }[];
  score: number;
  completed: boolean;
}

