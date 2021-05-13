import { configureStore } from '@reduxjs/toolkit';

import peopleSlice from './features/people/peopleSlice';

const store = configureStore({
  reducer: {
    people: peopleSlice,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
