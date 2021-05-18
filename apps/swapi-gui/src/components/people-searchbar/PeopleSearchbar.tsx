import React from 'react';

import {
  LoadingState,
  PeopleFeatureKey,
  fetchPeoplePage,
  resetPeople,
  setPage,
  setSearchTerm,
} from '../../store/people/people.slice';
import styles from './PeopleSearchbar.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks';

export function PeopleSearchbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector((state) => state[PeopleFeatureKey].loading);
  const search = useAppSelector((state) => state[PeopleFeatureKey].search);

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
    dispatch(setPage(1));
    dispatch(resetPeople());
    dispatch(setSearchTerm(''));
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
