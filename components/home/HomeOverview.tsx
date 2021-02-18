import { Alert, Box, Button, Grid, LinearProgress, Paper, Slider, Tab, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { IDeviceModel } from "../../src/devices/Device";
import { IDeviceWidgetConfig } from "../devices/Device";
import RGL from 'react-grid-layout';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import { useResizeDetector } from 'react-resize-detector';
import { makeAutoObservable } from "mobx";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

export interface IDeviceConfigWithDisplayConfig {
    deviceModel: IDeviceModel;
    displayConfig: IDeviceWidgetConfig;
    position: RGL.Layout;
}

class WidgetPartsBuilder {
    parts: IWidgetPart[] = [];
    columns?: number = 1;
    rows?: number = 1;

    constructor() {
        makeAutoObservable(this);
    }
}

const FormNumberSlider = (props: { value?: number, defaultValue?: number, onChange: (value?: number) => void, label: string, labelMinWidth?: number | string }) => {
    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item sx={{ minWidth: props.labelMinWidth }}>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
                <Slider
                    defaultValue={props.defaultValue}
                    step={1}
                    max={Math.max(10, props.value ?? 1)}
                    min={1}
                    marks
                    valueLabelDisplay="auto"
                    value={props.value}
                    onChange={(_, v) => props.onChange(parseInt(v?.toString(), 10) || undefined)} />
            </Grid>
            <Grid item>
                <TextField style={{ width: '60px' }} value={props.value} onChange={(e) => props.onChange(parseInt(e.target.value.toString(), 10) || undefined)} />
            </Grid>
        </Grid>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const WidgetEditor = observer((props: { columnWidth: number }) => {
    const builder = useMemo(() => new WidgetPartsBuilder(), []);
    const [tabValue, setTabValue] = React.useState('1');

    const handleTabChange = (_, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Grid container direction="column" spacing={2} alignItems="flex-start">
            <Grid item>
                <Grid container>
                    <Widget columnWidth={props.columnWidth} columns={builder.columns || 1} rows={builder.rows || 1} parts={builder.parts} onEditConfirmed={() => { }} isEditingDashboard={false} />
                </Grid>
            </Grid>
            <Grid item>
                <Paper sx={{ minWidth: props.columnWidth*3 }}>
                    <Box flex flexGrow={1}>
                        <TabContext value={tabValue}>
                            <TabList
                                orientation="vertical"
                                variant="scrollable"
                                onChange={handleTabChange}
                                value={tabValue}>
                                <Tab label="Style" value="1" />
                                <Tab label="Style" value="2" />
                                <Tab label="Style" value="3" />
                            </TabList>
                            <TabPanel value="1">
                                <Grid container direction="column" spacing={1}>
                                    <Grid item xs={12}>
                                        <FormNumberSlider value={builder.columns} onChange={(v) => builder.columns = v} label="Width" labelMinWidth="80px" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormNumberSlider value={builder.rows} onChange={(v) => builder.rows = v} label="Height" labelMinWidth="80px" />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <div>2</div>
                            </TabPanel>
                            <TabPanel value="3">
                                <div>3</div>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
});

const HomeOverview = () => {
    const [devices, setDevices] = useState<IDeviceConfigWithDisplayConfig[]>([]);
    const [editedConfig, setEditedConfig] = useState<IDeviceConfigWithDisplayConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [executedConduct, setExecutedConduct] = useState(false);

    const handleEdit = () => {
        setEditedConfig(devices);
        setIsEditing(true);
    }

    const handleEditComplete = () => {
        localStorage.setItem('dashboard-config', JSON.stringify(editedConfig));
        setIsEditing(false);
    };

    useEffect(() => {
        const loadAsync = async () => {
            try {
                setDevices(JSON.parse(localStorage.getItem('dashboard-config') ?? '{}'));
            } catch (error) {
                console.warn("Failed to load devices from Beacon", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadAsync();
    }, []);

    useEffect(() => {
        if (window.location.search.startsWith('?do=')) {
            const conductRaw = decodeURIComponent(window.location.search.substring(9));
            const conductReq = JSON.parse(conductRaw);
            (async () => {
                await HttpService.requestAsync("/conducts/request", "post", {
                    deviceId: conductReq.di,
                    channelName: "signal",
                    contactName: conductReq.c,
                    valueSerialized: "1"
                });
                setExecutedConduct(true);
            })();
        }
    }, []);

    if (window.location.search.startsWith("?do=")) {
        if (executedConduct)
            return <div>Done</div>
        return <div>Doing...</div>
    }

    const widgetParts: IWidgetPart[] = [
        {
            type: "inlineLabel",
            config: {
                label: "Living room",
                icon: "livingroom",
                size: "large"
            },
            size: "1"
        },
        {
            type: "button",
            config: {
                icon: "light"
            },
            size: "1/3"
        },
        {
            type: "button",
            config: {
                icon: "light"
            },
            size: "1/3"
        },
        {
            type: "button",
            config: {
                icon: "light"
            },
            size: "1/3"
        },
        {
            type: "inlineLabel",
            config: {
                label: "Temperature",
                icon: "flower",
                size: "normal",
                value: "23.5",
                units: "°C"
            },
            size: "1",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "Humidity",
                icon: "flower",
                value: "35",
                units: "%"
            },
            size: "1",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "",
            },
            size: "1",
            dense: true
        },
        {
            type: "button",
            config: {
                icon: "onoff",
                small: true
            },
            size: "1/6",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "Couch socket",
            },
            size: "5/6",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "Consumption",
                icon: "empty",
                value: "123",
                units: "W",
                size: "small"
            },
            size: "1",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "Average",
                icon: "empty",
                value: "1.5",
                units: "kW",
                size: "small"
            },
            size: "1",
            dense: true
        },
        {
            type: "graph",
            config: {
                columns: 1,
                rows: 1
            },
            size: "1"
        },
        {
            type: "inlineLabel",
            config: {
                label: "Doors socket",
                icon: "power"
            },
            size: "3/4"
        },
        {
            type: "button",
            config: {
                icon: "onoff"
            },
            size: "1/4"
        },
        {
            type: "inlineLabel",
            config: {
                label: "Consumption",
                icon: "empty",
                value: "123",
                units: "W",
                size: "small"
            },
            size: "1",
            dense: true
        },
        {
            type: "inlineLabel",
            config: {
                label: "Average",
                icon: "empty",
                value: "1.5",
                units: "kW",
                size: "small"
            },
            size: "1",
            dense: true
        },
        {
            type: "graph",
            config: {
                columns: 1,
                rows: 1
            },
            size: "1"
        }
    ];

    const RenderDashboard = () => {
        const { width, ref } = useResizeDetector({ handleHeight: false, handleWidth: true });
        const castedRef = ref as React.MutableRefObject<HTMLDivElement | null>; // Workaround from: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572

        if (typeof width === 'undefined')
            return <div ref={castedRef}></div>;

        const columnWidth = width && width < 400 ? width / 2 : width / Math.max(Math.floor(width / 220), 2);
        return (
            <div ref={castedRef}>
                <Box m={1}>
                    <WidgetEditor columnWidth={columnWidth} />
                    <Widget columnWidth={columnWidth} columns={1} rows={9} parts={widgetParts} onEditConfirmed={handleEditComplete} isEditingDashboard={isEditing} />
                </Box>
            </div>);
    };

    return (
        <Grid container direction="column" spacing={1} wrap="nowrap">
            {isLoading && (
                <Grid item>
                    <LinearProgress />
                </Grid>
            )}
            <Grid item>
                {isEditing ? (
                    <Alert
                        severity="info"
                        variant="filled"
                        style={{ borderRadius: 0 }}
                        action={<Button variant="contained" size="small" onClick={handleEditComplete}>Done editing</Button>}>
                        Add, move, resize your items.
                    </Alert>
                ) : (
                        <Box sx={{ px: 2 }}>
                            <Grid container spacing={1} justifyContent="flex-end">
                                <Grid item>
                                    <Button disabled={isLoading} startIcon={<EditSharpIcon />} onClick={handleEdit}>Edit</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }
            </Grid>
            <Grid item>
                <RenderDashboard />
            </Grid>
        </Grid>
    );
};

export default observer(HomeOverview);