'use client';

import { useState, useMemo, CSSProperties } from 'react';
import Image from 'next/image';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';
import { useResizeObserver } from '@enterwell/react-hooks';
import useLocale from '../../src/hooks/useLocale';
import { IDashboardModel } from '../../src/dashboards/DashboardsRepository';
import GridWrapper from './GridWrapper';
import DragableWidget from './DragableWidget';
import DisplayWidget from './DisplayWidget';

function NoWidgetsPlaceholder({ onAdd }: { onAdd: () => void }) {
    const { t } = useLocale('App', 'Dashboards');

    return (
        <Stack alignItems="center" justifyContent="center">
            <Row style={{ height: '80vh' }} justifyContent="center">
                <Stack style={{ maxWidth: 320 }} spacing={4} alignItems="center" justifyContent="center">
                    <Image priority width={280} height={213} alt="No Widgets" src="/assets/placeholders/placeholder-no-widgets.svg" />
                    <Typography level="h2">{t('NoWidgets')}</Typography>
                    <Typography center level="body2">{t('NoWidgetsHelpTextFirstLine')}<br />{t('NoWidgetsHelpTextSecondLine')}</Typography>
                    <Button onClick={onAdd}>{t('AddWidget')}</Button>
                </Stack>
            </Row>
        </Stack>
    );
}

function DashboardView(props: { dashboard: IDashboardModel, isEditing: boolean, onAddWidget: () => void }) {
    const { dashboard, isEditing, onAddWidget } = props;

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const resizeObserverRef = useResizeObserver((_, entry) => {
        setWindowInnerWidth(entry.contentRect.width);
    });

    // Render placeholder when there is no widgets
    const widgetsOrder = useMemo(() => dashboard.widgets.slice().sort((a, b) => a.order - b.order).map(w => w.id), [dashboard.widgets]);
    const widgets = useMemo(() => widgetsOrder.map(wo => dashboard.widgets.find(w => wo === w.id)).filter(Boolean), [dashboard.widgets, widgetsOrder]);
    if (widgets.length <= 0) {
        return <NoWidgetsPlaceholder onAdd={onAddWidget} />
    }

    function handleOrderChanged(newOrder: string[]) {
        for (let i = 0; i < newOrder.length; i++) {
            const widget = widgets.find(w => w.id === newOrder[i]);
            if (widget) {
                widget.order = i;
            }
        }
    }

    function handleSetWidgetConfig(widgetId: string, config: object | undefined) {
        const widget = dashboard.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.config = config;
        }
    }

    function handleRemoveWidget(widgetId: string) {
        dashboard.widgets.splice(dashboard.widgets.findIndex(w => w.id === widgetId), 1);
    }

    const WidgetComponent = isEditing ? DragableWidget : DisplayWidget;
    const widgetSize = 78 + 8; // Widget is 76x76 + 2px for border + 8 spacing between widgets (2x4px)
    const dashbaordPadding = 0;//48 + 109; // Has 24 x padding (109 nav width)
    const numberOfColumns = Math.max(4, Math.floor((windowInnerWidth - dashbaordPadding) / widgetSize)); // When width is less than 400, set to quad column

    return (
        <div ref={resizeObserverRef}>
            <div
                className="grid w-[--dashboard-w] grid-cols-[repeat(var(--dashboard-cols),1fr)] gap-2"
                style={{
                    '--dashboard-cols': numberOfColumns,
                    '--dashboard-w': `${widgetSize * numberOfColumns - 8}px`
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
