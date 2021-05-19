import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';
import { text, withKnobs } from '@storybook/addon-knobs';

import { PeopleFeatureKey, initialPeopleState, peopleAdapter } from '../people.slice';
import { PeopleListItem } from './PeopleListItem';
import { PeopleListStyles } from '../people-list';

const mockStore = configureStore();

export default {
  component: PeopleListItem,
  decorators: [
    (Story) => (
      <ul className={PeopleListStyles['people-list']}>
        <Story />
      </ul>
    ),
    withKnobs,
  ],
  title: 'PeopleListItem',
};

export const primary = () => {
  const person = { name: text('Name', 'Luke Skywalker'), url: 'http://swapi.dev/api/people/1/' };
  const modifiedState = peopleAdapter.addOne(initialPeopleState, person);
  const store = mockStore({ [PeopleFeatureKey]: modifiedState });

  return (
    <Provider store={store}>
      <PeopleListItem id={person.url} />
    </Provider>
  );
};
