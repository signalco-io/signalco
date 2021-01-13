import { IDeviceTarget } from "../devices/Device";
import HttpService from "../services/HttpService";

export default class ConductsService {
    static async RequestConductAsync(target: IDeviceTarget, value?: any) {
        await HttpService.requestAsync("/conducts/request", "post", {
            target: target,
            valueSerialized: typeof value === 'string' ? value : JSON.stringify(value)
        });
    }
}