import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from 'shared/redux';

import { AppRouter } from './routers';

export const extraArgument = {
  appRouter: AppRouter,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
