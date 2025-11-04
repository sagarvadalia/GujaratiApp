import { z } from 'zod';

import { prisma } from '../db/client';
import type { Leaderboard, LeaderboardEntry, LeaderboardPeriod } from '../types/leaderboard';
import { publicProcedure, router } from './_app';

// Mock user data helper (in production, this would come from user service)
const getUserData = async (userId: string): Promise<Omit<LeaderboardEntry, 'score' | 'rank'>> => {
  // Try to get from progress table
  const progress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  return {
    userId,
    username: `User${userId.slice(0, 6)}`, // In production, fetch from user service
    level: progress?.level ?? 1,
    streak: progress?.currentStreak ?? 0,
    wordsLearned: progress?.wordsLearned ?? 0,
  };
};

const calculateScore = (entry: Omit<LeaderboardEntry, 'score' | 'rank'>): number => {
  // Score calculation: level * 10 + streak * 5 + wordsLearned
  return entry.level * 10 + entry.streak * 5 + entry.wordsLearned;
};

const generateLeaderboard = async (period: LeaderboardPeriod): Promise<LeaderboardEntry[]> => {
  // Get all user progress entries
  const allProgress = await prisma.userProgress.findMany({
    orderBy: [
      { level: 'desc' },
      { currentStreak: 'desc' },
      { wordsLearned: 'desc' },
    ],
    take: period === 'daily' ? 20 : period === 'weekly' ? 50 : 100,
  });

  const entries: LeaderboardEntry[] = [];

  for (const progress of allProgress) {
    const userData = await getUserData(progress.userId);
    const score = calculateScore({
      ...userData,
      level: progress.level,
      streak: progress.currentStreak,
      wordsLearned: progress.wordsLearned,
    });
    entries.push({
      ...userData,
      level: progress.level,
      streak: progress.currentStreak,
      wordsLearned: progress.wordsLearned,
      score,
      rank: 0, // Will be set after sorting
    });
  }

  // Sort by score and assign ranks
  entries.sort((a, b) => b.score - a.score);
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

export const leaderboardRouter = router({
  /**
   * Get leaderboard for a specific period
   */
  get: publicProcedure
    .input(
      z.object({
        period: z.enum(['daily', 'weekly', 'monthly', 'all-time']),
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(50),
      })
    )
    .query(async ({ input }) => {
      const entries = await generateLeaderboard(input.period);
      const limitedEntries = entries.slice(0, input.limit);

      // Find user's entry if userId provided
      let userEntry: LeaderboardEntry | undefined;
      let userRank: number | undefined;

      if (input.userId) {
        userEntry = entries.find((e) => e.userId === input.userId);
        if (userEntry) {
          userRank = userEntry.rank;
        } else {
          // Create entry for user if not in leaderboard
          const userData = await getUserData(input.userId);
          const progress = await prisma.userProgress.findUnique({
            where: { userId: input.userId },
          });
          const score = calculateScore({
            ...userData,
            level: progress?.level ?? 1,
            streak: progress?.currentStreak ?? 0,
            wordsLearned: progress?.wordsLearned ?? 0,
          });
          userEntry = {
            ...userData,
            level: progress?.level ?? 1,
            streak: progress?.currentStreak ?? 0,
            wordsLearned: progress?.wordsLearned ?? 0,
            score,
            rank: entries.length + 1,
          };
        }
      }

      const leaderboard: Leaderboard = {
        period: input.period,
        entries: limitedEntries,
        userRank,
        userEntry,
        updatedAt: new Date(),
      };

      return leaderboard;
    }),

  /**
   * Update user's leaderboard entry (this happens automatically via progress updates)
   */
  updateUserScore: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        period: z.enum(['daily', 'weekly', 'monthly', 'all-time']),
        level: z.number().optional(),
        streak: z.number().optional(),
        wordsLearned: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Update progress (leaderboard is calculated from progress)
      if (input.level || input.streak || input.wordsLearned) {
        await prisma.userProgress.upsert({
          where: { userId: input.userId },
          create: {
            userId: input.userId,
            level: input.level ?? 1,
            currentStreak: input.streak ?? 0,
            wordsLearned: input.wordsLearned ?? 0,
          },
          update: {
            ...(input.level && { level: input.level }),
            ...(input.streak && { currentStreak: input.streak }),
            ...(input.wordsLearned && { wordsLearned: input.wordsLearned }),
          },
        });
      }

      // Generate leaderboard to get updated rank
      const entries = await generateLeaderboard(input.period);
      const userEntry = entries.find((e) => e.userId === input.userId);

      return {
        entry: userEntry ?? {
          userId: input.userId,
          username: `User${input.userId.slice(0, 6)}`,
          level: input.level ?? 1,
          streak: input.streak ?? 0,
          wordsLearned: input.wordsLearned ?? 0,
          score: 0,
          rank: entries.length + 1,
        },
        rank: userEntry?.rank ?? entries.length + 1,
      };
    }),

  /**
   * Get user's rank across all periods
   */
  getUserRanks: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const ranks: Record<LeaderboardPeriod, number | null> = {
        daily: null,
        weekly: null,
        monthly: null,
        'all-time': null,
      };

      for (const period of ['daily', 'weekly', 'monthly', 'all-time'] as LeaderboardPeriod[]) {
        const entries = await generateLeaderboard(period);
        const entry = entries.find((e) => e.userId === input.userId);
        if (entry) {
          ranks[period] = entry.rank;
        }
      }

      return ranks;
    }),
});
