import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// import { ErrorBoundary } from 'react-error-boundary';
// import Fallback from 'shared/ui/Fallback/Fallback';

import { store } from 'app/store';
import { queryClient } from 'shared/queryClient';
interface IProviders {
  /** Content that will be wrapped by providers. */
  readonly children: React.ReactElement;
}

export function Providers({ children }: IProviders) {
  return (
    <>
      {/* <ErrorBoundary FallbackComponent={Fallback}> */}
      <QueryClientProvider client={queryClient}>
        <Provider store={store}> {children}</Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      {/* </ErrorBoundary> */}
    </>
  );
}
