'use client';

import React, { PropsWithChildren, memo, useCallback, useState } from 'react';
import NextImage from 'next/image';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Link } from '@signalco/ui-primitives/Link';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Container } from '@signalco/ui-primitives/Container';
import { Card, CardContent, CardOverflow } from '@signalco/ui-primitives/Card';
import { CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { orderBy, isImageDataUrl } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { usePromise } from '@enterwell/react-hooks';
import InputGrabDomain from '../InputGrabDomain';
import { siteUrl } from '../../src/siteUrl';
import { KnownPages } from '../../src/knownPages';
import type { ScreenshotResponse } from '../../app/api/screenshot/route';
import type { BrandResources } from '../../app/api/quick/route';

function OgPreview({ og }: { og: BrandResources['og'] | undefined }) {
    if (!og?.title && !og?.image && !og?.url)
        return <>-</>;

    const card = (
        <Card style={{
            width: '100%',
            maxWidth: 400,
            minHeight: 209,
            overflow: 'hidden',
        }}>
            {isImageDataUrl(og.imageBase64) &&
                <CardOverflow>
                    <NextImage
                        src={og.imageBase64}
                        alt="og:image"
                        width={400}
                        height={209}
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: 'auto',
                        }} />
                </CardOverflow>
            }
            <CardContent style={{ justifyContent: 'flex-end' }}>
                <Stack style={{ paddingTop: 8 }}>
                    <Typography level="h5">{og.title}</Typography>
                    <Typography level="body2">{og.description}</Typography>
                </Stack>
            </CardContent>
            <div className="mt-2">
                <Divider />
            </div>
            <CardOverflow className="flex flex-wrap gap-2 p-2">
                {!!og.siteName && (
                    <Typography noWrap level="body3" semiBold secondary title={og.siteName}>
                        {og.siteName}
                    </Typography>
                )}
                {!!og.type && (
                    <>
                        {!!og.siteName && <Divider orientation="vertical" />}
                        <Typography level="body3" semiBold secondary>
                            {og.type}
                        </Typography>
                    </>
                )}
                {!!(og.locale || og.localeAlternate) && (
                    <>
                        <Divider orientation="vertical" />
                        <Typography level="body3" semiBold secondary>
                            {[og.locale, og.localeAlternate].filter(Boolean).join(', ')}
                        </Typography>
                    </>
                )}
                {!!og.url && (
                    <>
                        <Divider orientation="vertical" />
                        <Typography level="body3" noWrap semiBold secondary title={og.url}>
                            {og.url}
                        </Typography>
                    </>
                )}
            </CardOverflow>
        </Card>
    );
    try {
        return og.url ? <Link href={siteUrl(og.url).href}>{card}</Link> : card;
    } catch {
        return card;
    }
}

function IconPreview({ favicon, icons }: { favicon: BrandResources['favicon'], icons: BrandResources['icons'] }) {
    const fallback = icons.icon512Base64 || icons.icon256Base64 || icons.appleTouchIconBase64 || icons.icon128Base64 || icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64;
    if (!isImageDataUrl(fallback)) return <>-</>;

    return (
        <div style={{
            width: 144 + 16 * 2 + 42 + 16 * 2,
            height: 144 + 16 * 2,
            display: 'grid',
            gridTemplateColumns: '176px 74px',
            gridTemplateRows: '74px 48px',
            gap: 16
        }}>
            <NextImage
                style={{
                    width: 144 + 16 * 2,
                    height: 144 + 16 * 2,
                    gridRowEnd: 'span 2',
                    padding: 16,
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8
                }}
                src={fallback}
                alt="favicon"
                width={144}
                height={144} />
            <NextImage
                style={{
                    width: 42 + 16 * 2,
                    height: 42 + 16 * 2,
                    padding: 16,
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8
                }}
                src={icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64 || fallback}
                alt="favicon"
                width={42}
                height={42} />
            <NextImage
                style={{
                    width: 16 * 3,
                    height: 16 * 3,
                    padding: 16,
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8
                }}
                src={icons.icon16Base64 || favicon.base64 || fallback}
                alt="favicon"
                width={16}
                height={16} />
        </div>
    )
}

function TextInfo({ title, children }: PropsWithChildren<{ title: string }>) {
    return (
        <Stack spacing={.5}>
            <Typography level="body3" secondary>{title}</Typography>
            <div>{children}</div>
        </Stack>
    )
}

async function fetchResource<T>(path: string, domain: string): Promise<T> {
    const response = await fetch(`${path}?${new URLSearchParams({ domain })}`, {
        cache: 'no-store', signal: AbortSignal.timeout(50_000),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => undefined);
        throw new Error(error?.error || 'Could not load this website. Please try again.');
    }
    return response.json() as Promise<T>;
}

async function getPageScreenshot(domain: string) {
    const data = await fetchResource<ScreenshotResponse>('/api/screenshot', domain);
    if (!isImageDataUrl(data.data) || !data.width || !data.height) {
        throw new Error('The page preview is unavailable. Please try again later.');
    }
    return data;
}

function hexToRgb(hex: string) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function hexLightness(hex: string) {
    const rgb = hexToRgb(hex);
    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;
}

