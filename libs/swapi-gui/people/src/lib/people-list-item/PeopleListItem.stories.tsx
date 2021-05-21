import { MemoryRouter as Router } from 'react-router-dom';
import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';

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
  ],
  title: 'PeopleListItem',
} as Meta;

interface PeopleListItemStoryProps {
  name: string;
}

const PeopleListItemStory: Story<PeopleListItemStoryProps> = ({ children, name, ...args }) => {
  const person = { name, url: 'http://swapi.dev/api/people/1/' };
  const modifiedState = peopleAdapter.addOne(initialPeopleState, person);
  const store = mockStore({ [PeopleFeatureKey]: modifiedState });

  return (
    <Provider store={store}>
      <Router>
        <PeopleListItem id={person.url} {...args} />
      </Router>
    </Provider>
  );
};

export const Primary = PeopleListItemStory.bind({});
Primary.argTypes = {
  name: {
    description: 'The name of the person',
    control: { type: 'text' },
    name: 'Name',
  },
};
Primary.args = {
  name: 'Luke Skywalker',
} as PeopleListItemStoryProps;
