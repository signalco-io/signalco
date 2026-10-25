import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { isDeveloper } from '../../../src/services/EnvProvider';
import { siteUrl } from '../../../src/siteUrl';
import { publicSiteUrl } from '../../../src/services/fetchSite';

export type ScreenshotResponse = {
    data: string;
    width: number;
    height: number;
    colors: {
        hex: string;
        area: number;
    }[];
};

function extractColor(data: Buffer, channels: number) {
    const colors: string[] = [];
    for (let i = 0; i < data.length; i += channels) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];
        if (channels < 4 || (alpha ?? 0) > 0) {
            colors.push(`#${red?.toString(16).padStart(2, '0')}${green?.toString(16).padStart(2, '0')}${blue?.toString(16).padStart(2, '0')}`);
        }
    }
    return colors;
}

function colorsPalette(colors: string[]) {
    const colorMap = new Map<string, number>();
    for (const color of colors) {
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
    // Sum of all areas
    const totalArea = Array.from(colorMap.values()).reduce((a, b) => a + b, 0);
    // Normalize areas
    for (const [color, area] of colorMap.entries()) {
        colorMap.set(color, area / totalArea);
    }
    return colorMap;
}

function topColors(colors: Map<string, number>, count: number, minArea = 0.0001) {
    const sortedColors = Array.from(colors.entries()).sort((a, b) => b[1] - a[1]);
    const topColors = sortedColors.filter(([, area]) => area > minArea).slice(0, count);
    return topColors.map(([color, area]) => ({ hex: color, area }));
}

export const maxDuration = 60;

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
        await publicSiteUrl(url.href);
        const query = new URLSearchParams({ url: url.href, fullPage: 'true', width: '1280' });
        const browserApiUrl = 'https://browser.api.signalco.' + (isDeveloper ? 'dev' : 'io');
        const screenshotUrl = new URL(process.env.SCREENSHOT_API_URL || `${browserApiUrl}/api/screenshot`);
        screenshotUrl.search = query.toString();

        const response = await fetch(screenshotUrl, { cache: 'no-store', signal: AbortSignal.timeout(40_000) });
        const isSuccessResponse = response.status >= 200 && response.status < 300;
        if (!isSuccessResponse) {
            return NextResponse.json({ error: 'Failed to get screenshot' }, { status: 502 });
        }

        const data = Buffer.from(await response.arrayBuffer());
        const dataUrlDataPng = `data:image/png;base64,${data.toString('base64')}`;

        const metadata = await sharp(data).metadata();
        if (!metadata.width || !metadata.height) throw new Error('Invalid screenshot');

        let colors: ScreenshotResponse['colors'] = [];
        try {
            const start = performance.now();
            // Quantize near-identical shades so backgrounds do not fill the entire palette.
            const paletteImage = await sharp(data)
                .resize({ width: 256, withoutEnlargement: true })
                .png({ palette: true, colours: 16, dither: 0 })
                .toBuffer();
            const imgBuffer = await sharp(paletteImage).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
            const imgColors = extractColor(imgBuffer.data, imgBuffer.info.channels);
            const palette = colorsPalette(imgColors);
            colors = topColors(palette, 16);
            const end = performance.now() - start;
            console.debug(colors);
            console.info('Extracted colors in', end, 'ms');
        } catch (e) {
            console.error('Error extracting colors', e);
        }

        return NextResponse.json({ data: dataUrlDataPng, width: metadata.width, height: metadata.height, colors } satisfies ScreenshotResponse);
    } catch {
        return NextResponse.json({ error: 'The page preview is unavailable. Please try again later.' }, { status: 502 });
    }
}
