import { MemoryRouter as Router } from 'react-router-dom';
import { Meta, Story } from '@storybook/react';
import { Middleware } from 'redux';
import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { configureStore } from '@reduxjs/toolkit';
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
import { RootState, usePeopleDispatch, usePeopleSelector } from './hooks';

const peopleSliceAction = action('People Slice');
const pageUrl = 'http://swapi.dev/api/people/?page=1';

const storyboardActionLogger: Middleware<unknown, RootState> = (storeApi) => (next) => (action) => {
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
        <Router>
          <Story />
        </Router>
      </Provider>
    ),
  ],
  title: 'PeoplePage',
} as Meta;

interface PeoplePageStoryProps {
  loading: boolean;
  perPage: number;
  peopleNames: Array<string>;
}

const PeoplePageStory: Story<PeoplePageStoryProps> = ({
  children,
  loading: isLoading,
  perPage,
  peopleNames,
  ...args
}) => {
  const count = usePeopleSelector((state) => state[PeopleFeatureKey].count);
  const dispatch = usePeopleDispatch();
  const [people, setPeople] = useState([]);
  const search = usePeopleSelector((state) => state[PeopleFeatureKey].search);

  useEffect(() => {
    dispatch(setLoading(isLoading ? LoadingState.Pending : LoadingState.Idle));
  }, [dispatch, isLoading]);

  useEffect(() => {
    dispatch(setPerPage(perPage));
  }, [dispatch, perPage]);

  useEffect(() => {
    const generatedPeople = peopleNames.map((name, index) => ({
      name,
      url: `http://swapi.dev/api/people/${index}`,
    }));
    setPeople(generatedPeople);
    dispatch(
      fetchPeoplePage.fulfilled(
        {
          current: pageUrl,
          count: generatedPeople.length,
          next: pageUrl,
          previous: pageUrl,
          results: generatedPeople,
        },
        undefined,
        { page: pageUrl }
      )
    );
  }, [dispatch, peopleNames]);

  useEffect(() => {
    let filteredPeople = people;
    if (search.trim().length > 0) {
      filteredPeople = filteredPeople.filter((person) => person.name.includes(search));
    }
    fetchMock.mock(`begin:${pageUrl}`, {
      current: pageUrl,
      count: filteredPeople.length,
      next: pageUrl,
      previous: pageUrl,
      results: filteredPeople,
    });
    return fetchMock.reset;
  }, [dispatch, people, search]);

  useEffect(() => {
    if (people.length !== count && search.trim().length === 0) {
      dispatch(
        fetchPeoplePage.fulfilled(
          {
            current: pageUrl,
            count: people.length,
            next: pageUrl,
            previous: pageUrl,
            results: people,
          },
          undefined,
          { page: pageUrl }
        )
      );
    }
  }, [count, dispatch, people, search]);

  return <PeoplePage {...args} />;
};

export const Primary = PeoplePageStory.bind({});
Primary.argTypes = {
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
  peopleNames: {
    description: 'The names of the people to show',
    control: { type: 'object' },
    name: 'People',
  },
};
Primary.args = {
  loading: initialPeopleState.loading === LoadingState.Pending,
  perPage: initialPeopleState.perPage,
  peopleNames: ['Luke Skywalker', 'C-3PO', 'R2-D2'],
} as PeoplePageStoryProps;
