import { z } from 'zod';

import { prisma } from '../db/client';
import {
  type QualityScore,
  spacedRepetitionService,
  type SRSData,
} from '../services/spacedRepetition';
import { publicProcedure, router } from './_app';

function transformSRSData(data: any): SRSData {
  return {
    vocabularyId: data.vocabularyId,
    easeFactor: data.easeFactor,
    interval: data.interval,
    repetitions: data.repetitions,
    lastReview: data.lastReview,
    nextReview: data.nextReview,
    quality: data.quality,
  };
}

export const srsRouter = router({
  /**
   * Get all SRS data for a user
   */
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const items = await prisma.sRSData.findMany({
        where: { userId: input.userId },
      });
      return items.map(transformSRSData);
    }),

  /**
   * Get SRS data for a specific vocabulary item
   */
  getByVocabularyId: publicProcedure
    .input(z.object({ userId: z.string(), vocabularyId: z.string() }))
    .query(async ({ input }) => {
      const item = await prisma.sRSData.findUnique({
        where: {
          userId_vocabularyId: {
            userId: input.userId,
            vocabularyId: input.vocabularyId,
          },
        },
      });
      return item ? transformSRSData(item) : null;
    }),

  /**
   * Get vocabulary items due for review
   */
  getDueItems: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const items = await prisma.sRSData.findMany({
        where: {
          userId: input.userId,
          nextReview: { lte: new Date() },
        },
        orderBy: { nextReview: 'asc' },
        take: input.limit,
      });
      const allSRSData = items.map(transformSRSData);
      return spacedRepetitionService.getDueItems(allSRSData, input.limit);
    }),

  /**
   * Get weak words that need extra practice
   */
  getWeakWords: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const items = await prisma.sRSData.findMany({
        where: { userId: input.userId },
      });
      const allSRSData = items.map(transformSRSData);
      return spacedRepetitionService.getWeakWords(allSRSData);
    }),

  /**
   * Record a review session result
   */
  recordReview: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        vocabularyId: z.string(),
        quality: z.number().min(0).max(5) as z.ZodType<QualityScore>,
      })
    )
    .mutation(async ({ input }) => {
      let srsData = await prisma.sRSData.findUnique({
        where: {
          userId_vocabularyId: {
            userId: input.userId,
            vocabularyId: input.vocabularyId,
          },
        },
      });

      // Initialize if doesn't exist
      if (!srsData) {
        const initialData = spacedRepetitionService.initializeSRSData(input.vocabularyId);
        srsData = await prisma.sRSData.create({
          data: {
            userId: input.userId,
            vocabularyId: input.vocabularyId,
            easeFactor: initialData.easeFactor,
            interval: initialData.interval,
            repetitions: initialData.repetitions,
            lastReview: initialData.lastReview,
            nextReview: initialData.nextReview,
            quality: initialData.quality,
          },
        });
      }

      // Calculate next review
      const updatedSRSData = spacedRepetitionService.calculateNextReview(
        transformSRSData(srsData),
        input.quality
      );

      const updated = await prisma.sRSData.update({
        where: {
          userId_vocabularyId: {
            userId: input.userId,
            vocabularyId: input.vocabularyId,
          },
        },
        data: {
          easeFactor: updatedSRSData.easeFactor,
          interval: updatedSRSData.interval,
          repetitions: updatedSRSData.repetitions,
          lastReview: updatedSRSData.lastReview,
          nextReview: updatedSRSData.nextReview,
          quality: updatedSRSData.quality,
        },
      });

      return transformSRSData(updated);
    }),

  /**
   * Initialize SRS data for a vocabulary item
   */
  initialize: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        vocabularyId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const initialData = spacedRepetitionService.initializeSRSData(input.vocabularyId);
      
      const srsData = await prisma.sRSData.upsert({
        where: {
          userId_vocabularyId: {
            userId: input.userId,
            vocabularyId: input.vocabularyId,
          },
        },
        create: {
          userId: input.userId,
          vocabularyId: input.vocabularyId,
          easeFactor: initialData.easeFactor,
          interval: initialData.interval,
          repetitions: initialData.repetitions,
          lastReview: initialData.lastReview,
          nextReview: initialData.nextReview,
          quality: initialData.quality,
        },
        update: {},
      });

      return transformSRSData(srsData);
    }),

  /**
   * Get mastery level for vocabulary items
   */
  getMasteryLevels: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        vocabularyIds: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      const items = await prisma.sRSData.findMany({
        where: {
          userId: input.userId,
          vocabularyId: input.vocabularyIds ? { in: input.vocabularyIds } : undefined,
        },
      });
      const allSRSData = items.map(transformSRSData);
      const filteredData = input.vocabularyIds
        ? allSRSData.filter((data) => input.vocabularyIds!.includes(data.vocabularyId))
        : allSRSData;

      return filteredData.map((srsData) => ({
        vocabularyId: srsData.vocabularyId,
        masteryLevel: spacedRepetitionService.calculateMasteryLevel(srsData),
        easeFactor: srsData.easeFactor,
        nextReview: srsData.nextReview,
      }));
    }),
});
