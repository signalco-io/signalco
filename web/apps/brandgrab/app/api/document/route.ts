import { NextResponse } from 'next/server';
import { siteUrl } from '../../../src/siteUrl';
import { fetchSite } from '../../../src/services/fetchSite';
export const maxDuration = 20;
export async function GET(request: Request) {
    const input = new URL(request.url).searchParams.get('url');
    let url: URL;
    try { url = siteUrl(input || ''); } catch { return NextResponse.json({ error: 'Enter a public document URL.' }, { status: 400 }); }
    try {
        const response = await fetchSite(url.href, AbortSignal.timeout(12_000));
        const reader = response.body!.getReader();
        const chunks: Uint8Array[] = [];
        let size = 0;
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.length;
            if (size > 2_000_000) { await reader.cancel(); throw new Error('Document too large'); }
            chunks.push(value);
        }
        return NextResponse.json({ url: response.url || url.href, text: Buffer.concat(chunks).toString('utf8') });
    } catch { return NextResponse.json({ error: 'This document could not be loaded (missing, blocked, or larger than 2 MB).' }, { status: 502 }); }
}
