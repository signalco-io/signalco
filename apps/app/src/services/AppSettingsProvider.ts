import UserSettingsProvider from './UserSettingsProvider';
import { isDeveloper } from './EnvProvider';

export const ApiProductionUrl = 'https://api.signalco.io/api/';
export const ApiDevelopmentUrl = 'https://api.signalco.dev/api/'

export function signalcoApiEndpointIsProduction() {
    return signalcoApiEndpoint() === ApiProductionUrl;
}

export function signalcoApiEndpoint() {
    return UserSettingsProvider.value<string>(
        'dev:apiEndpoint',
        isDeveloper
            ? ApiDevelopmentUrl
            : ApiProductionUrl);
}

export function setSignalcoApiEndpoint(value: string) {
    UserSettingsProvider.set('dev:apiEndpoint', value);
}
