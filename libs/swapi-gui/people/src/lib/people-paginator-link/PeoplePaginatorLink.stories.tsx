import { Provider, connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunkMiddleware from 'redux-thunk';

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
import { PeoplePaginatorStyles } from '../people-paginator/';

function mapStateToProps(state: PartialRootState) {
  return {
    loading: state[PeopleFeatureKey].loading,
    maxPage: selectMaxPage(state),
    page: state[PeopleFeatureKey].page,
  };
}

const PeoplePaginatorLink = connect(mapStateToProps)(BasePeoplePaginatorLink);
const count = Number.MAX_VALUE;
const mockStore = configureStore([thunkMiddleware]);
const peopleSliceAction = action('People Slice');
const pageUrl = 'https://swapi.dev/api/people/?page=1';

export default {
  component: PeoplePaginatorLink,
  decorators: [
    (Story) => (
      <ul className={PeoplePaginatorStyles['people-paginator']}>
        <Story />
      </ul>
    ),
    withKnobs,
  ],
  title: 'PeoplePaginatorLink',
};

export const Previous = () => {
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const label = text('Label', 'Previous');
  const page = number('Page', initialPeopleState.page);

  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;

  const store = mockStore({
    [PeopleFeatureKey]: {
      ...initialPeopleState,
      count,
      current: pageUrl,
      loading,
      previous: pageUrl,
      page,
    },
  });

  const unsubscribe = store.subscribe(() => {
    const action = store.getActions().slice(-1)[0];
    peopleSliceAction(action);
  });

  useEffect(() => {
    return unsubscribe;
  }, [unsubscribe]);

  useEffect(() => {
    fetchMock.mock(`begin:${pageUrl}`, {
      count,
      current: pageUrl,
      next: null,
      previous: pageUrl,
      results: [],
    });
    return fetchMock.reset;
  }, []);

  return (
    <Provider store={store}>
      <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Previous}>
        {label}
      </PeoplePaginatorLink>
    </Provider>
  );
};

export const Next = () => {
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const label = text('Label', 'Next');

  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;

  const store = mockStore({
    [PeopleFeatureKey]: {
      ...initialPeopleState,
      count,
      current: pageUrl,
      loading,
      next: pageUrl,
    },
  });

  store.subscribe(() => {
    const action = store.getActions().slice(-1)[0];
    peopleSliceAction(action);
  });

  useEffect(() => {
    fetchMock.mock(`begin:${pageUrl}`, {
      count,
      current: pageUrl,
      next: pageUrl,
      previous: null,
      results: [],
    });
    return fetchMock.reset;
  }, []);

  return (
    <Provider store={store}>
      <PeoplePaginatorLink pageUrl={pageUrl} type={PeoplePaginatorLinkType.Next}>
        {label}
      </PeoplePaginatorLink>
    </Provider>
  );
};
