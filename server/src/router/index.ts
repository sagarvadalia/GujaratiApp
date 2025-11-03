import { router, publicProcedure } from './_app';
import { z } from 'zod';
import { vocabularyRouter } from './vocabulary';
import { progressRouter } from './progress';

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

