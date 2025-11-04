export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  level: number;
  streak: number;
  wordsLearned: number;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';

export interface Leaderboard {
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  userRank?: number;
  userEntry?: LeaderboardEntry;
  updatedAt: Date;
}

