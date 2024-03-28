import { ExoticComponent, memo } from 'react';
import { Container } from '@signalco/ui-primitives/Container';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { KnownPages } from '../../../src/knownPages';
import { PageNav, PageNavMenu } from '@signalco/ui/Nav';
import { NavigatingButton } from '../../../../../packages/ui/src/NavigatingButton/NavigatingButton';

const data: SectionData[] = [
    {
        component: 'Footer1',
        features: [
            {
                header: 'Product',
                ctas: [
                    { label: 'App', href: KnownPages.App },
                ]
            },
            {
                header: 'Legal',
                ctas: [
                    { label: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
                    { label: 'Terms of Service', href: KnownPages.LegalTermsOfService },
                    { label: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
                    { label: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
                    { label: 'SLA', href: KnownPages.LegalSla }
                ]
            }
        ],
        tagline: 'WorkingParty.ai',
    }
]

const sectionComponents: { [key: string]: ExoticComponent<SectionData> } = {
    'Footer1': memo(Footer1)
};

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth logo={'WorkingParty'}>
                <PageNavMenu links={[
                    { href: KnownPages.Pricing, text: 'Pricing' }
                ]}>
                    <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
                </PageNavMenu>
            </PageNav>
            <Container className="pt-20" maxWidth="lg">
                {children}
            </Container>
            <SectionsView
                sectionsData={data}
                componentsRegistry={sectionComponents} />
        </>
    );
}
