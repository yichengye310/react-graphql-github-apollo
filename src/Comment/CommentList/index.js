import React from 'react';
import { Query } from 'react-apollo';

import { GET_COMMENTS_OF_ISSUE } from './queries';
import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';

import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';

import './style.css';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issue: {
        ...previousResult.repository.issue,
        ...fetchMoreResult.repository.issue,
        comments: {
          ...previousResult.repository.issue.comments,
          ...fetchMoreResult.repository.issue.comments,
          edges: [
            ...previousResult.repository.issue.comments.edges,
            ...fetchMoreResult.repository.issue.comments.edges,
          ],
        },
      },
    },
  };
};

const CommentList = ({ repositoryOwner, repositoryName, issue }) => (
  <Query
    query={GET_COMMENTS_OF_ISSUE}
    variables={{
      repositoryOwner,
      repositoryName,
      number: issue.number,
    }}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { repository } = data;

      if (loading && !repository) {
        return <Loading />;
      }

      return (
        <div className="CommentList">
          {repository.issue.comments.edges.map(({ node }) => (
            <CommentItem key={node.id} comment={node} />
          ))}

          <FetchMore
            loading={loading}
            hasNextPage={
              repository.issue.comments.pageInfo.hasNextPage
            }
            variables={{
              cursor: repository.issue.comments.pageInfo.endCursor,
              repositoryOwner,
              repositoryName,
              number: issue.number,
            }}
            updateQuery={updateQuery}
            fetchMore={fetchMore}
          >
            Comments
          </FetchMore>

          <CommentAdd issueId={repository.issue.id} />
        </div>
      );
    }}
  </Query>
);

export default CommentList;
