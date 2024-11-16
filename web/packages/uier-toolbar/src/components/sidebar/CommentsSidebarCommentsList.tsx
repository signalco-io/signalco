import { Stack } from '@signalco/ui-primitives/Stack';
import { CommentThread } from '../CommentThread';
import { CommentItem } from '../@types/Comments';
import { useComments } from '../../hooks/useComments';

export function CommentsSidebarCommentsList() {
    const { query, upsert } = useComments();
    const { data: comments } = query;

    const handleResolveComment = async (commentItem: CommentItem) => {
        await upsert.mutateAsync({
            ...commentItem,
            resolved: true
        });
    };

    return (
        <Stack spacing={1}>
            {!comments?.length && (
                <div className="py-4 text-center text-muted-foreground">No comments</div>
            )}
            {comments?.map((commentItem) => (
                <div className="rounded-xl border" key={commentItem.id}>
                    <CommentThread key={commentItem.id} commentItem={commentItem} onResolve={() => handleResolveComment(commentItem)} />
                </div>
            ))}
        </Stack>
    );
}