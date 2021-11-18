import { IDeviceTarget } from "../devices/Device";
import HttpService from "../services/HttpService";

export interface IConduct {
    target: IDeviceTarget,
    value?: any,
    delay: number
}

export default class ConductsService {
    static async RequestConductAsync(target: IDeviceTarget, value?: any, delay?: number) {
        await HttpService.requestAsync("/conducts/request", "post", {
            deviceId: target.deviceId,
            channelName: target.channelName,
            contactName: target.contactName,
            valueSerialized: typeof value === 'string' ? value : JSON.stringify(value),
            delay: delay || 0
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
        await HttpService.requestAsync("/conducts/request-multiple", "post", conductsDtos);
    }
}