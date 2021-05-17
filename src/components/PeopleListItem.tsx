import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import { selectPersonById } from '../store/people';
import './PeopleList.scss';

interface PeopleListItemProps {
  id: string;
}

export const PeopleListItem: FunctionComponent<PeopleListItemProps> = ({ id }) => {
  const person = useSelector((state: RootState) => selectPersonById(state, id));

  // Verify we have a person to show
  if (person === undefined) {
    return <li>N/A</li>;
  }
  const { name } = person;

  return <li>{name}</li>;
};

export default PeopleListItem;
