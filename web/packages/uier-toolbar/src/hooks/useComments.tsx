'use client';

import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from '../components/Comments';

export function useComments(): {
    query: UseQueryResult<CommentItem[], Error>;
    upsert: UseMutationResult<string, Error, CommentItem, unknown>;
    delete: UseMutationResult<void, Error, string, unknown>;
} {
    const client = useQueryClient();
    const query = useQuery({
        queryKey: ['comments'],
        queryFn: () => {
            const comments = JSON.parse(localStorage.getItem('comments') ?? '[]') as CommentItem[];
            return comments.filter((c: CommentItem) => !c.resolved);
        }
    });

    const mutateUpsert = useMutation({
        mutationFn: async (comment: CommentItem) => {
            const comments = JSON.parse(localStorage.getItem('comments') ?? '[]') as CommentItem[];
            if (!comment.id) {
                comment.id = 'mock' + Math.random() + Date.now();
            }
            const currentComment = comments.find((c: CommentItem) => Boolean(comment.id) && c.id === comment.id);
            if (currentComment) {
                Object.assign(currentComment, comment);
            } else {
                comments.push(comment);
            }
            localStorage.setItem('comments', JSON.stringify(comments));
            client.invalidateQueries({
                queryKey: ['comments']
            });
            return comment.id;
        }
    });

    const mutateDelete = useMutation({
        mutationFn: async (id: string) => {
            const comments = JSON.parse(localStorage.getItem('comments') ?? '[]') as CommentItem[];
            const currentComment = comments.find((c: CommentItem) => c.id === id);
            if (currentComment) {
                comments.splice(comments.indexOf(currentComment), 1);
            }
            localStorage.setItem('comments', JSON.stringify(comments));
        },
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
