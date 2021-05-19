import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunkMiddleware from 'redux-thunk';

import {
  LoadingState,
  PeopleFeatureKey,
  decreasePage,
  increasePage,
  initialPeopleState,
} from '../people.slice';
import { PeoplePaginator } from './PeoplePaginator';

const mockStore = configureStore([thunkMiddleware]);
const pageUrl = 'https://swapi.dev/api/people/?page=1';
const peopleSliceAction = action('People Slice');

export default {
  component: PeoplePaginator,
  decorators: [withKnobs],
  title: 'PeoplePaginator',
};

export const Primary = () => {
  const count = number('Count', initialPeopleState.count);
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const [page, setPage] = useState(initialPeopleState.page);
  const perPage = number('Per Page', initialPeopleState.perPage);

  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;

  const store = mockStore({
    [PeopleFeatureKey]: {
      ...initialPeopleState,
      count,
      loading,
      next: pageUrl,
      page,
      perPage,
    },
  });

  const unsubscribe = store.subscribe(() => {
    const action = store.getActions().slice(-1)[0];
    peopleSliceAction(action);
    if (decreasePage.match(action)) {
      setPage(page - 1);
    } else if (increasePage.match(action)) {
      setPage(page + 1);
    }
  });

  useEffect(() => {
    return unsubscribe;
  }, [unsubscribe]);

  useEffect(() => {
    fetchMock.mock(`begin:${pageUrl}`, {
      current: pageUrl,
      count,
      next: pageUrl,
      previous: null,
      results: [],
    });
    return fetchMock.reset;
  }, [count]);

  return (
    <Provider store={store}>
      <PeoplePaginator />
    </Provider>
  );
};
