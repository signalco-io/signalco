import { NextResponse } from 'next/server';
import getPixels from 'get-pixels';
import { extractColors } from 'extract-colors';
import { HmacSHA1 } from 'crypto-js';

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

    const query = `url=${domain}&full_page=true&width=1280&hide_cookie_banners=true`;
    const token = HmacSHA1(query, process.env.URLBOX_SECRET ?? '');
    const response = await fetch(`https://api.urlbox.io/v1/${process.env.URLBOX_KEY}/${token}/png?${query}`);
    const data = Buffer.from(await response.arrayBuffer());
    const dataUrlData = `data:image/png;base64,${data.toString('base64')}`;

    let colors: ScreenshotResponse['colors'] = [];
    try {
        const pixels = await getPixelsAsync(dataUrlData);
        colors = await extractColors({ data: pixels.data })
    } catch (e) {
        // TODO: Log error
    }

    return NextResponse.json({ data: dataUrlData, colors });
}
