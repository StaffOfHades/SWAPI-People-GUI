import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PeopleFeatureKey, initialPeopleState } from './people.slice';
import { PeoplePage } from './PeoplePage';

test('PeoplePage should render all of its parts', () => {
  const mockStore = configureStore();
  const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });
  const { baseElement } = render(
    <Provider store={store}>
      <Router>
        <PeoplePage />
      </Router>
    </Provider>
  );
  const title = getByText(baseElement, 'People & Characters');
  expect(title).toBeInTheDocument();
  const parent = title.parentNode;
  expect(parent).toBe(parent.closest('div'));
  expect(parent.childElementCount).toEqual(4);
  const [, peopleSearchBar, peopleList, peoplePaginator] = parent.childNodes;
  expect(peopleSearchBar.classList.contains('people-searchbar')).toBe(true);
  expect(peopleList.classList.contains('people-list')).toBe(true);
  expect(peoplePaginator.classList.contains('people-paginator')).toBe(true);
});
