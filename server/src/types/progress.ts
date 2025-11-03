export interface UserProgress {
  userId: string;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  dailyProgress: number;
  accuracyRate: number;
  lastActiveDate: Date;
  completedCategories: string[];
}

