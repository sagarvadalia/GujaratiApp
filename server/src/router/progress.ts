import { z } from 'zod';

import { prisma } from '../db/client';
import type { UserProgress } from '../types/progress';
import { categories } from '../types/vocabulary';
import { publicProcedure, router } from './_app';

function transformProgress(progress: any): UserProgress {
  return {
    userId: progress.userId,
    wordsLearned: progress.wordsLearned,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    dailyGoal: progress.dailyGoal,
    dailyProgress: progress.dailyProgress,
    accuracyRate: progress.accuracyRate,
    lastActiveDate: progress.lastActiveDate,
    completedCategories: progress.completedCategories as UserProgress['completedCategories'],
    xp: progress.xp,
    level: progress.level,
    totalCrowns: 0, // Add to schema if needed
    hearts: progress.hearts,
    maxHearts: progress.maxHearts,
    lastHeartRegen: progress.lastHeartRegen,
  };
}

export const progressRouter = router({
  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const progress =
        (await prisma.userProgress.findUnique({
          where: { userId: input.userId },
        })) ??
        (await prisma.userProgress.create({
          data: {
            userId: input.userId,
          },
        }));

      return transformProgress(progress);
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
        xp: z.number().optional(),
        level: z.number().optional(),
        totalCrowns: z.number().optional(),
        hearts: z.number().optional(),
        maxHearts: z.number().optional(),
        lastHeartRegen: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...updates } = input;

      const progress = await prisma.userProgress.upsert({
        where: { userId },
        create: {
          userId,
          ...updates,
          completedCategories: updates.completedCategories ?? [],
        },
        update: updates,
      });

      return transformProgress(progress);
    }),

  addXP: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.userProgress.findUnique({
        where: { userId: input.userId },
      }) ?? await prisma.userProgress.create({
        data: { userId: input.userId },
      });

      const calculateXPForLevel = (level: number): number => {
        if (level === 1) return 0;
        return Math.floor(50 * Math.pow(level - 1, 1.5));
      };

      const newXP = existing.xp + input.amount;
      let newLevel = existing.level;
      let xpForNextLevel = calculateXPForLevel(newLevel + 1);

      while (newXP >= xpForNextLevel && newLevel < 100) {
        newLevel++;
        xpForNextLevel = calculateXPForLevel(newLevel + 1);
      }

      const updated = await prisma.userProgress.update({
        where: { userId: input.userId },
        data: {
          xp: newXP,
          level: newLevel,
        },
      });

      return {
        ...transformProgress(updated),
        leveledUp: newLevel > existing.level,
        previousLevel: existing.level,
      };
    }),

  loseHeart: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.userProgress.findUnique({
        where: { userId: input.userId },
      }) ?? await prisma.userProgress.create({
        data: { userId: input.userId },
      });

      const updated = await prisma.userProgress.update({
        where: { userId: input.userId },
        data: {
          hearts: Math.max(0, existing.hearts - 1),
        },
      });

      return transformProgress(updated);
    }),

  regenerateHearts: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.userProgress.findUnique({
        where: { userId: input.userId },
      }) ?? await prisma.userProgress.create({
        data: { userId: input.userId },
      });

      const HEART_REGEN_INTERVAL_MS = 5 * 60 * 60 * 1000;
      const now = new Date();
      const lastRegen = new Date(existing.lastHeartRegen);
      const timeSinceLastRegen = now.getTime() - lastRegen.getTime();
      const heartsToRegen = Math.floor(timeSinceLastRegen / HEART_REGEN_INTERVAL_MS);

      let newHearts = Math.min(existing.maxHearts, existing.hearts + heartsToRegen);
      let newLastRegen = lastRegen;

      if (heartsToRegen > 0) {
        newLastRegen = new Date(lastRegen.getTime() + heartsToRegen * HEART_REGEN_INTERVAL_MS);
      }

      const updated = await prisma.userProgress.update({
        where: { userId: input.userId },
        data: {
          hearts: newHearts,
          lastHeartRegen: newLastRegen,
        },
      });

      return transformProgress(updated);
    }),

  restoreAllHearts: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.userProgress.findUnique({
        where: { userId: input.userId },
      }) ?? await prisma.userProgress.create({
        data: { userId: input.userId },
      });

      const updated = await prisma.userProgress.update({
        where: { userId: input.userId },
        data: {
          hearts: existing.maxHearts,
          lastHeartRegen: new Date(),
        },
      });

      return transformProgress(updated);
    }),

  incrementDailyProgress: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.userProgress.findUnique({
        where: { userId: input.userId },
      }) ?? await prisma.userProgress.create({
        data: { userId: input.userId },
      });

      const updated = await prisma.userProgress.update({
        where: { userId: input.userId },
        data: {
          dailyProgress: existing.dailyProgress + 1,
          lastActiveDate: new Date(),
        },
      });

      return transformProgress(updated);
    }),
});
