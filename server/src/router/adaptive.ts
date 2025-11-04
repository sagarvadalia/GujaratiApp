import { z } from 'zod';

import { adaptiveDifficultyService } from '../services/adaptive';
import { publicProcedure, router } from './_app';

export const adaptiveRouter = router({
  /**
   * Record an exercise attempt for adaptive difficulty tracking
   */
  recordAttempt: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
        vocabularyId: z.string().optional(),
        correct: z.boolean(),
        timeSpent: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      await adaptiveDifficultyService.recordAttempt(
        input.userId,
        input.skillId,
        input.correct,
        input.timeSpent,
        input.vocabularyId
      );
      return { success: true };
    }),

  /**
   * Get recommended difficulty for a skill/exercise
   */
  getRecommendedDifficulty: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
        baseDifficulty: z.number().min(1).max(5),
        vocabularyId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await adaptiveDifficultyService.calculateDifficulty(
        input.userId,
        input.skillId,
        input.baseDifficulty,
        input.vocabularyId
      );
    }),

  /**
   * Get weak areas that need extra practice
   */
  getWeakAreas: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await adaptiveDifficultyService.getWeakAreas(input.userId, input.skillId);
    }),

  /**
   * Get personalized learning speed
   */
  getLearningSpeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        speed: await adaptiveDifficultyService.getLearningSpeed(input.userId, input.skillId),
      };
    }),

  /**
   * Check if skill should be reviewed
   */
  shouldReviewSkill: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
        daysSinceLastReview: z.number().min(0),
      })
    )
    .query(async ({ input }) => {
      return {
        shouldReview: await adaptiveDifficultyService.shouldReviewSkill(
          input.userId,
          input.skillId,
          input.daysSinceLastReview
        ),
      };
    }),
});

