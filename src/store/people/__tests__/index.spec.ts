import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock-jest';
import thunkMiddleware from 'redux-thunk';

import {
  fetchPeoplePage,
  initialState,
  peopleAdapter,
  reducer,
  selectPeople,
  selectPeoplePage,
  selectPersonById,
  setPage,
  setSearchTerm,
} from '../index';

describe('people slice', () => {
  const people = [
    {
      name: 'Luke Skywalker',
      url: 'http://swapi.dev/api/people/1/',
    },
    {
      name: 'C-3PO',
      url: 'http://swapi.dev/api/people/2/',
    },
    {
      name: 'R2-D2',
      url: 'http://swapi.dev/api/people/3/',
    },
  ];
  describe('when using reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
    test('should correctly modify state', () => {
      const page = 20;
      expect(reducer(initialState, setPage(page))).toEqual({ ...initialState, page });
      const search = 'Skywalker';
      expect(reducer(initialState, setSearchTerm(search))).toEqual({ ...initialState, search });
    });
  });
  describe('when using entity adapter', () => {
    test('should properly set & order people array', () => {
      const modifiedState = peopleAdapter.upsertMany(initialState, people);
      const entities = people.reduce((entities, person) => {
        entities[person.url] = person;
        return entities;
      }, {} as Record<string, Object>);
      const ids = people.map((person) => person.url);
      expect(modifiedState.entities).toEqual(entities);
      expect(modifiedState.ids).toEqual(ids);
    });
    test('should properly use selector to get all entities', () => {
      const state = peopleAdapter.upsertMany(initialState, people);
      const selectedPeople = selectPeople({ people: state });
      expect(selectedPeople).toEqual(people);
    });
    test('should properly use selector to get page of entities', () => {
      const perPage = 2;
      const state = peopleAdapter.upsertMany({ ...initialState, perPage }, people);
      const selectedPeoplePage = selectPeoplePage({ people: state });
      expect(selectedPeoplePage).toEqual(people.slice(0, perPage));
    });
    test('should properly use selector to get person by id', () => {
      const person = people[1];
      const state = peopleAdapter.upsertMany(initialState, people);
      const selectedPerson = selectPersonById({ people: state }, person.url);
      expect(selectedPerson).toEqual(person);
    });
  });
  describe('when using async thunk', () => {
    const mockStore = configureStore([thunkMiddleware]);
    const url = 'https://swapi.dev/api/people/?page=1';
    afterEach(() => fetchMock.reset());
    test('should properly handle fetch & set returned data', async () => {
      const data = {
        count: 82,
        next: 'http://swapi.dev/api/people/?page=2',
        previous: null,
        results: people.slice(0, 1),
      };
      fetchMock.mock(url, data);
      const store = mockStore(initialState);
      const query = { pageUrl: url };
      const {
        meta: { requestId },
      } = await store.dispatch(fetchPeoplePage(query));
      const actions = store.getActions();
      expect(actions).toEqual([
        fetchPeoplePage.pending(requestId, query),
        fetchPeoplePage.fulfilled({ ...data, current: url }, requestId, query),
      ]);
    });
    test('should properly handle fetch with search', async () => {
      const data = {
        count: 4,
        next: null,
        previous: null,
        results: people.slice(0, 1),
      };
      const query = { pageUrl: url, search: 'Skywalker' };
      fetchMock.mock(`${url}&search=${query.search}`, data);
      const store = mockStore(initialState);
      const {
        meta: { requestId },
      } = await store.dispatch(fetchPeoplePage(query));
      const actions = store.getActions();
      expect(actions).toEqual([
        fetchPeoplePage.pending(requestId, query),
        fetchPeoplePage.fulfilled({ ...data, current: url }, requestId, query),
      ]);
    });
    test('should properly handle fetch error', async () => {
      fetchMock.mock(url, 500);
      const store = mockStore(initialState);
      const query = { pageUrl: url };
      const {
        meta: { requestId },
      } = await store.dispatch(fetchPeoplePage(query));
      const actions = store.getActions();
      expect(actions).toMatchObject([
        fetchPeoplePage.pending(requestId, query),
        fetchPeoplePage.rejected({ name: 'Error', message: 'Invalid response' }, requestId, query),
      ]);
    });
  });
});
