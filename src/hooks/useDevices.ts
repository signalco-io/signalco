import { useEffect, useState } from "react";
import { IDeviceModel } from "../devices/Device";
import DevicesRepository from "../devices/DevicesRepository";

const useDevices = (deviceIds?: string[]) => {
    const [devices, setDevices] = useState<(IDeviceModel | undefined)[] | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (deviceIds) {
                const newDevices = [];
                for (let i = 0; i < deviceIds.length; i++) {
                    const deviceId = deviceIds[i];
                    const device = await DevicesRepository.getDeviceAsync(deviceId)
                    newDevices.push(device);
                }
                setDevices(newDevices);
            }
        })();
    }, [deviceIds]);
    return devices;
};

export default useDevices;