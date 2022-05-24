import { startTransition, useEffect, useState } from 'react';
import { IDeviceModel } from '../devices/Device';
import DevicesRepository from '../devices/DevicesRepository';

function useDevice(deviceId?: string) {
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (deviceId) {
                const device = await DevicesRepository.getDeviceAsync(deviceId);
                startTransition(() => {
                    setDevice(device);
                });
            }
        })();
    }, [deviceId]);
    return device;
}

export default useDevice;
