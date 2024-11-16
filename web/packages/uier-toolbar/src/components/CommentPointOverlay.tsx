import { useRef } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { getElementSelector } from '@signalco/js';
import { useWindowEvent } from '@signalco/hooks/useWindowEvent';
import { CommentPoint } from './@types/Comments';

type CommentPointOverlayProps = {
    onPoint: (commentPoint: CommentPoint) => void;
};

export function CommentPointOverlay({ onPoint }: CommentPointOverlayProps) {
    const hoveredElement = useRef<Element>();

    useWindowEvent('mousemove', (e) => {
        hoveredElement.current = window.document.elementsFromPoint(e.clientX, e.clientY)
            ?.filter(el => el && el.id != 'uier-toolbar' && !el.classList.contains('review-overlay'))
            .at(0);
    });

    useWindowEvent('click', (event: MouseEvent) => {
        const el = hoveredElement.current;
        if (!el) return;

        const selector = getElementSelector(el);
        const elBounds = el.getBoundingClientRect();
        const relativeX = event.clientX - elBounds.left;
        const relativeY = event.clientY - elBounds.top;

        onPoint({
            type: 'point',
            selector,
            xNormal: relativeX / elBounds.width,
            yNormal: relativeY / elBounds.height
        });
    });

    return (
        <div className={cx(
            'review-overlay',
            'select-none fixed top-0 left-0 w-full h-full z-50',
            'cursor-[url("data:image/svg+xml;utf8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M31%2016C31%2024.2843%2024.2843%2031%2016%2031C7.71574%2031%201.00001%2024.2843%201.00001%2016L1.00003%206.40219L1.00004%201.90082L1.00004%201L1.85657%201L6.28413%201L16%201.00001C24.2843%201.00001%2031%207.71574%2031%2016Z%22%20fill%3D%22black%22%20stroke%3D%22white%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M9%2016H23%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3Cpath%20d%3D%22M16%209V23%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E"),auto]'
        )} />
    );
}
