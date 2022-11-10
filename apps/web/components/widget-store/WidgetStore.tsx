import React from 'react';
import Image from 'next/image';
import { Add } from '@signalco/ui-icons';
import { Box, Stack } from '@mui/system';
import { AspectRatio, Card, CardOverflow, Grid, IconButton, TextField, Typography } from '@mui/joy';
import { widgetType } from '../widgets/Widget';
import useSearch, { filterFuncObjectStringProps } from '../../src/hooks/useSearch';

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
        description: 'See sotck prices at a glance.',
        preview: '/assets/widget-previews/Components_Widgets_Widget_Widget Finance Stock.png',
    }
];

function WidgetStore(props: { onAddWidget?: (widgetType: widgetType) => void }) {
    const [
        filteredAvailableWidgetsItems,
        showAvailableWidgetsSearch,
        searchAvailableWidgetsText,
        handleSearchAvailableWidgetsTextChange] =
        useSearch(availableWidgets, filterFuncObjectStringProps, 6);

    return (
        <Stack spacing={2}>
            {showAvailableWidgetsSearch && <TextField placeholder="Search..." value={searchAvailableWidgetsText} onChange={(e) => handleSearchAvailableWidgetsTextChange(e.target.value)} />}
            <Stack direction="row">
                <Typography level="body2">{filteredAvailableWidgetsItems.length} widget{filteredAvailableWidgetsItems.length > 1 ? 's' : ''} available</Typography>
            </Stack>
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <Grid container spacing={2} justifyContent="center">
                    {filteredAvailableWidgetsItems.map((availableWidget, index) => (
                        <Grid key={`${availableWidget.type}-${index}`}>
                            <Card variant="outlined" sx={{ width: '370px' }}>
                                <Stack pb={2}>
                                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                        <div>
                                            <Typography>{availableWidget.name}</Typography>
                                            <Typography level="body2">{availableWidget.description}</Typography>
                                        </div>
                                        <IconButton disabled={props.onAddWidget == null} aria-label="Add to dashboard" onClick={() => props.onAddWidget && props.onAddWidget(Array.isArray(availableWidget.type) ? availableWidget.type[0] : availableWidget.type)}>
                                            <Add />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                                <CardOverflow>
                                    <AspectRatio ratio={1}>
                                        <Image
                                            src={availableWidget.preview}
                                            alt={`${availableWidget.name} Preview`}
                                            fill sizes="100vw" />
                                    </AspectRatio>
                                </CardOverflow>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
}

export default WidgetStore;
