import { Link, useRouteMatch } from 'react-router-dom';
import React, { FunctionComponent } from 'react';

import { selectPersonById } from '../people.slice';
import { usePeopleSelector } from '../hooks';
import styles from './PeopleListItem.module.scss';

export interface PeopleListItemProps {
  id: string;
}

export const PeopleListItem: FunctionComponent<PeopleListItemProps> = ({ id }) => {
  const match = useRouteMatch();
  const person = usePeopleSelector((state) => selectPersonById(state, id));

  let { path } = match;

  if (path[path.length - 1] !== '/') path += '/';

  // Verify we have a person to show
  if (person === undefined) {
    return <li>N/A</li>;
  }
  const { name } = person;

  return (
    <li>
      <Link className={styles['PeopleListItem-link']} to={`${path}${id}`}>
        {name}
      </Link>
    </li>
  );
};

export default PeopleListItem;
