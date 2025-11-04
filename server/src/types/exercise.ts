export type ExerciseType =
  | 'multiple-choice'
  | 'true-false'
  | 'translation'
  | 'match-pairs'
  | 'fill-blank'
  | 'listen-tap'
  | 'listen-write'
  | 'speak'
  | 'write'
  | 'word-order'
  | 'picture-match'
  | 'complete-translation';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  skillId: string;
  vocabularyIds: string[];
  difficulty: number; // 1-5
  instructions: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string; // Gujarati word/phrase
  correctAnswer: string; // English translation
  options: string[]; // Array of possible answers
  audioUrl?: string; // Audio for question
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  statement: string; // e.g., "નમસ્તે means Hello"
  correctAnswer: boolean;
  audioUrl?: string;
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sourceText: string; // English or Gujarati
  targetLanguage: 'gu' | 'en';
  correctAnswer: string; // Expected translation
  hints?: string[]; // Progressive hints
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'match-pairs';
  pairs: Array<{
    id: string;
    left: string; // Gujarati
    right: string; // English
  }>;
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string; // Sentence with blank: "I want to ___ water"
  blankIndex: number; // Position of blank in sentence
  correctAnswer: string; // Word to fill blank
  options?: string[]; // Optional choices
  audioUrl?: string;
}

export interface ListenTapExercise extends BaseExercise {
  type: 'listen-tap';
  audioUrl: string; // Audio to play
  correctAnswer: string; // Correct word/phrase
  options: string[]; // Words to choose from
  transcription?: string; // What the audio says
}

export interface ListenWriteExercise extends BaseExercise {
  type: 'listen-write';
  audioUrl: string;
  correctAnswer: string; // What user should type
  hints?: string[];
}

export interface SpeakExercise extends BaseExercise {
  type: 'speak';
  text: string; // Text to pronounce
  audioUrl: string; // Reference audio
  transcription?: string;
}

export interface WriteExercise extends BaseExercise {
  type: 'write';
  prompt: string; // English prompt
  correctAnswer: string; // Expected Gujarati response
  hints?: string[];
}

export interface WordOrderExercise extends BaseExercise {
  type: 'word-order';
  words: string[]; // Scrambled words
  correctOrder: number[]; // Indices in correct order
  translation?: string; // English translation for reference
}

export interface PictureMatchExercise extends BaseExercise {
  type: 'picture-match';
  imageUrl: string;
  correctAnswer: string; // Gujarati word
  options: string[]; // Possible words
}

export interface CompleteTranslationExercise extends BaseExercise {
  type: 'complete-translation';
  sourceText: string; // Full sentence in English
  correctAnswer: string; // Full sentence in Gujarati
  hints?: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | TranslationExercise
  | MatchPairsExercise
  | FillBlankExercise
  | ListenTapExercise
  | ListenWriteExercise
  | SpeakExercise
  | WriteExercise
  | WordOrderExercise
  | PictureMatchExercise
  | CompleteTranslationExercise;

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  userAnswer: string | boolean | number[];
  correctAnswer: string | boolean | number[];
  timeSpent: number; // milliseconds
  hintsUsed: number;
}

export interface ExerciseSession {
  id: string;
  skillId: string;
  exercises: Exercise[];
  currentExerciseIndex: number;
  results: ExerciseResult[];
  startedAt: Date;
  completed: boolean;
  xpEarned: number;
}

