import { PropsWithChildren } from 'react';
import { Container } from '@signalco/ui-primitives/Container';
import { PageNav } from '@signalco/ui/Nav';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { KnownPages } from '../../../src/knownPages';
import { cmsComponents } from '../../../src/components/cmsComponents';
import WorkingPartyLogotype from '../../../src/components/brand/WorkingPartyLogotype';
import { NavigatingButton } from '../../../../../packages/ui/src/NavigatingButton/NavigatingButton';

const data: SectionData[] = [
    {
        component: 'Footer1',
        features: [
            {
                header: 'Product',
                ctas: [
                    { label: 'App', href: KnownPages.App },
                    // { label: 'Pricing', href: KnownPages.Pricing },
                    // { label: 'Contact', href: KnownPages.Contact },
                ]
            },
            // {
            //     header: 'Legal',
            //     ctas: [
            //         { label: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
            //         { label: 'Terms of Service', href: KnownPages.LegalTermsOfService },
            //         { label: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
            //         { label: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
            //         { label: 'SLA', href: KnownPages.LegalSla }
            //     ]
            // }
        ],
        tagline: 'WorkingParty.ai',
        asset: <WorkingPartyLogotype width={290} />
    }
]

export default function RootMarketingLayout({ children, }: PropsWithChildren) {
    return (
        <>
            <PageNav
                logo={<WorkingPartyLogotype height={32} />}
                links={[
                    // { href: KnownPages.Pricing, text: 'Pricing' }
                ]}>
                <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
            </PageNav>
            <Container className="pt-16">
                {children}
            </Container>
            <SectionsView
                sectionsData={data}
                componentsRegistry={cmsComponents} />
        </>
    );
}
