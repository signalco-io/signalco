'use client';

import { MouseEventHandler, TouchEventHandler, useRef } from 'react';

export type useResizeOptions = {
    orientation?: 'horizontal' | 'vertical';
    onResize?: (newSize: number) => void;
    minSize?: number;
    maxSize?: number;
};

export function useResizeable({
    orientation: direction = 'horizontal', onResize, minSize = 0, maxSize
}: useResizeOptions) {
    const fixedSideRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef(false);
    const didResize = useRef(false);

    const handleMouseDown: MouseEventHandler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        isResizingRef.current = true;
        didResize.current = false;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart: TouchEventHandler = (event) => {
        event.stopPropagation();
        isResizingRef.current = true;
        didResize.current = false;
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (event: TouchEvent) => {
        handleMove(direction === 'vertical'
            ? event.touches[0].clientX
            : event.touches[0].clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
        handleMove(direction === 'vertical'
            ? event.clientX
            : event.clientY);
    };

    const handleMove = (clientPos: number) => {
        if (!isResizingRef.current) return;

        let newSize: number | undefined = direction === 'vertical'
            ? clientPos - (fixedSideRef.current?.clientLeft ?? 0) - (fixedSideRef.current?.offsetLeft ?? 0) - (handleRef.current?.clientWidth ?? 0) / 2
            : clientPos - (fixedSideRef.current?.clientTop ?? 0) - (fixedSideRef.current?.offsetTop ?? 0) - (handleRef.current?.clientHeight ?? 0) / 2;

        // Correct for min size
        if (newSize < minSize) {
            newSize = minSize;
        }

        const actualMaxSize = maxSize ?? (direction === 'vertical' ? window.innerWidth : window.innerHeight);
        if (newSize > actualMaxSize) {
            newSize = actualMaxSize - ((direction === 'vertical' ? handleRef.current?.clientWidth : handleRef.current?.clientHeight) ?? 0);
        }

        if (fixedSideRef.current && newSize != null) {
            didResize.current = true;
            fixedSideRef.current.style.setProperty(direction === 'vertical' ? 'width' : 'height', `${newSize}px`);
            if (onResize) {
                onResize(newSize);
            }
        }
    };

    const handleTouchEnd = (event: TouchEvent) => {
        if (didResize.current) {
            event.stopPropagation();
        }

        isResizingRef.current = false;

        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (didResize.current) {
            event.preventDefault();
            event.stopPropagation();
        }

        isResizingRef.current = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return {
        fixedSideRef,
        handleRef,
        handlers: {
            handleMouseDown,
            handleTouchStart
        }
    };
}
