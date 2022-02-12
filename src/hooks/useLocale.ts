import en from '../../locales/en.json';
import hr from '../../locales/hr.json';
import { ObjectDictAny } from '../sharedTypes';
import useUserSetting from './useUserSetting';

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
        if (innerArgs[5]) return "{";
        if (innerArgs[6]) return "}";
        const path = innerArgs[2];
        console.log(resolvePathDot(data as ObjectDictAny, path))
        return resolvePathDot(data as ObjectDictAny, path)?.toString() ?? `{${path}}`;
    });
}

export const availableLocales = ["hr", "en"];

export default function useLocale(...namespace: string[]) {
    const [userLocale] = useUserSetting('locale', 'en');

    let namespaceKeys = resolvePathSplit(userLocale === 'en' ? en : hr, namespace);

    return { t: (key: string, data?: object) => { return namespaceKeys && namespaceKeys[key] ? formatString(namespaceKeys[key], data) : `{${key}}`; } };
}