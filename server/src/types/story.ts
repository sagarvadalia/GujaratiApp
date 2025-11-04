export interface Story {
  id: string;
  title: string;
  description: string;
  content: StoryParagraph[];
  difficulty: number; // 1-5
  category: StoryCategory;
  vocabularyIds: string[]; // Vocabulary covered in this story
  grammarRuleIds?: string[]; // Grammar rules practiced
  xpReward: number;
  unlockLevel?: number; // Minimum level required to unlock
  audioUrl?: string; // Full story audio narration
}

export type StoryCategory =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'folktale'
  | 'daily-life'
  | 'culture'
  | 'history';

export interface StoryParagraph {
  id: string;
  order: number;
  sentences: StorySentence[];
}

export interface StorySentence {
  id: string;
  gujarati: string;
  transliteration: string;
  english: string;
  audioUrl?: string;
  vocabularyIds: string[]; // Vocabulary in this sentence
}

export interface StoryProgress {
  userId: string;
  storyId: string;
  completed: boolean;
  lastReadAt: Date;
  comprehensionScore?: number; // Score from comprehension questions
  wordsLearned: string[]; // Vocabulary IDs learned from this story
}

export interface StoryComprehensionQuestion {
  id: string;
  storyId: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | boolean;
  points: number;
  relatedSentenceIds?: string[]; // Sentences relevant to this question
}

