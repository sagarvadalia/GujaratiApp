import React from 'react';

import { trpc, trpcClient } from '../utils/trpc';
import { queryClient } from './QueryProvider';

interface TRPCProviderProps {
  children: React.ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
