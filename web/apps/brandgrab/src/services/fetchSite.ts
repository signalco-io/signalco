import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
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

export async function publicSiteUrl(input: string) {
    const url = siteUrl(input);
    const addresses = await lookup(url.hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) =>
        blocked.check(address, isIP(address) === 6 ? 'ipv6' : 'ipv4'))) {
        throw new Error('Only public websites are supported.');
    }
    return url;
}

export async function fetchSite(input: string, signal: AbortSignal): Promise<Response> {
    let url = input;
    for (let redirect = 0; redirect <= 5; redirect++) {
        const target = await publicSiteUrl(url);
        const response = await fetch(target, { redirect: 'manual', signal });
        if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
            await response.body?.cancel();
            url = new URL(response.headers.get('location')!, target).href;
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
