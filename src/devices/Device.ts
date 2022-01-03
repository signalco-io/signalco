import { makeAutoObservable, makeObservable, observable } from "mobx";

export class SignalUserDto {
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

export interface IUser {
    id: string;
    email: string;
    fullName?: string;
}

export class User implements IUser {
    id: string;
    email: string;
    fullName?: string | undefined;

    constructor(id: string, email: string, fullName?: string) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
    }
}

export interface IDeviceContactDataValue {
    value: string;
    label?: string;
}

export class DeviceContactDataValue implements IDeviceContactDataValue {
    value: string;
    label?: string;

    constructor(value: string, label?: string) {
        this.value = value;
        this.label = label;
    }
}

export interface IDeviceContact {
    name: string;
    dataType: string;
    access: number;
    dataValues?: IDeviceContactDataValue[];
    dataValuesMultiple: boolean;
}

export class DeviceContact implements IDeviceContact {
    name: string;
    dataType: string;
    access: number;
    dataValues?: IDeviceContactDataValue[];
    dataValuesMultiple: boolean;

    constructor(name: string, dataType: string, access: number, dataValuesMultiple: boolean, dataValues?: IDeviceContactDataValue[])  {
        this.name = name;
        this.dataType = dataType;
        this.access = access;
        this.dataValues = dataValues;
        this.dataValuesMultiple = dataValuesMultiple;
    }
}

export interface IDeviceEndpoint {
    channel: string;
    contacts: IDeviceContact[];
}

export class DeviceEndpoint implements IDeviceEndpoint {
    channel: string;
    contacts: IDeviceContact[];

    constructor(channel: string, contacts: IDeviceContact[]) {
        this.channel = channel;
        this.contacts = contacts;
    }
}

export interface IDeviceModel {
    id: string;
    alias: string;
    identifier: string;
    endpoints: IDeviceEndpoint[]
    states: IDeviceContactState[];
    sharedWith: IUser[];
    manufacturer?: string;
    model?: string;

    getLastActivity(): Date | -1;
    getState(target: IDeviceTarget): IDeviceContactState;
    getContact(target: IDeviceTarget): IDeviceContact;
    updateState(channelName: string, contactName: string, valueSerialized: string|undefined, timeStamp: Date): void;
}

export class DeviceModel implements IDeviceModel {
    id: string;
    alias: string
    identifier: string;
    endpoints: IDeviceEndpoint[];
    states: IDeviceContactState[];
    sharedWith: IUser[];
    manufacturer?: string;
    model?: string;

    constructor(id: string, alias: string, identifier: string, endpoints: IDeviceEndpoint[], states: IDeviceContactState[], sharedWith: IUser[], manufacturer?: string, model?: string) {
        this.id = id;
        this.alias = alias;
        this.identifier = identifier;
        this.endpoints = endpoints;
        this.states = states;
        this.sharedWith = sharedWith;
        this.manufacturer = manufacturer;
        this.model = model;

        makeObservable(this, {
            manufacturer: observable,
            alias: observable,
            model: observable
        })
    }

    getLastActivity() {
        return this.states.map(s => s.timeStamp).sort((a, b) => a.getTime() - b.getTime()).pop() || -1;
    }

    getContact(target: IDeviceTarget) {
        return this.endpoints
            .filter(e => e.channel === target.channelName)
            .flatMap(i => i.contacts)
            .filter(i => i.name === target.contactName)[0];
    }

    getState(target: IDeviceTarget) {
        return this.states.filter(s =>
            s.channel === target.channelName && s.name === target.contactName)[0];
    }

    updateState(channelName: string, contactName: string, valueSerialized: string|undefined, timeStamp: Date) {
        const state = this.states.filter(s => s.channel === channelName && s.name === contactName)[0];
        if (state) {
            state.updateState(valueSerialized, timeStamp);
            console.debug('Device ', this.id, this.alias, 'state updated', state, valueSerialized, timeStamp);
        }
    }
}

export interface IDeviceContactState {
    name: string;
    channel: string;
    valueSerialized?: any
    timeStamp: Date;

    updateState(valueSerialized: string|undefined, timeStamp: Date): void;
}

export class DeviceContactState implements IDeviceContactState {
    name: string;
    channel: string;
    valueSerialized?: any;
    timeStamp: Date;

    _changedListeners: Function[] = [];

    constructor(name: string, channel: string, valueSerialized: string|undefined, timeStamp: Date) {
        this.name = name;
        this.channel = channel;
        this.valueSerialized = valueSerialized;
        this.timeStamp = timeStamp;

        makeAutoObservable(this);
    }

    updateState(valueSerialized: string|undefined, timeStamp: Date) {
        this.valueSerialized = valueSerialized;
        this.timeStamp = timeStamp;
    }
}

export interface IDeviceTargetIncomplete {
    deviceId: string;
    channelName?: string;
    contactName?: string;
}

export interface IDeviceTarget {
    deviceId: string;
    channelName: string;
    contactName: string;
}

export interface IDeviceTargetWithValueFallback extends IDeviceTarget {
    valueSerialized?: string
}
