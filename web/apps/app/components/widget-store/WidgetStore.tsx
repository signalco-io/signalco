import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Card } from '@signalco/ui-primitives/Card';
import { Add } from '@signalco/ui-icons';
import { asArray } from '@signalco/js';
import { useSearch, filterFuncObjectStringProps } from '@signalco/hooks/useSearch';
import { widgetType } from '../widgets/Widget';

const availableWidgets: { type: widgetType | widgetType[], name: string, description: string, preview: string }[] = [
    {
        type: 'state',
        name: 'State',
        description: 'Control and see state of any integrated entity.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget State.png'
    },
    {
        type: 'shades',
        name: 'Shades',
        description: 'Control and see state of window shades.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Shades.png',
    },
    {
        type: 'vacuum',
        name: 'Vacuum',
        description: 'Control and see state of your robot vacuum.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Vacuum.png',
    },
    {
        type: 'indicator',
        name: 'Indicator',
        description: 'See state of anything.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Idicator.png',
    },
    {
        type: ['termostat', 'airconditioning'],
        name: 'Air conditioning',
        description: 'Monitor and Control temperature of your space.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Termostat.png',
    },
    {
        type: 'time',
        name: 'Time',
        description: 'Displays current time.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Time.png',
    },
    {
        type: 'checklist',
        name: 'Checklist',
        description: 'Keep track of your tasks.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Checklist.png',
    },
    {
        type: 'button',
        name: 'Button',
        description: 'Execute the action.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Button.png',
    },
    {
        type: 'finance-stock',
        name: 'Stock',
        description: 'See stock prices at a glance.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Finance Stock.png',
    },
    {
        type: 'graph',
        name: 'Graph',
        description: 'Visaulize your data with graph.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Graph.png',
    },
    {
        type: 'energy',
        name: 'Energy',
        description: 'Visaulize your energy consumption.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Energy.png',
    }
];

function WidgetStore(props: { onAddWidget?: (widgetType: widgetType) => void }) {
    const [
        filteredAvailableWidgetsItems,
        searchAvailableWidgetsText,
        handleSearchAvailableWidgetsTextChange] =
        useSearch(availableWidgets, filterFuncObjectStringProps);

    return (
        <Stack spacing={4}>
            <Input placeholder="Search..." value={searchAvailableWidgetsText} onChange={(e) => handleSearchAvailableWidgetsTextChange(e.target.value)} />
            <div className="overflow-y-auto overflow-x-hidden">
                <div className="grid auto-cols-max gap-2">
                    {filteredAvailableWidgetsItems.map((availableWidget, index) => (
                        <Card key={`${availableWidget.type}-${index}`} className="w-full">
                            <Stack spacing={1}>
                                <Row spacing={1} justifyContent="space-between" alignItems="start">
                                    <div>
                                        <Typography>{availableWidget.name}</Typography>
                                        <Typography level="body2" secondary>{availableWidget.description}</Typography>
                                    </div>
                                    <IconButton
                                        variant="plain"
                                        disabled={props.onAddWidget == null}
                                        aria-label="Add to dashboard"
                                        onClick={() => props.onAddWidget && props.onAddWidget(asArray(availableWidget.type)[0] ?? 'unknown')}>
                                        <Add />
                                    </IconButton>
                                </Row>
                            </Stack>
                        </Card>
                    ))}
                </div>
            </div>
        </Stack>
    );
}

export default WidgetStore;
