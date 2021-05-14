import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText, queryByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { LoadingState, initialState, peopleAdapter } from './peopleSlice';
import PeopleList from './PeopleList';

describe('People List', () => {
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

  test('renders people correctly', async () => {
    const modifiedState = peopleAdapter.upsertMany(initialState, people);
    const store = mockStore({ people: modifiedState });

    const { container } = render(
      <Provider store={store}>
        <PeopleList />
      </Provider>
    );

    for (let p in people) {
      expect(getByText(container, people[p].name)).toBeInTheDocument();
    }
  });
  test('renders loading state correctly', async () => {
    const modifiedState = peopleAdapter.upsertMany(initialState, people);
    const store = mockStore({ people: { ...modifiedState, loading: LoadingState.Pending } });

    const { container } = render(
      <Provider store={store}>
        <PeopleList />
      </Provider>
    );

    expect(getByText(container, '...Loading')).toBeInTheDocument();
  });
});
