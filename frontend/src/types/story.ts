export interface Story {
  id: string;
  title: string;
  description: string;
  content: StoryParagraph[];
  difficulty: number; // 1-5
  category: StoryCategory;
  vocabularyIds: string[];
  grammarRuleIds?: string[];
  xpReward: number;
  unlockLevel?: number;
  audioUrl?: string;
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
  vocabularyIds: string[];
}

export interface StoryProgress {
  userId: string;
  storyId: string;
  completed: boolean;
  lastReadAt: Date;
  comprehensionScore?: number;
  wordsLearned: string[];
}

export interface StoryComprehensionQuestion {
  id: string;
  storyId: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | boolean;
  points: number;
  relatedSentenceIds?: string[];
}

