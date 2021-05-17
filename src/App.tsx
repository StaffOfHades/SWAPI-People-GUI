import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import { PeopleList } from './components/PeopleList';
import { PeoplePaginator } from './components/PeoplePaginator';
import { PeopleSearchbar } from './components/PeopleSearchbar';
import './App.scss';

export const People: FunctionComponent<{ className?: string }> = ({ className }): JSX.Element => (
  <div className={classNames('People', className)}>
    <PeopleSearchbar />
    <PeopleList />
    <PeoplePaginator />
  </div>
);

export function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <div>
          <ul className="App-header">
            <li>
              <Link className="App-link" to="/">
                People
              </Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/">
              <People className="App-content" />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
