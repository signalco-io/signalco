import { PropsWithChildren } from 'react';
import { CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { PageNav } from '@signalco/ui/Nav';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { KnownPages } from '../../src/knownPages';

const footerData: SectionData = {
    tagline: 'slco',
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
};

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav logo="slco.io" />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
            <Footer1 {...footerData} />
        </>
    );
}
