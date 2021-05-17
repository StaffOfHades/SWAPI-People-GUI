import React, { FunctionComponent } from 'react';

import { selectPersonById } from '../store/people';
import { useAppSelector } from '../hooks';
import './PeopleList.scss';

interface PeopleListItemProps {
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
