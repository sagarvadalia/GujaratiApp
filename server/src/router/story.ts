import { z } from 'zod';

import { prisma } from '../db/client';
import type {
  Story,
  StoryComprehensionQuestion,
  StoryProgress,
} from '../types/story';
import { publicProcedure, router } from './_app';

function transformStory(story: any): Story {
  return {
    id: story.id,
    title: story.title,
    description: story.description,
    difficulty: story.difficulty,
    category: story.category as Story['category'],
    vocabularyIds: story.vocabularyIds,
    grammarRuleIds: story.grammarRuleIds ?? [],
    xpReward: story.xpReward,
    unlockLevel: story.unlockLevel ?? undefined,
    audioUrl: story.audioUrl ?? undefined,
    content: story.paragraphs
      .sort((a: any, b: any) => a.order - b.order)
      .map((para: any) => ({
        id: para.id,
        order: para.order,
        sentences: para.sentences
          .sort((a: any, b: any) => a.order - b.order)
          .map((sent: any) => ({
            id: sent.id,
            gujarati: sent.gujarati,
            transliteration: sent.transliteration,
            english: sent.english,
            audioUrl: sent.audioUrl ?? undefined,
            vocabularyIds: sent.vocabularyIds,
          })),
      })),
  };
}

function transformStoryProgress(progress: any): StoryProgress {
  return {
    userId: progress.userId,
    storyId: progress.storyId,
    completed: progress.completed,
    lastReadAt: progress.lastReadAt,
    comprehensionScore: progress.comprehensionScore ?? undefined,
    wordsLearned: progress.wordsLearned,
  };
}

function transformQuestion(q: any): StoryComprehensionQuestion {
  return {
    id: q.id,
    storyId: q.storyId,
    question: q.question,
    type: q.type as StoryComprehensionQuestion['type'],
    options: q.options.length > 0 ? q.options : undefined,
    correctAnswer: q.correctAnswer,
    points: q.points,
    relatedSentenceIds: q.relatedSentenceIds.length > 0 ? q.relatedSentenceIds : undefined,
  };
}

export const storyRouter = router({
  /**
   * Get all stories
   */
  getAll: publicProcedure.query(async () => {
    const stories = await prisma.story.findMany({
      include: {
        paragraphs: {
          include: {
            sentences: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return stories.map(transformStory);
  }),

  /**
   * Get story by ID
   */
  getById: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ input }) => {
      const story = await prisma.story.findUnique({
        where: { id: input.storyId },
        include: {
          paragraphs: {
            include: {
              sentences: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      });
      return story ? transformStory(story) : null;
    }),

  /**
   * Get stories by difficulty level
   */
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.number().min(1).max(5) }))
    .query(async ({ input }) => {
      const stories = await prisma.story.findMany({
        where: { difficulty: input.difficulty },
        include: {
          paragraphs: {
            include: {
              sentences: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return stories.map(transformStory);
    }),

  /**
   * Get stories by category
   */
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const stories = await prisma.story.findMany({
        where: { category: input.category },
        include: {
          paragraphs: {
            include: {
              sentences: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return stories.map(transformStory);
    }),

  /**
   * Get comprehension questions for a story
   */
  getComprehensionQuestions: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ input }) => {
      const questions = await prisma.storyComprehensionQuestion.findMany({
        where: { storyId: input.storyId },
        orderBy: { order: 'asc' },
      });
      return questions.map(transformQuestion);
    }),

  /**
   * Record story progress
   */
  recordProgress: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        storyId: z.string(),
        completed: z.boolean(),
        comprehensionScore: z.number().optional(),
        wordsLearned: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.storyProgress.findUnique({
        where: {
          userId_storyId: {
            userId: input.userId,
            storyId: input.storyId,
          },
        },
      });

      const progress = await prisma.storyProgress.upsert({
        where: {
          userId_storyId: {
            userId: input.userId,
            storyId: input.storyId,
          },
        },
        create: {
          userId: input.userId,
          storyId: input.storyId,
          completed: input.completed,
          comprehensionScore: input.comprehensionScore,
          wordsLearned: input.wordsLearned ?? [],
        },
        update: {
          completed: input.completed,
          comprehensionScore: input.comprehensionScore,
          wordsLearned: input.wordsLearned ?? existing?.wordsLearned ?? [],
          lastReadAt: new Date(),
        },
      });

      return transformStoryProgress(progress);
    }),

  /**
   * Get user's story progress
   */
  getProgress: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        storyId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.storyId) {
        const progress = await prisma.storyProgress.findUnique({
          where: {
            userId_storyId: {
              userId: input.userId,
              storyId: input.storyId,
            },
          },
        });
        return progress ? transformStoryProgress(progress) : null;
      }

      const progressList = await prisma.storyProgress.findMany({
        where: { userId: input.userId },
      });
      return progressList.map(transformStoryProgress);
    }),
});
