import React from 'react';
import { useParams } from 'react-router-dom';

import { selectPersonById } from '../people.slice';
import { usePeopleSelector } from '../hooks';
import './PersonPage.module.scss';

export interface PersonPageParams {
  id: string;
}

export function PersonPage(): JSX.Element {
  const { id } = useParams<PersonPageParams>();
  const person = usePeopleSelector((state) => selectPersonById(state, id));

  // Verify we have a person to show
  if (person === undefined) {
    return <h2>Not Found</h2>;
  }
  const { name } = person;

  return <h2>{name}</h2>;
}

export default PersonPage;
