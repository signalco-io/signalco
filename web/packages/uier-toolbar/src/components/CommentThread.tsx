import { Fragment, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { CommentThreadItem } from './CommentThreadItem';
import { CommentItem } from './Comments';

export function CommentThread({ commentItem, onResolve }: { commentItem: CommentItem; onResolve?: () => void; }) {
    const [expanded, setExpanded] = useState(false);
    if (!commentItem.thread.items.length) return null;

    const fistComment = commentItem.thread.items[0];
    const lastComment = commentItem.thread.items.length > 1 ? commentItem.thread.items.at(-1) : null;
    const restComments = commentItem.thread.items.slice(1, -1);

    return (
        <Stack className="py-2">
            {fistComment && (
                <>
                    <div className="px-4 py-2 pb-3">
                        <CommentThreadItem
                            first
                            comment={fistComment}
                            onDone={onResolve} />
                    </div>
                    {lastComment && <Divider />}
                </>
            )}
            {expanded && restComments.map((comment, i) => (
                <Fragment key={comment.id}>
                    <div className="px-4 py-3">
                        <CommentThreadItem
                            comment={comment}
                            onDone={onResolve} />
                    </div>
                    <Divider />
                </Fragment>
            ))}
            {!expanded && restComments.length > 0 && (
                <Button
                    variant="plain"
                    onClick={() => setExpanded(true)}>
                    Show all ({restComments.length} more)...
                </Button>
            )}
            {lastComment && (
                <>
                    {!expanded && restComments.length > 0 && <Divider />}
                    <div className="px-4 py-2 pt-3">
                        <CommentThreadItem
                            comment={lastComment}
                            onDone={onResolve} />
                    </div>
                </>
            )}
        </Stack>
    );
}
