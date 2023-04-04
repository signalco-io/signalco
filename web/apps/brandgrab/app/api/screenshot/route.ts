import { NextResponse } from 'next/server';
import getPixels from 'get-pixels';
import { extractColors } from 'extract-colors';
import { isDeveloper } from '../../../src/services/EnvProvider';

function getPixelsAsync(url: string) {
    return new Promise<{data: Uint8ClampedArray, width?: number | undefined, height?: number | undefined}>((resolve, reject) => {
        getPixels(url, (err, pixels) => {
            if (err) {
                reject(err);
            } else {
                // NOTE: Type hack - Uint8Array not compatible with Uint8ClampedArray
                resolve(pixels as unknown as {data: Uint8ClampedArray, width?: number | undefined, height?: number | undefined});
            }
        });
    });
}

export type ScreenshotResponse = {
    data: string;
    colors: Awaited<ReturnType<typeof extractColors>>;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    if (!domain) {
        return NextResponse.json({ error: 'No domain provided' }, { status: 400 });
    }

    const query = `url=https://${domain}&fullPage=true&width=1280&scrollThrough=true`;
    const screenshotUrl = `https://browser.api.signalco.${isDeveloper ? 'dev' : 'io'}/api/screenshot?${query}`;
    console.info('Requesting screenshot', screenshotUrl);

    const response = await fetch(screenshotUrl);
    const data = Buffer.from(await response.arrayBuffer());
    const dataUrlDataPng = `data:image/png;base64,${data.toString('base64')}`;

    let colors: ScreenshotResponse['colors'] = [];
    try {
        const pixels = await getPixelsAsync(dataUrlDataPng);
        colors = await extractColors({ data: pixels.data })
    } catch (e) {
        console.error('Error extracting colors', e);
    }

    return NextResponse.json({ data: dataUrlDataPng, colors });
}
