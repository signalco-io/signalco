'use client';

import { useEffect, useState } from 'react';
import { arrayMax, orderBy } from '@signalco/js';
import { useWindowRect } from '@signalco/hooks/useWindowRect';
import { CommentItemPosition } from '../components/@types/Comments';


export function useCommentItemRects(commentSelection: CommentItemPosition | null | undefined) {
    const [selectionRects, setSelectionRects] = useState<DOMRect[]>([]);

    const windowRect = useWindowRect(window);

    useEffect(() => {
        if (!commentSelection) {
            setSelectionRects([]);
            return;
        }

        if (commentSelection.type !== 'text') {
            const element = commentSelection?.selector?.length
                ? document.querySelector(commentSelection.selector)
                : undefined;

            if (!element) {
                setSelectionRects([]);
                return;
            }

            const rects = [...element.getClientRects()];
            const lastRect = orderBy(rects, r => r.bottom).at(-1);

            const calculatedRect = new DOMRect(
                (lastRect?.left ?? 0) + (lastRect?.width ?? 0) * commentSelection.xNormal,
                (lastRect?.top ?? 0) + (lastRect?.height ?? 0) * commentSelection.yNormal,
                1,
                1
            );

            setSelectionRects([calculatedRect]);
        } else if (commentSelection.type === 'text') {
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
            const isReversed = (arrayMax([...startElement.getClientRects()], r => r?.top ?? 0) ?? 0) >
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
        }
    }, [commentSelection, windowRect]);

    return selectionRects;
}
