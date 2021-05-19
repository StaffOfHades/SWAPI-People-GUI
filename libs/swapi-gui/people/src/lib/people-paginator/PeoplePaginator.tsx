import React, { FunctionComponent } from 'react';

import { PeopleFeatureKey, selectMaxPage } from '../people.slice';
import { PeoplePaginatorLink, PeoplePaginatorLinkType } from '../people-paginator-link';
import styles from './PeoplePaginator.module.scss';
import { usePeopleSelector } from '../hooks';

export function PeoplePaginator(): JSX.Element {
  const loadingState = usePeopleSelector((state) => state[PeopleFeatureKey].loading);
  const nextURL = usePeopleSelector((state) => state[PeopleFeatureKey].next);
  const previousURL = usePeopleSelector((state) => state[PeopleFeatureKey].previous);
  const currentPage = usePeopleSelector((state) => state[PeopleFeatureKey].page);
  const maxPage = usePeopleSelector(selectMaxPage);

  return (
    <ul className={styles['people-paginator']}>
      <li>
        Page <strong>{currentPage}</strong> of {maxPage}
      </li>
      <PeoplePaginatorLink
        loading={loadingState}
        maxPage={maxPage}
        page={currentPage}
        pageUrl={previousURL}
        type={PeoplePaginatorLinkType.Previous}
      >
        Anterior
      </PeoplePaginatorLink>
      <PeoplePaginatorLink
        loading={loadingState}
        maxPage={maxPage}
        page={currentPage}
        pageUrl={nextURL}
        type={PeoplePaginatorLinkType.Next}
      >
        Siguiente
      </PeoplePaginatorLink>
    </ul>
  );
}

export default PeoplePaginator;
