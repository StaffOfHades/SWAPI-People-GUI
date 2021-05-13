import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { RootState } from '../../store';

/* Types */

export const APIPageSize = 10;

export enum LoadingState {
  Idle = 'idle',
  Pending = 'pending',
  Error = 'error',
}

export interface Person {
  /* eslint-disable camelcase */
  birth_year: string;
  created: string | Date;
  edited: string | Date;
  eye_color: string;
  films: Array<string>;
  gender: 'female' | 'male' | 'n/a';
  hair_color: string;
  height: string | number;
  homeworld: string;
  mass: string | number;
  name: string;
  skin_color: string;
  species: Array<string>;
  starships: Array<string>;
  vehicles: Array<string>;
  url: string;
}

export interface PeopleList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<Person>;
}

interface AdditionalState extends Omit<PeopleList, 'results'> {
  loading: LoadingState;
  page: number;
  perPage: number;
}

/* Entity Adapter */

const peopleAdapter = createEntityAdapter<Person>({
  selectId: (person) => person.url,
  sortComparer: (left, right) => left.url.localeCompare(right.url),
});

const initialState = peopleAdapter.getInitialState<AdditionalState>({
  count: 0,
  loading: LoadingState.Idle,
  next: null,
  page: 1,
  perPage: 4,
  previous: null,
});

/* Async Thunks */

export const fetchPeoplePage = createAsyncThunk<PeopleList, { pageUrl: string; search?: string }>(
  'people/fetch',
  async ({ pageUrl, search }) => {
    const parameters: Array<string> = [];
    if (search !== undefined) parameters.push(`search=${search}`);
    const paramtersQuery = parameters.length > 0 ? `?${parameters.join('&')}` : '';
    const response = await fetch(`${pageUrl}${paramtersQuery}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const peopleList = await response.json();
    if (response.ok) {
      return peopleList;
    }
    throw new Error('Invalid response');
  }
);

/* Slice */

const peopleSlice = createSlice({
  initialState,
  name: 'people',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPeoplePage.pending, (state) => {
      state.loading = LoadingState.Pending;
    });
    builder.addCase(fetchPeoplePage.fulfilled, (state, { payload }: PayloadAction<PeopleList>) => {
      const { count, next, previous, results } = payload;
      peopleAdapter.upsertMany(state, results);
      state.count = count;
      state.loading = LoadingState.Idle;
      state.next = next;
      state.previous = previous;
    });
    builder.addCase(fetchPeoplePage.rejected, (state, action) => {
      if (action.payload) {
        console.error(action.payload);
      } else {
        console.error(action.error);
      }
      state.loading = LoadingState.Error;
    });
  },
});
export default peopleSlice.reducer;

/* Selectors */

export const { selectAll: selectPeople, selectById: selectPersonById } =
  peopleAdapter.getSelectors<RootState>((state) => state.people);

export const selectMaxPage = createSelector(
  (state: RootState) => state.people.count,
  (state: RootState) => state.people.perPage,
  (count, perPage) => Math.ceil(count / perPage)
);

export const selectPeoplePage = createSelector(
  selectPeople,
  (state: RootState) => state.people.page,
  (state: RootState) => state.people.perPage,
  (people, page, perPage) => {
    // Make sure we have enough people to return
    if (page * perPage > people.length) return [];
    return people.slice(page * perPage, (page + 1) * perPage);
  }
);
