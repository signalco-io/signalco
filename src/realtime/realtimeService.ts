import PageNotificationService from '../notifications/PageNotificationService';
import HttpService from '../services/HttpService';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import CurrentUserProvider from '../services/CurrentUserProvider';

class SignalSignalRDeviceStateDto {
    entityId?: string;
    channelName?: string;
    contactName?: string;
    valueSerialized?: string;
    timeStamp?: string;
}

class RealtimeService {
    private contactsHub?: HubConnection;

    private async HandleDeviceStateAsync(state: string) {
        const change = JSON.parse(state) as SignalSignalRDeviceStateDto;
        if (typeof change.entityId === 'undefined' ||
            typeof change.channelName === 'undefined' ||
            typeof change.contactName === 'undefined' ||
            typeof change.timeStamp === 'undefined') {
            console.warn('Got device state with invalid values', state);
            return;
        }

        // TODO: Update local contact value
        console.debug('TODO: Update local contact value');
        // const device = await EntityRepository.byIdAsync(state.entityId);
        // if (typeof device !== 'undefined') {
        //     device.updateState(
        //         state.channelName,
        //         state.contactName,
        //         state.valueSerialized,
        //         new Date(state.timeStamp)
        //     );
        // }
    }

    private async _hubStartWithRetryAsync(retryCount: number) {
        try {
            if (this.contactsHub == null) return;

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
                PageNotificationService.show('Realtime connection to cloud established.', 'success');
            });
            } catch (err) {
            const delay = Math.min((retryCount + 1) * 2, 180);

            console.warn(`Failed to start SignalR hub connection. Reconnecting in ${delay}s`, err);

            // TODO: Some kind of indicator we are offline

            setTimeout(() => {
                this._hubStartWithRetryAsync(delay);
            }, (delay) * 1000);
        }
    };

    async startAsync() {
        if (this.contactsHub != null) return;

        console.debug('Configuring SignalR...');

        this.contactsHub = new HubConnectionBuilder()
          .withUrl(HttpService.getApiUrl('/signalr/contacts'), {
            accessTokenFactory: () => {
                const token = CurrentUserProvider.getToken();
                if (token === 'undefined')
                    throw Error('TokenFactory not present. Unable to authorize SignalR client.');
                return token!;
            }
          })
          .configureLogging(LogLevel.Information)
          .build();

        this._hubStartWithRetryAsync(0);
    };
}

const service = new RealtimeService();

export default service;
