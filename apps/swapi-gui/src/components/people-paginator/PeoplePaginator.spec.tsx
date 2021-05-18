import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import {
  PeopleFeatureKey,
  initialPeopleState,
  selectMaxPage,
} from '../../store/people/people.slice';
import { PeoplePaginator } from './PeoplePaginator';

describe('PeoplePaginator', () => {
  describe('when rendering', () => {
    const mockStore = configureStore();
    test('should have text content of page indicate match data from store', () => {
      const page = 2;
      const store = mockStore({ [PeopleFeatureKey]: { ...initialPeopleState, page, count: 20 } });
      const maxPage = selectMaxPage(store.getState());

      const { container } = render(
        <Provider store={store}>
          <PeoplePaginator />
        </Provider>
      );
      const button = getByText(container, 'Anterior');
      expect(button).toBeInTheDocument();
      const list = button.closest('ul');
      expect(list).toBeInTheDocument();
      expect(list.childElementCount).toEqual(3);
      const pageListElement = list.firstChild;
      expect(pageListElement.textContent).toEqual(`Page ${page} of ${maxPage}`);
    });
  });
});
