import { Alert, Box, Button, Grid, LinearProgress, Paper, Tab } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { IDeviceModel } from "../../src/devices/Device";
import DevicesRepository from "../../src/devices/DevicesRepository";
import Device, { IDeviceWidgetConfig } from "../devices/Device";
import RGL from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";

function defaultDisplay(config?: IDeviceModel) {
    const displayConfig: IDeviceWidgetConfig = {
        activeContactNegated: false,
        lastActivity: false,
        showDiagram: false
    };

    if (config && config.alias) {
        displayConfig.room = config.alias.split(" ")[0];

        const lightMatch = config.alias.match(/light|lamp/i);
        if (lightMatch && lightMatch.length >= 0) {
            displayConfig.icon = "light";
        }

        const motionMatch = config.alias.match(/motion/i);
        if (motionMatch && motionMatch.length >= 0) {
            displayConfig.icon = "motion";
        }

        const socketMatch = config.alias.match(/socket/i);
        if (socketMatch && socketMatch.length >= 0) {
            displayConfig.icon = "socket";
        }

        const windowMatch = config.alias.match(/window/i);
        if (windowMatch && windowMatch.length >= 0) {
            displayConfig.icon = "window";
        }

        const doorMatch = config.alias.match(/door/i);
        if (doorMatch && doorMatch.length >= 0) {
            displayConfig.icon = "doors";
        }

        const switchMatch = config.alias.match(/switch|fan/i);
        if (switchMatch && switchMatch.length >= 0) {
            displayConfig.icon = "switch";
        }

        const airQualityMatch = config.alias.match(/temperature|humidity|air/i);
        if (airQualityMatch && airQualityMatch.length >= 0) {
            displayConfig.icon = "airquality";
        }
    }

    // if (displayConfig.icon === "light") {
    //     displayConfig.actionContactName = "state";
    //     displayConfig.activeContactName = "state";
    // } else if (displayConfig.icon === "motion") {
    //     displayConfig.activeContactName = "occupancy";
    //     displayConfig.lastActivity = true;
    // } else if (displayConfig.icon === "socket") {
    //     displayConfig.actionContactName = "state";
    //     displayConfig.activeContactName = "state";
    // } else if (displayConfig.icon === "window" || displayConfig.icon === "doors") {
    //     displayConfig.activeContactName = "contact";
    //     displayConfig.activeContactNegated = true;
    // } else if (displayConfig.icon === "switch") {
    //     displayConfig.actionContactName = "state";
    //     displayConfig.activeContactName = "state";
    // } else if (displayConfig.icon === "airquality") {
    //     displayConfig.displayValues = [
    //         {
    //             contactName: "temperature",
    //             units: "°C"
    //         },
    //         {
    //             contactName: "humidity"
    //         }
    //     ]
    // }

    const endpoint = config?.endpoints[0];
    const booleanContacts = endpoint?.contacts.filter(c => c.dataType === 'bool');
    if (booleanContacts && booleanContacts.length > 0) {
        const getReadContacts = booleanContacts.filter(c => c.access & 1 || c.access & 4);
        if (getReadContacts.length > 0) {
            displayConfig.activeContactName = getReadContacts[0].name;
            displayConfig.activeChannelName = endpoint?.channel;
        }

        const writeContacts = booleanContacts.filter(c => c.access & 2);
        if (writeContacts.length > 0) {
            displayConfig.actionContactName = writeContacts[0].name;
            displayConfig.actionChannelName = endpoint?.channel;
        }
    }

    endpoint?.contacts.filter(c => (c.dataType === 'double' || c.dataType === 'string') && (c.access & 1 || c.access & 4)).forEach(valueContact => {
        if (typeof displayConfig.displayValues === 'undefined')
            displayConfig.displayValues = [];
        displayConfig.displayValues.push({
            channelName: endpoint?.channel,
            contactName: valueContact.name
        })
    });

    return displayConfig;
}

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
    const [widgetEditorIdentifier, setWidgetEditorIdentifier] = useState<string | undefined>();
    const [value, setValue] = React.useState("1");

    const generateDashboardAsync = async () => {
        try {
            const screenSize = typeof window !== 'undefined' ? window.innerWidth : 1280;
            const columnsCount = Math.floor(screenSize / 220 * 2);

            const availableDevices = await DevicesRepository.getDevicesAsync();
            const updatedDevices = availableDevices.map((d, index) => {
                return {
                    deviceModel: d, displayConfig: defaultDisplay(d), position: {
                        i: d.identifier,
                        x: (index * 2) % columnsCount,
                        y: Math.floor((index * 2) / columnsCount),
                        w: 2,
                        h: 1 + Math.ceil((d.endpoints[0]?.contacts.length || 0) / 2)
                    }
                }
            });

            const config = JSON.stringify(updatedDevices);
            localStorage.setItem('dashboard-config', config);
            return config;
        } catch (error) {
            console.warn("Failed to load devices from Beacon", error);
            return "";
        }
    }

    const handleEdit = () => {
        setEditedConfig(devices);
        setIsEditing(true);
    }

    const handleLayoutChange = (layouts: RGL.Layout[]) => {
        if (!isEditing) return;

        const configWithUpdatedLayout = editedConfig;
        // Update layouts
        layouts.forEach(l => {
            const existingLayout = configWithUpdatedLayout.filter(c => c.position.i == l.i)[0];
            if (typeof existingLayout !== 'undefined') {
                existingLayout.position = l;
            } else console.warn("Layout for item not found", l.i);
        });
        setEditedConfig(configWithUpdatedLayout);
    };

    const handleEditComplete = () => {
        localStorage.setItem('dashboard-config', JSON.stringify(editedConfig));
        setIsEditing(false);
    };

    useEffect(() => {
        const loadAsync = async () => {
            try {
                setDevices(JSON.parse(localStorage.getItem('dashboard-config') ?? await generateDashboardAsync()));
            } catch (error) {
                console.warn("Failed to load devices from Beacon", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (window.location.search.startsWith('?conduct=')) {
            const conductRaw = decodeURIComponent(window.location.search.substring(9));
            const conductReq = JSON.parse(conductRaw);
            console.log(conductReq)
            const doFunc = async () => {
                await HttpService.requestAsync("/conducts/request", "post", {
                    deviceId: conductReq.di,
                    channelName: "signal",
                    contactName: conductReq.c,
                    valueSerialized: "1"
                });
                window.location.href = window.location.origin + window.location.pathname;
            }
            doFunc();
        }

        loadAsync();
    }, []);

    const handleWidgetEdit = (deviceIdentifier: string) => {
        var widget = editedConfig.filter(d => d.position.i === deviceIdentifier)[0];
        if (typeof widget === 'undefined') {
            console.warn("Widget not found. Edit not handled.")
            return;
        }

        setWidgetEditorIdentifier(deviceIdentifier);
    }

    const handleReset = async () => {
        setDevices(JSON.parse(await generateDashboardAsync()));
    }

    const renderDeviceEditor = (device: IDeviceConfigWithDisplayConfig) => {
        return (
            <Paper style={{ height: '100%', width: '100%' }}>
                <Grid container direction="column" alignItems="stretch">
                    <Grid item>
                        <Box sx={{ py: 1 }}>
                            <Device
                                isEditingWidget
                                deviceId={device.deviceModel.id}
                                deviceAlias={device.deviceModel.alias}
                                displayConfig={device.displayConfig}
                                onEdit={handleWidgetEdit} />
                        </Box>
                    </Grid>
                    <Grid item>
                        <TabContext value={value}>
                            <TabList variant="fullWidth" onChange={(_, v) => setValue(v)}>
                                <Tab value="1" label="Styles" style={{ minWidth: 120 }} />
                                <Tab value="2" label="Options" style={{ minWidth: 120 }} />
                                <Tab value="3" label="Other" style={{ minWidth: 120 }} />
                            </TabList>
                            <TabPanel value="1">
                                Styles
                                </TabPanel>
                            <TabPanel value="2">
                                Options
                                </TabPanel>
                            <TabPanel value="3">
                                Other
                                </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    const renderDevice = (device: IDeviceConfigWithDisplayConfig) => {
        return typeof widgetEditorIdentifier !== 'undefined' && widgetEditorIdentifier === device.deviceModel.identifier
            ? (<div key={`edit-${device.deviceModel.identifier}`} data-grid={{
                i: device.position.i,
                x: device.position.x,
                y: device.position.y,
                w: Math.max(device.position.w, 4),
                h: device.position.h + 8
            }}>
                {renderDeviceEditor(device)}
            </div>)
            : (<div key={device.deviceModel.identifier} data-grid={device.position}>
                <Device
                    isEditingDashboard={isEditing}
                    deviceId={device.deviceModel.id}
                    deviceAlias={device.deviceModel.alias}
                    displayConfig={device.displayConfig}
                    onEdit={handleWidgetEdit} />
            </div>);
    }

    const widgetParts: IWidgetPart[] = [
        {
            type: "inlineLabel",
            config: {
                label: "test",
                icon: "lock"
            }
        }
    ];


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
                                <Grid item>
                                    <Button disabled={isLoading} onClick={handleReset}>Reset</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }
            </Grid>
            <Grid item>
                <SizeMe noPlaceholder>
                    {({ size }) => {
                        console.log("Size", size);
                        if (size.width) {
                            return (
                                <>
                                    <Widget parts={widgetParts} onEditConfirmed={handleEditComplete} isEditingDashboard={isEditing} />
                                    <RGL
                                        isDraggable={isEditing}
                                        // compactType={null}
                                        onLayoutChange={handleLayoutChange}
                                        width={size.width || (typeof window !== 'undefined' ? window.innerWidth : 1820)}
                                        rowHeight={51}
                                        cols={Math.floor((size.width || 1820) / 220 * 2)}
                                    >
                                        {devices.map(d => renderDevice(d))}
                                    </RGL>
                                </>
                            );
                        } return <div></div>
                    }}
                </SizeMe>
            </Grid>
        </Grid>
    );
};

export default observer(HomeOverview);