import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { PeopleFeatureKey, peopleReducer } from './people.slice';

const store = configureStore({
  reducer: {
    [PeopleFeatureKey]: peopleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const usePeopleDispatch = () => useDispatch<AppDispatch>();
export const usePeopleSelector: TypedUseSelectorHook<RootState> = useSelector;
