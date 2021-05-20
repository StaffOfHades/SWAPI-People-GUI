import { Meta, Story } from '@storybook/react';
import { Provider, connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunkMiddleware from 'redux-thunk';

import {
  LoadingState,
  PartialRootState,
  PeopleFeatureKey,
  decreasePage,
  fetchPeoplePage,
  increasePage,
  initialPeopleState,
  peopleAdapter,
  selectMaxPage,
} from '../people.slice';
import {
  PeoplePaginatorLink as BasePeoplePaginatorLink,
  PeoplePaginatorLinkType,
} from './PeoplePaginatorLink';
import { PeoplePaginatorStyles } from '../people-paginator/';

function mapStateToProps(state: PartialRootState) {
  return {
    loading: state[PeopleFeatureKey].loading,
    maxPage: selectMaxPage(state),
    page: state[PeopleFeatureKey].page,
  };
}

const PeoplePaginatorLink = connect(mapStateToProps)(BasePeoplePaginatorLink);
const count = Number.MAX_VALUE;
const mockStore = configureStore([thunkMiddleware]);
const peopleSliceAction = action('People Slice');
const pageUrl = 'https://swapi.dev/api/people/?page=1';

export default {
  component: PeoplePaginatorLink,
  decorators: [
    (Story) => (
      <ul className={PeoplePaginatorStyles['people-paginator']}>
        <Story />
      </ul>
    ),
  ],
  title: 'PeoplePaginatorLink',
} as Meta;

interface PeoplePaginatorLinkStoryProps {
  loading: boolean;
  label: string;
  type?: PeoplePaginatorLinkType;
}

const PeoplePaginatorLinkStory: Story<PeoplePaginatorLinkStoryProps> = ({
  children,
  label,
  loading: isLoading,
  page,
  type,
  ...args
}) => {
  const loading = isLoading ? LoadingState.Pending : LoadingState.Idle;

  const store = mockStore({
    [PeopleFeatureKey]: {
      ...initialPeopleState,
      count,
      current: pageUrl,
      loading,
      next: pageUrl,
      previous: pageUrl,
      page,
    },
  });

  const unsubscribe = store.subscribe(() => {
    const action = store.getActions().slice(-1)[0];
    peopleSliceAction(action);
  });

  useEffect(() => {
    return unsubscribe;
  }, [unsubscribe]);

  useEffect(() => {
    fetchMock.mock(`begin:${pageUrl}`, {
      count,
      current: pageUrl,
      next: pageUrl,
      previous: pageUrl,
      results: [],
    });
    return fetchMock.reset;
  }, []);

  return (
    <Provider store={store}>
      <PeoplePaginatorLink pageUrl={pageUrl} type={type} {...args}>
        {label}
      </PeoplePaginatorLink>
    </Provider>
  );
};

const Primary = PeoplePaginatorLinkStory.bind({});
Primary.argTypes = {
  label: {
    description: 'The text contents of the button',
    control: { type: 'text' },
    name: 'Label',
  },
  loading: {
    description: 'Whether the component is in a loading state',
    control: { type: 'boolean' },
    name: 'Loading',
  },
  page: {
    description: 'The current internal page number',
    control: { type: 'number', min: 1 },
    name: 'Page',
  },
  type: {
    description: 'The link type',
    control: { type: 'select' },
    options: Object.values(PeoplePaginatorLinkType),
    name: 'Type',
  },
};
Primary.args = {
  label: 'Link',
  loading: initialPeopleState.loading === LoadingState.Pending,
  page: initialPeopleState.page,
  type: undefined,
} as PeoplePaginatorLinkStoryProps;

export const Previous = PeoplePaginatorLinkStory.bind({});
Previous.argTypes = {
  ...Primary.argTypes,
  type: {
    ...Primary.argTypes.type,
    control: false,
    table: {
      disable: true,
    },
  },
};
Previous.args = {
  ...Primary.args,
  page: 2,
  label: 'Previous',
  type: PeoplePaginatorLinkType.Previous,
} as PeoplePaginatorLinkStoryProps;

export const Next = PeoplePaginatorLinkStory.bind({});
Next.argTypes = {
  ...Primary.argTypes,
  page: {
    ...Primary.argTypes.page,
    control: false,
    table: {
      disable: true,
    },
  },
  type: {
    ...Primary.argTypes.type,
    control: false,
    table: {
      disable: true,
    },
  },
};
Next.args = {
  ...Primary.args,
  label: 'Next',
  type: PeoplePaginatorLinkType.Next,
} as PeoplePaginatorLinkStoryProps;
