'use client';

import { MouseEventHandler, TouchEventHandler, useCallback, useEffect, useRef } from 'react';

export type useResizeOptions = {
    orientation?: 'horizontal' | 'vertical';
    onResize?: (newSize: number) => void;
    minSize?: number;
    maxSize?: number;
    collapsable?: boolean;
    collapsed?: boolean;
    collapseBreakpoint?: number;
    collapsedSize?: number;
    onCollapsedChanged?: (collapsed: boolean) => void;
    disableMobile?: boolean;
};

export function useResizeable({
    orientation: direction = 'horizontal',
    onResize,
    minSize = 0,
    maxSize,
    collapsable,
    collapsed,
    collapseBreakpoint,
    collapsedSize,
    onCollapsedChanged,
    disableMobile
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
        if (event.touches[0]) {
            handleMove(direction === 'vertical'
                ? event.touches[0].clientX
                : event.touches[0].clientY);
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        handleMove(direction === 'vertical'
            ? event.clientX
            : event.clientY);
    };

    const adjustSize = useCallback((newSize: number | undefined) => {
        if (newSize == null || (disableMobile && window.innerWidth < 768)) {
            fixedSideRef.current?.style.setProperty(direction === 'vertical' ? 'width' : 'height', null);
            return;
        }

        // Correct for min size
        const actualMinSize = (collapsable && collapsed) ? (collapsedSize ?? 0) : minSize;
        if (newSize < actualMinSize) {
            newSize = actualMinSize;
        }

        const actualMaxSize = (collapsable && collapsed)
            ? (collapsedSize ?? (direction === 'vertical' ? window.innerWidth : window.innerHeight))
            : (maxSize ?? (direction === 'vertical' ? window.innerWidth : window.innerHeight));
        if (newSize > actualMaxSize) {
            newSize = actualMaxSize;
        }

        if (fixedSideRef.current && newSize != null) {
            didResize.current = true;
            fixedSideRef.current.style.setProperty(direction === 'vertical' ? 'width' : 'height', `${newSize}px`);
            if (onResize) {
                onResize(newSize);
            }
        }
    }, [collapsable, collapsed, collapsedSize, direction, maxSize, minSize, onResize]);

    const handleMove = (clientPos: number) => {
        if (!isResizingRef.current) return;

        const newSize: number | undefined = direction === 'vertical'
            ? clientPos - (fixedSideRef.current?.clientLeft ?? 0) - (fixedSideRef.current?.offsetLeft ?? 0) - (handleRef.current?.clientWidth ?? 0) / 2
            : clientPos - (fixedSideRef.current?.clientTop ?? 0) - (fixedSideRef.current?.offsetTop ?? 0) - (handleRef.current?.clientHeight ?? 0) / 2;

        // Trigger collapse/expand if needed
        const actualCollapseBreakpoint = collapseBreakpoint ?? ((collapsedSize ?? 0) * 3);
        if (collapsable && !collapsed && newSize <= (actualCollapseBreakpoint ?? 0)) {
            onCollapsedChanged?.(true);
            handleTouchEnd();
            handleMouseUp();
            return;
        } else if (collapsable && collapsed && newSize > (collapsedSize ?? 0)) {
            onCollapsedChanged?.(false);
            handleTouchEnd();
            handleMouseUp();
            return;
        }

        adjustSize(newSize);
    };

    const handleTouchEnd = (event?: TouchEvent) => {
        if (didResize.current) {
            event?.stopPropagation();
        }

        isResizingRef.current = false;

        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleMouseUp = (event?: MouseEvent) => {
        if (didResize.current) {
            event?.preventDefault();
            event?.stopPropagation();
        }

        isResizingRef.current = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        adjustSize(direction === 'vertical'
            ? fixedSideRef.current?.clientWidth ?? 0
            : fixedSideRef.current?.clientHeight ?? 0);
    }, [adjustSize, direction]);

    // Handle collapsed
    useEffect(() => {
        if (collapsable && collapsed) {
            adjustSize(collapsedSize ?? 0);
        } else if (collapsable && !collapsed) {
            adjustSize(undefined);
        }
    }, [adjustSize, collapsable, collapsed, collapsedSize]);

    return {
        fixedSideRef,
        handleRef,
        handlers: {
            handleMouseDown,
            handleTouchStart
        }
    };
}
