import { z } from 'zod';

import { publicProcedure, router } from './_app';
import { progressRouter } from './progress';
import { vocabularyRouter } from './vocabulary';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}!`,
      };
    }),
  
  getPosts: publicProcedure.query(() => {
    return [
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ];
  }),

  vocabulary: vocabularyRouter,
  progress: progressRouter,
});

export type AppRouter = typeof appRouter;

