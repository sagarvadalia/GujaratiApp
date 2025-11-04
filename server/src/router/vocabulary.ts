import { z } from 'zod';

import { prisma } from '../db/client';
import { TranslationService } from '../services/translation';
import { categories } from '../types/vocabulary';
import { publicProcedure, router } from './_app';

const translationService = new TranslationService();

export const vocabularyRouter = router({
  getAll: publicProcedure.query(async () => {
    const items = await prisma.vocabulary.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return items.map((v) => ({
      id: v.id,
      gujarati: v.gujarati,
      transliteration: v.transliteration,
      english: v.english,
      category: v.category,
      difficulty: v.difficulty,
      audioUrl: v.audioUrl ?? undefined,
      imageUrl: v.imageUrl ?? undefined,
      exampleSentence: v.exampleSentence ?? undefined,
    }));
  }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(categories) }))
    .query(async ({ input }) => {
      const items = await prisma.vocabulary.findMany({
        where: { category: input.category },
        orderBy: { createdAt: 'asc' },
      });
      return items.map((v) => ({
        id: v.id,
        gujarati: v.gujarati,
        transliteration: v.transliteration,
        english: v.english,
        category: v.category,
        difficulty: v.difficulty,
        audioUrl: v.audioUrl ?? undefined,
        imageUrl: v.imageUrl ?? undefined,
        exampleSentence: v.exampleSentence ?? undefined,
      }));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const item = await prisma.vocabulary.findUnique({
        where: { id: input.id },
      });
      if (!item) return null;
      return {
        id: item.id,
        gujarati: item.gujarati,
        transliteration: item.transliteration,
        english: item.english,
        category: item.category,
        difficulty: item.difficulty,
        audioUrl: item.audioUrl ?? undefined,
        imageUrl: item.imageUrl ?? undefined,
        exampleSentence: item.exampleSentence ?? undefined,
      };
    }),

  translate: publicProcedure
    .input(z.object({ text: z.string(), targetLanguage: z.string().default('gu') }))
    .mutation(async ({ input }) => {
      try {
        const translatedText = await translationService.translateText(
          input.text,
          input.targetLanguage
        );
        return { translatedText };
      } catch (error) {
        throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  transliterate: publicProcedure
    .input(z.object({ text: z.string(), sourceLanguage: z.string().default('gu') }))
    .mutation(async ({ input }) => {
      try {
        const transliteratedText = await translationService.transliterateText(
          input.text,
          input.sourceLanguage
        );
        return { transliteratedText };
      } catch (error) {
        throw new Error(`Transliteration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        gujarati: z.string(),
        transliteration: z.string(),
        english: z.string(),
        category: z.enum(categories),
        difficulty: z.number().min(1).max(5),
        audioUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        exampleSentence: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const item = await prisma.vocabulary.create({
        data: input,
      });
      return {
        id: item.id,
        gujarati: item.gujarati,
        transliteration: item.transliteration,
        english: item.english,
        category: item.category,
        difficulty: item.difficulty,
        audioUrl: item.audioUrl ?? undefined,
        imageUrl: item.imageUrl ?? undefined,
        exampleSentence: item.exampleSentence ?? undefined,
      };
    }),
});

