import { CardHeader, Grid, OutlinedInput, Stack, Box, Card, Typography, CardActions, CardMedia, CardContent, IconButton } from "@mui/material";
import React from "react";
import Image from 'next/image';
import useSearch, { filterFuncObjectStringProps } from "../../src/hooks/useSearch";
import { AddOutlined } from "@mui/icons-material";
import { widgetType } from "./Widget";

const availableWidgets = [
    {
        type: 'state',
        name: 'State widget',
        description: 'Control and see state of any integrated entity.',
        preview: '/assets/widget-previews/WidgetStatePreview_dark.svg'
    },
    {
        type: 'shades',
        name: 'Shades widget',
        description: 'Control and see state of window shades.',
        preview: '/assets/widget-previews/WidgetShadesPreview_dark.svg',
        previewWidth: 300
    },
    {
        type: 'vacuum',
        name: 'Vacuum widget',
        description: 'Control and see state of your robot vacuum.',
        preview: '/assets/widget-previews/WidgetVacuumPreview_dark.svg',
        previewWidth: 200,
        previewHeight: 200
    },
    {
        type: 'indicator',
        name: 'Indicator widget',
        description: 'See state of anything.',
        preview: '/assets/widget-previews/WidgetIndicatorPreview_dark.png',
        previewHeight: 400,
        previewWidth: 106
    }
];

const WidgetStore = (props: { onAddWidget: (widgetType: widgetType) => void }) => {
    const [filteredAvailableWidgetsItems, showAvailableWidgetsSearch, searchAvailableWidgetsText, handleSearchAvailableWidgetsTextChange] =
        useSearch(availableWidgets, filterFuncObjectStringProps, 6);

    return (
        <Stack spacing={2}>
            {showAvailableWidgetsSearch && <OutlinedInput placeholder="Search..." value={searchAvailableWidgetsText} onChange={(e) => handleSearchAvailableWidgetsTextChange(e.target.value)} />}
            <Stack direction="row">
                <Typography variant="body2" color="text.secondary">{filteredAvailableWidgetsItems.length} widget{filteredAvailableWidgetsItems.length > 1 ? 's' : ''} available</Typography>
            </Stack>
            <div>
                <Grid container spacing={1} justifyContent="center">
                    {filteredAvailableWidgetsItems.map((availableWidget, index) => (
                        <Grid item key={`${availableWidget.type}-${index}`}>
                            <Card sx={{ minWidth: '320px' }}>
                                <CardHeader title={availableWidget.name} />
                                <CardMedia>
                                    <Box sx={{ width: '100%', height: '230px', background: 'black', display: 'flex', 'justifyContent': 'center' }}>
                                        <Image
                                            src={availableWidget.preview}
                                            alt={`${availableWidget.name} Preview`}
                                            width={availableWidget.previewWidth || 165}
                                            height={availableWidget.previewHeight || 165} />
                                    </Box>
                                </CardMedia>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {availableWidget.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                                    <IconButton aria-label="Add to dashboard" onClick={() => props.onAddWidget(availableWidget.type)}>
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