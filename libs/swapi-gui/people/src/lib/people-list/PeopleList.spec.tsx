import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { LoadingState, PeopleFeatureKey, initialPeopleState, peopleAdapter } from '../people.slice';
import { PeopleList } from './PeopleList';

describe('PeopleList', () => {
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

  test('should render people correctly', () => {
    const modifiedState = peopleAdapter.upsertMany(initialPeopleState, people);
    const store = mockStore({ [PeopleFeatureKey]: modifiedState });

    const { container } = render(
      <Provider store={store}>
        <Router>
          <PeopleList />
        </Router>
      </Provider>
    );

    for (const p in people) {
      expect(getByText(container, people[p].name)).toBeInTheDocument();
    }
  });
  test('should render loading state correctly', () => {
    const modifiedState = peopleAdapter.upsertMany(initialPeopleState, people);
    const store = mockStore({
      [PeopleFeatureKey]: { ...modifiedState, loading: LoadingState.Pending },
    });

    const { container } = render(
      <Provider store={store}>
        <Router>
          <PeopleList />
        </Router>
      </Provider>
    );

    expect(getByText(container, '...Loading')).toBeInTheDocument();
  });
});
