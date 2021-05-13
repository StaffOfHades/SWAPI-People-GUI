import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

enum LoadingState {
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

const peopleAdapter = createEntityAdapter<Person>({
  selectId: (person) => person.url,
});

const initialState = peopleAdapter.getInitialState<
  Omit<PeopleList, 'results'> & { loading: LoadingState }
>({
  count: 0,
  loading: LoadingState.Idle,
  next: null,
  previous: null,
});

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
      peopleAdapter.setAll(state, results);
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
