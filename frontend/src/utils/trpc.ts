import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../../server/src/router';

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // For React Native, use the environment variable or default to localhost
  // Note: On physical devices, use your computer's IP address instead of localhost
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  return 'http://localhost:3001';
};

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});