function PagePreview({ domain }: { domain: string }) {
    const pageScreenshotDomain = useCallback(() => getPageScreenshot(domain), [domain]);
    const pageScreenshot = usePromise(pageScreenshotDomain);

    const width = 400;
    const containerHeight = 300;

    return (
        <Stack spacing={3}>
            <TextInfo title="Page preview">
                <Card style={{
                    width: '100%',
                    maxWidth: width,
                    height: containerHeight,
                    overflowY: 'auto',
                }}>
                    <Loadable isLoading={pageScreenshot.isLoading} error={pageScreenshot.error} loadingLabel="Loading preview">
                        {pageScreenshot.item && <img
                            src={pageScreenshot.item.data}
                            alt="Page preview"
                            width={pageScreenshot.item.width}
                            height={pageScreenshot.item.height}
                            style={{ width: '100%', height: 'auto' }} />}
                    </Loadable>
                </Card>
            </TextInfo>
            <TextInfo title="Colors">
                <Loadable isLoading={pageScreenshot.isLoading} error={pageScreenshot.error} loadingLabel="Loading preview">
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {orderBy(pageScreenshot.item?.colors ?? [], (a, b) => b.area - a.area).map((color) => (
                            <div key={color.hex}
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 4,
                                    backgroundColor: color.hex,
                                    fontSize: '.8em',
                                    padding: 4,
                                    alignItems: 'end',
                                    display: 'flex',
                                    color: hexLightness(color.hex) < .5 ? 'rgba(255,255,255, .8)' : 'rgba(0,0,0, .8)',
                                    border: '1px solid hsl(var(--border))'
                                }}>
                                {color.hex}
                            </div>
                        ))}
                    </div>
                </Loadable>
            </TextInfo>
        </Stack>
    )
}

function BrandView({ domain }: { domain: string | undefined }) {
    const quickLookupDomain = useCallback(() => quickLookup(domain), [domain]);
    const domainResources = usePromise(quickLookupDomain);
    const resources = domainResources.item;

    if (domainResources.error) {
        return <Loadable loadingLabel="Loading branding" error={domainResources.error.replace(/^Error: /, '')} />;
    }

    return (
        <Stack spacing={4}>
            <Stack spacing={3}>
                <TextInfo title="Domain">
                    <Loadable placeholder="skeletonText" isLoading={domainResources.isLoading} error={domainResources.error} loadingLabel="Loading SEO">
                        {resources?.domain || '-'}
                    </Loadable>
                </TextInfo>
                <TextInfo title="Title">
                    <Loadable placeholder="skeletonText" isLoading={domainResources.isLoading} error={domainResources.error} loadingLabel="Loading SEO">
                        {resources?.title || '-'}
                    </Loadable>
                </TextInfo>
                <TextInfo title="Description">
                    <Loadable placeholder="skeletonText" isLoading={domainResources.isLoading} error={domainResources.error} loadingLabel="Loading SEO">
                        {resources?.description || '-'}
                    </Loadable>
                </TextInfo>
                <TextInfo title="Favicon & Icons">
                    <Loadable isLoading={domainResources.isLoading} error={domainResources.error} loadingLabel="Loading SEO">
                        {resources?.favicon ? (
                            <IconPreview favicon={resources.favicon} icons={resources.icons} />
                        ) : (
                            <>-</>
                        )}
                    </Loadable>
                </TextInfo>
                <TextInfo title="Open Graph (og)">
                    <Loadable isLoading={domainResources.isLoading} error={domainResources.error} loadingLabel="Loading SEO">
                        <OgPreview og={resources?.og} />
                    </Loadable>
                </TextInfo>
            </Stack>
            {resources?.domain && (
                <PagePreview key={resources.domain} domain={resources.domain} />
            )}
        </Stack>
    );
}

async function quickLookup(domain: string | undefined): Promise<BrandResources | undefined> {
    if (!domain) {
        return undefined;
    }

    return fetchResource<BrandResources>('/api/quick', domain);
}

const sectionsComponentRegistry = {
    'Footer1': memo(Footer1)
}

const sectionsData: SectionData[] = [
    {
        component: 'Footer1',
        tagline: 'BrandGrab',
        features: [
            {
                header: 'Community',
                ctas: [
                    { label: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' },
                    { label: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions' },
                ]
            },
            {
                header: 'Legal',
                ctas: [
                    { label: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
                    { label: 'Terms of Service', href: KnownPages.LegalTermsOfService },
                    { label: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
                    { label: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
                    { label: 'SLA', href: KnownPages.LegalSla },
                ]
            }
        ],
        ctas: [
            { label: 'X formerly known as Twitter', href: 'https://x.com/signalco_io', icon: <CompanyX /> },
            { label: 'reddit', href: 'https://www.reddit.com/r/signalco/', icon: <CompanyReddit /> },
            { label: 'GitHub', href: 'https://github.com/signalco-io/signalco', icon: <CompanyGitHub /> },
        ]
    }
];

export default function LandingPageView() {
    const [domain] = useSearchParam('domain');
    const [retry, setRetry] = useState(0);

    return (
        <Stack spacing={8}>
            <Container maxWidth="md">
                <Stack spacing={2}>
                    <Typography level="h1">Discover website branding</Typography>
                    <Typography secondary>Enter a website to explore its metadata, icons, preview, and colors.</Typography>
                    <InputGrabDomain onRetry={() => setRetry((value) => value + 1)} />
                </Stack>
            </Container>
            <Container maxWidth="md">
                <BrandView key={`${domain}:${retry}`} domain={domain} />
            </Container>
            <SectionsView
                sectionsData={sectionsData}
                componentsRegistry={sectionsComponentRegistry} />
        </Stack>
    );
}
