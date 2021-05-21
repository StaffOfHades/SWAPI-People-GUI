import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { PeoplePage } from '@teachable/swapi-gui/people';
import React from 'react';

import { Home } from './home';
import styles from './App.module.scss';

export function App(): JSX.Element {
  return (
    <div className={styles.App}>
      <Router>
        <div>
          <ul className={styles['App-header']}>
            <li>
              <Link className={styles['App-link']} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={styles['App-link']} to="/person">
                People
              </Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/">
              <Home className={styles['App-content']} />
            </Route>
            <Route path="/people">
              <PeoplePage className={styles['App-content']} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
