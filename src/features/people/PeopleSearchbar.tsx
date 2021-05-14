import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { LoadingState, fetchPeoplePage, resetPeople, setPage, setSearchTerm } from './peopleSlice';

export default function PeopleSearchbar(): JSX.Element {
  const dispatch = useDispatch();
  const loadingState = useSelector((state: RootState) => state.people.loading);
  const search = useSelector((state: RootState) => state.people.search);

  const isLoading = loadingState === LoadingState.Pending;
  const canSearch = isLoading || (search ?? '').trim().length === 0;

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (loadingState === LoadingState.Pending) return;
    dispatch(setPage(1));
    dispatch(resetPeople());
    dispatch(fetchPeoplePage({ pageUrl: 'https://swapi.dev/api/people/?page=1', search }));
  }

  function handleReset(): void {
    if (canSearch) return;
    dispatch(setPage(1));
    dispatch(resetPeople());
    dispatch(setSearchTerm(undefined));
    dispatch(fetchPeoplePage({ pageUrl: 'https://swapi.dev/api/people/?page=1' }));
  }

  return (
    <form className="people-searchbar" onSubmit={handleSearch}>
      <input
        disabled={isLoading}
        onChange={({ target: { value } }) => dispatch(setSearchTerm(value))}
        value={search || ''}
      />
      <button disabled={canSearch} type="submit">
        Search
      </button>
      <button disabled={isLoading} onClick={handleReset} type="button">
        Clear
      </button>
    </form>
  );
}
