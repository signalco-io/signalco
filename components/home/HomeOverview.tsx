import { Grid, LinearProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import DevicesLocalRepository from "../../src/devices/DevicesLocalRepository";
import Device, { IDeviceConfiguration, IDeviceWidgetConfig } from "../devices/Device";

function defaultDisplay(config?: IDeviceConfiguration) {
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

        const switchMatch = config.alias.match(/switch/i);
        if (switchMatch && switchMatch.length >= 0) {
            displayConfig.icon = "switch";
        }

        const airQualityMatch = config.alias.match(/temperature|humidity|air/i);
        if (airQualityMatch && airQualityMatch.length >= 0) {
            displayConfig.icon = "airquality";
        }
    }

    if (displayConfig.icon === "light") {
        displayConfig.actionContactName = "state";
        displayConfig.activeContactName = "state";
    } else if (displayConfig.icon === "motion") {
        displayConfig.activeContactName = "occupancy";
        displayConfig.lastActivity = true;
    } else if (displayConfig.icon === "socket") {
        displayConfig.actionContactName = "state";
        displayConfig.activeContactName = "state";
    } else if (displayConfig.icon === "window" || displayConfig.icon === "doors") {
        displayConfig.activeContactName = "contact";
        displayConfig.activeContactNegated = true;
    } else if (displayConfig.icon === "switch") {
        displayConfig.actionContactName = "state";
        displayConfig.activeContactName = "state";
    } else if (displayConfig.icon === "airquality") {
        displayConfig.displayValues = [
            {
                contactName: "temperature",
                units: "°C"
            },
            {
                contactName: "humidity"
            }
        ]
    }

    return displayConfig;
}

export interface IDeviceConfigWithDisplayConfig {
    deviceConfig: IDeviceConfiguration;
    displayConfig: IDeviceWidgetConfig;
}

const HomeOverview = () => {
    const [devices, setDevices] = useState<IDeviceConfigWithDisplayConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const availableDevices = await DevicesLocalRepository.getDevicesAsync();
                setDevices(availableDevices.map(d => {
                    return { deviceConfig: d, displayConfig: defaultDisplay(d) }
                }));
                setIsLoading(false);
            } catch (error) {
                console.warn("Failed to load devices from Beacon");
            }
        }

        loadDevices();
    }, []);

    const renderDevice = (device: IDeviceConfigWithDisplayConfig) => (
        <Grid item key={device.deviceConfig.identifier}>
            <Device deviceConfiguration={device.deviceConfig} displayConfig={device.displayConfig} />
        </Grid>
    );

    if (isLoading) {
        return (
            <LinearProgress />
        );
    }

    return (
        <Grid container spacing={1}>
            {devices.map(d => renderDevice(d))}
        </Grid>
    );
};

export default HomeOverview;