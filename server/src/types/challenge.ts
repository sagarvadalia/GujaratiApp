export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  description: string;
  type: ChallengeType;
  target: number; // Target value (e.g., 10 lessons, 50 XP)
  reward: number; // XP reward for completion
  bonusReward?: number; // Bonus XP for exceeding target
  difficulty: 'easy' | 'medium' | 'hard';
}

export type ChallengeType =
  | 'complete-lessons'
  | 'earn-xp'
  | 'maintain-streak'
  | 'learn-vocabulary'
  | 'practice-exercises'
  | 'complete-story';

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  bonusEarned: boolean;
}

