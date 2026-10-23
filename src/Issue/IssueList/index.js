import React, {useState} from 'react';
import {useQuery, useApolloClient} from '@apollo/client';

import {GET_ISSUES_OF_REPOSITORY} from './queries';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import {ButtonUnobtrusive} from '../../Button';

import './style.css';

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
                }) => {

    const [issueState, onChangeIssueState] = useState(ISSUE_STATES.NONE);

    const {loading, error, data, fetchMore} = useQuery(GET_ISSUES_OF_REPOSITORY, {
        variables: {
            repositoryOwner,
            repositoryName,
            issueState,
        }, notifyOnNetworkStatusChange: true, skip: !isShow(issueState),
    });

    const {repository} = data || {};

    return (
        <div className="Issues">
            <IssueFilter
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
                issueState={issueState}
                onChangeIssueState={onChangeIssueState}
            />
            {isShow(issueState) && error && <ErrorMessage error={error}/>}
            {isShow(issueState) && (loading && !repository) && <Loading/>}
            {isShow(issueState) && !repository?.issues?.edges?.length && <div className="IssueList">No issues ...</div>}
            {isShow(issueState) && <IssueList
                issues={repository?.issues}
                loading={loading}
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
                issueState={issueState}
                fetchMore={fetchMore}
            />}
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
                   }) => {

    const [isShowComments, onShowComments] = React.useState(false);

    return (<div className="IssueList">
        {issues?.edges?.map(({node}) => (
            <IssueItem
                key={node.id}
                issue={node}
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
                isShowComments={isShowComments}
                onShowComments={onShowComments}
            />
        ))}

        <FetchMore
            loading={loading}
            hasNextPage={issues?.pageInfo?.hasNextPage}
            variables={{
                cursor: issues?.pageInfo?.endCursor,
                repositoryOwner,
                repositoryName,
                issueState,
            }}
            updateQuery={updateQuery}
            fetchMore={fetchMore}
        >
            Issues
        </FetchMore>
    </div>);
};

export default Issues;
