import React from 'react';
import {gql, useQuery} from '@apollo/client';

import Loading from '../Loading';
import ErrorMessage from '../Error';
import TimeLineList from '../TimeLine';
import REPOSITORY_FRAGMENT from '../TimeLine/fragments';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

const TimeLineProfile = () => {
    const {data, loading, error, fetchMore} = useQuery(GET_REPOSITORIES_OF_CURRENT_USER, {
        notifyOnNetworkStatusChange: true,
    });

    const {viewer} = data || {};

    if (loading && !viewer) {
        return <Loading isCenter={true}/>;
    }

    if (error) {
        return <ErrorMessage error={error}/>;
    }

    return (
        <TimeLineList
            loading={loading}
            repositories={viewer.repositories}
            fetchMore={fetchMore}
            entry={'viewer'}
        />
    );

};

export default TimeLineProfile;
