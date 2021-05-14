import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import {
  LoadingState,
  decreasePage,
  increasePage,
  fetchPeoplePage,
  selectMaxPage,
  selectPeopleTotal,
} from './peopleSlice';

export enum PaginatorLinkType {
  Next = 'next',
  Previous = 'previous',
}

interface PaginatorLinkProps {
  loading: LoadingState;
  maxPage: number;
  page: number;
  pageUrl: string | null;
  type: PaginatorLinkType;
}

export const PaginatorLink: FunctionComponent<PaginatorLinkProps> = ({
  children,
  loading,
  maxPage,
  page,
  pageUrl,
  type,
}) => {
  const count = useSelector((state: RootState) => state.people.count);
  const dispatch = useDispatch();
  const perPage = useSelector((state: RootState) => state.people.perPage);
  const peopleTotal = useSelector(selectPeopleTotal);
  const search = useSelector((state: RootState) => state.people.search);

  let disabled = false;
  switch (type) {
    case PaginatorLinkType.Next:
      disabled = page >= maxPage || (pageUrl === null && peopleTotal !== count);
      break;
    case PaginatorLinkType.Previous:
      disabled = page < 2;
      break;
    default:
      break;
  }

  if (loading === LoadingState.Pending || disabled) {
    return (
      <button disabled type="button">
        {loading === LoadingState.Pending ? '...Loading' : children}
      </button>
    );
  }

  const requestPeoplePage = (): void => {
    if (type === PaginatorLinkType.Next) {
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

export default function PeoplePaginator(): JSX.Element {
  const loadingState = useSelector((state: RootState) => state.people.loading);
  const nextURL = useSelector((state: RootState) => state.people.next);
  const previousURL = useSelector((state: RootState) => state.people.previous);
  const currentPage = useSelector((state: RootState) => state.people.page);
  const maxPage = useSelector(selectMaxPage);

  return (
    <ul className="people-paginator">
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
