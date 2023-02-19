import { isAbsoluteUrl, trimStartChar } from '@signalco/js';
import { signalcoApiEndpoint } from './AppSettingsProvider';

export function getApiUrl(url: string): string {
    return signalcoApiEndpoint() + trimStartChar(url, '/');
}

let _tokenFactory: (() => Promise<string | undefined>) | undefined = undefined;
export function setTokenFactory(factory: () => Promise<string | undefined>) {
    _tokenFactory = factory;
}

export function getTokenFactory() {
    return _tokenFactory;
}

async function _getBearerTokenAsync() {
    const tokenFactory = getTokenFactory();
    if (tokenFactory) {
        const token = await tokenFactory();
        if (typeof token !== 'undefined') {
            return `Bearer ${token}`;
        }
    }

    console.warn('Token is undefined');
    throw new Error('Login failed.');
}

export async function requestAsync(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    headers?: Record<string, string>
) {
    const token = await _getBearerTokenAsync();
    try {
        const urlResolved = new URL(isAbsoluteUrl(url) ? url : getApiUrl(url));
        if (method === 'get' && data) {
            urlResolved.search = new URLSearchParams(data).toString();
        }
        const response = await fetch(urlResolved, {
            method: method,
            body: method !== 'get' ? JSON.stringify(data) : undefined,
            headers: {
                Accept: 'application/json',
                Authorization: token,
                'Content-Type': 'application/json',
                ...headers
            },
        });

        if (response.status === 200) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }

        if (response.status === 403) {
            console.warn('Token expired: ', response.statusText, response.status);
        }

        let bodyText: string | null = null;
        try {
            bodyText = await response.text()
        } catch {
            bodyText = 'empty response';
        }
        throw new Error(`Got status ${response.statusText} (${response.status}): ${bodyText}`);
    } catch(err) {
        console.error('Unknown API error', err);
        throw err;
    }
}

export async function getAsync<T>(url: string, data?: any): Promise<T> {
    return await requestAsync(url, 'get', data) as T;
}
