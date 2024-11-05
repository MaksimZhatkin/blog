import { QueryClient, QueryKey } from '@tanstack/react-query';

export const BASE_URL = 'https://blog-platform.kata.academy/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
    },
  },
});

export const invalidateAppQuery = (key: QueryKey) => {
  queryClient.invalidateQueries({ queryKey: key });
};
