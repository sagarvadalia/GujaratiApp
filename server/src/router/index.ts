import { z } from 'zod';

import { publicProcedure, router } from './_app';
import { achievementsRouter } from './achievements';
import { adaptiveRouter } from './adaptive';
import { challengeRouter } from './challenge';
import { grammarRouter } from './grammar';
import { leaderboardRouter } from './leaderboard';
import { pathRouter } from './path';
import { progressRouter } from './progress';
import { srsRouter } from './srs';
import { storyRouter } from './story';
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
  path: pathRouter,
  grammar: grammarRouter,
  srs: srsRouter,
  adaptive: adaptiveRouter,
  story: storyRouter,
  achievements: achievementsRouter,
  leaderboard: leaderboardRouter,
  challenge: challengeRouter,
});

export type AppRouter = typeof appRouter;

