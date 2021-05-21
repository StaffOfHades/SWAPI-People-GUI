import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
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
const pageUrl = 'http://swapi.dev/api/people/?page=1';
const peopleSliceAction = action('People Slice');

export default {
  component: PeoplePaginator,
  title: 'PeoplePaginator',
} as Meta;

interface PeoplePaginatorStoryProps {
  count: number;
  loadine: number;
}

const PeoplePaginatorStory: Story<PeoplePaginatorStoryProps> = ({
  children,
  count,
  loading: isLoading,
  perPage,
  ...args
}) => {
  const [page, setPage] = useState(initialPeopleState.page);

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
      <PeoplePaginator {...args} />
    </Provider>
  );
};

export const Primary = PeoplePaginatorStory.bind({});
Primary.argTypes = {
  count: {
    description: 'The number of people in total',
    control: { type: 'number', min: 1 },
    name: 'Count',
  },
  loading: {
    description: 'Whether the component is in a loading state',
    control: { type: 'boolean' },
    name: 'Loading',
  },
  perPage: {
    description: 'The number of people to show per page',
    control: { type: 'number', min: 1 },
    name: 'Per Page',
  },
};
Primary.args = {
  count: initialPeopleState.perPage,
  loading: initialPeopleState.loading === LoadingState.Pending,
  perPage: initialPeopleState.perPage,
} as PeoplePaginatorStoryProps;
