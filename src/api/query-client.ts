import { QueryClient } from '@tanstack/react-query';

import { ApiFailure, type FailureCode } from './http.js';

const RETRYABLE = new Set<FailureCode>(['network', 'timeout', 'internal']);

const retry = (failureCount: number, error: Error): boolean =>
  failureCount < 2 && error instanceof ApiFailure && RETRYABLE.has(error.code);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
