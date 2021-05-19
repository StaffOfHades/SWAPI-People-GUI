import React, { FunctionComponent } from 'react';

import { selectPersonById } from '../people.slice';
import { useAppSelector } from '../hooks';
import './PeopleListItem.module.scss';

export interface PeopleListItemProps {
  id: string;
}

export const PeopleListItem: FunctionComponent<PeopleListItemProps> = ({ id }) => {
  const person = useAppSelector((state) => selectPersonById(state, id));

  // Verify we have a person to show
  if (person === undefined) {
    return <li>N/A</li>;
  }
  const { name } = person;

  return <li>{name}</li>;
};

export default PeopleListItem;
