import React, {useState} from 'react';
import { useMutation } from '@apollo/client/react';

import {ADD_COMMENT} from './mutations';

import TextArea from '../../TextArea';
import Button from '../../Button';
import ErrorMessage from '../../Error';

const CommentAdd = ({issueId}) => {
    const [value, setValue] = useState('');
    const [addComment, {error}] = useMutation(ADD_COMMENT, {
        variables: {
            body: value,
            subjectId: issueId
        }
    });
    return (
        <div>
            {error && <ErrorMessage error={error}/>}
            <form onSubmit={e => {
                addComment().then(() => setValue(''));
            }}>
                <TextArea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Leave a comment"
                />
                <Button type="submit">Comment</Button>
            </form>
        </div>
    );
};

export default CommentAdd;
