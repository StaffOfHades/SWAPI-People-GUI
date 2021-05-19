import { PeopleFeatureKey, peopleReducer } from '@teachable/swapi-gui/people';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [PeopleFeatureKey]: peopleReducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
