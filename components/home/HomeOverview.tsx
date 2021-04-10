import { Alert, Box, Button, Grid, LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { IDeviceModel } from "../../src/devices/Device";
import { IDeviceWidgetConfig } from "../devices/Device";
import RGL from 'react-grid-layout';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import { useResizeDetector } from 'react-resize-detector';

export interface IDeviceConfigWithDisplayConfig {
    deviceModel: IDeviceModel;
    displayConfig: IDeviceWidgetConfig;
    position: RGL.Layout;
}

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
                icon: "light",
                label: "Light 1"
            },
            size: "1/3"
        },
        {
            type: "button",
            config: {
                icon: "light",
                label: "Light 2"
            },
            size: "1/3"
        },
        {
            type: "button",
            config: {
                icon: "light",
                label: "Light 3"
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
                    {/* <WidgetEditor columnWidth={columnWidth} /> */}
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