import { IDeviceTarget } from '../devices/Device';
import DevicesRepository from '../devices/DevicesRepository';
import DateTimeProvider from '../services/DateTimeProvider';
import HttpService from '../services/HttpService';

export interface IConduct {
    target: IDeviceTarget,
    value?: any,
    delay: number
}

export default class ConductsService {
    private static async _updateLocalStateAsync(conduct: IConduct) {
        const device = await DevicesRepository.getDeviceAsync(conduct.target.deviceId);
        device?.updateState(
            conduct.target.channelName,
            conduct.target.contactName,
            conduct.value?.toString(),
            DateTimeProvider.now()
        );
    }

    static async RequestConductAsync(target: IDeviceTarget, value?: any, delay?: number) {
        await HttpService.requestAsync('/conducts/request', 'post', {
            deviceId: target.deviceId,
            channelName: target.channelName,
            contactName: target.contactName,
            valueSerialized: typeof value === 'string' ? value : JSON.stringify(value),
            delay: delay || 0
        });

        ConductsService._updateLocalStateAsync({
            delay: delay || 0,
            value: value,
            target: target
        });
    }

    static async RequestMultipleConductAsync(conducts: IConduct[]) {
        const conductsDtos = conducts.map(conduct => ({
            deviceId: conduct.target.deviceId,
            channelName: conduct.target.channelName,
            contactName: conduct.target.contactName,
            valueSerialized: typeof conduct.value === 'string' ? conduct.value : JSON.stringify(conduct.value),
            delay: conduct.delay || 0
        }));
        await HttpService.requestAsync('/conducts/request-multiple', 'post', conductsDtos);

        // Set local value state
        for (let index = 0; index < conducts.length; index++) {
            ConductsService._updateLocalStateAsync(conducts[index]);
        }
    }
}
