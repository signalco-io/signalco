import { NextResponse } from 'next/server';
import { HmacSHA1 } from 'crypto-js';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    if (!domain) {
        return NextResponse.json({ error: 'No domain provided' }, { status: 400 });
    }

    const query = `url=${domain}&full_page=true&width=1280&hide_cookie_banners=true`;
    const token = HmacSHA1(query, process.env.URLBOX_SECRET ?? '');
    const response = await fetch(`https://api.urlbox.io/v1/${process.env.URLBOX_KEY}/${token}/webp?${query}`);
    const data = Buffer.from(await response.arrayBuffer());

    return NextResponse.json({ data: `data:image/webp;base64,${data.toString('base64')}` });
}
