import Device from "../../components/devices/Device";
import HttpService from "../services/HttpService";
import { IDeviceModel, DeviceModel, IDeviceContactState, DeviceContactState } from "./Device";

class SignalDeviceDto {
    id?: string;
    alias?: string;
    deviceIdentifier?: string;
    states?: SignalDeviceContactStateDto[];

    static FromDto(dto: SignalDeviceDto) : IDeviceModel {
        if (dto.id == null || dto.alias == null || dto.deviceIdentifier == null) {
            throw Error("Invalid SignalDeviceDto - missing required properties.");
        }

        return new DeviceModel(dto.id, dto.alias, dto.deviceIdentifier, [], dto.states?.map(SignalDeviceContactStateDto.FromDto) ?? []);
    }
}

class SignalDeviceContactStateDto {
    name?: string;
    channel?: string;
    valueSerialized?: string;
    timeStamp?: Date;

    static FromDto(dto: SignalDeviceContactStateDto) : IDeviceContactState {
        if (dto.name == null || dto.channel == null || dto.timeStamp == null) {
            throw Error("Invalid SignalDeviceContactStateDto - missing required properties.");
        }

        return new DeviceContactState(dto.name, dto.channel, dto.valueSerialized, dto.timeStamp);
    }
}

export default class DevicesRepository {
    static async getDevicesAsync() : Promise<IDeviceModel[]> {
        return (await HttpService.getAsync<SignalDeviceDto[]>("/devices")).map(SignalDeviceDto.FromDto);
    }
};