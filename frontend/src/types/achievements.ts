export type AchievementType =
  | 'streak'
  | 'vocabulary'
  | 'perfect-lesson'
  | 'category-completion'
  | 'daily-goal'
  | 'early-bird'
  | 'night-owl'
  | 'level-up'
  | 'story-completion'
  | 'practice-master';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  icon: string;
  points: number;
  requirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress?: number;
}

