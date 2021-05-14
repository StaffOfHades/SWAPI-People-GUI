import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import React from 'react';

import PeopleList from './features/people/PeopleList';
import PeoplePaginator from './features/people/PeoplePaginator';
import PeopleSearchbar from './features/people/PeopleSearchbar';
import './App.scss';

export function People(): JSX.Element {
  return (
    <div>
      <PeopleSearchbar />
      <PeopleList />
      <PeoplePaginator />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">People</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact path="/">
              <People />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
