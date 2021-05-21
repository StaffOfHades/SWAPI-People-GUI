import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByDisplayValue, getByText } from '@testing-library/dom';
import fetchMock from 'fetch-mock-jest';
import { render, waitFor } from '@testing-library/react';
import thunkMiddleware from 'redux-thunk';
import userEvent from '@testing-library/user-event';

import {
  LoadingState,
  PeopleFeatureKey,
  fetchPeoplePage,
  initialPeopleState,
  resetPeople,
  setPage,
  setSearchTerm,
} from '../people.slice';
import { PeopleSearchbar } from './PeopleSearchbar';

describe('PeopleList', () => {
  const search = 'Skywalker';
  describe('when rendering', () => {
    const mockStore = configureStore();
    test('should have input match data from store', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, search } });

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      expect(getByDisplayValue(baseElement, search)).toBeInTheDocument();
    });
    test('should have disabled submit button with empty query', () => {
      const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      expect(getByText(baseElement, 'Search').attributes).toHaveProperty('disabled');
    });
    test('should have enabled submit button with non-empty query', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, search } });

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      expect(getByText(baseElement, 'Search').attributes).not.toHaveProperty('disabled');
    });
    test('should have disabled clear button when loading', () => {
      const store = mockStore({
        [PeopleFeatureKey]: { ...initialPeopleState, loading: LoadingState.Pending },
      });

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      expect(getByText(baseElement, 'Clear').attributes).toHaveProperty('disabled');
    });
    test('should have enabled clear button when not loading', () => {
      const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      expect(getByText(baseElement, 'Clear').attributes).not.toHaveProperty('disabled');
    });
  });
  describe('when user clicks button', () => {
    const mockStore = configureStore([thunkMiddleware]);
    const pageUrl = 'http://swapi.dev/api/people/?page=1';
    afterEach(() => fetchMock.reset());
    test('should fire search action if search button', async () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, search } });
      const query = { pageUrl, search };
      fetchMock.mock(`${query.pageUrl}&search=${query.search}`, {});

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      userEvent.click(getByText(baseElement, 'Search'));

      await waitFor(() => expect(store.getActions().length).toBe(4));

      // Remove request id from comparison since we have no way of deterministically accessing it
      const pendingFetchPeoplePage = fetchPeoplePage.pending(undefined, query);
      delete pendingFetchPeoplePage.meta.requestId;
      const fulfilledFetchPeoplePage = fetchPeoplePage.fulfilled({}, undefined, query);
      delete fulfilledFetchPeoplePage.meta.requestId;

      const actions = store.getActions();
      expect(actions).toMatchObject([
        setPage(1),
        resetPeople(),
        pendingFetchPeoplePage,
        fulfilledFetchPeoplePage,
      ]);
    });
    test('should fire reset action if clear button', async () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, search } });
      const query = { pageUrl };
      fetchMock.mock(query.pageUrl, {});

      const { baseElement } = render(
        <Provider store={store}>
          <PeopleSearchbar />
        </Provider>
      );

      userEvent.click(getByText(baseElement, 'Clear'));

      await waitFor(() => expect(store.getActions().length).toBe(5));

      // Remove request id from comparison since we have no way of deterministically accessing it
      const pendingFetchPeoplePage = fetchPeoplePage.pending(undefined, query);
      delete pendingFetchPeoplePage.meta.requestId;
      const fulfilledFetchPeoplePage = fetchPeoplePage.fulfilled({}, undefined, query);
      delete fulfilledFetchPeoplePage.meta.requestId;

      const actions = store.getActions();
      expect(actions).toMatchObject([
        setSearchTerm(''),
        setPage(1),
        resetPeople(),
        pendingFetchPeoplePage,
        fulfilledFetchPeoplePage,
      ]);
    });
  });
});
