'use client';

import { HTMLAttributes, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Card } from '@signalco/ui-primitives/Card';
import { Check, Delete, Send } from '@signalco/ui-icons';
import { orderBy } from '@signalco/js';
import { useComments } from './useComments';
import { useCommentItemRects } from './useCommentItemRects';
import { CommentSelectionHighlight } from './CommentSelectionHighlight';
import { CommentItem } from './Comments';
import { CommentIcon } from './CommentIcon';

type CommentBubbleProps = HTMLAttributes<HTMLDivElement> & {
    commentItem: CommentItem;
};

export function CommentBubble({
    commentItem, className, style
}: CommentBubbleProps) {
    const selectionRects = useCommentItemRects(commentItem.position);
    const lastRect = orderBy(selectionRects, r => r.bottom).at(-1);
    const { upsert } = useComments();

    const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await upsert.mutateAsync({
            ...commentItem,
            thread: {
                ...commentItem.thread,
                items: [
                    ...commentItem.thread.items,
                    {
                        id: Math.random().toString(),
                        text: formData.get('text') as string
                    }
                ]
            }
        });
    };

    const handleResolveComment = async () => {
        await upsert.mutateAsync({
            ...commentItem,
            resolved: true
        });
    };

    const [open, setOpen] = useState(false);

    return (
        <>
            {commentItem.position.type === 'text' && (
                <CommentSelectionHighlight commentSelection={commentItem.position} />
            )}
            <Popper
                trigger={(
                    <div
                        role="button"
                        className={cx(
                            'fixed z-[48] hover:z-[49] cursor-pointer',
                            className
                        )}
                        style={{
                            left: (lastRect?.right ?? 0) + 16,
                            top: (lastRect?.bottom ?? 0) + 16,
                            transform: 'translate(-50%, -50%)',
                            ...style
                        }}>
                        <CommentIcon className="hover:scale-110 hover:brightness-75" />
                        <span
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                            {commentItem.thread.items.length}
                        </span>
                    </div>
                )}
                side="right"
                open={open}
                onOpenChange={setOpen}
            >
                <Card>
                    <Stack spacing={2}>
                        <Row>
                            <IconButton variant="plain" onClick={handleResolveComment}>
                                <Check />
                            </IconButton>
                        </Row>
                        {commentItem.thread.items.map((comment, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-sm">{comment.text}</span>
                            </div>
                        ))}
                        <form onSubmit={handleCreateComment}>
                            <Stack spacing={1}>
                                <Input name="text" placeholder="Leave comment..." autoFocus />
                                <Row justifyContent="space-between">
                                    <div></div>
                                    <IconButton variant="solid" size="sm" type="submit">
                                        <Send />
                                    </IconButton>
                                </Row>
                            </Stack>
                        </form>
                    </Stack>
                </Card>
            </Popper>
        </>
    );
}
