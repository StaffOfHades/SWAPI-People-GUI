import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { selectPersonById } from './peopleSlice';
import './PeopleList.scss';

export default function PeopleListItem({ id }: { id: string }): JSX.Element {
  const person = useSelector((state: RootState) => selectPersonById(state, id));

  // Verify we have a person to show
  if (person === undefined) {
    return <li>N/A</li>;
  }
  const { name } = person;

  return <li>{name}</li>;
}
