import React, { PropsWithChildren, memo } from 'react';
import { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './global.css';
import { Stack } from '@signalco/ui-primitives/Stack';
import { CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { KnownPages } from '../src/knownPages';
import { PageLayout } from '../components/layouts/PageLayout';
import SignalcoLogotype from '../components/icons/SignalcoLogotype';

const sectionsComponentRegistry = {
    'Footer1': memo(Footer1)
}

const sectionsData: SectionData[] = [
    {
        component: 'Footer1',
        tagline: 'signalco',
        asset: <SignalcoLogotype width={220} />,
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

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body className={'font-sans'}>
                <Stack>
                <PageLayout>{children}</PageLayout>
                    <SectionsView
                        sectionsData={sectionsData}
                        componentsRegistry={sectionsComponentRegistry} />
                </Stack>
                <Analytics />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco | Blog',
    description: 'Automate your life',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ]
} satisfies Viewport;
