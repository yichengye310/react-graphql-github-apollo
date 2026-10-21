import React from 'react';
import {useMutation} from '@apollo/client';

import REPOSITORY_FRAGMENT from '../fragments';
import Link from '../../Link';
import Button from '../../Button';

import '../style.css';

import {
    STAR_REPOSITORY,
    UNSTAR_REPOSITORY,
    WATCH_REPOSITORY,
} from '../mutations';
import {ADD_COMMENT} from '../../Comment/CommentAdd/mutations';

const VIEWER_SUBSCRIPTIONS = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription =>
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
    client,
    {
        data: {
            updateSubscription: {
                subscribable: {id, viewerSubscription},
            },
        },
    },
) => {
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    });

    let {totalCount} = repository.watchers;
    totalCount =
        viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
            ? totalCount + 1
            : totalCount - 1;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            watchers: {
                ...repository.watchers,
                totalCount,
            },
        },
    });
};

const updateAddStar = (
    client,
    {
        data: {
            addStar: {
                starrable: {id, viewerHasStarred},
            },
        },
    },
) =>
    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: getUpdatedStarData(client, id, viewerHasStarred),
    });

const updateRemoveStar = (
    client,
    {
        data: {
            removeStar: {
                starrable: {id, viewerHasStarred},
            },
        },
    },
) => {
    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: getUpdatedStarData(client, id, viewerHasStarred),
    });
};

const getUpdatedStarData = (client, id, viewerHasStarred) => {
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    });

    let {totalCount} = repository.stargazers;
    totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

    return {
        ...repository,
        stargazers: {
            ...repository.stargazers,
            totalCount,
        },
    };
};

const RepositoryItem = ({
                            id,
                            name,
                            url,
                            descriptionHTML,
                            primaryLanguage,
                            owner,
                            stargazers,
                            watchers,
                            viewerSubscription,
                            viewerHasStarred,
                        }) => {
    const [updateSubscription, {}] = useMutation(WATCH_REPOSITORY, {
        variables: {
            id,
            viewerSubscription: isWatch(viewerSubscription)
                ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
        }, optimisticResponse: {
            updateSubscription: {
                __typename: 'Mutation',
                subscribable: {
                    __typename: 'Repository',
                    id,
                    viewerSubscription: isWatch(viewerSubscription)
                        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
                },
            },
        },
        update: {updateWatch}
    });

    const [addStar, {}] = useMutation(STAR_REPOSITORY, {
        variables: {id},
        optimisticResponse: {
            addStar: {
                __typename: 'Mutation',
                starrable: {
                    __typename: 'Repository',
                    id,
                    viewerHasStarred: !viewerHasStarred,
                },
            },
        },
        update: {updateAddStar}
    });

    const [removeStar, {}] = useMutation(STAR_REPOSITORY, {
        variables: {id},
        optimisticResponse: {
            removeStar: {
                __typename: 'Mutation',
                starrable: {
                    __typename: 'Repository',
                    id,
                    viewerHasStarred: !viewerHasStarred,
                },
            },
        },
        update: {updateRemoveStar}
    });

    return (<div>
        <div className="RepositoryItem-title">
            <h2>
                <Link href={url}>{name}</Link>
            </h2>

            <div>
                <Button
                    className="RepositoryItem-title-action"
                    data-test-id="updateSubscription"
                    onClick={updateSubscription}
                >
                    {watchers.totalCount}{' '}
                    {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
                </Button>

                {!viewerHasStarred ?
                    <Button
                        className={'RepositoryItem-title-action'}
                        onClick={addStar}
                    >
                        {stargazers.totalCount} Star
                    </Button>
                    :
                    <Button
                        className="RepositoryItem-title-action"
                        onClick={removeStar}
                    >
                        {stargazers.totalCount} Unstar
                    </Button>
                }
            </div>
        </div>

        <div className="RepositoryItem-description">
            <div
                className="RepositoryItem-description-info"
                dangerouslySetInnerHTML={{__html: descriptionHTML}}
            />
            <div className="RepositoryItem-description-details">
                <div>
                    {primaryLanguage && (
                        <span>Language: {primaryLanguage.name}</span>
                    )}
                </div>
                <div>
                    {owner && (
                        <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
                    )}
                </div>
            </div>
        </div>
    </div>);
};

export default RepositoryItem;
