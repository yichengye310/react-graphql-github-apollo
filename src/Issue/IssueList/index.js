import React from 'react';
import {useQuery, useApolloClient} from '@apollo/client';
import {withState} from 'recompose';

import {GET_ISSUES_OF_REPOSITORY} from './queries';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import {ButtonUnobtrusive} from '../../Button';

import './style.css';
import {GET_COMMENTS_OF_ISSUE} from '../../Comment/CommentList/queries';

const ISSUE_STATES = {
    NONE: 'NONE',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
    [ISSUE_STATES.NONE]: 'Show Open Issues',
    [ISSUE_STATES.OPEN]: 'Show Closed Issues',
    [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
    [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
    [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
    [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const updateQuery = (previousResult, {fetchMoreResult}) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    return {
        ...previousResult,
        repository: {
            ...previousResult.repository,
            issues: {
                ...previousResult.repository.issues,
                ...fetchMoreResult.repository.issues,
                edges: [
                    ...previousResult.repository.issues.edges,
                    ...fetchMoreResult.repository.issues.edges,
                ],
            },
        },
    };
};

const prefetchIssues = (
    client,
    repositoryOwner,
    repositoryName,
    issueState,
) => {
    const nextIssueState = TRANSITION_STATE[issueState];

    if (isShow(nextIssueState)) {
        client.query({
            query: GET_ISSUES_OF_REPOSITORY,
            variables: {
                repositoryOwner,
                repositoryName,
                issueState: nextIssueState,
            },
        });
    }
};

const Issues = ({
                    repositoryOwner,
                    repositoryName,
                    issueState,
                    onChangeIssueState,
                }) => {
    const {loading, error, data, fetchMore} = useQuery(GET_ISSUES_OF_REPOSITORY, {
        variables: {
            repositoryOwner,
            repositoryName,
            issueState,
        }, notifyOnNetworkStatusChange: true,
    });
    return (<div className="Issues">
        <IssueFilter
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            issueState={issueState}
            onChangeIssueState={onChangeIssueState}
        />

        {isShow(issueState) && (
            <div>
                {() => {
                    if (error) {
                        return <ErrorMessage error={error}/>;
                    }

                    const {repository} = data;

                    if (loading && !repository) {
                        return <Loading/>;
                    }

                    if (!repository.issues.edges.length) {
                        return <div className="IssueList">No issues ...</div>;
                    }

                    return (
                        <IssueList
                            issues={repository.issues}
                            loading={loading}
                            repositoryOwner={repositoryOwner}
                            repositoryName={repositoryName}
                            issueState={issueState}
                            fetchMore={fetchMore}
                        />
                    );
                }}
            </div>
        )}
    </div>);
};

const IssueFilter = ({
                         repositoryOwner,
                         repositoryName,
                         issueState,
                         onChangeIssueState,
                     }) => {
    const client = useApolloClient();
    return (<ButtonUnobtrusive
        onClick={() =>
            onChangeIssueState(TRANSITION_STATE[issueState])
        }
        onMouseOver={() =>
            prefetchIssues(
                client,
                repositoryOwner,
                repositoryName,
                issueState,
            )
        }
    >
        {TRANSITION_LABELS[issueState]}
    </ButtonUnobtrusive>);
};

const IssueList = ({
                       issues,
                       loading,
                       repositoryOwner,
                       repositoryName,
                       issueState,
                       fetchMore,
                   }) => (
    <div className="IssueList">
        {issues.edges.map(({node}) => (
            <IssueItem
                key={node.id}
                issue={node}
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
            />
        ))}

        <FetchMore
            loading={loading}
            hasNextPage={issues.pageInfo.hasNextPage}
            variables={{
                cursor: issues.pageInfo.endCursor,
                repositoryOwner,
                repositoryName,
                issueState,
            }}
            updateQuery={updateQuery}
            fetchMore={fetchMore}
        >
            Issues
        </FetchMore>
    </div>
);

export default withState(
    'issueState',
    'onChangeIssueState',
    ISSUE_STATES.NONE,
)(Issues);
