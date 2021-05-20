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
  initialPeopleState,
  peopleAdapter,
  setSearchTerm,
} from '../people.slice';
import { PeopleSearchbar } from './PeopleSearchbar';

const mockStore = configureStore([thunkMiddleware]);
const pageUrl = 'https://swapi.dev/api/people/?page=1';
const peopleSliceAction = action('People Slice');

export default {
  component: PeopleSearchbar,
  title: 'PeopleSearchbar',
} as Meta;

interface PeopleSearchbarStoryProps {
  loading: boolean;
  peopleNames: Array<string>;
}

const PeopleSearchbarStory: Story<PeopleSearchbarStoryProps> = ({
  children,
  loading: isLoading,
  peopleNames,
  ...args
}) => {
  const [search, setSearch] = useState(initialPeopleState.search);

  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;
  const people = peopleNames.map((name, index) => ({
    name,
    url: `https://swapi.dev/api/people/${index}`,
  }));

  const modifiedState = peopleAdapter.addMany(initialPeopleState, people);

  const store = mockStore({
    [PeopleFeatureKey]: {
      ...modifiedState,
      loading,
      search,
    },
  });

  const unsubscribe = store.subscribe(() => {
    const action = store.getActions().slice(-1)[0];
    peopleSliceAction(action);
    if (setSearchTerm.match(action)) {
      setSearch(action.payload);
    }
  });

  useEffect(() => {
    return unsubscribe;
  }, [unsubscribe]);

  useEffect(() => {
    const filteredPeople = people.filter((person) => person.name.includes(search));
    fetchMock.mock(`begin:${pageUrl}`, {
      current: pageUrl,
      count: filteredPeople.length,
      next: null,
      previous: null,
      results: filteredPeople,
    });
    return fetchMock.reset;
  }, [people, search]);

  return (
    <Provider store={store}>
      <PeopleSearchbar {...args} />
    </Provider>
  );
};

export const Primary = PeopleSearchbarStory.bind({});
Primary.argTypes = {
  loading: {
    description: 'Whether the component is in a loading state',
    control: { type: 'boolean' },
    name: 'Loading',
  },
  peopleNames: {
    description: 'The names of the people to show',
    control: { type: 'object' },
    name: 'People',
  },
};
Primary.args = {
  loading: initialPeopleState.loading === LoadingState.Pending,
  peopleNames: ['Luke Skywalker', 'C-3PO', 'R2-D2'],
} as PeopleSearchbarStoryProps;
