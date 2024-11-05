import {
  asyncThunkCreator,
  buildCreateSlice,
  combineSlices,
  createSelector,
  ThunkAction,
  UnknownAction,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';

import type { store, extraArgument } from '../app/store';

export const rootReducer = combineSlices();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppState = any;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<R, AppState, typeof extraArgument, UnknownAction>;
export type ExtraArgument = typeof extraArgument;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const createAppSelector = createSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
