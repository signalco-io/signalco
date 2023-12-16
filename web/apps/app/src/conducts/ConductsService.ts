import { requestAsync } from '../services/HttpService';
import IContactPointer from '../contacts/IContactPointer';

export interface IConduct {
    pointer: IContactPointer,
    value?: unknown,
    delay: number
}

export default class ConductsService {
    private static async _updateLocalStateAsync(_: IConduct) {
        console.warn('Implement local update or refetch', _);
        // const device = await DevicesRepository.getDeviceAsync(conduct.target.deviceId);
        // device?.updateState(
        //     conduct.target.channelName,
        //     conduct.target.contactName,
        //     conduct.value?.toString(),
        //     DateTimeProvider.now()
        // );
    }

    static async RequestConductAsync(pointer: IContactPointer, value?: unknown, delay?: number) {
        await requestAsync('/conducts/request', 'post', {
            entityId: pointer.entityId,
            channelName: pointer.channelName,
            contactName: pointer.contactName,
            valueSerialized: typeof value === 'string' ? value : JSON.stringify(value),
            delay: delay || 0
        });

        ConductsService._updateLocalStateAsync({
            delay: delay || 0,
            value,
            pointer: pointer
        });
    }

    static async RequestMultipleConductAsync(conducts: IConduct[]) {
        const conductsDtos = conducts.map(conduct => ({
            entityId: conduct.pointer.entityId,
            channelName: conduct.pointer.channelName,
            contactName: conduct.pointer.contactName,
            valueSerialized: typeof conduct.value === 'string' ? conduct.value : JSON.stringify(conduct.value),
            delay: conduct.delay || 0
        }));
        await requestAsync('/conducts/request-multiple', 'post', conductsDtos);

        // Set local value state
        for (let index = 0; index < conducts.length; index++) {
            const conduct = conducts[index];
            if (conduct) {
                ConductsService._updateLocalStateAsync(conduct);
            }
        }
    }
}
