import { z } from 'zod';

import { TranslationService } from '../services/translation';
import { categories, initialVocabulary, type Vocabulary } from '../types/vocabulary';
import { publicProcedure, router } from './_app';

// In-memory storage for Phase 1 (will be replaced with database later)
let vocabularyData: Vocabulary[] = [...initialVocabulary];

const translationService = new TranslationService();

export const vocabularyRouter = router({
  getAll: publicProcedure.query(() => {
    return vocabularyData;
  }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(categories) }))
    .query(({ input }) => {
      return vocabularyData.filter((v) => v.category === input.category);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return vocabularyData.find((v) => v.id === input.id);
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
      })
    )
    .mutation(({ input }) => {
      const newVocabulary: Vocabulary = {
        id: Date.now().toString(),
        ...input,
      };
      vocabularyData.push(newVocabulary);
      return newVocabulary;
    }),
});

