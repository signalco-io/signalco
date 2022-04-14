import { CardHeader, Grid, Stack, Box, Card, Typography, CardActions, CardMedia, IconButton, TextField, Divider } from "@mui/material";
import React from "react";
import Image from 'next/image';
import useSearch, { filterFuncObjectStringProps } from "../../src/hooks/useSearch";
import { AddOutlined } from "@mui/icons-material";
import { widgetType } from "./Widget";

const availableWidgets = [
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
    }
];

const WidgetStore = (props: { onAddWidget?: (widgetType: widgetType) => void }) => {
    const [filteredAvailableWidgetsItems, showAvailableWidgetsSearch, searchAvailableWidgetsText, handleSearchAvailableWidgetsTextChange] =
        useSearch(availableWidgets, filterFuncObjectStringProps, 6);

    return (
        <Stack spacing={2}>
            {showAvailableWidgetsSearch && <TextField placeholder="Search..." value={searchAvailableWidgetsText} onChange={(e) => handleSearchAvailableWidgetsTextChange(e.target.value)} />}
            <Stack direction="row">
                <Typography variant="body2" color="text.secondary">{filteredAvailableWidgetsItems.length} widget{filteredAvailableWidgetsItems.length > 1 ? 's' : ''} available</Typography>
            </Stack>
            <div>
                <Grid container spacing={2} justifyContent="center">
                    {filteredAvailableWidgetsItems.map((availableWidget, index) => (
                        <Grid item key={`${availableWidget.type}-${index}`}>
                            <Card>
                                <CardHeader
                                    title={availableWidget.name}
                                    subheader={availableWidget.description}
                                    subheaderTypographyProps={{ variant: "body2", color: "text.secondary", pt: 1 }} />
                                <CardMedia>
                                    <Box sx={{ width: '100%', height: '370px', display: 'flex', 'justifyContent': 'center' }}>
                                        <Image
                                            src={availableWidget.preview}
                                            alt={`${availableWidget.name} Preview`}
                                            width={availableWidget.previewWidth || 370}
                                            height={availableWidget.previewHeight || 370} />
                                    </Box>
                                </CardMedia>
                                <Divider />
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    <IconButton disabled={props.onAddWidget == null} aria-label="Add to dashboard" onClick={() => props.onAddWidget && props.onAddWidget(availableWidget.type)}>
                                        <AddOutlined />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Stack>
    );
};

export default WidgetStore;
