'use client';

import { HTMLAttributes } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { useCommentItemRects } from '../hooks/useCommentItemRects';
import { CommentSelection } from './@types/Comments';

type CommentSelectionHighlightProps = HTMLAttributes<HTMLDivElement> & {
    commentSelection: CommentSelection;
};

export function CommentSelectionHighlight({
    commentSelection, className, style
}: CommentSelectionHighlightProps) {
    const selectionRects = useCommentItemRects(commentSelection);
    return (
        <>
            {selectionRects?.map((rect, i) => (
                <div
                    key={i}
                    className={cx(
                        'fixed select-none bg-red-400 opacity-40 pointer-events-none',
                        className
                    )}
                    style={{
                        left: rect.left,
                        top: rect.top + (rect.height < 12 ? 0 : 4),
                        width: rect.width,
                        height: rect.height - (rect.height < 12 ? 0 : 8),
                        willChange: 'left, top',
                        ...style
                    }} />
            ))}
        </>
    );
}
