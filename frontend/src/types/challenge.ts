export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  type: ChallengeType;
  target: number;
  reward: number;
  bonusReward?: number;
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

