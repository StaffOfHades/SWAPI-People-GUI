import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import { PeopleList } from '../people-list';
import { PeoplePaginator } from '../people-paginator';
import { PeopleSearchbar } from '../people-searchbar';
import './PeoplePage.module.scss';

interface PeoplePageProps {
  className?: string;
}

export const PeoplePage: FunctionComponent<PeoplePageProps> = ({ className }): JSX.Element => (
  <div className={classNames('People', className)}>
    <PeopleSearchbar />
    <PeopleList />
    <PeoplePaginator />
  </div>
);

export default PeoplePage;
