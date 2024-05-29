import { QueryClient } from '@tanstack/react-query';
import { showNotification } from '@signalco/ui-notifications';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getApiUrl, getTokenFactory } from '../services/HttpService';
import { contactKey } from '../hooks/signalco/useContact';
import { entityKey } from '../hooks/signalco/entity/useEntities';

class SignalSignalRDeviceStateDto {
    entityId?: string;
    channelName?: string;
    contactName?: string;
    valueSerialized?: string;
    timeStamp?: string;
}

class RealtimeService {
    private contactsHub?: HubConnection;
    public queryClient?: QueryClient = undefined;

    constructor() {
        this.HandleDeviceStateAsync = this.HandleDeviceStateAsync.bind(this);
    }

    private async HandleDeviceStateAsync(state: string) {
        const change = JSON.parse(state) as SignalSignalRDeviceStateDto;
        if (typeof change.entityId === 'undefined' ||
            typeof change.channelName === 'undefined' ||
            typeof change.contactName === 'undefined' ||
            typeof change.timeStamp === 'undefined') {
            console.warn('Got device state with invalid values', state);
            return;
        }

        if (this.queryClient) {
            console.debug('Invalidated queries for entity and contact', change.entityId, change.channelName, change.contactName);
            this.queryClient.invalidateQueries({ queryKey: entityKey(change.entityId) });
            this.queryClient.invalidateQueries({ queryKey: contactKey(change) });
        }
    }

    async startAsync() {
        if (this.contactsHub != null) return;

        console.debug('Configuring SignalR...');

        this.contactsHub = new HubConnectionBuilder()
            .withUrl(getApiUrl('/signalr/contacts'), {
                accessTokenFactory: async () => {
                    const factory = getTokenFactory();
                    if (!factory) {
                        throw Error('TokenFactory not present.');
                    }

                    const token = await factory();
                    if (token === 'undefined' || typeof token === 'undefined') {
                        throw Error('TokenFactory not present. Unable to authorize SignalR client.');
                    }

                    return token;
                }
            })
            .configureLogging(LogLevel.Information)
            .build();

        console.debug('Connecting to SignalR...');

        try {
            let reconnectDelay = 1000;
            await this.contactsHub.start();
            this.contactsHub.on('contact', this.HandleDeviceStateAsync);
            this.contactsHub.onclose((err) => {
                console.error(`SignalR connection closed. Reconnecting with delay ${reconnectDelay}ms...`);
                console.debug('SignalR connection closes reason:', err);
                setTimeout(() => {
                    reconnectDelay *= 2;
                    if (reconnectDelay > 60000) {
                        showNotification('SignalR connection lost. Reconnecting...', 'warning');
                        reconnectDelay = 60000;
                    }
                    this.contactsHub?.start();
                }, reconnectDelay);
            });
            this.contactsHub.onreconnecting((err) => {
                console.warn('Signalr reconnecting...');
                console.debug('Signalr reconnection reason:', err);
            });
            this.contactsHub.onreconnected(() => {
                console.log('Signalr reconnected');
                showNotification('Real-time connection to cloud established.', 'success');
            });
        } catch (err) {
            console.error('Error starting SignalR connection', err);
            showNotification('Error starting real-time connection to cloud. Please refresh page to re-establish connection.', 'error');
        }
    }
}

const service = new RealtimeService();

export default service;
