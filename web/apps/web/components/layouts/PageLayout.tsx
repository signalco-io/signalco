import { Fragment, PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { CompanyX, CompanyReddit, CompanyGitHub } from '@signalco/ui-icons';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { SystemStatusLabel } from '../pages/SystemStatusLabel';
import { PageNav, PageNavMenu } from '@signalco/ui/Nav';
import SignalcoLogotype from '../icons/SignalcoLogotype';
import { KnownPages } from '../../src/knownPages';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';

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
                { label: 'Station', href: KnownPages.Station },
                { label: 'Roadmap', href: KnownPages.Roadmap },
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
            <PageNav fullWidth={fullWidth} logo={<SignalcoLogotype height={32} />}>
                <PageNavMenu links={[
                    { href: KnownPages.Features, text: 'Features' },
                    { href: KnownPages.Channels, text: 'Channels' },
                    { href: KnownPages.Pricing, text: 'Pricing' }
                ]}>
                    <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
                </PageNavMenu>
            </PageNav>
            <main className="pt-20">
                <ContentContainer>
                    {children}
                </ContentContainer>
            </main>
            <Footer1 {...footerData} />
        </Stack>);
}
