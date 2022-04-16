import EntityRepository from '../entity/EntityRepository';
import { IHistoricalValue } from '../entity/IHistoricalValue';
import HttpService from '../services/HttpService';
import {
    IDeviceModel,
    DeviceModel,
    IDeviceContactState,
    DeviceContactState,
    IDeviceContact,
    DeviceContact,
    IDeviceEndpoint,
    DeviceEndpoint,
    IDeviceTarget,
    IDeviceContactDataValue,
    DeviceContactDataValue,
    SignalUserDto
} from './Device';

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
            throw Error('Invalid SignalDeviceDto - missing required properties.');
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

class SignalDeviceEndpointDto {
    channel?: string;
    contacts?: SignalDeviceEndpointContactDto[];

    static FromDto(dto: SignalDeviceEndpointDto): IDeviceEndpoint {
        if (dto.channel == null || dto.contacts == null) {
            throw Error('Invalid SignalDeviceEndpointDto - missing required properties.');
        }

        return new DeviceEndpoint(dto.channel, dto.contacts?.map(SignalDeviceEndpointContactDto.FromDto));
    }
}

class SignalDeviceEndpointContactDataValueDto {
    value?: string;
    label?: string;

    static FromDto(dto: SignalDeviceEndpointContactDataValueDto): IDeviceContactDataValue {
        if (dto.value == null) {
            throw Error('Invalid SignalDeviceEndpointContactDataValueDto - missing required properties.');
        }

        return new DeviceContactDataValue(dto.value, dto.label);
    }
}

class SignalDeviceEndpointContactDto {
    name?: string;
    dataType?: string;
    access?: number;
    noiseReductionDelta?: number;
    dataValues?: SignalDeviceEndpointContactDataValueDto[];
    dataValuesMultiple?: boolean;

    static FromDto(dto: SignalDeviceEndpointContactDto): IDeviceContact {
        if (dto.name == null || dto.dataType == null) {
            throw Error('Invalid SignalDeviceEndpointContactDto - missing required properties.');
        }

        return new DeviceContact(dto.name, dto.dataType, dto.access ?? 0, dto.dataValuesMultiple ?? false, dto.dataValues?.map(SignalDeviceEndpointContactDataValueDto.FromDto));
    }
}

class SignalDeviceContactStateDto {
    name?: string;
    channel?: string;
    valueSerialized?: string;
    timeStamp?: string;

    static FromDto(dto: SignalDeviceContactStateDto): IDeviceContactState {
        if (dto.name == null || dto.channel == null || dto.timeStamp == null) {
            throw Error('Invalid SignalDeviceContactStateDto - missing required properties.');
        }

        return new DeviceContactState(dto.name, dto.channel, dto.valueSerialized, new Date(dto.timeStamp));
    }
}

class SignalDeviceStateHistoryDto {
    values?: IHistoricalValue[];
}

interface ISignalDeviceInfoUpdateDto {
    DeviceId: string;
    Alias: string | undefined;
    Manufacturer: string | undefined;
    Model: string | undefined;
}

export default class DevicesRepository {
    static devicesCache?: IDeviceModel[];
    static devicesCacheKeyed?: { [id: string]: IDeviceModel };
    static isLoading: boolean;

    static async deleteAsync(deviceId: string) {
        await DevicesRepository._cacheDevicesAsync();
        await EntityRepository.deleteAsync(deviceId, 1);
        // TODO: Remove from local
    }

    static async renameAsync(deviceId: string, alias: string | undefined) {
        await DevicesRepository._cacheDevicesAsync();
        const device = await DevicesRepository.getDeviceAsync(deviceId);
        if (device == null)
            throw new Error('Unknown device.');

        const aliasTrimmed = alias?.trim();
        const data: ISignalDeviceInfoUpdateDto = {
            DeviceId: device.id,
            Alias: aliasTrimmed,
            Manufacturer: device.manufacturer,
            Model: device.model
        };
        await HttpService.requestAsync('/devices/info/update', 'post', data);

        // Update local info
        device.alias = aliasTrimmed || '';
    }

    static async getDeviceStateHistoryAsync(target: IDeviceTarget, duration: string = '1.00:00:00'): Promise<IHistoricalValue[] | undefined> {
        return (await HttpService.getAsync<SignalDeviceStateHistoryDto>('/devices/state-history', { ...target, duration })).values;
    }

    static async getDeviceByIdentifierAsync(identifier: string): Promise<IDeviceModel | undefined> {
        await DevicesRepository._cacheDevicesAsync();
        if (typeof DevicesRepository.devicesCacheKeyed !== 'undefined') {
            const matchedDevices = DevicesRepository.devicesCache?.filter(d => d.identifier === identifier);
            if (typeof matchedDevices === 'undefined' ||
                matchedDevices.length <= 0 ||
                typeof matchedDevices[0] === 'undefined')
                return undefined;

            return matchedDevices[0];
        }
    }

    static async getDeviceAsync(deviceId: string): Promise<IDeviceModel | undefined> {
        await DevicesRepository._cacheDevicesAsync();
        if (typeof DevicesRepository.devicesCacheKeyed !== 'undefined') {
            if (typeof DevicesRepository.devicesCacheKeyed[deviceId] === 'undefined')
                return undefined;
            return DevicesRepository.devicesCacheKeyed[deviceId];
        }
        return undefined;
    }

    static async getDevicesAsync(): Promise<IDeviceModel[]> {
        await DevicesRepository._cacheDevicesAsync();
        return DevicesRepository.devicesCache ?? [];
    }

    private static async _cacheDevicesAsync() {
        // TODO: Invalidate cache after some period
        if (!DevicesRepository.isLoading &&
            !DevicesRepository.devicesCache) {
            DevicesRepository.isLoading = true;
            DevicesRepository.devicesCache = (await HttpService.getAsync<SignalDeviceDto[]>('/devices'))?.map(SignalDeviceDto.FromDto) ?? [];
            DevicesRepository.devicesCacheKeyed = {};
            DevicesRepository.devicesCache.forEach(device => {
                if (DevicesRepository.devicesCacheKeyed)
                    DevicesRepository.devicesCacheKeyed[device.id] = device;
            });
            DevicesRepository.devicesCache.sort((a, b) => a.alias.toLowerCase() < b.alias.toLowerCase() ? -1 : (a.alias.toLowerCase() > b.alias.toLowerCase() ? 1 : 0));

            DevicesRepository.isLoading = false;
        }

        // Wait to load
        while (DevicesRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
};
