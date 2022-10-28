import React from 'react';
import Image from 'next/image';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/joy';
import GridWrapper from './GridWrapper';
import DragableWidget from './DragableWidget';
import DisplayWidget from './DisplayWidget';
import useLocale from '../../src/hooks/useLocale';
import { IDashboardModel } from '../../src/dashboards/DashboardsRepository';

export const draggingUpscale = 1.1;

function DashboardView(props: { dashboard: IDashboardModel, isEditing: boolean, onAddWidget: () => void }) {
    const { dashboard, isEditing, onAddWidget } = props;

    const { t } = useLocale('App', 'Dashboards');

    const widgetSize = 78 + 8; // Widget is 76x76 + 2px for border + 8 spacing between widgets (2x4px)
    const dashbaordPadding = 48 + 109; // Has 24 x padding (109 nav width)
    const numberOfColumns = Math.max(4, Math.floor((window.innerWidth - dashbaordPadding) / widgetSize)); // When width is less than 400, set to quad column

    const widgetsOrder = dashboard.widgets.slice().sort((a, b) => a.order - b.order).map(w => w.id);
    const widgets = widgetsOrder.map(wo => dashboard.widgets.find(w => wo === w.id)!);

    function handleSetWidgetConfig(widgetId: string, config: object | undefined) {
        const widget = dashboard.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.config = config;
        }
    }

    function handleRemoveWidget(widgetId: string) {
        dashboard.widgets.splice(dashboard.widgets.findIndex(w => w.id === widgetId), 1);
    }

    function handleOrderChanged(newOrder: string[]) {
        for (let i = 0; i < newOrder.length; i++) {
            const widget = widgets.find(w => w.id === newOrder[i]);
            if (widget) {
                widget.order = i;
            }
        }
    }

    // Render placeholder when there is no widgets
    if (widgets.length <= 0) {
        return (
            <Stack alignItems="center" justifyContent="center">
                <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center" direction="row">
                    <Stack maxWidth={320} spacing={4} alignItems="center" justifyContent="center">
                        <Image priority width={280} height={213} alt="No Widgets" src="/assets/placeholders/placeholder-no-widgets.svg" />
                        <Typography level="h2">{t('NoWidgets')}</Typography>
                        <Typography textAlign="center" level="body2">{t('NoWidgetsHelpTextFirstLine')}<br />{t('NoWidgetsHelpTextSecondLine')}</Typography>
                        <Button onClick={onAddWidget}>{t('AddWidget')}</Button>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    const WidgetComponent = isEditing ? DragableWidget : DisplayWidget;

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
            gap: 1,
            width: `${widgetSize * numberOfColumns - 8}px`
        }}>
            <GridWrapper isEditing={isEditing} order={widgetsOrder} orderChanged={handleOrderChanged}>
                {widgets.map((widget) => (
                    <WidgetComponent
                        key={`widget-${widget.id.toString()}`}
                        id={widget.id}
                        onRemove={() => handleRemoveWidget(widget.id)}
                        isEditMode={isEditing}
                        type={widget.type}
                        config={widget.config}
                        setConfig={(config) => handleSetWidgetConfig(widget.id, config)} />
                ))}
            </GridWrapper>
        </Box >
    );
}

export default DashboardView;
