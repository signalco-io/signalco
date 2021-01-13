import Device from "../../components/devices/Device";
import HttpService from "../services/HttpService";
import { IDeviceModel, DeviceModel, IDeviceContactState, DeviceContactState, IDeviceContact, DeviceContact, IDeviceEndpoint, DeviceEndpoint } from "./Device";

class SignalDeviceDto {
    id?: string;
    alias?: string;
    deviceIdentifier?: string;
    endpoints?: SignalDeviceEndpointDto[];
    states?: SignalDeviceContactStateDto[];

    static FromDto(dto: SignalDeviceDto) : IDeviceModel {
        if (dto.id == null || dto.alias == null || dto.deviceIdentifier == null) {
            throw Error("Invalid SignalDeviceDto - missing required properties.");
        }

        return new DeviceModel(dto.id, dto.alias, dto.deviceIdentifier, dto.endpoints?.map(SignalDeviceEndpointDto.FromDto) ?? [], dto.states?.map(SignalDeviceContactStateDto.FromDto) ?? []);
    }
}

class SignalDeviceEndpointDto {
    channel?: string;
    contacts?: SignalDeviceEndpointContactDto[];

    static FromDto(dto: SignalDeviceEndpointDto) : IDeviceEndpoint {
        if (dto.channel == null || dto.contacts == null) {
            throw Error("Invalid SignalDeviceEndpointDto - missing required properties.");
        }

        return new DeviceEndpoint(dto.channel, dto.contacts?.map(SignalDeviceEndpointContactDto.FromDto));
    }
}

class SignalDeviceEndpointContactDto {
    name?: string;
    dataType?: string;
    access?: number;
    noiseReductionDelta?: number;

    static FromDto(dto: SignalDeviceEndpointContactDto) : IDeviceContact {
        if (dto.name == null || dto.dataType == null) {
            throw Error("Invalid SignalDeviceEndpointContactDto - missing required properties.");
        }

        return new DeviceContact(dto.name, dto.dataType);
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