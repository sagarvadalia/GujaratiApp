import { z } from 'zod';

import { prisma } from '../db/client';
import type { Achievement, UserAchievement } from '../types/achievements';
import { publicProcedure, router } from './_app';

function transformAchievement(a: any): Achievement {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    type: a.type as Achievement['type'],
    icon: a.icon,
    points: a.points,
    requirement: a.requirement,
    rarity: a.rarity as Achievement['rarity'],
  };
}

function transformUserAchievement(ua: any): UserAchievement {
  return {
    userId: ua.userId,
    achievementId: ua.achievementId,
    unlockedAt: ua.unlockedAt,
    progress: ua.progress ?? undefined,
  };
}

export const achievementsRouter = router({
  /**
   * Get all available achievements
   */
  getAll: publicProcedure.query(async () => {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return achievements.map(transformAchievement);
  }),

  /**
   * Get user's achievements
   */
  getUserAchievements: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: input.userId },
        include: {
          achievement: true,
        },
      });
      return userAchievements.map(transformUserAchievement);
    }),

  /**
   * Unlock an achievement for a user
   */
  unlockAchievement: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        achievementId: z.string(),
        progress: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: input.userId,
            achievementId: input.achievementId,
          },
        },
      });

      if (existing) {
        if (input.progress !== undefined) {
          const updated = await prisma.userAchievement.update({
            where: {
              userId_achievementId: {
                userId: input.userId,
                achievementId: input.achievementId,
              },
            },
            data: { progress: input.progress },
            include: { achievement: true },
          });
          return {
            unlocked: false,
            alreadyUnlocked: true,
            achievement: transformAchievement(updated.achievement),
            userAchievement: transformUserAchievement(updated),
          };
        }
        return { unlocked: false, alreadyUnlocked: true };
      }

      const achievement = await prisma.achievement.findUnique({
        where: { id: input.achievementId },
      });

      if (!achievement) {
        throw new Error('Achievement not found');
      }

      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId: input.userId,
          achievementId: input.achievementId,
          progress: input.progress,
        },
        include: {
          achievement: true,
        },
      });

      return {
        unlocked: true,
        achievement: transformAchievement(userAchievement.achievement),
        userAchievement: transformUserAchievement(userAchievement),
      };
    }),

  /**
   * Check and unlock achievements based on user progress
   */
  checkAchievements: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        streak: z.number().optional(),
        vocabularyCount: z.number().optional(),
        level: z.number().optional(),
        perfectLessons: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const unlocked: Achievement[] = [];
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: input.userId },
        include: { achievement: true },
      });

      const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

      // Check streak achievements
      if (input.streak !== undefined) {
        const streakAchievements = await prisma.achievement.findMany({
          where: {
            type: 'streak',
            requirement: { lte: input.streak },
            id: { notIn: Array.from(unlockedIds) },
          },
        });

        for (const achievement of streakAchievements) {
          await prisma.userAchievement.create({
            data: {
              userId: input.userId,
              achievementId: achievement.id,
            },
          });
          unlocked.push(transformAchievement(achievement));
          unlockedIds.add(achievement.id);
        }
      }

      // Check vocabulary achievements
      if (input.vocabularyCount !== undefined) {
        const vocabAchievements = await prisma.achievement.findMany({
          where: {
            type: 'vocabulary',
            requirement: { lte: input.vocabularyCount },
            id: { notIn: Array.from(unlockedIds) },
          },
        });

        for (const achievement of vocabAchievements) {
          await prisma.userAchievement.create({
            data: {
              userId: input.userId,
              achievementId: achievement.id,
            },
          });
          unlocked.push(transformAchievement(achievement));
          unlockedIds.add(achievement.id);
        }
      }

      // Check level achievements
      if (input.level !== undefined) {
        const levelAchievements = await prisma.achievement.findMany({
          where: {
            type: 'level-up',
            requirement: { lte: input.level },
            id: { notIn: Array.from(unlockedIds) },
          },
        });

        for (const achievement of levelAchievements) {
          await prisma.userAchievement.create({
            data: {
              userId: input.userId,
              achievementId: achievement.id,
            },
          });
          unlocked.push(transformAchievement(achievement));
        }
      }

      return { unlocked };
    }),
});
