import React from 'react';

import { LoadingState, PeopleFeatureKey, selectPeoplePage } from '../people.slice';
import { PeopleListItem } from '../people-list-item';
import styles from './PeopleList.module.scss';
import { useAppSelector } from '../hooks';

export function PeopleList(): JSX.Element {
  const loadingState = useAppSelector((state) => state[PeopleFeatureKey].loading);
  const people = useAppSelector(selectPeoplePage);
  const perPage = useAppSelector((state) => state[PeopleFeatureKey].perPage);

  if (loadingState === LoadingState.Pending) {
    const spacers: Array<JSX.Element> = [];
    let index = 0;
    while (index < perPage - 1) {
      spacers.push(<li key={index}>&#160;</li>);
      index += 1;
    }
    return (
      <ul className={styles['people-list']}>
        <li className="loader">...Loading</li>
        {spacers}
      </ul>
    );
  }

  const renderedPeopleItems = people.map((person) => (
    <PeopleListItem key={person.url} id={person.url} />
  ));

  let key = 0;
  // To prevent issues where UI moves unexpectedly, always have 4 elements in rendered people items
  while (renderedPeopleItems.length < perPage) {
    renderedPeopleItems.push(<li key={key}>&#160;</li>);
    key += 1;
  }

  return <ul className={styles['people-list']}>{renderedPeopleItems}</ul>;
}

export default PeopleList;
