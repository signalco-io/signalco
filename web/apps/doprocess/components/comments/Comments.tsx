'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { nanoid } from 'nanoid';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Comment } from '@signalco/ui-icons';
import { arrayMax, getElementSelector, orderBy } from '@signalco/js';
import { useWindowRect } from '@signalco/hooks/useWindowRect';
import { useWindowEvent } from '@signalco/hooks/useWindowEvent';
import { useDocumentEvent } from '@signalco/hooks/useDocumentEvent';
import { useResizeObserver } from '@enterwell/react-hooks';

const popoverWidth = 288;
const popoverWindowMargin = 8;

export const Comments = dynamic(() => import('./Comments').then(m => m.CommentsGlobal), { ssr: false });

type CommentSelection = {
    id?: string;
    text: string;
    startSelector: string;
    startOffset: number;
    startType: 'text' | 'element';
    endSelector?: string;
    endOffset: number;
    endType: 'text' | 'element';
}

function useCommentSelectionRects(commentSelection: CommentSelection | null | undefined) {
    const [selectionRects, setSelectionRects] = useState<DOMRect[]>([]);

    const rect = useWindowRect(window);

    useEffect(() => {
        if (!commentSelection) {
            setSelectionRects([]);
            return;
        }

        const startElement = commentSelection?.startSelector?.length
            ? document.querySelector(commentSelection.startSelector)
            : undefined;
        const endElement = commentSelection?.endSelector?.length
            ? document.querySelector(commentSelection.endSelector)
            : startElement;

        if (!startElement || !endElement) {
            setSelectionRects([]);
            return;
        }

        const startElementOrTextNode = commentSelection.startType === 'text'
            ? startElement.childNodes[0]
            : startElement;
        const endElementOrTextNode = commentSelection.endType === 'text'
            ? endElement.childNodes[0]
            : endElement;

        if (!startElementOrTextNode || !endElementOrTextNode) {
            setSelectionRects([]);
            return;
        }

        // Fix reverse order of start/end elements
        const isReversed =
            (arrayMax([...startElement.getClientRects()], r => r?.top ?? 0) ?? 0) >
            (arrayMax([...endElement.getClientRects()], r => r?.top ?? 0) ?? 0);
        const firstElementOrTextNode = isReversed ? endElementOrTextNode : startElementOrTextNode;
        const lastElementOrTextNode = isReversed ? startElementOrTextNode : endElementOrTextNode;

        const range = document.createRange();
        const startOffset = isReversed || (firstElementOrTextNode === lastElementOrTextNode && commentSelection.startOffset > commentSelection.endOffset)
            ? commentSelection.endOffset
            : commentSelection.startOffset;
        const endOffset = isReversed || (firstElementOrTextNode === lastElementOrTextNode && commentSelection.startOffset > commentSelection.endOffset)
            ? commentSelection.startOffset
            : commentSelection.endOffset;

        range.setStart(firstElementOrTextNode, Math.min(startOffset, firstElementOrTextNode.textContent?.length ?? 0));
        range.setEnd(lastElementOrTextNode, Math.min(endOffset, lastElementOrTextNode.textContent?.length ?? 0));
        setSelectionRects([...range.getClientRects()]);
    }, [commentSelection, rect]);

    return selectionRects;
}

function CommentCursor(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            {...props}
        >
            <path fill="#000" stroke="#fff" d="M.5.5h11v11H.5z" />
            <circle cx={12} cy={12} r={11.5} fill="#000" stroke="#fff" />
            <path fill="#000" d="M1 1h11v11H1z" />
        </svg>
    );
}

function CommentSelectionHighlight({
    commentSelection, creating, className, style
}: HTMLAttributes<HTMLDivElement> & { commentSelection: CommentSelection, creating?: boolean }) {
    const selectionRects = useCommentSelectionRects(commentSelection);
    const lastRect = orderBy(selectionRects, r => r.bottom).at(-1);
    return (
        <>
            {selectionRects?.map((rect, i) => (
                <div
                    key={i}
                    className={cx(
                        creating && 'pointer-events-none',
                        'fixed select-none bg-red-400 opacity-40',
                        className
                    )}
                    style={{
                        left: rect.left,
                        top: rect.top + (rect.height < 12 ? 0 : 4),
                        width: rect.width,
                        height: rect.height - (rect.height < 12 ? 0 : 8),
                        ...style
                    }} />
            ))}
            {!creating && (
                <div
                    className="fixed"
                    style={{
                        left: (lastRect?.right ?? 0) + 16,
                        top: (lastRect?.bottom ?? 0) + 16,
                        transform: 'translate(-50%, -50%)'
                    }}>
                    <CommentCursor />
                    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-secondary-foreground">1</span>
                </div>
            )}
        </>
    )
}

function CommentPopover({ rects, onCreate }: { rects: DOMRect[], onCreate: () => void }) {
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
                'absolute bg-card border w-72 rounded-full p-1 -translate-x-1/2',
            )}
            style={{ left: leftFixed, top: topFixed }}>
            <div>
                <Tooltip title="Add comment">
                    <IconButton variant="plain" className="rounded-full" onClick={onCreate}>
                        <Comment />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

export function CommentsGlobal() {
    const [creatingCommentSelection, setCreatingCommentSelection] = useState<CommentSelection>();
    const [commentSelections, setCommentSelections] = useState<CommentSelection[]>([]);

    useWindowEvent('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && creatingCommentSelection) {
            event.stopPropagation();
            event.preventDefault();
            setCreatingCommentSelection(undefined);
        }
    });

    useDocumentEvent('selectionchange', () => {
        // Ignore if selection is empty or no selection in document
        const selection = window.getSelection();
        const text = selection?.toString();
        if (!selection || !text?.length) {
            setCreatingCommentSelection(undefined);
            return;
        }

        setCreatingCommentSelection({
            text,
            startSelector: getElementSelector(selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement),
            startOffset: selection.anchorOffset,
            startType: selection.anchorNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element',
            endSelector: getElementSelector(selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement),
            endOffset: selection.focusOffset,
            endType: selection.focusNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element'
        });
    });

    const creatingSelectionRects = useCommentSelectionRects(creatingCommentSelection);

    const handleCreateComment = () => {
        if (!creatingCommentSelection) {
            return;
        }

        setCreatingCommentSelection(undefined);
        setCommentSelections([...commentSelections, {
            id: nanoid(),
            ...creatingCommentSelection
        }]);
    }

    return (
        <>
            {creatingCommentSelection && (
                <CommentSelectionHighlight commentSelection={creatingCommentSelection} creating />
            )}
            {commentSelections.map((commentSelection) => (
                <CommentSelectionHighlight key={commentSelection.id} commentSelection={commentSelection} />
            ))}
            {creatingSelectionRects?.length > 0 && (
                <CommentPopover
                    rects={creatingSelectionRects}
                    onCreate={handleCreateComment} />
            )}
        </>
    );
}
