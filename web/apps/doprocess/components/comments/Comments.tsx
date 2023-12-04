'use client';

import { createPortal } from 'react-dom';
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

type CommentSelection = {
    text: string;
    startSelector: string;
    startOffset: number;
    startType: 'text' | 'element';
    endSelector?: string;
    endOffset: number;
    endType: 'text' | 'element';
}

export function CommentsGlobal() {
    const [commentSelection, setCommentSelection] = useState<CommentSelection>();

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

        setCommentSelection({
            text,
            startSelector: getElementSelector(selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement),
            startOffset: selection.anchorOffset,
            startType: selection.anchorNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element',
            endSelector: getElementSelector(selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement),
            endOffset: selection.focusOffset,
            endType: selection.focusNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element'
        });
    });

    const [focusedEl, setFocusedEl] = useState<DOMRect[]>([]);
    useEffect(() => {
        if (!commentSelection) {
            setFocusedEl([]);
            return;
        }

        const startElement = commentSelection?.startSelector?.length
            ? document.querySelector(commentSelection.startSelector)
            : undefined;
        const endElement = commentSelection?.endSelector?.length
            ? document.querySelector(commentSelection.endSelector)
            : startElement;

        if (!startElement || !endElement) {
            setFocusedEl([]);
            return;
        }

        const startElementOrTextNode = commentSelection.startType === 'text' ? startElement.childNodes[0] : startElement;
        const endElementOrTextNode = commentSelection.endType === 'text' ? endElement.childNodes[0] : endElement;

        if (!startElementOrTextNode || !endElementOrTextNode) {
            setFocusedEl([]);
            return;
        }

        // TODO: Fix reverse order of start/end elements
        const range = document.createRange();
        const startOffset = startElementOrTextNode === endElementOrTextNode && commentSelection.startOffset > commentSelection.endOffset
            ? commentSelection.endOffset
            : commentSelection.startOffset;
        const endOffset = startElementOrTextNode === endElementOrTextNode && commentSelection.startOffset > commentSelection.endOffset
            ? commentSelection.startOffset
            : commentSelection.endOffset;
        range.setStart(startElementOrTextNode, startOffset);
        range.setEnd(endElementOrTextNode, endOffset);
        setFocusedEl([...range.getClientRects()]);
    }, [commentSelection]);

    const lastRangeRect = orderBy(focusedEl, rr => rr.bottom).at(-1);
    const {bottom, top, right} = lastRangeRect ?? {bottom: 0, top: 0, right: 0};
    const leftFixed = Math.min(window.innerWidth - popoverWidth / 2 - popoverWindowMargin, Math.max(popoverWidth / 2 + popoverWindowMargin, right ?? 0));
    const topFixed = (bottom ?? 0) + popoverHeight + 20 + popoverWindowMargin > window.innerHeight
        ? window.scrollY + (top ?? 0) - popoverHeight - 40
        : window.scrollY + (bottom ?? 0) + 20;

    return (
        <>
            <div
                ref={resizeObserverRef}
                className={cx(
                    'absolute bg-card border w-72 rounded-full p-2 -translate-x-1/2 opacity-0',
                    commentSelection && 'opacity-100'
                )}
                style={{ left: leftFixed, top: topFixed }}>
                <div>Comment</div>
            </div>
            {focusedEl?.map((rect, i) => (
                <div
                    key={i}
                    className="pointer-events-none fixed select-none bg-red-400 opacity-40"
                    onSelectCapture={() => false}
                    onSelect={() => false}
                    onDragStart={() => false}
                    style={{
                        left: rect.left,
                        top: rect.top + rect.height * 0.1,
                        width: rect.width,
                        height: rect.height * 0.8
                    }} />
            ))}
        </>
    );
}
