import { Grid, LinearProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { IDeviceModel } from "../../src/devices/Device";
import DevicesRepository from "../../src/devices/DevicesRepository";
import Device, { IDeviceWidgetConfig } from "../devices/Device";
import RGL from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';

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
}

const HomeOverview = () => {
    const [devices, setDevices] = useState<IDeviceConfigWithDisplayConfig[]>([]);
    const [layout, setLayout] = useState<RGL.Layout[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const availableDevices = await DevicesRepository.getDevicesAsync();
                const updatedDevices = availableDevices.map(d => {
                    return { deviceModel: d, displayConfig: defaultDisplay(d) }
                });

                const updatedLayout = updatedDevices.map((dev, index) => {
                    return {
                        i: dev.deviceModel.identifier,
                        x: (index * 2) % 10,
                        y: Math.floor((index * 2) / 10),
                        w: 2,
                        h: 1
                    }
                });

                setDevices(updatedDevices);
                setLayout(updatedLayout);
            } catch (error) {
                console.warn("Failed to load devices from Beacon", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadDevices();
    }, []);

    const renderDevice = (device: IDeviceConfigWithDisplayConfig) => (
        <div key={device.deviceModel.identifier}>
            <Device deviceModel={device.deviceModel} displayConfig={device.displayConfig} />
        </div>
    );

    return (
        <SizeMe>
            {({ size }) => {

                return (
                    <>
                        {isLoading && <LinearProgress />}
                        <RGL
                            layout={layout}
                            isBounded={true}
                            isDraggable={false}
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
    );
};

export default HomeOverview;