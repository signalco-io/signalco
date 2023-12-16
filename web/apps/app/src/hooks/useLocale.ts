import { useMemo } from 'react';
import { ObjectDictAny } from '@signalco/js';
import { useIsServer } from '@signalco/hooks/useIsServer';
import UserSettingsProvider from '../services/UserSettingsProvider';
import hr from '../../locales/hr.json';
import en from '../../locales/en.json';

export type LocalizeFunc = (key: string, data?: object | undefined) => string;

function resolvePathDot(data: ObjectDictAny, path: string) {
    return resolvePathSplit(data, path.split('.'));
}

function resolvePathSplit(data: ObjectDictAny, pathParts: string[]) {
    let namespaceKeys = data;
    for (let i = 0; i < pathParts.length; i++) {
        const nextNamespaceKey = pathParts[i];
        if (!nextNamespaceKey) {
            break;
        }
        namespaceKeys = namespaceKeys[nextNamespaceKey] as ObjectDictAny;
    }

    return namespaceKeys;
}

function formatString(text: string, data?: object) {
    return text.replace(/\{((\d+|[a-zA-Z_$]\w*(?:\.[a-zA-Z_$]\w*|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*(?:(?:\}\})+[^\}]+)*))?)\}|(\{\{)|(\}\})/g, function (...args) {
        if (args[5]) return '{';
        if (args[6]) return '}';
        const path = args[2];
        return resolvePathDot(data as ObjectDictAny, path)?.toString() ?? `{${path}}`;
    });
}

export const availableLocales = ['hr', 'en'];

export function localizer(...namespace: string[]): LocalizeFunc {
    const userLocale = UserSettingsProvider.value('locale', 'en');

    const namespaceKeys = resolvePathSplit(userLocale === 'en' ? en : hr, namespace);

    return (key: string, data?: object) => {
        const valueUnknown = namespaceKeys[key];
        const value = typeof valueUnknown === 'string' ? valueUnknown : undefined;
        return typeof value !== 'undefined'
            ? formatString(value, data)
            : `{${key}}`;
    };
}

export function useLocalePlaceholders() {
    return useLocale('App', 'Placeholders');
}

export function useLocaleHelpers() {
    return useLocale('Helpers');
}

export default function useLocale(...namespace: string[]): { t: LocalizeFunc } {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const t = useMemo(() => localizer(...namespace), [...namespace]);
    const isServer = useIsServer();

    return { t: !isServer ? t : () => '' };
}
