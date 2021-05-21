import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';

import { PeopleFeatureKey, Person, initialPeopleState, peopleAdapter } from '../people.slice';
import { PersonPage } from './PersonPage';
import { PeopleListStyles } from '../people-list';

const mockStore = configureStore();

export default {
  component: PersonPage,
  decorators: [
    (Story) => (
      <div style={{ textAlign: 'center' }}>
        <Story />
      </div>
    ),
  ],
  title: 'PersonPage',
} as Meta;

interface PersonPageStoryProps {
  person: Person;
}

const PersonPageStory: Story<PersonPageStoryProps> = ({ children, person, ...args }) => {
  const modifiedState = peopleAdapter.addOne(initialPeopleState, person);
  const store = mockStore({ [PeopleFeatureKey]: modifiedState });

  return (
    <Provider store={store}>
      <Router initialEntries={[`/${person.url}`]}>
        <Switch>
          <Route path={'/:id([\\w.\\/:]+)'}>
            <PersonPage {...args} />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export const Primary = PersonPageStory.bind({});
Primary.argTypes = {
  person: {
    description: 'The details of a person',
    control: { type: 'object' },
    name: 'Person',
  },
};
Primary.args = {
  person: {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'http://swapi.dev/api/planets/1/',
    films: [
      'http://swapi.dev/api/films/1/',
      'http://swapi.dev/api/films/2/',
      'http://swapi.dev/api/films/3/',
      'http://swapi.dev/api/films/6/',
    ],
    species: [],
    vehicles: ['http://swapi.dev/api/vehicles/14/', 'http://swapi.dev/api/vehicles/30/'],
    starships: ['http://swapi.dev/api/starships/12/', 'http://swapi.dev/api/starships/22/'],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'http://swapi.dev/api/people/1/',
  },
} as PersonPageStoryProps;
