import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { fetchPeoplePage } from '@teachable/swapi-gui/people';

import { App } from './app';
import store from './store';

store.dispatch(fetchPeoplePage({ pageUrl: 'http://swapi.dev/api/people/?page=1' }));

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
