import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText, queryByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PeopleListItem } from '../PeopleListItem';
import { initialState, peopleAdapter } from '../../store/people';

describe('People List Item', () => {
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
    const modifiedState = peopleAdapter.upsertMany(initialState, people);
    const store = mockStore({ people: modifiedState });

    const [person] = people;

    const { container } = render(
      <Provider store={store}>
        <PeopleListItem id={person.url} />
      </Provider>
    );

    expect(getByText(container, person.name)).toBeInTheDocument();
  });
  test('should render invalid value for invalid id', () => {
    const store = mockStore({ people: initialState });

    const { container } = render(
      <Provider store={store}>
        <PeopleListItem id={'invalid_id'} />
      </Provider>
    );

    const [person] = people;
    expect(queryByText(container, person.name)).not.toBeInTheDocument();
    expect(getByText(container, 'N/A')).toBeInTheDocument();
  });
});
