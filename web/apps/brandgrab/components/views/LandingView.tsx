'use client';

import { memo, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import type { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import InputGrabDomain from '../InputGrabDomain';
import { KnownPages } from '../../src/knownPages';
import { siteUrl } from '../../src/siteUrl';
import SiteInspector from './SiteInspector';

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

    let validDomain: string | undefined;
    try { validDomain = domain ? siteUrl(domain).href : undefined; } catch { /* Input shows validation. */ }

    return (
        <Stack spacing={8}>
            <Container maxWidth="md">
                <Stack spacing={2}>
                    <Typography level="h1">Discover website branding</Typography>
                    <Typography secondary>Explore responsive previews, brand colors, typography, social cards, SEO, and accessibility.</Typography>
                    <InputGrabDomain onRetry={() => setRetry((value) => value + 1)} />
                </Stack>
            </Container>
            <Container maxWidth="lg">
                {validDomain && <SiteInspector key={`${validDomain}:${retry}`} domain={validDomain} />}
            </Container>
            <SectionsView
                sectionsData={sectionsData}
                componentsRegistry={sectionsComponentRegistry} />
        </Stack>
    );
}
