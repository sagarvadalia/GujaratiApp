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
  difficulty: number;
  instructions: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string;
  correctAnswer: string;
  options: string[];
  audioUrl?: string;
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  statement: string;
  correctAnswer: boolean;
  audioUrl?: string;
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sourceText: string;
  targetLanguage: 'gu' | 'en';
  correctAnswer: string;
  hints?: string[];
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'match-pairs';
  pairs: {
    id: string;
    left: string;
    right: string;
  }[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string;
  blankIndex: number;
  correctAnswer: string;
  options?: string[];
  audioUrl?: string;
}

export interface ListenTapExercise extends BaseExercise {
  type: 'listen-tap';
  audioUrl: string;
  correctAnswer: string;
  options: string[];
  transcription?: string;
}

export interface ListenWriteExercise extends BaseExercise {
  type: 'listen-write';
  audioUrl: string;
  correctAnswer: string;
  hints?: string[];
}

export interface SpeakExercise extends BaseExercise {
  type: 'speak';
  text: string;
  audioUrl: string;
  transcription?: string;
}

export interface WriteExercise extends BaseExercise {
  type: 'write';
  prompt: string;
  correctAnswer: string;
  hints?: string[];
}

export interface WordOrderExercise extends BaseExercise {
  type: 'word-order';
  words: string[];
  correctOrder: number[];
  translation?: string;
}

export interface PictureMatchExercise extends BaseExercise {
  type: 'picture-match';
  imageUrl: string;
  correctAnswer: string;
  options: string[];
}

export interface CompleteTranslationExercise extends BaseExercise {
  type: 'complete-translation';
  sourceText: string;
  correctAnswer: string;
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
  timeSpent: number;
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

