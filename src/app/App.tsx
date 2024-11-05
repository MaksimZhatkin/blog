import React from 'react';

import { Providers } from './providers/Providers';
import { AppRouter } from './routers';

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
