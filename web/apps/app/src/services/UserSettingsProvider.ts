import { ValueOrFuncGeneric } from '@signalco/js';
import LocalStorageService from './LocalStorageService';

class UserSettingsProvider {
    value<T>(key: string, defaultValue: ValueOrFuncGeneric<T>) {
        return LocalStorageService.getItemOrDefault<T>(key, defaultValue)
    }

    set<T>(key: string, value: T | undefined) {
        LocalStorageService.setItem(key, value);
    }
}

const provider = new UserSettingsProvider();

export default provider;
