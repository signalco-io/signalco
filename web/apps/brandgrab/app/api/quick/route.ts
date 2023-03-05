import {load} from 'cheerio';
import { isAbsoluteUrl } from '@signalco/js';
import { NextResponse } from 'next/server'

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

async function fetchDataUrl(url: string, domain: string) {
    const response = await fetch(isAbsoluteUrl(url) ? url : `https://${domain}${url}`)
    const blob = await response.blob();
    const base64Data = Buffer.from(await blob.arrayBuffer()).toString('base64');
    return `data:${response.headers.get('content-type')};base64,${base64Data}`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    if (!domain) {
        return NextResponse.json({ error: 'No domain provided' }, { status: 400 });
    }

    const pageHtml = await fetch(`https://${domain}`);
    const $ = load(await pageHtml.text());
    const title = $('title')?.text() || '';
    const description = $('meta[name="description"]')?.attr('content') || '';
    const favicon = $('link[rel="icon"]')?.attr('href') || '';
    const icon16 = $('link[rel="icon"][sizes="16x16"]')?.attr('href') || '';
    const icon32 = $('link[rel="icon"][sizes="32x32"]')?.attr('href') || '';
    const icon64 = $('link[rel="icon"][sizes="64x64"]')?.attr('href') || '';
    const icon128 = $('link[rel="icon"][sizes="128x128"]')?.attr('href') || '';
    const icon256 = $('link[rel="icon"][sizes="256x256"]')?.attr('href') || '';
    const icon512 = $('link[rel="icon"][sizes="512x512"]')?.attr('href') || '';
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

    let favIcoBase64 = '';
    if (favicon.length > 0) {
        favIcoBase64 = await fetchDataUrl(favicon, domain) ?? '';
    }

    let ogImageBase64 = '';
    if (ogImage.length > 0) {
        ogImageBase64 = await fetchDataUrl(ogImage, domain) ?? '';
    }

    let icon16Base64 = '';
    if (icon16.length > 0) {
        icon16Base64 = await fetchDataUrl(icon16, domain) ?? '';
    }

    let icon32Base64 = '';
    if (icon32.length > 0) {
        icon32Base64 = await fetchDataUrl(icon32, domain) ?? '';
    }

    let icon64Base64 = '';
    if (icon64.length > 0) {
        icon64Base64 = await fetchDataUrl(icon64, domain) ?? '';
    }

    let icon128Base64 = '';
    if (icon128.length > 0) {
        icon128Base64 = await fetchDataUrl(icon128, domain) ?? '';
    }

    let icon256Base64 = '';
    if (icon256.length > 0) {
        icon256Base64 = await fetchDataUrl(icon256, domain) ?? '';
    }

    let icon512Base64 = '';
    if (icon512.length > 0) {
        icon512Base64 = await fetchDataUrl(icon512, domain) ?? '';
    }

    let appleTouchIconBase64 = '';
    if (appleTouchIcon.length > 0) {
        appleTouchIconBase64 = await fetchDataUrl(appleTouchIcon, domain) ?? '';
    }

    return NextResponse.json({
        domain,
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
}
