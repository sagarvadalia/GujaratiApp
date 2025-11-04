import { z } from 'zod';

import type { UserProgress } from '../types/progress';
import { categories } from '../types/vocabulary';
import { publicProcedure, router } from './_app';

const createEmptyProgress = (userId: string): UserProgress => ({
  userId,
  wordsLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyGoal: 10,
  dailyProgress: 0,
  accuracyRate: 0,
  lastActiveDate: new Date(),
  completedCategories: [],
});

// In-memory storage for Phase 1 (will be replaced with database later)
const progressData: Map<string, UserProgress> = new Map();

export const progressRouter = router({
  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      const progress = progressData.get(input.userId);
      if (!progress) {
        // Return default progress
        return createEmptyProgress(input.userId);
      }
      return progress;
    }),

  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        wordsLearned: z.number().optional(),
        currentStreak: z.number().optional(),
        longestStreak: z.number().optional(),
        dailyGoal: z.number().optional(),
        dailyProgress: z.number().optional(),
        accuracyRate: z.number().optional(),
        lastActiveDate: z.date().optional(),
        completedCategories: z.array(z.enum(categories)).optional(),
      })
    )
    .mutation(({ input }) => {
      const { userId, ...updates } = input;
      const existing = progressData.get(userId) ?? createEmptyProgress(userId);

      const updated: UserProgress = {
        ...existing,
        ...updates,
      };

      progressData.set(userId, updated);
      return updated;
    }),

  incrementDailyProgress: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input }) => {
      const existing = progressData.get(input.userId) ?? createEmptyProgress(input.userId);

      const updated: UserProgress = {
        ...existing,
        dailyProgress: existing.dailyProgress + 1,
        lastActiveDate: new Date(),
      };

      progressData.set(input.userId, updated);
      return updated;
    }),
});

