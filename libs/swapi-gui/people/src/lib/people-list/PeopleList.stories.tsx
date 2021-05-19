import { Provider } from 'react-redux';
import React from 'react';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import configureStore from 'redux-mock-store';

import { LoadingState, PeopleFeatureKey, initialPeopleState, peopleAdapter } from '../people.slice';
import { PeopleList } from './PeopleList';

const mockStore = configureStore();

export default {
  component: PeopleList,
  decorators: [withKnobs],
  title: 'PeopleList',
};

export const primary = () => {
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const perPage = number('Per Page', initialPeopleState.perPage);
  const peopleNames = array('People', ['Luke Skywalker', 'C-3PO', 'R2-D2']);

  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;
  const people = peopleNames.map((name, index) => ({
    name,
    url: `https://swapi.dev/api/people/${index}`,
  }));

  const modifiedState = peopleAdapter.addMany(initialPeopleState, people);

  const store = mockStore({ [PeopleFeatureKey]: { ...modifiedState, loading, perPage } });

  return (
    <Provider store={store}>
      <PeopleList />
    </Provider>
  );
};
