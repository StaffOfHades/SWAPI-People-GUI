import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';

import { PeopleFeatureKey, initialPeopleState } from '../../store/people/people.slice';
import { PeoplePage } from './PeoplePage';

test('PeoplePage should render all of its parts', () => {
  const mockStore = configureStore();
  const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });
  const { container } = render(
    <Provider store={store}>
      <PeoplePage />
    </Provider>
  );
  expect(container.childElementCount).toEqual(1);
  expect(container).toBe(container.closest('div'));
  expect(container.firstChild.childElementCount).toEqual(3);
  const [peopleSearchBar, peopleList, peoplePaginator] = container.firstChild.childNodes;
  expect(peopleSearchBar.classList.contains('people-searchbar')).toBe(true);
  expect(peopleList.classList.contains('people-list')).toBe(true);
  expect(peoplePaginator.classList.contains('people-paginator')).toBe(true);
});
