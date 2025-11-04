import { z } from 'zod';

import { prisma } from '../db/client';
import type { GrammarRule, GrammarTip } from '../types/grammar';
import { publicProcedure, router } from './_app';

// Helper function to transform Prisma data to GrammarRule format
function transformGrammarRule(rule: any): GrammarRule {
  return {
    id: rule.id,
    title: rule.title,
    description: rule.description,
    category: rule.category as GrammarRule['category'],
    explanation: rule.explanation,
    examples: rule.examples.map((ex: any) => ({
      gujarati: ex.gujarati,
      transliteration: ex.transliteration,
      english: ex.english,
    })),
    difficulty: rule.difficulty,
    conjugationPatterns: rule.conjugationPatterns.map((pattern: any) => ({
      tense: pattern.tense,
      person: pattern.person,
      forms: pattern.forms.map((form: any) => ({
        person: form.person,
        number: form.number,
        form: form.form,
        transliteration: form.transliteration,
        example: form.example ?? undefined,
      })),
    })),
    relatedVocabularyIds: rule.relatedVocabularyIds,
  };
}

function transformGrammarTip(tip: any): GrammarTip {
  return {
    id: tip.id,
    ruleId: tip.ruleId,
    tip: tip.tip,
    context: (tip).context,
  };
}

export const grammarRouter = router({
  getAll: publicProcedure.query(async () => {
    const rules = await prisma.grammarRule.findMany({
      include: {
        examples: {
          orderBy: { order: 'asc' },
        },
        conjugationPatterns: {
          include: {
            forms: {
              orderBy: { order: 'asc' },
            },
          },
        },
        tips: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return rules.map(transformGrammarRule);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const rule = await prisma.grammarRule.findUnique({
        where: { id: input.id },
        include: {
          examples: {
            orderBy: { order: 'asc' },
          },
          conjugationPatterns: {
            include: {
              forms: {
                orderBy: { order: 'asc' },
              },
            },
          },
          tips: {
            orderBy: { order: 'asc' },
          },
        },
      });
      return rule ? transformGrammarRule(rule) : null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const rules = await prisma.grammarRule.findMany({
        where: { category: input.category },
        include: {
          examples: {
            orderBy: { order: 'asc' },
          },
          conjugationPatterns: {
            include: {
              forms: {
                orderBy: { order: 'asc' },
              },
            },
          },
          tips: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return rules.map(transformGrammarRule);
    }),

  getTips: publicProcedure
    .input(z.object({ ruleId: z.string().optional() }))
    .query(async ({ input }) => {
      const tips = await prisma.grammarTip.findMany({
        where: input.ruleId ? { ruleId: input.ruleId } : undefined,
        orderBy: { order: 'asc' },
      });
      return tips.map(transformGrammarTip);
    }),

  getTip: publicProcedure
    .input(z.object({ tipId: z.string() }))
    .query(async ({ input }) => {
      const tip = await prisma.grammarTip.findUnique({
        where: { id: input.tipId },
      });
      return tip ? transformGrammarTip(tip) : null;
    }),
});
