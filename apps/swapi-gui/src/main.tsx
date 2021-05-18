import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';

import { App } from './app';
import { fetchPeoplePage } from './store/people/people.slice';
import store from './store';

store.dispatch(fetchPeoplePage({ pageUrl: 'https://swapi.dev/api/people/?page=1' }));

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
