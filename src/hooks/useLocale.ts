import { useMemo } from 'react';
import useIsClient from './useIsClient';
import { ObjectDictAny } from '../sharedTypes';
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

        if (!namespaceKeys) {
            break;
        }
        namespaceKeys = namespaceKeys[nextNamespaceKey] as ObjectDictAny;
    }

    return namespaceKeys;
}

function formatString(text: string, data?: object) {
    return text.replace(/\{((\d+|[a-zA-Z_$]\w*(?:\.[a-zA-Z_$]\w*|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*(?:(?:\}\})+[^\}]+)*))?)\}|(\{\{)|(\}\})/g, function () {
        var innerArgs = arguments;
        if (innerArgs[5]) return '{';
        if (innerArgs[6]) return '}';
        const path = innerArgs[2];
        return resolvePathDot(data as ObjectDictAny, path)?.toString() ?? `{${path}}`;
    });
}

export const availableLocales = ['hr', 'en'];

export function localizer(...namespace: string[]): LocalizeFunc {
    const userLocale = UserSettingsProvider.value('locale', 'en');

    let namespaceKeys = resolvePathSplit(userLocale === 'en' ? en : hr, namespace);

    return (key: string, data?: object) => { return namespaceKeys && namespaceKeys[key] ? formatString(namespaceKeys[key], data) : `{${key}}`; };
}

export function useLocalePlaceholders() {
    return useLocale('App', 'Placeholders');
}

export function useLocaleHelpers() {
    return useLocale('Helpers');
}

export default function useLocale(...namespace: string[]): {t: LocalizeFunc} {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const t = useMemo(() => localizer(...namespace), [...namespace]);
    const isClient = useIsClient();

    return { t: isClient ? t : () => '' };
}
