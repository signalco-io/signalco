import HttpService from "../services/HttpService";

export default class DevicesLocalRepository {
    static async getDevicesAsync() {
        return await HttpService.getAsync("https://192.168.0.8:5004/beacon/devices");
    }
};