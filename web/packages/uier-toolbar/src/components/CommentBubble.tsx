'use client';

import React, { HTMLAttributes, useContext, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';
import { Send } from '@signalco/ui-icons';
import { orderBy } from '@signalco/js';
import { useComments } from '../hooks/useComments';
import { useCommentItemRects } from '../hooks/useCommentItemRects';
import { CommentThread } from './CommentThread';
import { CommentSelectionHighlight } from './CommentSelectionHighlight';
import { CommentsBootstrapperContext } from './CommentsBootstrapperContext';
import { CommentIcon } from './CommentIcon';
import { CommentItem } from './@types/Comments';

type CommentBubbleProps = HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    creating?: boolean;
    onCreated?: (commentItemId: string) => void;
    onCanceled?: () => void;
    commentItem: CommentItem;
};

export function CommentBubble({
    defaultOpen, creating, onCreated, onCanceled, commentItem, className, style
}: CommentBubbleProps) {
    const { rootElement } = useContext(CommentsBootstrapperContext);
    const selectionRects = useCommentItemRects(commentItem.position);
    const lastRect = orderBy(selectionRects, r => r.bottom).at(-1);
    const { upsert } = useComments();

    const handleResolveComment = async () => {
        await upsert.mutateAsync({
            ...commentItem,
            resolved: true
        });
    };

    const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        e.currentTarget.reset();
        const { id } = await upsert.mutateAsync({
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

        if (creating) {
            onCreated?.(id);
        }
    };

    const [open, setOpen] = useState(creating ?? defaultOpen);
    const handleOpenChange = (open: boolean) => {
        if (!open && creating) {
            onCanceled?.();
        }
        setOpen(open);
    }

    return (
        <>
            {commentItem.position.type === 'text' && (
                <CommentSelectionHighlight commentSelection={commentItem.position} />
            )}
            <Popper
                container={rootElement}
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
                            willChange: 'left, top',
                            ...style
                        }}>
                        <CommentIcon className="hover:scale-110 hover:brightness-75" />
                        <span
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white">
                            {commentItem.thread.items.length}
                        </span>
                    </div>
                )}
                className="bg-background text-primary"
                sideOffset={-32}
                align="start"
                alignOffset={32}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <div>
                    <Stack>
                        <Stack className="max-h-96 overflow-y-scroll">
                            <CommentThread
                                commentItem={commentItem}
                                onResolve={handleResolveComment} />
                            <Divider />
                        </Stack>
                        <form onSubmit={handleCreateComment}>
                            <Stack className="bg-card px-1 py-4 pt-2">
                                <Input
                                    variant="plain"
                                    name="text"
                                    placeholder="Leave comment..."
                                    autoFocus
                                    autoComplete={'off'} />
                                <Row justifyContent="space-between" className="px-3">
                                    <div></div>
                                    <IconButton variant="solid" size="xs" type="submit" aria-label="Leave comment">
                                        <Send />
                                    </IconButton>
                                </Row>
                            </Stack>
                        </form>
                    </Stack>
                </div>
            </Popper>
        </>
    );
}
