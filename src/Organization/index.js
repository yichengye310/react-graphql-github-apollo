import React from 'react';
import {gql} from '@apollo/client';
import {useQuery} from '@apollo/client/react';

import RepositoryList, {REPOSITORY_FRAGMENT} from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
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

const Organization = ({organizationName}) => {
    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES_OF_ORGANIZATION, {
        variables: {
            organizationName
        }, notifyOnNetworkStatusChange: true, skip: !organizationName
    });

    if (error) {
        return <ErrorMessage error={error}/>;
    }

    const {organization} = data || {};

    if (loading && !organization) {
        return <Loading isCenter={true}/>;
    }

    return (
        <RepositoryList
            loading={loading}
            repositories={organization.repositories}
            fetchMore={fetchMore}
            entry={'organization'}
        />
    );
};

export default Organization;
