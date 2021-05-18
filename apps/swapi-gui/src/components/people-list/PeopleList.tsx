import React from 'react';

import { LoadingState, PeopleFeatureKey, selectPeoplePage } from '../../store/people/people.slice';
import { PeopleListItem } from '../people-list-item';
import styles from './PeopleList.module.scss';
import { useAppSelector } from '../../hooks';

export function PeopleList(): JSX.Element {
  const loadingState = useAppSelector((state) => state[PeopleFeatureKey].loading);
  const people = useAppSelector(selectPeoplePage);

  if (loadingState === LoadingState.Pending) {
    return (
      <ul className={styles['people-list']}>
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

  let key = 0;
  // To prevent issues where UI moves unexpectedly, always have 4 elements in rendered people items
  while (renderedPeopleItems.length < 4) {
    renderedPeopleItems.push(<li key={key}>&#160;</li>);
    key += 1;
  }

  return <ul className={styles['people-list']}>{renderedPeopleItems}</ul>;
}

export default PeopleList;
