import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import App, { People } from './App';
import { initialState } from './features/people/peopleSlice';

test('App should render navbar', () => {
  const mockStore = configureStore();
  const store = mockStore({ people: initialState });
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(getByText(container, 'People')).toBeInTheDocument();
});

test('People should render all of its parts', () => {
  const mockStore = configureStore();
  const store = mockStore({ people: initialState });
  const { container } = render(
    <Provider store={store}>
      <People />
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
