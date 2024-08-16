import { CSSProperties } from 'react';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { useDashboardSizes } from './useDashboardSizes';
import { DashboardPadding } from './DashboardPadding';

export function DashboardSkeleton() {
    const { resizeObserverRef, widgetSize, numberOfColumns, dashboardWidth } = useDashboardSizes();

    return (
        <DashboardPadding>
            <div ref={resizeObserverRef}>
                <div className="grid-rows-[repeat(auto-fill,var(--widget-size))]] grid w-[--dashboard-w] grid-cols-[repeat(auto-fill,var(--widget-size))] gap-2"
                    style={{
                        '--dashboard-cols': numberOfColumns,
                        '--dashboard-w': `${dashboardWidth}px`,
                        '--widget-size': `${widgetSize}`
                    } as CSSProperties}
                    suppressHydrationWarning>
                    <Skeleton className="col-start-[span_2] size-[calc(2*var(--widget-size)+0.5*1rem)]" />
                    <Skeleton className="col-start-[span_2] size-[calc(2*var(--widget-size)+0.5*1rem)]" />
                    <Skeleton className="col-start-[span_4] size-[calc(2*var(--widget-size)+0.5*1rem)]" />
                </div>
            </div>
        </DashboardPadding>
    )
}
