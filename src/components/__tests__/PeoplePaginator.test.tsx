import { Provider, connect } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText, queryByText } from '@testing-library/dom';
import fetchMock from 'fetch-mock-jest';
import { render, waitFor } from '@testing-library/react';
import thunkMiddleware from 'redux-thunk';
import userEvent from '@testing-library/user-event';

import type { RootState } from '../../store';
import {
  LoadingState,
  decreasePage,
  fetchPeoplePage,
  increasePage,
  initialState,
  peopleAdapter,
  resetPeople,
  selectMaxPage,
  setPage,
  setSearchTerm,
} from '../../store/people';
import {
  PaginatorLink as BasePaginatorLink,
  PaginatorLinkType,
  PeoplePaginator,
} from '../PeoplePaginator';

function mapStateToProps(state: RootState) {
  return {
    loading: state.people.loading,
    maxPage: selectMaxPage(state),
    page: state.people.page,
  };
}

const PaginatorLink = connect(mapStateToProps)(BasePaginatorLink);

describe('Paginator Link', () => {
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

  const modifiedState = peopleAdapter.upsertMany(initialState, people);

  fetchMock.mock(query.pageUrl, {});
  describe('when rendering of any type', () => {
    const mockStore = configureStore();
    test('should be disabled and be loading if in loading state', () => {
      const store = mockStore({ people: { ...initialState, loading: LoadingState.Pending } });
      const text = 'Link';

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink>{text}</PaginatorLink>
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
      const store = mockStore({ people: { ...modifiedState, count: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={null} type={PaginatorLinkType.Next}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be disabled on last page', () => {
      const store = mockStore({ people: { ...modifiedState, count: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Next}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be enabled when url is present and not on last page', () => {
      const store = mockStore({ people: { ...modifiedState, count: 10 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Next}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).not.toHaveProperty('disabled');
    });
  });
  describe('when rendering of type previous', () => {
    const mockStore = configureStore();
    const text = 'previous';
    test('should be disabled if on first page', () => {
      const store = mockStore({ people: initialState });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Previous}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).toHaveProperty('disabled');
    });
    test('should be enabled when not on first page', () => {
      const store = mockStore({ people: { ...initialState, page: 2 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Previous}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      expect(getByText(container, text).attributes).not.toHaveProperty('disabled');
    });
  });
  describe('when activiting next button with a click', () => {
    const mockStore = configureStore([thunkMiddleware]);
    const text = 'next';
    test('should fire increment multiple action if data needs to be loaded', async () => {
      const store = mockStore({ people: { ...modifiedState, count: 10, perPage: 3 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Next}>
            {text}
          </PaginatorLink>
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
      const store = mockStore({ people: { ...modifiedState, count: 3, perPage: 1 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Next}>
            {text}
          </PaginatorLink>
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
      const store = mockStore({ people: { ...modifiedState, count: 3, page: 2, perPage: 1 } });

      const { container } = render(
        <Provider store={store}>
          <PaginatorLink pageUrl={pageUrl} type={PaginatorLinkType.Previous}>
            {text}
          </PaginatorLink>
        </Provider>
      );

      userEvent.click(getByText(container, text));

      const actions = store.getActions();
      expect(actions).toEqual([decreasePage()]);
    });
  });
});

describe('People Paginator', () => {
  describe('when rendering', () => {
    const mockStore = configureStore();
    test('should have text content of page indicate match data from store', () => {
      const page = 2;
      const store = mockStore({ people: { ...initialState, page, count: 20 } });
      const maxPage = selectMaxPage(store.getState());

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginator />
        </Provider>
      );
      const button = getByText(container, 'Anterior');
      expect(button).toBeInTheDocument();
      const list = button.closest('ul');
      expect(list).toBeInTheDocument();
      expect(list.childElementCount).toEqual(3);
      const pageListElement = list.firstChild;
      expect(pageListElement.textContent).toEqual(`Page ${page} of ${maxPage}`);
    });
  });
});
