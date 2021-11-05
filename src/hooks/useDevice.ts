import { useEffect, useState } from "react";
import { IDeviceModel } from "../devices/Device";
import DevicesRepository from "../devices/DevicesRepository";

const useDevice = (deviceId: string) => {
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (deviceId) {
                setDevice(await DevicesRepository.getDeviceAsync(deviceId));
            }
        })();
    }, [deviceId]);
    return device;
};

export default useDevice;