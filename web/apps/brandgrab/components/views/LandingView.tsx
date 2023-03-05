'use client';

import React, { useCallback } from 'react';
import NextImage from 'next/image';
import Stack from '@signalco/ui/dist/Stack';
import { Card, CardContent, CardCover, CardOverflow, ChildrenProps, Container, Divider, Link, Loadable, MuiStack, Tooltip, Typography } from '@signalco/ui';
import { orderBy } from '@signalco/js';
import { useLoadAndError, useSearchParam } from '@signalco/hooks';
import { ScreenshotResponse } from '../../app/api/screenshot/route';
import { BrandResources } from '../../app/api/quick/route';

function OgPreview({ og }: { og: BrandResources['og'] | undefined }) {
    if (!og?.title && !og?.image && !og?.url)
        return <>-</>;

    return (
        <Link href={og.url}>
            <Card variant="outlined" style={{
                width: 400,
                minHeight: 209,
                overflow: 'hidden',
                transition: 'box-shadow .2s ease-in-out, border-color .2s ease-in-out'
            }} sx={{
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}>
                {og.imageBase64 &&
                    <CardOverflow sx={{
                        padding: 0
                    }}>
                        <NextImage
                            src={og.imageBase64}
                            alt="og:image"
                            width={400}
                            height={209} />
                    </CardOverflow>
                }
                <CardContent style={{ justifyContent: 'flex-end' }}>
                    <Stack>
                        <Typography level="h5" style={{
                            marginTop: 8
                        }}>{og.title}</Typography>
                        <Typography level="body2">{og.description}</Typography>
                    </Stack>
                </CardContent>
                <Divider sx={{ mt: 2 }} />
                <CardOverflow
                    variant="soft"
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        px: 'var(--Card-padding)',
                        bgcolor: 'background.level1',
                    }}
                >
                    {!!og.siteName && (
                        <Tooltip title={og.siteName}>
                            <Typography noWrap level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                                {og.siteName}
                            </Typography>
                        </Tooltip>
                    )}
                    {!!og.type && (
                        <>
                            {!!og.siteName && <Divider orientation="vertical" />}
                            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                                {og.type}
                            </Typography>
                        </>
                    )}
                    {!!(og.locale || og.localeAlternate) && (
                        <>
                            <Divider orientation="vertical" />
                            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                                {[og.locale, og.localeAlternate].filter(Boolean).join(', ')}
                            </Typography>
                        </>
                    )}
                    {!!og.url && (
                        <>
                            <Divider orientation="vertical" />
                            <Tooltip title={og.url}>
                                <Typography level="body3" noWrap sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                                    {og.url}
                                </Typography>
                            </Tooltip>
                        </>
                    )}
                </CardOverflow>
            </Card>
        </Link>
    )
}

function IconPreview({ favicon, icons }: { favicon: BrandResources['favicon'], icons: BrandResources['icons'] }) {
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
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon512Base64 || icons.icon256Base64 || icons.appleTouchIconBase64 || icons.icon128Base64 || icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={144}
                height={144} />
            <NextImage
                style={{
                    width: 42 + 16 * 2,
                    height: 42 + 16 * 2,
                    padding: 16,
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={42}
                height={42} />
            <NextImage
                style={{
                    width: 16 * 3,
                    height: 16 * 3,
                    padding: 16,
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={16}
                height={16} />
        </div>
    )
}

function TextInfo({ title, children }: { title: string } & ChildrenProps) {
    return (
        <Stack spacing={.5}>
            <Typography level="body3">{title}</Typography>
            <div>{children}</div>
        </Stack>
    )
}

async function getPageScreenshot(domain: string) {
    const res = await fetch(`/api/screenshot?domain=${encodeURIComponent(domain)}`);
    const data = await res.json() as ScreenshotResponse;
    // TODO: Move dimensions resolve to server
    const dimensions = await getImageDimensions(data.data);
    return {
        data: data.data,
        w: dimensions.w,
        h: dimensions.h,
        colors: data.colors
    }
}

function getImageDimensions(file: string) {
    return new Promise<{ w: number, h: number }>(function (resolved) {
        const i = new Image();
        i.onload = function () {
            resolved({ w: i.width, h: i.height })
        };
        i.src = file
    })
}

function PagePreview({ domain }: { domain: string }) {
    const pageScreenshotDomain = useCallback(() => getPageScreenshot(domain), [domain]);
    const pageScreenshot = useLoadAndError(pageScreenshotDomain);

    const width = 400;
    const containerHeight = 300;

    return (
        <Stack spacing={3}>
            <TextInfo title="Page preview">
                <Card style={{
                    width: width,
                    height: containerHeight,
                    overflowY: 'auto',
                    boxSizing: 'content-box',
                }}>
                    <Loadable isLoading={pageScreenshot.isLoading} error={pageScreenshot.error} loadingLabel="Loading preview">
                        <CardCover style={{
                            height: (width / (pageScreenshot.item?.w ?? 1)) * (pageScreenshot.item?.h ?? 0),
                            borderRadius: 0
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element  */}
                            <img
                                src={pageScreenshot.item?.data || ''}
                                alt="Page preview"
                                width={pageScreenshot.item?.w}
                                height={pageScreenshot.item?.h}
                                style={{
                                    objectPosition: '0 0',
                                    borderRadius: 0
                                }} />
                        </CardCover>
                    </Loadable>
                </Card>
            </TextInfo>
            <TextInfo title="Colors">
                <Loadable isLoading={pageScreenshot.isLoading} error={pageScreenshot.error} loadingLabel="Loading preview">
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {orderBy(pageScreenshot.item?.colors ?? [], (a, b) => b.area - a.area).map((color) => (
                            <div key={color.hex} style={{
                                width: 64,
                                height: 64,
                                borderRadius: 4,
                                backgroundColor: color.hex,
                                fontSize: '.8em',
                                padding: 4,
                                alignItems: 'end',
                                display: 'flex',
                                color: color.lightness < .5 ? 'rgba(256,256,256, .8)' : 'rgba(0,0,0, .8)',
                                border: '1px solid var(--joy-palette-divider)'
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
    const domainResources = useLoadAndError(quickLookupDomain);
    const resources = domainResources.item;

    return (
        <MuiStack direction={{ xs: 'column', md: 'row' }} spacing={4}>
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
                        {!!resources?.favicon ? (
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
                <PagePreview domain={resources?.domain} />
            )}
        </MuiStack>
    );
}

async function quickLookup(domain: string | undefined): Promise<BrandResources | undefined> {
    if (!domain) {
        return undefined;
    }

    return await fetch('/api/quick?domain=' + encodeURIComponent(domain)).then(res => res.json()).then(res => res as BrandResources);
}

export default function LandingPageView() {
    const [domain] = useSearchParam('domain');

    return (
        <Stack style={{ overflowX: 'hidden', paddingBottom: 16 }}>
            <Container maxWidth="md">
                <BrandView domain={domain} />
            </Container>
        </Stack>
    );
}
