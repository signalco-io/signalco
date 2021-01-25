import { makeAutoObservable } from "mobx";

export interface IDeviceContact {
    name: string;
    dataType: string;
    access: number;
}

export class DeviceContact implements IDeviceContact {
    name: string;
    dataType: string;
    access: number;

    constructor(name: string, dataType: string, access: number)  {
        this.name = name;
        this.dataType = dataType;
        this.access = access;
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

    updateState(channelName: string, contactName: string, valueSerialized: string|undefined, timeStamp: Date): void;
}

export class DeviceModel implements IDeviceModel {
    id: string;
    alias: string;
    identifier: string;
    endpoints: IDeviceEndpoint[];
    states: IDeviceContactState[];

    constructor(id: string, alias: string, identifier: string, endpoints: IDeviceEndpoint[], states: IDeviceContactState[]) {
        this.id = id;
        this.alias = alias;
        this.identifier = identifier;
        this.endpoints = endpoints;
        this.states = states;
    }

    updateState(channelName: string, contactName: string, valueSerialized: string|undefined, timeStamp: Date) {
        const state = this.states.filter(s => s.channel === channelName && s.name === contactName)[0];
        if (state) {
            state.updateState(valueSerialized, timeStamp);
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

export interface IDeviceTarget {
    deviceId: string;
    channelName: string;
    contactName: string;
}

export interface IDeviceStatePublish extends IDeviceTarget {
    valueSerialized?: string;
    timeStamp: Date;
}

export class DeviceStatePublish implements IDeviceStatePublish {
    deviceId: string;
    channelName: string;
    contactName: string;
    valueSerialized?: string;
    timeStamp: Date;

    constructor(deviceId: string, channelName: string, contactName: string, valueSerialized: string|undefined, timeStamp: Date) {
        this.deviceId = deviceId;
        this.contactName = contactName;
        this.channelName = channelName;
        this.valueSerialized = valueSerialized;
        this.timeStamp = timeStamp;
        makeAutoObservable(this);
    }
}
