import { Alert, Box, Button, Grid, LinearProgress, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { IDeviceModel } from "../../src/devices/Device";
import DevicesRepository from "../../src/devices/DevicesRepository";
import Device, { IDeviceWidgetConfig } from "../devices/Device";
import RGL from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';
import EditSharpIcon from '@material-ui/icons/EditSharp';

function defaultDisplay(config?: IDeviceModel) {
    const displayConfig: IDeviceWidgetConfig = {
        activeContactNegated: false,
        lastActivity: false
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
        if (booleanContacts.length === 1) {
            // console.log('using contact ', config?.alias, booleanContacts[0]);
            displayConfig.activeContactName = booleanContacts[0].name;
            displayConfig.activeChannelName = endpoint?.channel;

            if (booleanContacts[0].access & 2) {
                displayConfig.actionContactName = booleanContacts[0].name;
                displayConfig.actionChannelName = endpoint?.channel;
            }
        } else {
            // console.warn("finding best match...", config?.alias, booleanContacts);
        }
    } else {
        // console.warn("needs something else", config?.alias);
    }

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

    const generateDashboardAsync = async () => {
        try {
            const screenSize = typeof window !== 'undefined' ? window.innerWidth : 1024;
            const columnsCount = screenSize / 220;

            const availableDevices = await DevicesRepository.getDevicesAsync();
            const updatedDevices = availableDevices.map((d, index) => {
                return {
                    deviceModel: d, displayConfig: defaultDisplay(d), position: {
                        i: d.identifier,
                        x: (index * 2) % columnsCount,
                        y: Math.floor((index * 2) / columnsCount),
                        w: 2,
                        h: 1
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

        loadAsync();
    }, []);

    const renderDevice = (device: IDeviceConfigWithDisplayConfig) => (
        <div key={device.deviceModel.identifier} data-grid={device.position}>
            <Device deviceModel={device.deviceModel} displayConfig={device.displayConfig} />
        </div>
    );

    return (
        <Grid container direction="column" spacing={1} wrap="nowrap">
            <Grid item>
                {isEditing ? (
                    <Alert
                        severity="info"
                        variant="filled"
                        action={<Button variant="contained" size="small" onClick={handleEditComplete}>Done editing</Button>}>
                        Add, move, resize your items.
                    </Alert>
                ) : (
                        <Box sx={{ px: 2, py: 1 }}>
                            <Button size="small" disabled={isLoading} startIcon={<EditSharpIcon />} onClick={handleEdit}>Edit</Button>
                        </Box>
                    )
                }
            </Grid>
            <Grid item>
                <SizeMe>
                    {({ size }) => {
                        return (
                            <>
                                {isLoading && <LinearProgress />}
                                <RGL
                                    isBounded={true}
                                    isDraggable={isEditing}
                                    onLayoutChange={handleLayoutChange}
                                    width={size.width || (typeof window !== 'undefined' ? window.innerWidth : 1024)}
                                    rowHeight={51}
                                    cols={Math.floor((size.width || 1024) / 220 * 2)}
                                >
                                    {devices.map(d => renderDevice(d))}
                                </RGL>
                            </>
                        );
                    }}
                </SizeMe>
            </Grid>
        </Grid>
    );
};

export default HomeOverview;