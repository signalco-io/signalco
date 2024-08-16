'use client';

import { useMemo, CSSProperties } from 'react';
import { Dashboard } from '../../src/dashboards/DashboardsRepository';
import { useDashboardSizes } from './useDashboardSizes';
import { NoWidgetsPlaceholder } from './NoWidgetsPlaceholder';
import GridWrapper from './GridWrapper';
import DragableWidget from './DragableWidget';
import DisplayWidget from './DisplayWidget';

function DashboardView(props: { dashboard: Dashboard, isEditing: boolean, onAddWidget: () => void }) {
    const { dashboard, isEditing, onAddWidget } = props;

    function handleOrderChanged(newOrder: string[]) {
        for (let i = 0; i < newOrder.length; i++) {
            const widget = widgets.find(w => w.id === newOrder[i]);
            if (widget) {
                widget.order = i;
            }
        }
    }

    function handleSetWidgetConfig(widgetId: string, config: Record<string, unknown> | undefined) {
        const widget = dashboard.configuration.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.config = config;
        }
    }

    function handleRemoveWidget(widgetId: string) {
        dashboard.configuration.widgets.splice(dashboard.configuration.widgets.findIndex(w => w.id === widgetId), 1);
    }

    const WidgetComponent = isEditing ? DragableWidget : DisplayWidget;

    const { resizeObserverRef, widgetSize, numberOfColumns, dashboardWidth } = useDashboardSizes();

    // Render placeholder when there is no widgets
    const widgetsOrder = useMemo(() => dashboard.configuration.widgets.slice().sort((a, b) => a.order - b.order).map(w => w.id), [dashboard.configuration.widgets]);
    const widgets = useMemo(() => widgetsOrder.map(wo => dashboard.configuration.widgets.find(w => wo === w.id)).filter(Boolean), [dashboard.configuration.widgets, widgetsOrder]);
    if (widgets.length <= 0) {
        return <NoWidgetsPlaceholder onAdd={onAddWidget} />
    }

    return (
        <div ref={resizeObserverRef}>
            <div
                className="grid-rows-[repeat(auto-fill,var(--widget-size))]] grid w-[--dashboard-w] grid-cols-[repeat(auto-fill,var(--widget-size))] gap-2"
                style={{
                    '--dashboard-cols': numberOfColumns,
                    '--dashboard-w': `${dashboardWidth}px`,
                    '--widget-size': `${widgetSize}`
                } as CSSProperties}
            >
                <GridWrapper isEditing={isEditing} order={widgetsOrder} orderChanged={handleOrderChanged}>
                    {widgets.map((widget) => (
                        <WidgetComponent
                            key={`widget-${dashboard.id}-${widget.id.toString()}`}
                            id={widget.id}
                            onRemove={() => handleRemoveWidget(widget.id)}
                            isEditMode={isEditing}
                            type={widget.type}
                            config={widget.config ?? {}}
                            setConfig={(config) => handleSetWidgetConfig(widget.id, config)} />
                    ))}
                </GridWrapper>
            </div>
        </div>
    );
}

export default DashboardView;
