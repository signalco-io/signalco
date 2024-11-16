'use client';

import { useState } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Comment } from '@signalco/ui-icons';
import { orderBy } from '@signalco/js';
import { useResizeObserver } from '@enterwell/react-hooks';
import { popoverWidth, popoverWindowMargin } from './@types/Comments';

export function CommentSelectionPopover({ rects, onCreate }: { rects: DOMRect[]; onCreate: () => void; }) {
    const [popoverHeight, setPopoverHeight] = useState(0);
    const resizeObserverRef = useResizeObserver((_, entry) => {
        setPopoverHeight(entry.contentRect.height);
    });

    // Calculate position of comment popover
    const lastRangeRect = orderBy(rects, rr => rr.bottom).at(-1);
    const { bottom, top, right } = lastRangeRect ?? { bottom: 0, top: 0, right: 0 };
    const leftFixed = Math.min(window.innerWidth - popoverWidth / 2 - popoverWindowMargin, Math.max(popoverWidth / 2 + popoverWindowMargin, right ?? 0));
    const topFixed = (bottom ?? 0) + popoverHeight + 20 + popoverWindowMargin > window.innerHeight
        ? window.scrollY + (top ?? 0) - popoverHeight - 40
        : window.scrollY + (bottom ?? 0) + 20;

    return (
        <div
            ref={resizeObserverRef}
            className={cx(
                'absolute bg-card border rounded-full p-1 -translate-x-1/2'
            )}
            style={{ left: leftFixed, top: topFixed }}>
            <div>
                <Button
                    title="Add comment"
                    variant="plain"
                    className="gap-2 rounded-full"
                    onClick={onCreate}
                    startDecorator={<Comment />}>
                    Comment...
                </Button>
            </div>
        </div>
    );
}
