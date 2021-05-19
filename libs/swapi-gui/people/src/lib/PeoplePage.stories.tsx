import { Middleware } from 'redux';
import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { configureStore } from '@reduxjs/toolkit';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import fetchMock from 'fetch-mock';

import {
  PeopleFeatureKey,
  LoadingState,
  fetchPeoplePage,
  initialPeopleState,
  peopleReducer,
  setLoading,
  setPerPage,
} from './people.slice';
import { PeoplePage } from './PeoplePage';
import { RootState, useAppDispatch, useAppSelector } from './hooks';

const peopleSliceAction = action('People Slice');
const pageUrl = 'https://swapi.dev/api/people/?page=1';

const storyboardActionLogger: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
  peopleSliceAction(action);
  return next(action);
};

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storyboardActionLogger),
  reducer: {
    [PeopleFeatureKey]: peopleReducer,
  },
});

export default {
  component: PeoplePage,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
    withKnobs,
  ],
  title: 'PeoplePage',
};

export const primary = () => {
  const dispatch = useAppDispatch();
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const peopleNames = array('People', ['Luke Skywalker', 'C-3PO', 'R2-D2']);
  const perPage = number('Per Page', initialPeopleState.perPage);
  const search = useAppSelector((state) => state[PeopleFeatureKey].search);

  useEffect(() => {
    dispatch(setLoading(isLoading ? LoadingState.Pending : LoadingState.Idle));
  }, [isLoading]);

  useEffect(() => {
    dispatch(setPerPage(perPage));
  }, [perPage]);

  useEffect(() => {
    let people = peopleNames.map((name, index) => ({
      name,
      url: `https://swapi.dev/api/people/${index}`,
    }));
    if (search.trim().length > 0) {
      people = people.filter((person) => person.name.includes(search));
    }
    const response = {
      current: pageUrl,
      count: people.length,
      next: pageUrl,
      previous: pageUrl,
      results: people,
    };
    dispatch(fetchPeoplePage.fulfilled(response, undefined, { page: pageUrl, search }));
    fetchMock.mock(`begin:${pageUrl}`, response);
    return fetchMock.reset;
  }, [peopleNames, search]);

  return <PeoplePage />;
};
