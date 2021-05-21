import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText, queryByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PeopleFeatureKey, initialPeopleState, peopleAdapter } from '../people.slice';
import { PersonPage } from './PersonPage';

describe('PersonPage', () => {
  const mockStore = configureStore();
  const people = [
    {
      name: 'Luke Skywalker',
      url: 'http://swapi.dev/api/people/1/',
    },
    {
      name: 'C-3PO',
      url: 'http://swapi.dev/api/people/2/',
    },
    {
      name: 'R2-D2',
      url: 'http://swapi.dev/api/people/3/',
    },
  ];

  test('should render person correctly with its id', () => {
    const modifiedState = peopleAdapter.upsertMany(initialPeopleState, people);
    const store = mockStore({ [PeopleFeatureKey]: modifiedState });

    const [person] = people;

    const { baseElement } = render(
      <Provider store={store}>
        <Router initialEntries={[`/${person.url}`]}>
          <Switch>
            <Route path={'/:id([\\w.\\/:]+)'}>
              <PersonPage />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );

    expect(queryByText(baseElement, 'Not Found')).not.toBeInTheDocument();
    expect(getByText(baseElement, person.name)).toBeInTheDocument();
  });
  test('should render invalid value for invalid id', () => {
    const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });

    const { baseElement } = render(
      <Provider store={store}>
        <Router>
          <PersonPage />
        </Router>
      </Provider>
    );

    const [person] = people;
    expect(queryByText(baseElement, person.name)).not.toBeInTheDocument();
    expect(getByText(baseElement, 'Not Found')).toBeInTheDocument();
  });
});
