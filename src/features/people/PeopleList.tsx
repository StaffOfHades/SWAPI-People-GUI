import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { LoadingState, selectPeoplePage } from './peopleSlice';
import PeopleListItem from './PeopleListItem';

export default function PeopleList(): JSX.Element {
  const loadingState = useSelector((state: RootState) => state.people.loading);
  const people = useSelector(selectPeoplePage);

  if (loadingState === LoadingState.Pending) {
    return (
      <div className="people-list">
        <div className="loader">...Loading</div>
      </div>
    );
  }

  const renderedPeopleItems = people.map((person) => (
    <PeopleListItem key={person.url} id={person.url} />
  ));

  return <ul className="people-list">{renderedPeopleItems}</ul>;
}
