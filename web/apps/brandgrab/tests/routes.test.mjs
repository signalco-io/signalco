import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import { BlockList, isIP } from 'node:net';
import { EventEmitter } from 'node:events';
import { Readable, pipeline } from 'node:stream';
import { createBrotliDecompress, createGunzip, createInflate, gzipSync } from 'node:zlib';
import { load } from 'cheerio';
import sharp from 'sharp';

// Execute the real handlers with isolated network boundaries and real HTML/image parsing.
async function moduleAt(file, bindings = {}, globals = {}, context = createContext({
    URL, URLSearchParams, Response, Headers, Buffer, AbortSignal, performance, process: { env: {} },
    console: { info() {}, debug() {}, error() {} }, ...globals,
})) {
    const source = stripTypeScriptTypes(await readFile(new URL(file, import.meta.url), 'utf8'));
    const module = new SourceTextModule(source, { context });
    await module.link(async (specifier) => {
        if (specifier.endsWith('siteUrl')) return moduleAt('../src/siteUrl.ts', bindings, globals, context);
        const exports = bindings[specifier];
        assert.ok(exports, `Unexpected import: ${specifier}`);
        return new SyntheticModule(Object.keys(exports), function () {
            for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
        }, { context });
    });
    await module.evaluate();
    return module;
}

async function route(name, bindings, fetch, env = {}) {
    const module = await moduleAt(`../app/api/${name}/route.ts`, {
        'next/server': { NextResponse: { json: Response.json.bind(Response) } },
        cheerio: { load }, sharp: { default: sharp },
        '../../../src/services/EnvProvider': { isDeveloper: false },
        '../../../src/services/fetchSite': {
            fetchSite: () => assert.fail('Unexpected network request'),
            publicSiteUrl: () => assert.fail('Unexpected network request'),
        },
        ...bindings,
    }, { fetch, process: { env } });
    return (domain) => module.namespace.GET(new Request(`https://brandgrab.io/api/${name}?${new URLSearchParams(domain === undefined ? {} : { domain })}`));
}

test('normalizes domains and full URLs and rejects unsupported inputs', async () => {
    const { namespace: { siteUrl } } = await moduleAt('../src/siteUrl.ts');
    assert.equal(siteUrl(' example.com ').href, 'https://example.com/');
    assert.equal(siteUrl('HTTP://Example.com/brand?a=1&b=2#top').href, 'http://example.com/brand?a=1&b=2');
    for (const input of ['', 'localhost', '127.0.0.1', '169.254.169.254', '[::1]', 'file://example.com/a',
        'https://user:pass@example.com', 'https://example.com:123', 'https://app.internal']) {
        assert.throws(() => siteUrl(input), undefined, input);
    }
});

test('metadata resolves artwork against the final page URL and tolerates missing optional images', async () => {
    const calls = [];
    const get = await route('quick', {
        '../../../src/services/fetchSite': { fetchSite: async (url) => {
            calls.push(url);
            if (calls.length === 1) {
                const response = new Response('<title>Example</title><meta name="description" content="A brand"><link rel="shortcut icon" href="icons/icon.png"><meta property="og:image" content="//cdn.example.com/og.png"><link rel="apple-touch-icon" href="/missing.png">');
                Object.defineProperty(response, 'url', { value: 'https://www.example.com/brand/' });
                return response;
            }
            if (url.endsWith('/missing.png')) throw new Error('404');
            return new Response('image bytes', { headers: { 'content-type': 'image/png' } });
        } },
    });
    const response = await get('example.com');
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.title, 'Example');
    assert.equal(result.description, 'A brand');
    assert.ok(result.favicon.base64.startsWith('data:image/png;base64,'));
    assert.equal(result.icons.appleTouchIconBase64, '');
    assert.ok(calls.includes('https://www.example.com/brand/icons/icon.png'));
    assert.ok(calls.includes('https://cdn.example.com/og.png'));
});

test('metadata uses the conventional favicon and reports website failures as JSON', async () => {
    const get = await route('quick', {
        '../../../src/services/fetchSite': { fetchSite: async (url) => {
            if (url === 'https://example.com/') return new Response('<title>No artwork</title>');
            assert.equal(url, 'https://example.com/favicon.ico');
            throw new Error('missing');
        } },
    });
    const result = await (await get('example.com')).json();
    assert.equal(result.favicon.base64, '');
    const failed = await route('quick', {
        '../../../src/services/fetchSite': { fetchSite: async () => { throw new Error('timeout'); } },
    });
    const response = await failed('example.com');
    assert.equal(response.status, 502);
    assert.ok((await response.json()).error);
});

