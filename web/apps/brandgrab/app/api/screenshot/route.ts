import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { isDeveloper } from '../../../src/services/EnvProvider';
import { siteUrl } from '../../../src/siteUrl';
import { publicSiteUrl } from '../../../src/services/fetchSite';
import { devices, type Device, type Capture } from '../../../src/inspector';
export type ScreenshotResponse = Capture;
export const maxDuration = 60;
export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const domain = params.get('domain');
    const device = params.get('device') || 'desktop';
    if (!domain || !Object.hasOwn(devices, device)) return NextResponse.json({ error: 'A website and valid device are required.' }, { status: 400 });
    let url: URL;
    try { url = siteUrl(domain); } catch {
        return NextResponse.json({ error: 'Enter a public website domain or an HTTP(S) URL.' }, { status: 400 });
    }
    try {
        await publicSiteUrl(url.href);
        const viewport = devices[device as Device];
        const query = new URLSearchParams({ url: url.href, fullPage: 'true', scrollThrough: 'true', width: String(viewport.width), height: String(viewport.height), mobile: String(device !== 'desktop'), inspect: String(device === 'desktop') });
        const endpoint = new URL(process.env.SCREENSHOT_API_URL || `https://browser.api.signalco.${isDeveloper ? 'dev' : 'io'}/api/screenshot`);
        endpoint.search = query.toString();
        const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(50_000) });
        if (!response.ok) throw new Error('Capture failed');
        const json = response.headers.get('content-type')?.includes('application/json');
        const result = json ? await response.json() as Capture : undefined;
        const bytes = result ? Buffer.from(result.data.split(',')[1] || '', 'base64') : Buffer.from(await response.arrayBuffer());
        const metadata = await sharp(bytes).metadata();
        if (!metadata.width || !metadata.height) throw new Error('Invalid screenshot');
        return NextResponse.json({ data: `data:image/png;base64,${bytes.toString('base64')}`, width: metadata.width, height: metadata.height, ...(result ? { inspection: result.inspection, reachedBottom: result.reachedBottom } : {}) } satisfies Capture);
    } catch {
        return NextResponse.json({ error: 'The page preview is unavailable. Please try again later.' }, { status: 502 });
    }
}
