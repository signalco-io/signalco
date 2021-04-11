import { IDeviceTarget } from "../devices/Device";
import HttpService from "../services/HttpService";

export default class ConductsService {
    static async RequestConductAsync(target: IDeviceTarget, value?: any, delay: number = 0) {
        await HttpService.requestAsync("/conducts/request", "post", {
            deviceId: target.deviceId,
            channelName: target.channelName,
            contactName: target.contactName,
            valueSerialized: typeof value === 'string' ? value : JSON.stringify(value),
            delay: delay
        });
    }
}