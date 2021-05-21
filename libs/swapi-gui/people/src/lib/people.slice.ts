import {
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

/* Types */

export const APIPageSize = 10;
export const PeopleFeatureKey = 'people';

export enum LoadingState {
  Idle = 'idle',
  Pending = 'pending',
  Error = 'error',
}

export interface FetchPeopleOptions {
  pageUrl: string;
  search?: string;
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
  current: string;
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<Person>;
}

export interface InitialState extends Omit<PeopleList, 'results'> {
  loading: LoadingState;
  page: number;
  perPage: number;
  search: string;
}

export interface PeopleState extends EntityState<Person>, InitialState {}

export interface PartialRootState {
  [PeopleFeatureKey]: PeopleState;
}

/* Entity Adapter */

export const peopleAdapter = createEntityAdapter<Person>({
  selectId: (person) => person.url,
  sortComparer: (left, right) =>
    left.url.length === right.url.length
      ? left.url.localeCompare(right.url)
      : left.url.length - right.url.length,
});

export const initialPeopleState: PeopleState = peopleAdapter.getInitialState<InitialState>({
  current: '',
  count: 0,
  loading: LoadingState.Idle,
  next: null,
  page: 1,
  perPage: 4,
  previous: null,
  search: '',
});

/* Async Thunks */

export const fetchPeoplePage = createAsyncThunk<PeopleList, FetchPeopleOptions>(
  `${PeopleFeatureKey}/fetch`,
  async ({ pageUrl, search }) => {
    const parameters: Array<string> = [];
    if (search !== undefined && search.trim().length > 0) parameters.push(`search=${search}`);
    const paramtersQuery = parameters.length > 0 ? `&${parameters.join('&')}` : '';
    const response = await fetch(`${pageUrl}${paramtersQuery}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const peopleList: PeopleList = await response.json();
      return {
        ...peopleList,
        current: pageUrl,
      };
    }
    throw new Error('Invalid response');
  }
);

/* Slice */

const peopleSlice = createSlice({
  initialState: initialPeopleState,
  name: PeopleFeatureKey,
  reducers: {
    decreasePage(state) {
      state.page -= 1;
    },
    increasePage(state) {
      state.page += 1;
    },
    resetPeople: peopleAdapter.removeAll,
    setLoading(state, { payload }: PayloadAction<LoadingState>) {
      state.loading = payload;
    },
    setPage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
    setPerPage(state, { payload }: PayloadAction<number>) {
      state.perPage = payload;
    },
    setSearchTerm(state, { payload }: PayloadAction<string>) {
      state.search = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPeoplePage.pending, (state) => {
      state.loading = LoadingState.Pending;
    });
    builder.addCase(fetchPeoplePage.fulfilled, (state, { payload }: PayloadAction<PeopleList>) => {
      peopleAdapter.upsertMany(state, payload.results);
      state.count = payload.count;
      state.current = payload.current;
      state.loading = LoadingState.Idle;
      state.next = payload.next;
      state.previous = payload.previous;
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
export default peopleSlice;
export const { actions: peopleActions, reducer: peopleReducer } = peopleSlice;
export const {
  decreasePage,
  increasePage,
  resetPeople,
  setLoading,
  setPage,
  setPerPage,
  setSearchTerm,
} = peopleActions;

/* Selectors */

export const {
  selectAll: selectPeople,
  selectById: selectPersonById,
  selectTotal: selectPeopleTotal,
} = peopleAdapter.getSelectors<PartialRootState>((state) => state[PeopleFeatureKey]);

export const selectMaxPage = createSelector(
  (state: PartialRootState) => state[PeopleFeatureKey].count,
  (state: PartialRootState) => state[PeopleFeatureKey].perPage,
  (count, perPage) => Math.ceil(count / perPage)
);

export const selectPeoplePage = createSelector(
  selectPeople,
  (state: PartialRootState) => state[PeopleFeatureKey].page,
  (state: PartialRootState) => state[PeopleFeatureKey].perPage,
  (people, page, perPage) => {
    // Make sure we have enough people to return
    if ((page - 1) * perPage > people.length) return [];
    return people.slice((page - 1) * perPage, page * perPage);
  }
);
