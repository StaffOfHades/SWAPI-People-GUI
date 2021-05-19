import { PeopleFeatureKey, initialPeopleState } from '@teachable/swapi-gui/people';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getByText } from '@testing-library/dom';
import { render } from '@testing-library/react';

import App from './App';

test('App should render navbar', () => {
  const mockStore = configureStore();
  const store = mockStore({ [PeopleFeatureKey]: initialPeopleState });
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(getByText(container, 'People')).toBeInTheDocument();
});
