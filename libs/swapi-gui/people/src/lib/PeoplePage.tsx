import { Switch, Route, useRouteMatch } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import { PeopleList } from './people-list';
import { PeoplePaginator } from './people-paginator';
import { PeopleSearchbar } from './people-searchbar';
import { PersonPage } from './person-page';
import './PeoplePage.module.scss';

export interface PeoplePageProps {
  className?: string;
}

export const PeoplePage: FunctionComponent<PeoplePageProps> = ({ className }): JSX.Element => {
  const match = useRouteMatch();

  let { path } = match;

  if (path[path.length - 1] !== '/') path += '/';

  return (
    <div className={classNames('People', className)}>
      <Switch>
        <Route path={`${path}:id([\\w.\\/:]+)`}>
          <PersonPage />
        </Route>
        <Route path={path}>
          <PeopleSearchbar />
          <PeopleList />
          <PeoplePaginator />
        </Route>
      </Switch>
    </div>
  );
};

export default PeoplePage;
