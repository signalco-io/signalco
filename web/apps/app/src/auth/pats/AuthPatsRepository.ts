import createClient from 'openapi-fetch';
import { _getBearerTokenAsync, getApiUrl } from '../../services/HttpService';
import { paths } from '../../api/signalco/schema'; // generated from openapi-typescript

async function signalcoApiClient() {
    return createClient<paths>({
        baseUrl: getApiUrl(),
        headers: { Authorization: await _getBearerTokenAsync() },
    });
}

export async function authPatsAsync() {
    const client = await signalcoApiClient();
    const pats = (await client.GET('/auth/pats')).data;
    return pats?.map((pat) => ({
        ...pat,
        expire: pat.expire ? new Date(pat.expire) : undefined
    }));
}

export async function authPatCreateAsync(alias: string | undefined, expire: Date | undefined) {
    const client = await signalcoApiClient();
    return (await client.POST('/auth/pats', {
        body: {
            alias,
            expire: expire instanceof Date ? expire.toISOString() : undefined
        }
    })).data;
}
