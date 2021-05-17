import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import { LoadingState, selectPeoplePage } from '../store/people';
import PeopleListItem from './PeopleListItem';

export default function PeopleList(): JSX.Element {
  const loadingState = useSelector((state: RootState) => state.people.loading);
  const people = useSelector(selectPeoplePage);

  if (loadingState === LoadingState.Pending) {
    return (
      <ul className="people-list">
        <li className="loader">...Loading</li>
        <li>&#160;</li>
        <li>&#160;</li>
        <li>&#160;</li>
      </ul>
    );
  }

  const renderedPeopleItems = people.map((person) => (
    <PeopleListItem key={person.url} id={person.url} />
  ));

  // To prevent issues where UI moves unexpectedly, always have 4 elements in rendered people items
  while (renderedPeopleItems.length < 4) {
    renderedPeopleItems.push(<li>&#160;</li>);
  }

  return <ul className="people-list">{renderedPeopleItems}</ul>;
}
