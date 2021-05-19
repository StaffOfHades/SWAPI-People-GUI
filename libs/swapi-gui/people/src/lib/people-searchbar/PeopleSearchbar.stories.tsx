import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { array, boolean, withKnobs } from '@storybook/addon-knobs';
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
  decorators: [withKnobs],
  title: 'PeopleSearchbar',
};

export const primary = () => {
  const isLoading = boolean('Loading', initialPeopleState.loading === LoadingState.Pending);
  const [search, setSearch] = useState(initialPeopleState.search);
  const peopleNames = array('People', ['Luke Skywalker', 'C-3PO', 'R2-D2']);

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
  }, []);

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
      <PeopleSearchbar />
    </Provider>
  );
};
