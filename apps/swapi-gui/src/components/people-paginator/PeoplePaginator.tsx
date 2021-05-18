import React, { FunctionComponent } from 'react';

import { PeopleFeatureKey, selectMaxPage } from '../../store/people/people.slice';
import { PaginatorLink, PaginatorLinkType } from '../paginator-link';
import styles from './PeoplePaginator.module.scss';
import { useAppSelector } from '../../hooks';

export function PeoplePaginator(): JSX.Element {
  const loadingState = useAppSelector((state) => state[PeopleFeatureKey].loading);
  const nextURL = useAppSelector((state) => state[PeopleFeatureKey].next);
  const previousURL = useAppSelector((state) => state[PeopleFeatureKey].previous);
  const currentPage = useAppSelector((state) => state[PeopleFeatureKey].page);
  const maxPage = useAppSelector(selectMaxPage);

  return (
    <ul className={styles['people-paginator']}>
      <li>
        Page <strong>{currentPage}</strong> of {maxPage}
      </li>
      <PaginatorLink
        loading={loadingState}
        maxPage={maxPage}
        page={currentPage}
        pageUrl={previousURL}
        type={PaginatorLinkType.Previous}
      >
        Anterior
      </PaginatorLink>
      <PaginatorLink
        loading={loadingState}
        maxPage={maxPage}
        page={currentPage}
        pageUrl={nextURL}
        type={PaginatorLinkType.Next}
      >
        Siguiente
      </PaginatorLink>
    </ul>
  );
}

export default PeoplePaginator;
