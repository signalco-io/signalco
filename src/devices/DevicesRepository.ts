import { IHistoricalValue } from "../../components/devices/Device";
import HttpService from "../services/HttpService";
import { IDeviceModel, DeviceModel, IDeviceContactState, DeviceContactState, IDeviceContact, DeviceContact, IDeviceEndpoint, DeviceEndpoint, IDeviceStatePublish, DeviceStatePublish, IDeviceTarget, User, IUser } from "./Device";

class SignalDeviceDto {
    id?: string;
    alias?: string;
    deviceIdentifier?: string;
    endpoints?: SignalDeviceEndpointDto[];
    states?: SignalDeviceContactStateDto[];
    sharedWith?: SignalUserDto[];
    manufacturer?: string;
    model?: string;

    static FromDto(dto: SignalDeviceDto): IDeviceModel {
        if (dto.id == null || dto.alias == null || dto.deviceIdentifier == null) {
            throw Error("Invalid SignalDeviceDto - missing required properties.");
        }

        return new DeviceModel(
            dto.id,
            dto.alias,
            dto.deviceIdentifier,
            dto.endpoints?.map(SignalDeviceEndpointDto.FromDto) ?? [],
            dto.states?.map(SignalDeviceContactStateDto.FromDto) ?? [],
            dto.sharedWith?.map(SignalUserDto.FromDto) ?? [],
            dto.manufacturer,
            dto.model);
    }
}

class SignalUserDto {
    id?: string;
    email?: string;
    fullName?: string;

    static FromDto(dto: SignalUserDto): IUser {
        if (dto.id == null || dto.email == null) {
            throw Error("Invalid SignalUserDto - missing required properties.");
        }

        return new User(dto.id, dto.email, dto.fullName);
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

class SignalDeviceStateHistoryDto {
    values?: IHistoricalValue[];
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
    static devicesCache?: IDeviceModel[];
    static devicesCacheKeyed?: { [id: string]: IDeviceModel };
    static isLoading: boolean;

    static async getDeviceStateHistoryAsync(target: IDeviceTarget, duration: string = "1.00:00:00"): Promise<IHistoricalValue[] | undefined> {
        return (await HttpService.getAsync<SignalDeviceStateHistoryDto>('/devices/state-history', { ...target, duration })).values;
    }

    static async getDeviceAsync(deviceId: string): Promise<IDeviceModel | undefined> {
        await DevicesRepository._cacheDevicesAsync();
        if (typeof DevicesRepository.devicesCacheKeyed !== 'undefined') {
            if (typeof DevicesRepository.devicesCacheKeyed[deviceId] === "undefined")
                return undefined;
            return DevicesRepository.devicesCacheKeyed[deviceId];
        }
        return undefined;
    }

    static async _cacheDevicesAsync() {
        // TODO: Invalidate cache after some period        
        if (!DevicesRepository.isLoading &&
            !DevicesRepository.devicesCache) {
            DevicesRepository.isLoading = true;
            DevicesRepository.devicesCache = (await HttpService.getAsync<SignalDeviceDto[]>("/devices")).map(SignalDeviceDto.FromDto);
            DevicesRepository.devicesCacheKeyed = {};
            DevicesRepository.devicesCache.forEach(device => {
                if (DevicesRepository.devicesCacheKeyed)
                    DevicesRepository.devicesCacheKeyed[device.id] = device;
            });
            DevicesRepository.devicesCache.sort((a, b) => a.alias < b.alias ? -1 : (a.alias > b.alias ? 1 : 0));

            DevicesRepository.isLoading = false;
        }

        // Wait to load
        while (DevicesRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    static async getDevicesAsync(): Promise<IDeviceModel[]> {
        await DevicesRepository._cacheDevicesAsync();
        return DevicesRepository.devicesCache ?? [];
    }
};