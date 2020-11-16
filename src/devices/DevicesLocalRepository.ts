import HttpService from "../services/HttpService";

export default class DevicesLocalRepository {
    static async getDevicesAsync() {
        return await HttpService.getAsync("http://192.168.0.20:5000/beacon/devices");
    }
};