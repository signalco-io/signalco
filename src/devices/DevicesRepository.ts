import Device from "../../components/devices/Device";
import HttpService from "../services/HttpService";
import { IDeviceModel, DeviceModel, IDeviceContactState, DeviceContactState, IDeviceContact, DeviceContact, IDeviceEndpoint, DeviceEndpoint, IDeviceStatePublish, DeviceStatePublish } from "./Device";

class SignalDeviceDto {
    id?: string;
    alias?: string;
    deviceIdentifier?: string;
    endpoints?: SignalDeviceEndpointDto[];
    states?: SignalDeviceContactStateDto[];

    static FromDto(dto: SignalDeviceDto): IDeviceModel {
        if (dto.id == null || dto.alias == null || dto.deviceIdentifier == null) {
            throw Error("Invalid SignalDeviceDto - missing required properties.");
        }

        return new DeviceModel(
            dto.id, 
            dto.alias, 
            dto.deviceIdentifier, 
            dto.endpoints?.map(SignalDeviceEndpointDto.FromDto) ?? [], 
            dto.states?.map(SignalDeviceContactStateDto.FromDto) ?? []);
    }
}

class SignalDeviceEndpointDto {
    channel?: string;
    contacts?: SignalDeviceEndpointContactDto[];

    static FromDto(dto: SignalDeviceEndpointDto): IDeviceEndpoint {
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

    static FromDto(dto: SignalDeviceEndpointContactDto): IDeviceContact {
        if (dto.name == null || dto.dataType == null) {
            throw Error("Invalid SignalDeviceEndpointContactDto - missing required properties.");
        }

        return new DeviceContact(dto.name, dto.dataType, dto.access ?? 0);
    }
}

class SignalDeviceContactStateDto {
    name?: string;
    channel?: string;
    valueSerialized?: string;
    timeStamp?: string;

    static FromDto(dto: SignalDeviceContactStateDto): IDeviceContactState {
        if (dto.name == null || dto.channel == null || dto.timeStamp == null) {
            throw Error("Invalid SignalDeviceContactStateDto - missing required properties.");
        }

        return new DeviceContactState(dto.name, dto.channel, dto.valueSerialized, new Date(dto.timeStamp));
    }
}

export class SignalDeviceStatePublishDto {
    DeviceId?: string;
    ChannelName?: string;
    ContactName?: string;
    ValueSerialized?: string;
    TimeStamp?: string;

    static FromDto(dto: SignalDeviceStatePublishDto): IDeviceStatePublish {
        if (dto.DeviceId == null || dto.ChannelName == null || dto.ContactName == null || dto.TimeStamp == null) {
            throw Error("Invalid SignalDeviceStatePublishDto - missing required properties.");
        }

        return new DeviceStatePublish(dto.DeviceId, dto.ChannelName, dto.ContactName, dto.ValueSerialized, new Date(dto.TimeStamp));
    }
}

export default class DevicesRepository {
    static devicesCache?: { [id: string]: IDeviceModel };
    static isLoading: boolean;

    static async getDeviceAsync(deviceId: string): Promise<IDeviceModel | undefined> {
        // Cache devices
        // TODO: Invalidate cache after some period        
        if (!DevicesRepository.isLoading &&
            !DevicesRepository.devicesCache) {
            DevicesRepository.isLoading = true;
            const devices = await DevicesRepository.getDevicesAsync();
            DevicesRepository.devicesCache = {};
            devices.forEach(device => {
                if (DevicesRepository.devicesCache)
                    DevicesRepository.devicesCache[device.id] = device;
            });
            DevicesRepository.isLoading = false;
        }

        // Wait to load
        while (DevicesRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }

        if (typeof DevicesRepository.devicesCache !== 'undefined') {
            if (typeof DevicesRepository.devicesCache[deviceId] === "undefined")
                return undefined;
            return DevicesRepository.devicesCache[deviceId];
        }
        return undefined;
    }

    static async getDevicesAsync(): Promise<IDeviceModel[]> {
        return (await HttpService.getAsync<SignalDeviceDto[]>("/devices")).map(SignalDeviceDto.FromDto);
    }
};