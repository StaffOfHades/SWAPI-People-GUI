import React, { FunctionComponent } from 'react';

import {
  LoadingState,
  PeopleFeatureKey,
  decreasePage,
  increasePage,
  fetchPeoplePage,
  selectPeopleTotal,
} from '../people.slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import './PeoplePaginatorLink.module.scss';

export enum PeoplePaginatorLinkType {
  Next = 'next',
  Previous = 'previous',
}

export interface PeoplePaginatorLinkProps {
  loading: LoadingState;
  maxPage: number;
  page: number;
  pageUrl: string | null;
  type: PeoplePaginatorLinkType;
}

export const PeoplePaginatorLink: FunctionComponent<PeoplePaginatorLinkProps> = ({
  children,
  loading,
  maxPage,
  page,
  pageUrl,
  type,
}) => {
  const count = useAppSelector((state) => state[PeopleFeatureKey].count);
  const dispatch = useAppDispatch();
  const perPage = useAppSelector((state) => state[PeopleFeatureKey].perPage);
  const peopleTotal = useAppSelector(selectPeopleTotal);
  const search = useAppSelector((state) => state[PeopleFeatureKey].search);

  let disabled = false;
  switch (type) {
    case PeoplePaginatorLinkType.Next:
      disabled = page >= maxPage || (pageUrl === null && peopleTotal !== count);
      break;
    case PeoplePaginatorLinkType.Previous:
      disabled = page < 2;
      break;
    default:
      break;
  }

  if (loading === LoadingState.Pending || disabled) {
    return (
      <li>
        <button disabled type="button">
          {loading === LoadingState.Pending ? '...Loading' : children}
        </button>
      </li>
    );
  }

  const requestPeoplePage = (): void => {
    if (type === PeoplePaginatorLinkType.Next) {
      dispatch(increasePage());
      const rowsToLoad = (page + 1) * perPage;
      if (pageUrl !== null && rowsToLoad > peopleTotal) {
        dispatch(fetchPeoplePage({ pageUrl, search }));
      }
    } else {
      dispatch(decreasePage());
    }
  };

  return (
    <li>
      <button onClick={requestPeoplePage} type="button">
        {children}
      </button>
    </li>
  );
};

export default PeoplePaginatorLink;