for (const name of ['quick', 'screenshot']) {
    test(`${name} rejects missing and invalid input before using the network`, async () => {
        const get = await route(name, {});
        for (const domain of [undefined, 'localhost', 'https://user:pass@example.com', 'file://example.com']) {
            assert.equal((await get(domain)).status, 400);
        }
    });
}

test('screenshots encode the complete URL and extract colors from an RGB image', async () => {
    const png = await sharp({ create: { width: 12, height: 8, channels: 3, background: '#123456' } }).png().toBuffer();
    const get = await route('screenshot', {
        '../../../src/services/fetchSite': { publicSiteUrl: async (url) => new URL(url) },
    }, async (url) => {
        assert.equal(new URL(url).origin, 'https://browser.example.com');
        assert.equal(new URL(url).searchParams.get('url'), 'https://example.com/page?a=1&b=2');
        assert.equal(new URL(url).searchParams.get('fullPage'), 'true');
        return new Response(png);
    }, { SCREENSHOT_API_URL: 'https://browser.example.com/api/screenshot' });
    const response = await get('https://example.com/page?a=1&b=2');
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.width, 12);
    assert.equal(result.height, 8);
    assert.deepEqual(result.colors, [{ hex: '#123456', area: 1 }]);
});

for (const failure of ['http', 'network', 'invalid image']) {
    test(`screenshots return a JSON error for ${failure} failure`, async () => {
        const get = await route('screenshot', {
            '../../../src/services/fetchSite': { publicSiteUrl: async (url) => new URL(url) },
        }, async () => {
            if (failure === 'network') throw new Error('timeout');
            return new Response('not an image', { status: failure === 'http' ? 503 : 200 });
        });
        const response = await get('example.com');
        assert.equal(response.status, 502);
        assert.ok((await response.json()).error);
    });
}

async function websiteClient({ lookup, request }) {
    return (await moduleAt('../src/services/fetchSite.ts', {
        'node:net': { BlockList, isIP },
        'node:dns/promises': { lookup },
        'node:http': { request }, 'node:https': { request },
        'node:stream': { Readable, pipeline },
        'node:zlib': { createBrotliDecompress, createGunzip, createInflate },
    })).namespace;
}

function mockRequest(handler) {
    return (options, callback) => {
        const request = new EventEmitter();
        request.end = () => {
            const result = handler(options);
            const incoming = Readable.from(result.body ? [Buffer.from(result.body)] : []);
            incoming.statusCode = result.status ?? 200;
            incoming.headers = result.headers ?? {};
            callback(incoming);
        };
        return request;
    };
}

test('website fetching rejects private DNS addresses and revalidates redirects', async () => {
    const calls = [];
    const client = await websiteClient({
        lookup: async (hostname) => [{ address: hostname === 'private.example.com' ? '10.0.0.1' : '93.184.216.34', family: 4 }],
        request: mockRequest((options) => {
            calls.push(options.hostname);
            return { status: 302, headers: { location: 'https://private.example.com/' } };
        }),
    });
    await assert.rejects(() => client.fetchSite('https://example.com', AbortSignal.timeout(1000)), /public websites/);
    assert.deepEqual(calls, ['93.184.216.34']);
});

test('connects to the checked IP while preserving TLS name, Host, path and final URL', async () => {
    let lookups = 0;
    const client = await websiteClient({
        // A second DNS query would return a private address: it must never happen.
        lookup: async () => [{ address: lookups++ === 0 ? '93.184.216.34' : '127.0.0.1', family: 4 }],
        request: mockRequest((options) => {
            assert.equal(options.hostname, '93.184.216.34');
            assert.equal(options.servername, 'example.com');
            assert.equal(options.headers.host, 'example.com');
            assert.equal(options.path, '/brand?a=1&b=2');
            assert.equal(options.port, 443);
            return { body: '<title>Example</title>' };
        }),
    });
    const response = await client.fetchSite('https://example.com/brand?a=1&b=2', AbortSignal.timeout(1000));
    assert.equal(await response.text(), '<title>Example</title>');
    assert.equal(response.url, 'https://example.com/brand?a=1&b=2');
    assert.equal(lookups, 1);
});

test('decodes compressed website responses', async () => {
    const client = await websiteClient({
        lookup: async () => [{ address: '93.184.216.34', family: 4 }],
        request: mockRequest(() => ({ body: gzipSync('<title>Compressed</title>'), headers: { 'content-encoding': 'gzip' } })),
    });
    const response = await client.fetchSite('https://example.com', AbortSignal.timeout(1000));
    assert.equal(await response.text(), '<title>Compressed</title>');
    assert.equal(response.headers.get('content-encoding'), null);
});
