import type { Category } from './vocabulary';

export interface UserProgress {
  userId: string;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  dailyProgress: number;
  accuracyRate: number;
  lastActiveDate: Date;
  completedCategories: Category[];
  xp: number;
  level: number;
  totalCrowns: number;
  hearts: number;
  maxHearts: number;
  lastHeartRegen: Date;
}

