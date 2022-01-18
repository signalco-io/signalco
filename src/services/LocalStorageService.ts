import { ValueOrFuncGeneric } from "../sharedTypes";

class LocalStorageService {
    getItem<T>(key: string, skipDeseriaalization?: boolean): T | undefined {
        return this.getItemOrDefault(key, undefined, skipDeseriaalization);
    }

    getItemOrDefault<T>(key: string, defaultValue: ValueOrFuncGeneric<T>, skipDeseriaalization?: boolean): T {
        if (typeof window === 'undefined' || !window?.localStorage) {
            return typeof defaultValue === 'function'
                ? defaultValue()
                : defaultValue;
        }

        const value = window.localStorage.getItem(key);
        if (typeof value !== 'undefined' && value != null) {
            try {
                return skipDeseriaalization
                    ? value as unknown as T
                    : JSON.parse(value);
            }
            catch {
                return value as unknown as T;
            }
        }

        return typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue;
    }

    setItem<T>(key: string, value: T | undefined) {
        if (typeof window === 'undefined' || !(window?.localStorage)) {
            throw new Error("Local storage is not available at this moment.");
        }

        if (typeof value === 'undefined' || value == null) {
            window.localStorage.removeItem(key);
        }
        else {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    }

    removeItem(key: string) {
        if (typeof window === 'undefined' || !window?.localStorage) {
            throw new Error("Local storage is not available at this moment.");
        }

        window.localStorage.removeItem(key);
    }
}

const service = new LocalStorageService();

export default service;