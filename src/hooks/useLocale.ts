import en from '../../locales/en.json';
import hr from '../../locales/hr.json';

const useLocale = (...namespace: string[]) => {
    const locale = 'en';

    let namespaceKeys = locale === 'en' ? en : hr;
    for (let i = 0; i < namespace.length; i++) {
        const nextNamespaceKey = namespace[i];
        namespaceKeys = namespaceKeys[nextNamespaceKey];
    }
    return { t: (key: string, data?: object) => {return namespaceKeys[key];}}
};

export default useLocale;