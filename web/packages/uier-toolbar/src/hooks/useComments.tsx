import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from '../components/@types/Comments';

// TODO: Call API
async function getComments() {
    const response = await fetch('https://uier.io/api/comments');
    const comments = await response.json() as CommentItem[];
    return comments.filter(c => !c.resolved);
}

// TODO: Call API
async function upsertComment(comment: CommentItem) {
    const response = await fetch('http://uier.io/api/comments', {
        method: 'POST',
        body: JSON.stringify({
            id: comment.id,
            domain: window.location.host,
            path: window.location.pathname + window.location.search, // TODO: Exclude review param from search
            position: comment.position,
            thread: comment.thread,
            device: comment.device,
            resolved: comment.resolved
        })
    });
    const { id } = await response.json();
    if (!id) {
        throw new Error('Failed to create comment');
    }

    return id;
}

// TODO: Call API
async function deleteComment(id: string) {
    // const comments = JSON.parse(localStorage.getItem('comments') ?? '[]') as CommentItem[];
    // const currentComment = comments.find((c: CommentItem) => c.id === id);
    // if (currentComment) {
    //     comments.splice(comments.indexOf(currentComment), 1);
    // }
    // localStorage.setItem('comments', JSON.stringify(comments));
    throw new Error('Not implemented');
}

export function useComments(): {
    query: UseQueryResult<CommentItem[], Error>;
    upsert: UseMutationResult<{ id: string, isNew: boolean }, Error, CommentItem, unknown>;
    delete: UseMutationResult<void, Error, string, unknown>;
} {
    const client = useQueryClient();
    const query = useQuery({
        queryKey: ['comments'],
        queryFn: getComments
    });

    const mutateUpsert = useMutation({
        mutationFn: async (comment: CommentItem) => {
            const id = await upsertComment(comment);
            console.log('mutated', id, comment.id, comment.id !== id)
            return ({
                id,
                isNew: comment.id !== id
            });
        },
        onSuccess: (id) => {
            if (id) {
                client.invalidateQueries({
                    queryKey: ['comments']
                });
            } else {
                client.invalidateQueries({
                    queryKey: ['comments', id]
                });
            }
        }
    });

    const mutateDelete = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ['comments']
            });
        }
    })

    return {
        query, upsert: mutateUpsert, delete: mutateDelete
    };
}
