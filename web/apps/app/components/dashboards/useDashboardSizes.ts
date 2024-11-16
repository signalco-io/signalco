import { useState } from 'react';
import { useResizeObserver } from '@enterwell/react-hooks';

export function useDashboardSizes() {
    const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const [elementWidth, setElementWidth] = useState(defaultWidth);
    const resizeObserverRef = useResizeObserver((_, entry) => {
        setElementWidth(entry.contentRect.width);
    });
    const widgetSize = 1 + 64 + 1 + 4; // Default widget is 64x64 + 2px for border + 8 spacing between widgets (2x4px)
    const dashboardWidth = elementWidth;
    const numberOfColumns = Math.max(2, Math.floor(dashboardWidth / widgetSize));
    const dynamicWidgetSize = `calc((${dashboardWidth}px - ${(numberOfColumns - 1) * 0.5}rem) / ${numberOfColumns})`;
    return {
        resizeObserverRef,
        widgetSize: dynamicWidgetSize,
        numberOfColumns,
        dashboardWidth
    };
}