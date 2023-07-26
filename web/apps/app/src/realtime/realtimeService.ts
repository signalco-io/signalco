import { QueryClient } from '@tanstack/react-query';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getApiUrl, getTokenFactory } from '../services/HttpService';
import { showNotification } from '../notifications/PageNotificationService';

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
            this.queryClient.invalidateQueries(['entity', change.entityId]);
            this.queryClient.invalidateQueries(['contact', change.entityId, change.channelName, change.contactName]);
        }
    }

    private async _hubStartWithRetryAsync(retryCount: number) {
        try {
            if (this.contactsHub == null) return;
            if (this.contactsHub.state === 'Connected')
                return;

            console.debug('Connecting to SignalR...');

            await this.contactsHub.start();
            this.contactsHub.on('contact', this.HandleDeviceStateAsync);
            this.contactsHub.onclose((err) => {
                console.log('SignalR connection closed. Reconnecting with delay...');
                console.debug('SignalR connection closes reason:', err);
                this._hubStartWithRetryAsync(0);
            });
            this.contactsHub.onreconnecting((err) => {
                console.log('Signalr reconnecting...');
                console.debug('Signalr reconnection reason:', err);
            });
            this.contactsHub.onreconnected(() => {
                console.log('Signalr reconnected');
                showNotification('Realtime connection to cloud established.', 'success');
            });
        } catch (err) {
            const delay = Math.min((retryCount + 1) * 2, 180);

            console.warn(`Failed to start SignalR hub connection. Reconnecting in ${delay}s`, err);

            // TODO: Some kind of indicator we are offline

            setTimeout(() => {
                this._hubStartWithRetryAsync(delay);
            }, (delay) * 1000);
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

        this._hubStartWithRetryAsync(0);
    }
}

const service = new RealtimeService();

export default service;
