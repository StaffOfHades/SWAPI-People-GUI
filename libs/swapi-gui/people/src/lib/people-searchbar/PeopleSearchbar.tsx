import React from 'react';

import {
  LoadingState,
  PeopleFeatureKey,
  fetchPeoplePage,
  resetPeople,
  setPage,
  setSearchTerm,
} from '../people.slice';
import styles from './PeopleSearchbar.module.scss';
import { usePeopleDispatch, usePeopleSelector } from '../hooks';

export function PeopleSearchbar(): JSX.Element {
  const dispatch = usePeopleDispatch();
  const loadingState = usePeopleSelector((state) => state[PeopleFeatureKey].loading);
  const search = usePeopleSelector((state) => state[PeopleFeatureKey].search);

  const isLoading = loadingState === LoadingState.Pending;
  const canSearch = isLoading || (search ?? '').trim().length === 0;

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (loadingState === LoadingState.Pending) return;
    dispatch(setPage(1));
    dispatch(resetPeople());
    dispatch(fetchPeoplePage({ pageUrl: 'https://swapi.dev/api/people/?page=1', search }));
  }

  function handleSearchChange({
    currentTarget: { value },
  }: React.FormEvent<HTMLInputElement>): void {
    dispatch(setSearchTerm(value));
  }

  function handleReset(): void {
    if (canSearch) return;
    dispatch(setSearchTerm(''));
    dispatch(setPage(1));
    dispatch(resetPeople());
    dispatch(fetchPeoplePage({ pageUrl: 'https://swapi.dev/api/people/?page=1' }));
  }

  return (
    <form className={styles['people-searchbar']} onSubmit={handleSearch}>
      <input disabled={isLoading} onChange={handleSearchChange} value={search} />
      <button disabled={canSearch} type="submit">
        Search
      </button>
      <button disabled={isLoading} onClick={handleReset} type="button">
        Clear
      </button>
    </form>
  );
}

export default PeopleSearchbar;
