import { ReactNode, Fragment, PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { Viewport, type Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { CompanyX, CompanyReddit, CompanyGitHub } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { PageNav } from '@signalco/ui/Nav';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { KnownPages } from '../src/knownPages';
import { SystemStatusLabel } from '../components/pages/SystemStatusLabel';
import SignalcoLogotype from '../components/icons/SignalcoLogotype';
import './global.css';

const footerData: SectionData = {
    tagline: 'signalco',
    asset: <SignalcoLogotype width={220} />,
    features: [
        {
            header: 'Product',
            ctas: [
                { label: 'Features', href: KnownPages.Features },
                { label: 'Channels', href: KnownPages.Channels },
                { label: 'App', href: KnownPages.App },
                { label: 'Pricing', href: KnownPages.Pricing },
                { label: 'Roadmap', href: KnownPages.Roadmap },
                { label: 'All our products', href: KnownPages.Products }
            ]
        },
        {
            header: 'Community',
            ctas: [
                { label: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' },
                { label: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions' },
            ]
        },
        {
            header: 'Resources',
            ctas: [
                { label: 'Status', href: KnownPages.Status },
                { label: 'Design', href: KnownPages.UiDocs },
                { label: 'API', href: KnownPages.DocsApi }
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
        },
        {
            tagline: 'SystemStatus',
            asset: <SystemStatusLabel />
        }
    ],
    ctas: [
        { label: 'X formerly known as Twitter', href: 'https://x.com/signalco_io', icon: <CompanyX /> },
        { label: 'reddit', href: 'https://www.reddit.com/r/signalco/', icon: <CompanyReddit /> },
        { label: 'GitHub', href: 'https://github.com/signalco-io/signalco', icon: <CompanyGitHub /> },
    ]
};

export function PageLayout({ children, fullWidth }: PropsWithChildren<{ fullWidth?: boolean }>) {
    const ContentContainer = fullWidth ? Fragment : Container;
    return (
        <Stack spacing={4}>
            <PageNav
                logo={<SignalcoLogotype height={32} />}
                links={[
                    { href: KnownPages.Features, text: 'Features' },
                    { href: KnownPages.Channels, text: 'Channels' },
                    { href: KnownPages.Pricing, text: 'Pricing' }
                ]}>
                <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
            </PageNav>
            <main className={cx(fullWidth ? 'pt-8' : 'pt-20')}>
                <ContentContainer>
                    {children}
                </ContentContainer>
            </main>
            <Footer1 {...footerData} />
        </Stack>);
}

export default function RootLayout({ children, }: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body className={'font-sans'}>
                <ThemeProvider attribute="class">
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    manifest: '/manifest.webmanifest',
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
