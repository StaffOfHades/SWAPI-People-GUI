import { Provider, connect } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText, queryByText } from '@testing-library/dom';
import fetchMock from 'fetch-mock-jest';
import { render, waitFor } from '@testing-library/react';
import thunkMiddleware from 'redux-thunk';
import userEvent from '@testing-library/user-event';

import {
  LoadingState,
  PartialRootState,
  PeopleFeatureKey,
  decreasePage,
  fetchPeoplePage,
  increasePage,
  initialPeopleState,
  peopleAdapter,
  selectMaxPage,
} from '../people.slice';
import {
  PeoplePaginatorLink as BasePeoplePaginatorLink,
  PeoplePaginatorLinkType,
} from './PeoplePaginatorLink';

function mapStateToProps(state: PartialRootState) {
  return {
    loading: state[PeopleFeatureKey].loading,
    maxPage: selectMaxPage(state),
    page: state[PeopleFeatureKey].page,
  };
}

const PeoplePaginatorLink = connect(mapStateToProps)(BasePeoplePaginatorLink);

describe('PeoplePaginatorLink', () => {
  const pageUrl = 'https://swapi.dev/api/people/?page=1';
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
  const query = { pageUrl };

  const modifiedState = peopleAdapter.upsertMany(initialPeopleState, people);

  fetchMock.mock(query.pageUrl, {});
  describe('when rendering of any type', () => {
    const mockStore = configureStore();
    test('should be disabled and be loading if in loading state', () => {
      const store = mockStore({
        [PeopleFeatureKey]: { ...initialPeopleState, loading: LoadingState.Pending },
      });
      const text = 'Link';

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink>{text}</PeoplePaginatorLink>
        </Provider>
      );

      const button = getByText(container, '...Loading');
      expect(queryByText(container, text)).not.toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(button.attributes).toHaveProperty('disabled');
    });
  });
  describe('when rendering of type next', () => {
    const mockStore = configureStore();
    const text = 'next';
    test('should be disabled if url it not defined', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, count: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={null} type={PeoplePaginatorLinkType.Next}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be disabled on last page', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, count: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Next}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be enabled when url is present and not on last page', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, count: 10 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Next}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).not.toHaveProperty('disabled');
    });
  });
  describe('when rendering of type previous', () => {
    const mockStore = configureStore();
    const text = 'previous';
    test('should be disabled if on first page', () => {
      const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Previous}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be enabled when not on first page', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, page: 2 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Previous}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).not.toHaveProperty('disabled');
    });
  });
  describe('when activiting next button with a click', () => {
    const mockStore = configureStore([thunkMiddleware]);
    const text = 'next';
    test('should fire increment multiple action if data needs to be loaded', async () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, count: 10, perPage: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Next}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      userEvent.click(getByText(container, text));

      await waitFor(() => expect(store.getActions().length).toBe(3));

      const actions = store.getActions();

      // Remove request id from comparison since we have no way of deterministically accessing it
      const pendingFetchPeoplePage = fetchPeoplePage.pending(undefined, query);
      delete pendingFetchPeoplePage.meta.requestId;
      const fulfilledFetchPeoplePage = fetchPeoplePage.fulfilled({}, undefined, query);
      delete fulfilledFetchPeoplePage.meta.requestId;

      expect(actions).toMatchObject([
        increasePage(),
        pendingFetchPeoplePage,
        fulfilledFetchPeoplePage,
      ]);
    });
    test('should only fire increment page action if data is loaded', () => {
      const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, count: 3, perPage: 1 } });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Next}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      userEvent.click(getByText(container, text));

      const actions = store.getActions();
      expect(actions).toEqual([increasePage()]);
    });
  });
  describe('when activiting previous button with a click', () => {
    const mockStore = configureStore([thunkMiddleware]);
    const text = 'previous';

    test('should fire decrement page action', () => {
      const store = mockStore({
        [PeopleFeatureKey]: { ...modifiedState, count: 3, page: 2, perPage: 1 },
      });

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Previous}>
            {text}
          </PeoplePaginatorLink>
        </Provider>
      );

      userEvent.click(getByText(container, text));

      const actions = store.getActions();
      expect(actions).toEqual([decreasePage()]);
    });
  });
});
