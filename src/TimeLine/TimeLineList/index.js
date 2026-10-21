import React, {Fragment} from 'react';
import TimeLineItem from '../TimeLineItem';
import FetchMore from '../../FetchMore';

const getUpdateQuery = entry => (
    previousResult,
    {fetchMoreResult},
) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    return {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges,
                ],
            },
        },
    };
};


const TimeLineList = ({
                          repositories,
                          loading,
                          fetchMore,
                          entry,
                      }) => (
    <Fragment>
        <div className="timeline">
            {repositories.edges.map(({node}) => (
                <div key={node.id}>
                    <TimeLineItem {...node} />
                </div>
            ))}
        </div>
        <FetchMore
            loading={loading}
            hasNextPage={repositories.pageInfo.hasNextPage}
            variables={{
                cursor: repositories.pageInfo.endCursor,
            }}
            updateQuery={getUpdateQuery(entry)}
            fetchMore={fetchMore}
        >
            Repositories
        </FetchMore>
    </Fragment>
);

export default TimeLineList;
