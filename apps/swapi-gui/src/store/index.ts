import { configureStore } from '@reduxjs/toolkit';

import { PeopleFeatureKey, peopleReducer } from './people/people.slice';

export const store = configureStore({
  reducer: {
    [PeopleFeatureKey]: peopleReducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
