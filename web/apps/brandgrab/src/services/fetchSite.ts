import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { Readable, pipeline } from 'node:stream';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import { siteUrl } from '../siteUrl';

const blocked = new BlockList();
for (const [address, prefix] of [
    ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
    ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.168.0.0', 16],
    ['198.18.0.0', 15], ['224.0.0.0', 4], ['240.0.0.0', 4],
] as const) blocked.addSubnet(address, prefix, 'ipv4');
for (const [address, prefix] of [
    ['::', 96], ['fc00::', 7], ['fe80::', 10], ['ff00::', 8],
] as const) blocked.addSubnet(address, prefix, 'ipv6');

async function resolvePublicSite(input: string) {
    const url = siteUrl(input);
    const addresses = await lookup(url.hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) =>
        blocked.check(address, isIP(address) === 6 ? 'ipv6' : 'ipv4'))) {
        throw new Error('Only public websites are supported.');
    }
    return { url, address: addresses[0]! };
}

export async function publicSiteUrl(input: string) {
    return (await resolvePublicSite(input)).url;
}

async function requestPublicSite(input: string, signal: AbortSignal): Promise<Response> {
    const { url, address } = await resolvePublicSite(input);
    signal.throwIfAborted();
    return new Promise((resolve, reject) => {
        const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)({
            // Connect to the checked IP itself; a second DNS lookup would allow rebinding.
            hostname: address.address,
            family: address.family,
            port: url.protocol === 'https:' ? 443 : 80,
            servername: url.hostname,
            path: url.pathname + url.search,
            headers: { host: url.hostname, 'accept-encoding': 'identity' },
            signal,
        }, (incoming) => {
            const headers = new Headers();
            for (const [key, value] of Object.entries(incoming.headers)) {
                if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
            const encoding = headers.get('content-encoding');
            const decompress = encoding === 'gzip' ? createGunzip()
                : encoding === 'br' ? createBrotliDecompress()
                    : encoding === 'deflate' ? createInflate() : undefined;
            let body: Readable = incoming;
            if (decompress) {
                body = pipeline(incoming, decompress, () => {});
                headers.delete('content-encoding');
                headers.delete('content-length');
            }
            const status = incoming.statusCode ?? 502;
            const response = new Response([204, 205, 304].includes(status) ? null
                : Readable.toWeb(body) as ReadableStream<Uint8Array>, { status, headers });
            Object.defineProperty(response, 'url', { value: url.href });
            resolve(response);
        });
        request.on('error', reject);
        request.end();
    });
}

export async function fetchSite(input: string, signal: AbortSignal): Promise<Response> {
    let url = input;
    for (let redirect = 0; redirect <= 5; redirect++) {
        const response = await requestPublicSite(url, signal);
        if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
            await response.body?.cancel();
            url = new URL(response.headers.get('location')!, response.url).href;
            continue;
        }
        if (!response.ok) {
            await response.body?.cancel();
            throw new Error('The website could not be loaded.');
        }
        return response;
    }
    throw new Error('The website redirected too many times.');
}
