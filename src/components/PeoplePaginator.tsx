import React, { FunctionComponent } from 'react';

import {
  LoadingState,
  decreasePage,
  increasePage,
  fetchPeoplePage,
  selectMaxPage,
  selectPeopleTotal,
} from '../store/people';
import { useAppDispatch, useAppSelector } from '../hooks';
import './PeoplePaginator.scss';

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
  const count = useAppSelector((state) => state.people.count);
  const dispatch = useAppDispatch();
  const perPage = useAppSelector((state) => state.people.perPage);
  const peopleTotal = useAppSelector(selectPeopleTotal);
  const search = useAppSelector((state) => state.people.search);

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
      <li>
        <button disabled type="button">
          {loading === LoadingState.Pending ? '...Loading' : children}
        </button>
      </li>
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

export function PeoplePaginator(): JSX.Element {
  const loadingState = useAppSelector((state) => state.people.loading);
  const nextURL = useAppSelector((state) => state.people.next);
  const previousURL = useAppSelector((state) => state.people.previous);
  const currentPage = useAppSelector((state) => state.people.page);
  const maxPage = useAppSelector(selectMaxPage);

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

export default PeoplePaginator;
