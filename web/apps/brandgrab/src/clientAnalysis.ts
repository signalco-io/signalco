import type { Inspection, StyleSample } from './inspector';

export function safeLink(value: string, base?: string) {
    try { const url = new URL(value, base); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
export function rgb(color: string): number[] | undefined {
    const match = color.match(/^rgba?\(([^)]+)\)$/);
    if (!match) return undefined;
    const parts = match[1]!.split(/[\s,\/]+/).filter(Boolean).map(Number);
    return parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite) && (parts.length < 4 || parts[3] === 1) ? parts.slice(0, 3) : undefined;
}
export function hex(color: string) {
    const parts = rgb(color);
    return parts ? '#' + parts.map(v => Math.round(v).toString(16).padStart(2, '0')).join('') : undefined;
}
function luminance(parts: number[]) {
    return parts.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0);
}
export function contrast(sample: StyleSample) {
    const fg = rgb(sample.color), bg = rgb(sample.background);
    if (!fg || !bg || !sample.text) return undefined;
    const a = luminance(fg), b = luminance(bg);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
export function groupColors(inspection?: Inspection) {
    const groups: Record<string, Map<string, number>> = { Accent: new Map(), Typography: new Map(), Background: new Map(), Secondary: new Map(), Tertiary: new Map() };
    const add = (group: string, value: string, count: number) => { const h = hex(value); if (h) groups[group]!.set(h, (groups[group]!.get(h) || 0) + count); };
    for (const s of inspection?.styles || []) {
        add('Typography', s.color, s.count);
        add('Background', s.background, s.count);
        for (const color of [s.color, s.background]) {
            const parts = rgb(color);
            if (parts && Math.max(...parts) - Math.min(...parts) > 45) add(['a', 'button'].includes(s.tag) ? 'Accent' : 'Secondary', color, s.count);
            else add('Tertiary', color, s.count);
        }
    }
    return Object.entries(groups).map(([label, colors]) => ({ label, colors: [...colors].sort((a,b) => b[1]-a[1]).slice(0, 8).map(([color]) => color) }));
}
export function analyzeSeo(html: string, base: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const meta = (name: string) => doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const headings = [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({ level: Number(h.tagName[1]), text: h.textContent?.trim() || '' }));
    const title = doc.querySelector('title')?.textContent?.trim() || '';
    const description = meta('description');
    const robots = meta('robots');
    const checks = [
        { label: 'Page title', value: title || 'Missing', ok: !!title },
        { label: 'Meta description', value: description || 'Missing', ok: !!description },
        { label: 'Canonical URL', value: canonical ? safeLink(canonical, base) || 'Invalid URL' : 'Missing', ok: !!canonical && !!safeLink(canonical, base) },
        { label: 'Indexing directive', value: robots || 'No robots meta directive', ok: !/noindex/i.test(robots) },
        { label: 'Main heading', value: `${headings.filter(h => h.level === 1).length} H1 headings`, ok: headings.filter(h => h.level === 1).length === 1 },
        { label: 'Document language', value: doc.documentElement.lang || 'Missing', ok: !!doc.documentElement.lang },
        { label: 'Mobile viewport', value: meta('viewport') || 'Missing', ok: !!meta('viewport') },
    ];
    const structured = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(el => { try { return { valid: true, text: JSON.stringify(JSON.parse(el.textContent || ''), null, 2) }; } catch { return { valid: false, text: el.textContent || '' }; } });
    return { checks, headings, structured, alternates: [...doc.querySelectorAll('link[hreflang]')].map(el => ({ language: el.getAttribute('hreflang'), url: safeLink(el.getAttribute('href') || '', base) })) };
}
export function parseSitemap(text: string, base: string) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror') || !['urlset', 'sitemapindex'].includes(doc.documentElement.localName)) throw new Error('This document is not a valid XML sitemap.');
    const index = doc.documentElement.localName === 'sitemapindex';
    const entries = [...doc.documentElement.children].map(el => {
        const child = (name: string) => [...el.children].find(c => c.localName === name)?.textContent?.trim() || '';
        return { url: safeLink(child('loc'), base), modified: child('lastmod') };
    }).filter((e): e is { url: string; modified: string } => !!e.url);
    return { index, entries };
}
export async function imagePalette(src: string) {
    const image = new Image();
    image.src = src;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = Math.max(1, Math.min(1024, Math.round(image.naturalHeight / image.naturalWidth * 128)));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const counts = new Map<string, number>();
    for (let i = 0; i < pixels.length; i += 4) {
        if (!pixels[i + 3]) continue;
        const color = '#' + [pixels[i]!, pixels[i+1]!, pixels[i+2]!].map(v => Math.min(255, Math.round(v / 16) * 16).toString(16).padStart(2, '0')).join('');
        counts.set(color, (counts.get(color) || 0) + 1);
    }
    return [...counts].sort((a,b) => b[1]-a[1]).slice(0, 16).map(([color]) => color);
}
