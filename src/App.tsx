import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import React from 'react';

import PeopleList from './features/people/PeopleList';
import PeoplePaginator from './features/people/PeoplePaginator';
import PeopleSearchbar from './features/people/PeopleSearchbar';
import logo from './assets/logo.svg';
import './App.css';

function Home(): JSX.Element {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </header>
  );
}

function People(): JSX.Element {
  return (
    <div>
      <PeopleSearchbar />
      <PeopleList />
      <PeoplePaginator />
    </div>
  );
}

function Dashboard(): JSX.Element {
  return (
    <div>
      <h2>Dashboard</h2>
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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/people">People</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/people">
              <People />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
