import { z } from 'zod';

import { prisma } from '../db/client';
import type { DailyChallenge, UserChallengeProgress } from '../types/challenge';
import { publicProcedure, router } from './_app';

// Generate today's challenge
const generateTodayChallenge = async (): Promise<DailyChallenge> => {
  const today = new Date().toISOString().split('T')[0];
  const challengeTypes: Array<DailyChallenge['type']> = [
    'complete-lessons',
    'earn-xp',
    'learn-vocabulary',
    'practice-exercises',
  ];

  const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

  let title = '';
  let description = '';
  let target = 0;
  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  let reward = 0;

  switch (type) {
    case 'complete-lessons':
      title = 'Complete Lessons';
      description = 'Complete lessons to earn bonus XP';
      target = 3;
      difficulty = 'medium';
      reward = 50;
      break;
    case 'earn-xp':
      title = 'XP Master';
      description = 'Earn XP through your learning activities';
      target = 100;
      difficulty = 'easy';
      reward = 25;
      break;
    case 'learn-vocabulary':
      title = 'Vocabulary Builder';
      description = 'Learn new vocabulary words';
      target = 10;
      difficulty = 'medium';
      reward = 40;
      break;
    case 'practice-exercises':
      title = 'Practice Makes Perfect';
      description = 'Complete practice exercises';
      target = 5;
      difficulty = 'easy';
      reward = 30;
      break;
  }

  const challenge = await prisma.dailyChallenge.upsert({
    where: { date: today },
    create: {
      date: today,
      title,
      description,
      type,
      target,
      reward,
      bonusReward: Math.floor(reward * 0.5),
      difficulty,
    },
    update: {},
  });

  return {
    id: challenge.id,
    date: challenge.date,
    title: challenge.title,
    description: challenge.description,
    type: challenge.type as DailyChallenge['type'],
    target: challenge.target,
    reward: challenge.reward,
    bonusReward: challenge.bonusReward ?? undefined,
    difficulty: challenge.difficulty as DailyChallenge['difficulty'],
  };
};

function transformChallenge(c: any): DailyChallenge {
  return {
    id: c.id,
    date: c.date,
    title: c.title,
    description: c.description,
    type: c.type as DailyChallenge['type'],
    target: c.target,
    reward: c.reward,
    bonusReward: c.bonusReward ?? undefined,
    difficulty: c.difficulty as DailyChallenge['difficulty'],
  };
}

function transformProgress(p: any): UserChallengeProgress {
  return {
    userId: p.userId,
    challengeId: p.challengeId,
    progress: p.progress,
    completed: p.completed,
    completedAt: p.completedAt ?? undefined,
    bonusEarned: p.bonusEarned,
  };
}

export const challengeRouter = router({
  /**
   * Get today's challenge
   */
  getToday: publicProcedure.query(async () => {
    return await generateTodayChallenge();
  }),

  /**
   * Get user's challenge progress
   */
  getProgress: publicProcedure
    .input(z.object({ userId: z.string(), challengeId: z.string() }))
    .query(async ({ input }) => {
      const progress = await prisma.userChallengeProgress.findUnique({
        where: {
          userId_challengeId: {
            userId: input.userId,
            challengeId: input.challengeId,
          },
        },
      });
      return progress ? transformProgress(progress) : null;
    }),

  /**
   * Update challenge progress
   */
  updateProgress: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        challengeId: z.string(),
        progress: z.number(),
        type: z.enum([
          'complete-lessons',
          'earn-xp',
          'maintain-streak',
          'learn-vocabulary',
          'practice-exercises',
          'complete-story',
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const challenge = await prisma.dailyChallenge.findUnique({
        where: { id: input.challengeId },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      const existing = await prisma.userChallengeProgress.findUnique({
        where: {
          userId_challengeId: {
            userId: input.userId,
            challengeId: input.challengeId,
          },
        },
      });

      const newProgress = Math.max(existing?.progress ?? 0, input.progress);
      const completed = newProgress >= challenge.target;
      const bonusEarned = newProgress >= challenge.target * 1.5;

      const userChallenge = await prisma.userChallengeProgress.upsert({
        where: {
          userId_challengeId: {
            userId: input.userId,
            challengeId: input.challengeId,
          },
        },
        create: {
          userId: input.userId,
          challengeId: input.challengeId,
          progress: newProgress,
          completed,
          completedAt: completed ? new Date() : null,
          bonusEarned,
        },
        update: {
          progress: newProgress,
          completed,
          completedAt: completed && !existing?.completedAt ? new Date() : existing?.completedAt,
          bonusEarned,
        },
      });

      return {
        progress: userChallenge.progress,
        completed: userChallenge.completed,
        bonusEarned: userChallenge.bonusEarned,
        reward: userChallenge.completed ? challenge.reward : 0,
        bonusReward: userChallenge.bonusEarned ? challenge.bonusReward ?? 0 : 0,
      };
    }),

  /**
   * Get all user's challenges
   */
  getUserChallenges: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateString = sevenDaysAgo.toISOString().split('T')[0];

      const challenges = await prisma.dailyChallenge.findMany({
        where: {
          date: { gte: dateString },
        },
        include: {
          userProgress: {
            where: { userId: input.userId },
          },
        },
        orderBy: { date: 'desc' },
      });

      return challenges.map((challenge) => {
        const progress = challenge.userProgress[0];
        return {
          challenge: transformChallenge(challenge),
          progress: progress
            ? transformProgress(progress)
            : {
                userId: input.userId,
                challengeId: challenge.id,
                progress: 0,
                completed: false,
                bonusEarned: false,
              },
        };
      });
    }),
});
