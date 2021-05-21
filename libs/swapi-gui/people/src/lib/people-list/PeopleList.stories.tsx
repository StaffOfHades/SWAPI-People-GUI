import { MemoryRouter as Router } from 'react-router-dom';
import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';

import { LoadingState, PeopleFeatureKey, initialPeopleState, peopleAdapter } from '../people.slice';
import { PeopleList } from './PeopleList';

const mockStore = configureStore();

export default {
  component: PeopleList,
  title: 'PeopleList',
} as Meta;

interface PeopleListStoryProps {
  loading: boolean;
  perPage: number;
  peopleNames: Array<string>;
}

const PeopleListStory: Story<PeopleListStoryProps> = ({
  children,
  loading: isLoading,
  perPage,
  peopleNames,
  ...args
}) => {
  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;
  const people = peopleNames.map((name, index) => ({
    name,
    url: `http://swapi.dev/api/people/${index}`,
  }));

  const modifiedState = peopleAdapter.addMany(initialPeopleState, people);

  const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, loading, perPage } });

  return (
    <Provider store={store}>
      <Router>
        <PeopleList {...args} />
      </Router>
    </Provider>
  );
};

export const Primary = PeopleListStory.bind({});
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
} as PeopleListStoryProps;
