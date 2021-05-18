import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import React from 'react';

import { PeoplePage } from '../components/people-page/';
import styles from './App.module.scss';

export function App(): JSX.Element {
  return (
    <div className={styles.App}>
      <Router>
        <div>
          <ul className={styles['App-header']}>
            <li>
              <Link className={styles['App-link']} to="/">
                People
              </Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/">
              <PeoplePage className={styles['App-content']} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
