import { NextResponse } from 'next/server';
import {load} from 'cheerio';
import { siteUrl } from '../../../src/siteUrl';
import { fetchSite } from '../../../src/services/fetchSite';

export type BrandResources = {
    domain: string;
    description: string;
    title: string;
    themeColor: string;
    msTileImage: string;
    msTileColor: string;
    favicon: {
        url: string;
        base64: string;
    };
    icons: {
        icon16: string;
        icon16Base64: string;
        icon32: string;
        icon32Base64: string;
        icon64: string;
        icon64Base64: string;
        icon128: string;
        icon128Base64: string;
        icon256: string;
        icon256Base64: string;
        icon512: string;
        icon512Base64: string;
        appleTouchIcon: string;
        appleTouchIconBase64: string;
    };
    og: {
        image: string;
        imageBase64: string;
        imageWidth: number | undefined;
        imageHeight: number | undefined;
        title: string;
        description: string;
        url: string;
        siteName: string;
        type: string;
        locale: string;
        localeAlternate: string;
    };
    twitter: {
        card: string;
    };
}

async function fetchDataUrl(url: string, baseUrl: string, signal: AbortSignal) {
    if (!url) return '';
    try {
        const response = await fetchSite(new URL(url, baseUrl).href, signal);
        const contentType = response.headers.get('content-type')?.split(';')[0];
        if (!contentType?.startsWith('image/')) {
            await response.body?.cancel();
            return '';
        }
        const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch {
        // Optional artwork must not discard otherwise useful page metadata.
        return '';
    }
}

export const maxDuration = 30;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    if (!domain) {
        return NextResponse.json({ error: 'No domain provided' }, { status: 400 });
    }

    let url: URL;
    try {
        url = siteUrl(domain);
    } catch {
        return NextResponse.json({ error: 'Enter a public website domain or an HTTP(S) URL.' }, { status: 400 });
    }

    try {
        const signal = AbortSignal.timeout(12_000);
        const pageHtml = await fetchSite(url.href, signal);
        const baseUrl = pageHtml.url || url.href;
        const $ = load(await pageHtml.text());
        const title = $('title')?.text() || '';
        const description = $('meta[name="description"]')?.attr('content') || '';
        const favicon = $('link[rel~="icon"]')?.attr('href') || '/favicon.ico';
        const icon16 = $('link[rel~="icon"][sizes="16x16"]')?.attr('href') || '';
        const icon32 = $('link[rel~="icon"][sizes="32x32"]')?.attr('href') || '';
        const icon64 = $('link[rel~="icon"][sizes="64x64"]')?.attr('href') || '';
        const icon128 = $('link[rel~="icon"][sizes="128x128"]')?.attr('href') || '';
        const icon256 = $('link[rel~="icon"][sizes="256x256"]')?.attr('href') || '';
        const icon512 = $('link[rel~="icon"][sizes="512x512"]')?.attr('href') || '';
        const themeColor = $('meta[name="theme-color"]')?.attr('content') || '';
        const appleTouchIcon = $('link[rel="apple-touch-icon"]')?.attr('href') || '';
        const msTileImage = $('meta[name="msapplication-TileImage"]')?.attr('content') || '';
        const msTileColor = $('meta[name="msapplication-TileColor"]')?.attr('content') || '';
        const ogImage = $('meta[property="og:image"]')?.attr('content') || '';
        const ogImageWidthString = $('meta[property="og:image:width"]')?.attr('content') || '';
        const ogImageWidth: number | undefined = ogImageWidthString ? parseInt(ogImageWidthString) : undefined;
        const ogImageHeightString = $('meta[property="og:image:height"]')?.attr('content') || '';
        const ogImageHeight: number | undefined = ogImageHeightString ? parseInt(ogImageHeightString) : undefined;
        const ogTitle = $('meta[property="og:title"]')?.attr('content') || '';
        const ogDescription = $('meta[property="og:description"]')?.attr('content') || '';
        const ogUrl = $('meta[property="og:url"]')?.attr('content') || '';
        const ogSiteName = $('meta[property="og:site_name"]')?.attr('content') || '';
        const ogType = $('meta[property="og:type"]')?.attr('content') || '';
        const ogLocale = $('meta[property="og:locale"]')?.attr('content') || '';
        const ogLocaleAlternate = $('meta[property="og:locale:alternate"]')?.attr('content') || '';
        const twitterCard = $('meta[name="twitter:card"]')?.attr('content') || '';

        const [favIcoBase64 = '', ogImageBase64 = '', icon16Base64 = '', icon32Base64 = '', icon64Base64 = '',
            icon128Base64 = '', icon256Base64 = '', icon512Base64 = '', appleTouchIconBase64 = ''] = await Promise.all(
            [favicon, ogImage, icon16, icon32, icon64, icon128, icon256, icon512, appleTouchIcon]
                .map((image) => fetchDataUrl(image, baseUrl, signal))
        );

        return NextResponse.json({
            domain: url.href,
            title,
            description,
            themeColor,
            msTileImage,
            msTileColor,
            favicon: {
                url: favicon,
                base64: favIcoBase64
            },
            icons: {
                icon16,
                icon16Base64,
                icon32,
                icon32Base64,
                icon64,
                icon64Base64,
                icon128,
                icon128Base64,
                icon256,
                icon256Base64,
                icon512,
                icon512Base64,
                appleTouchIcon,
                appleTouchIconBase64,
            },
            og: {
                image: ogImage,
                imageBase64: ogImageBase64,
                imageWidth: ogImageWidth,
                imageHeight: ogImageHeight,
                title: ogTitle,
                description: ogDescription,
                url: ogUrl,
                siteName: ogSiteName,
                type: ogType,
                locale: ogLocale,
                localeAlternate: ogLocaleAlternate
            },
            twitter: {
                card: twitterCard
            },
        } satisfies BrandResources);
    } catch {
        return NextResponse.json({ error: 'Could not load this website. Check the address and try again.' }, { status: 502 });
    }
}
