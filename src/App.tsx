import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import PeopleList from './features/people/PeopleList';
import PeoplePaginator from './features/people/PeoplePaginator';
import PeopleSearchbar from './features/people/PeopleSearchbar';
import './App.scss';

export const People: FunctionComponent<{ className?: string }> = ({ className }): JSX.Element => (
  <div className={classNames('People', className)}>
    <PeopleSearchbar />
    <PeopleList />
    <PeoplePaginator />
  </div>
);

export default function App(): JSX.Element {
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
