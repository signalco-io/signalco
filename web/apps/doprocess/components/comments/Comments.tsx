'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cx } from '@signalco/ui-primitives/cx';
import { getElementSelector, orderBy } from '@signalco/js';
import { useWindowEvent } from '@signalco/hooks/useWindowEvent';
import { useDocumentEvent } from '@signalco/hooks/useDocumentEvent';
import { useResizeObserver } from '@enterwell/react-hooks';

const popoverWidth = 288;
const popoverWindowMargin = 8;

export const Comments = dynamic(() => import('./Comments').then(m => m.CommentsGlobal), { ssr: false });

export function CommentsGlobal() {
    const [commentSelection, setCommentSelection] = useState<{
        right: number, bottom: number, top: number, text: string, selector: string
    }>();

    const [popoverHeight, setPopoverHeight] = useState(0);
    const resizeObserverRef = useResizeObserver((_, entry) => {
        setPopoverHeight(entry.contentRect.height);
    });

    useWindowEvent('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && commentSelection) {
            event.stopPropagation();
            event.preventDefault();
            setCommentSelection(undefined);
        }
    });

    useDocumentEvent('selectionchange', () => {
        const selection = window.getSelection();
        const text = selection?.toString();
        if (!selection || !text?.length) {
            setCommentSelection(undefined);
            return;
        }

        const rangesRects = selection.getRangeAt(selection.rangeCount - 1).getClientRects();
        const lastRangeRect = orderBy([...rangesRects], rr => rr.bottom).at(-1);
        console.log('lastRangeRect', lastRangeRect)

        if (!lastRangeRect) {
            setCommentSelection(undefined);
            return;
        }

        setCommentSelection({
            right: lastRangeRect.right,
            bottom: lastRangeRect.bottom,
            top: lastRangeRect.top, text,
            selector: getElementSelector(selection.focusNode?.parentElement)
        });
    });

    const left = Math.min(window.innerWidth - popoverWidth / 2 - popoverWindowMargin, Math.max(popoverWidth / 2 + popoverWindowMargin, commentSelection?.right ?? 0));
    const top = (commentSelection?.bottom ?? 0) + popoverHeight + 20 + popoverWindowMargin > window.innerHeight
        ? window.scrollY + (commentSelection?.top ?? 0) - popoverHeight - 40
        : window.scrollY + (commentSelection?.bottom ?? 0) + 20;

    console.log((commentSelection?.top ?? 0) + popoverHeight, popoverHeight, window.innerHeight)

    // selectionRange: { startContainerNodeSelector, endContainerNodeSelector, text, startOffset, endOffset }

    const [focusedEl, setFocusedEl] = useState<Element>();
    useEffect(() => {
        const el = commentSelection?.selector ? document.querySelector(commentSelection.selector) : undefined;
        setFocusedEl((curr) => {
            curr?.classList.remove('border');
            el?.classList.add('border');
            return el ?? undefined;
        });
    }, [commentSelection?.selector]);

    return (
        <div
            ref={resizeObserverRef}
            className={cx(
                'absolute bg-card border w-72 rounded-full p-2 -translate-x-1/2 opacity-0',
                commentSelection && 'opacity-100'
            )}
            style={{ left, top }}>
            <div>Comment</div>
            <div>{commentSelection?.selector}</div>
        </div>
    );
}
