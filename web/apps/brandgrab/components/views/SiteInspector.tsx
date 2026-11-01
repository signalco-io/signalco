'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { BrandResources } from '../../app/api/quick/route';
import { devices, type Capture, type Device, type Inspection } from '../../src/inspector';
import { analyzeSeo, contrast, groupColors, imagePalette, parseSitemap, safeLink } from '../../src/clientAnalysis';

type Resource<T> = { data?: T; error?: string };
const deviceKeys = Object.keys(devices) as Device[];
const tabs = ['Page previews', 'Branding', 'Social previews', 'SEO', 'Accessibility', 'Sitemap'] as const;
type Tab = typeof tabs[number];
async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal, cache: 'no-store' });
    if (!response.ok) {
        const result = await response.json().catch(() => undefined);
        throw new Error(result?.error || 'Could not load this website. Please try again.');
    }
    return response.json();
}
function Message({ error, loading = 'Loading…' }: { error?: string; loading?: string }) {
    return error ? <p role="alert" className="inspector-error">{error}</p> : <p role="status" className="inspector-muted">{loading}</p>;
}
function Panel({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
    return <section className="inspector-panel"><h3>{title}</h3>{note && <p className="inspector-muted">{note}</p>}{children}</section>;
}
function Swatches({ colors }: { colors: string[] }) {
    const [copied, setCopied] = useState('');
    return <><div className="inspector-swatches">{colors.map(color => <button key={color} type="button" title={`Copy ${color}`} onClick={() => { navigator.clipboard.writeText(color).then(() => setCopied(color)).catch(() => setCopied('Copy unavailable')); }}><span style={{ background: color }} /><code>{color}</code></button>)}</div><span role="status" className="inspector-muted">{copied && (copied === 'Copy unavailable' ? copied : `Copied ${copied}`)}</span></>;
}
function Branding({ resource, capture, palette }: { resource?: BrandResources; capture: Resource<Capture>; palette: string[] }) {
    const inspection = capture.data?.inspection;
    const groups = useMemo(() => groupColors(inspection), [inspection]);
    const fonts = useMemo(() => {
        const map = new Map<string, Inspection['styles'][number]>();
        for (const s of inspection?.styles || []) {
            if (!s.text) continue;
            const key = [s.family, s.size, s.weight, s.lineHeight, s.spacing].join('|');
            const previous = map.get(key);
            map.set(key, previous ? { ...previous, count: previous.count + s.count } : { ...s });
        }
        return [...map.values()].sort((a,b) => b.count - a.count).slice(0, 40);
    }, [inspection]);
    const icons = [...new Set([resource?.icons?.icon512Base64, resource?.icons?.appleTouchIconBase64, resource?.favicon?.base64].filter((v): v is string => !!v))];
    return <div className="inspector-stack">
        <Panel title="Favicon & Icons">{icons.length ? <div className="inspector-icons">{icons.map(src => <img key={src} src={src} alt="Website icon" width={96} height={96} />)}</div> : <p>No icon artwork available.</p>}</Panel>
        <Panel title="Brand colors" note="Roles are inferred from rendered usage. Secondary colors are supporting hues; tertiary colors are neutral shades. These are suggestions, not published design tokens.">
            {inspection ? groups.map(group => <div key={group.label} className="inspector-color-group"><h4>{group.label}</h4>{group.colors.length ? <Swatches colors={group.colors} /> : <p className="inspector-muted">No distinct colors detected.</p>}</div>) : <Message error={capture.error || (capture.data ? 'Rendered style inspection is unavailable from this browser service.' : undefined)} loading="Waiting for rendered styles…" />}
        </Panel>
        <Panel title="Screenshot palette" note="Sampled in your browser from the desktop image; may include photography.">{palette.length ? <Swatches colors={palette} /> : <Message error={capture.error} loading="Waiting for the desktop image…" />}</Panel>
        <Panel title="Typography" note="Computed CSS font stacks and frequently used text styles from the rendered desktop page. A stack does not guarantee that every listed font loaded.">
            {fonts.length ? <div className="inspector-table-wrap"><table><thead><tr><th>Family / example</th><th>Size</th><th>Weight</th><th>Line height</th><th>Spacing</th></tr></thead><tbody>{fonts.map((font,i) => <tr key={i}><td><strong>{font.family}</strong><small>{font.tag}: {font.text}</small></td><td>{font.size}</td><td>{font.weight}</td><td>{font.lineHeight}</td><td>{font.spacing}</td></tr>)}</tbody></table></div> : <Message error={capture.error || (capture.data ? 'No rendered typography data available.' : undefined)} loading="Waiting for typography…" />}
        </Panel>
    </div>;
}
function Social({ resource }: { resource: BrandResources }) {
    const [variant, setVariant] = useState('Facebook');
    const og = resource.og;
    const x = resource.twitter;
    const title = (variant === 'X' ? x?.title : '') || og?.title || resource.title;
    const description = (variant === 'X' ? x?.description : '') || og?.description || resource.description;
    const image = (variant === 'X' ? x?.imageBase64 : '') || og?.imageBase64;
    const href = safeLink(og?.url || resource.domain, resource.finalUrl || resource.domain) || resource.domain;
    return <Panel title="Search & social previews" note="Illustrative layouts based on page metadata. Platforms can crop, cache, or rewrite previews. Instagram does not consistently show OG cards in feed captions; this is a shared-link illustration.">
        <div className="inspector-pills" aria-label="Preview platform">{['Google', 'Facebook', 'Instagram', 'X', 'Threads'].map(label => <button type="button" key={label} aria-pressed={label === variant} onClick={() => setVariant(label)}>{label}</button>)}</div>
        <div className={`social-card social-${variant.toLowerCase()}`}>
            <p className="inspector-eyebrow">{variant} preview</p>
            {variant !== 'Google' && image && <img src={image} alt={`${variant} share artwork`} />}
            <div className="social-card-copy"><small>{new URL(resource.domain).hostname}</small><a href={href} target="_blank" rel="noreferrer">{variant === 'Google' ? resource.title : title || 'No title provided'}</a><p>{variant === 'Google' ? resource.description : description || 'No description provided'}</p></div>
        </div>
        {variant === 'X' && <p className="inspector-muted">twitter:card: {x?.card || 'Not declared (using Open Graph fallback)'}</p>}
        <details><summary>Open Graph metadata</summary><dl className="inspector-facts">{Object.entries(og || {}).filter(([key]) => !key.includes('Base64')).map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{String(value || '—')}</dd></div>)}</dl></details>
    </Panel>;
}
function Seo({ resource }: { resource: BrandResources }) {
    const seo = useMemo(() => analyzeSeo(resource.html || '', resource.finalUrl || resource.domain), [resource.html, resource.finalUrl, resource.domain]);
    return <div className="inspector-stack"><Panel title="SEO checks" note="Checks use the fetched source HTML. Search engines may use rendered content and choose different titles and snippets. These checks do not establish indexability or ranking.">
        <ul className="inspector-checks">{seo.checks.map(c => <li key={c.label}><span className="inspector-badge">{c.ok ? 'Found' : 'Review'}</span><div><strong>{c.label}</strong><p>{c.value}</p></div></li>)}</ul>
    </Panel><Panel title="Heading outline">{seo.headings.length ? <ol className="inspector-outline">{seo.headings.map((h,i) => <li key={i} style={{ paddingLeft: (h.level - 1) * 12 }}>H{h.level} · {h.text || '(empty)'}</li>)}</ol> : <p>No headings found in source HTML.</p>}</Panel>
        <Panel title="Structured data & language alternates">{seo.structured.length ? seo.structured.map((s,i) => <details key={i}><summary>JSON-LD {i+1} · {s.valid ? 'Valid JSON' : 'Invalid JSON'}</summary><pre>{s.text}</pre></details>) : <p>No JSON-LD found.</p>}{seo.alternates.map((a,i) => <p key={i}>{a.language}: {a.url ? <a href={a.url} target="_blank" rel="noreferrer">{a.url}</a> : 'Invalid URL'}</p>)}</Panel></div>;
}
function Accessibility({ capture }: { capture: Resource<Capture> }) {
    const inspection = capture.data?.inspection;
    const lowContrast = useMemo(() => (inspection?.styles || []).flatMap(s => {
        const ratio = contrast(s);
        const large = parseFloat(s.size) >= 24 || (parseFloat(s.size) >= 18.66 && Number(s.weight) >= 700);
        return ratio !== undefined && ratio < (large ? 3 : 4.5) ? [{ ...s, ratio }] : [];
    }), [inspection]);
    return <div className="inspector-stack"><Panel title="Accessibility checks" note="An initial automated review of visible desktop content, not a WCAG conformance audit. Keyboard operation, focus order, screen readers, image meaning, and other viewports need manual testing.">
        {inspection ? <><p className="inspector-muted">Inspected {inspection.sampled} of {inspection.total} visible elements. Up to 500 distinct styles are sampled.</p><ul className="inspector-checks">{inspection.checks.map(check => <li key={check.label}><span className="inspector-badge">{check.count ? `${check.count} to review` : 'None found'}</span><div><strong>{check.label}</strong>{check.examples.length > 0 && <details><summary>Examples</summary>{check.examples.map((example,i) => <pre key={i}>{example}</pre>)}</details>}</div></li>)}<li><span className="inspector-badge">{inspection.language || 'Review'}</span><strong>Document language</strong></li><li><span className="inspector-badge">{inspection.headings.some((h,i) => i > 0 && h.level > inspection.headings[i-1]!.level+1) ? 'Review' : 'None found'}</span><strong>Skipped heading levels</strong></li></ul></> : <Message error={capture.error || (capture.data ? 'Rendered accessibility checks are unavailable from this browser service.' : undefined)} loading="Waiting for rendered accessibility checks…" />}
    </Panel><Panel title="Text contrast candidates" note="Estimated from opaque computed text and ancestor background colors. Background images, overlays, gradients, and transparency can change actual contrast. Review each candidate visually.">
        {inspection ? lowContrast.length ? <ul className="inspector-checks">{lowContrast.slice(0,30).map((s,i) => <li key={i}><span className="inspector-badge">{s.ratio.toFixed(2)}:1</span><div><strong>{s.tag} · {s.size} / {s.weight}</strong><p>{s.text}</p><code>{s.color} on {s.background}</code></div></li>)}</ul> : <p>No low contrast candidates found in sampled styles.</p> : <p>Contrast results will appear with rendered styles.</p>}
    </Panel></div>;
}
function Sitemap({ domain }: { domain: string }) {
    const [document, setDocument] = useState<Resource<{ url: string; text: string }>>({});
    const [robots, setRobots] = useState<Resource<{ url: string; text: string }>>({});
    const [url, setUrl] = useState(new URL('/sitemap.xml', domain).href);
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(100);
    const [loading, setLoading] = useState(false);
    const request = useRef<AbortController | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        getJson<{ url: string; text: string }>(`/api/document?${new URLSearchParams({ url: new URL('/robots.txt', domain).href })}`, controller.signal).then(data => {
            setRobots({ data });
            const first = data.text.match(/^sitemap:\s*(https?:\/\/\S+)/im)?.[1];
            if (first) setUrl(first);
        }).catch(e => { if (!controller.signal.aborted) setRobots({ error: String(e.message) }); });
        return () => { controller.abort(); request.current?.abort(); };
    }, [domain]);
    const parsed = useMemo(() => { if (!document.data) return undefined; try { return parseSitemap(document.data.text, document.data.url); } catch (e) { return String((e as Error).message); } }, [document.data]);
    const entries = typeof parsed === 'object' ? parsed.entries.filter(e => e.url.toLowerCase().includes(query.toLowerCase())) : [];
    async function explore(target: string) {
        request.current?.abort();
        const controller = new AbortController(); request.current = controller;
        setUrl(target); setLoading(true); setDocument({}); setLimit(100); setQuery('');
        try { const data = await getJson<{ url: string; text: string }>(`/api/document?${new URLSearchParams({ url: target })}`, controller.signal); if (!controller.signal.aborted) setDocument({ data }); }
        catch (e) { if (!controller.signal.aborted) setDocument({ error: String((e as Error).message) }); }
        finally { if (!controller.signal.aborted) setLoading(false); }
    }
    const discovered = robots.data?.text.match(/^sitemap:\s*(https?:\/\/\S+)/gim)?.map(line => line.replace(/^sitemap:\s*/i, '')) || [];
    return <div className="inspector-stack"><Panel title="Sitemap explorer" note="Browse sitemap indexes and URL lists one document at a time. Documents are limited to 2 MB; compressed .gz files are not supported.">
        <form className="inspector-form" onSubmit={e => { e.preventDefault(); void explore(url); }}><label htmlFor="sitemap-url">Sitemap URL</label><div><input id="sitemap-url" type="url" required value={url} onChange={e => setUrl(e.target.value)} /><button type="submit" disabled={loading}>Explore</button></div></form>
        {discovered.length > 0 && <div className="inspector-pills">{discovered.map(item => <button type="button" key={item} onClick={() => void explore(item)}>{item}</button>)}</div>}
        {loading && <Message loading="Loading sitemap…" />}{document.error && <Message error={document.error} />}{typeof parsed === 'string' && <Message error={parsed} />}
        {typeof parsed === 'object' && <><p>{parsed.entries.length} {parsed.index ? 'sitemaps' : 'URLs'} found</p><label className="inspector-filter">Filter URLs<input value={query} onChange={e => {setQuery(e.target.value);setLimit(100);}} type="search" /></label><ul className="inspector-sitemap">{entries.slice(0,limit).map((entry,i) => <li key={`${entry.url}:${i}`}>{parsed.index ? <button type="button" onClick={() => void explore(entry.url)}>{entry.url}</button> : <a href={entry.url} target="_blank" rel="noreferrer">{entry.url}</a>}{entry.modified && <small>Updated {entry.modified}</small>}</li>)}</ul>{entries.length > limit && <button type="button" onClick={() => setLimit(v => v + 100)}>Show 100 more ({entries.length - limit} remaining)</button>}</>}
    </Panel><Panel title="robots.txt">{robots.data ? <pre>{robots.data.text}</pre> : <Message error={robots.error} loading="Loading robots.txt…" />}</Panel></div>;
}
export default function SiteInspector({ domain }: { domain: string }) {
    const [tab, setTab] = useState<Tab>('Page previews');
    const [metadata, setMetadata] = useState<Resource<BrandResources>>({});
    const [captures, setCaptures] = useState<Partial<Record<Device, Resource<Capture>>>>({});
    const [palette, setPalette] = useState<string[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(60_000)]);
        getJson<BrandResources>(`/api/quick?${new URLSearchParams({ domain })}`, signal).then(data => setMetadata({ data })).catch(e => { if (!controller.signal.aborted) setMetadata({ error: e.message }); });
        for (const device of deviceKeys) {
            getJson<Capture>(`/api/screenshot?${new URLSearchParams({ domain, device })}`, signal).then(data => {
                if (!data.data?.startsWith('data:image/') || !data.width || !data.height) throw new Error('The page preview is unavailable. Please try again later.');
                if (controller.signal.aborted) return;
                setCaptures(previous => ({ ...previous, [device]: { data } }));
                if (device === 'desktop') imagePalette(data.data).then(colors => { if (!controller.signal.aborted) setPalette(colors); }).catch(() => {});
            }).catch(e => { if (!controller.signal.aborted) setCaptures(previous => ({ ...previous, [device]: { error: e.message } })); });
        }
        return () => controller.abort();
    }, [domain]);
    const finished = deviceKeys.filter(device => captures[device]?.data || captures[device]?.error).length;
    const resource = metadata.data;
    return <div className="inspector">
        <div className="inspector-summary"><div><p className="inspector-eyebrow">WEBSITE INSPECTOR</p><h2>{resource?.title || domain}</h2><a href={safeLink(domain)} target="_blank" rel="noreferrer">{domain}</a>{resource?.description && <p>{resource.description}</p>}</div><p role="status" className="inspector-progress">{finished}/3 captures finished</p></div>
        {metadata.error && <Message error={metadata.error} />}
        <div role="tablist" aria-label="Website inspection" className="inspector-tabs">{tabs.map((label,index) => <button key={label} id={`tab-${index}`} role="tab" type="button" aria-selected={tab === label} tabIndex={tab === label ? 0 : -1} aria-controls={`panel-${index}`} onClick={() => setTab(label)} onKeyDown={e => {
            let next: number | undefined;
            if (e.key === 'ArrowRight') next = (index+1)%tabs.length;
            if (e.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
            if (e.key === 'Home') next = 0;
            if (e.key === 'End') next = tabs.length-1;
            if (next !== undefined) { e.preventDefault(); setTab(tabs[next]!); window.document.getElementById(`tab-${next}`)?.focus(); }
        }}>{label}</button>)}</div>
        {tabs.map((label,index) => <div key={label} role="tabpanel" id={`panel-${index}`} aria-labelledby={`tab-${index}`} hidden={tab !== label} tabIndex={0}>
            {label === 'Page previews' && <><p className="inspector-muted">Full-page captures arrive independently. Scroll inside each preview to explore the page.</p><div className="inspector-previews">{deviceKeys.map(device => <Panel key={device} title={devices[device].label} note={`${devices[device].width} × ${devices[device].height} viewport`}>
                {captures[device]?.data ? <><div className={`inspector-capture capture-${device}`} tabIndex={0} role="region" aria-label={`${devices[device].label} full-page preview`}><img src={captures[device]!.data!.data} alt={`${devices[device].label} page preview`} width={captures[device]!.data!.width} height={captures[device]!.data!.height} /></div><a className="inspector-download" href={captures[device]!.data!.data} download={`brandgrab-${device}.png`}>Download PNG</a>{captures[device]?.data?.reachedBottom === false && <p className="inspector-muted">Scroll time limit reached; later lazy content may be incomplete.</p>}</> : <Message error={captures[device]?.error} loading={`Capturing ${devices[device].label.toLowerCase()}…`} />}
            </Panel>)}</div></>}
            {label === 'Branding' && <Branding resource={resource} capture={captures.desktop || {}} palette={palette} />}
            {label === 'Social previews' && (resource ? <Social resource={resource} /> : <Message error={metadata.error} loading="Loading social metadata…" />)}
            {label === 'SEO' && (resource ? <Seo resource={resource} /> : <Message error={metadata.error} loading="Loading page source…" />)}
            {label === 'Accessibility' && <Accessibility capture={captures.desktop || {}} />}
            {label === 'Sitemap' && tab === label && <Sitemap domain={resource?.finalUrl || domain} />}
        </div>)}
    </div>;
}
