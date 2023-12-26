import { Heading1 } from '@signalco/cms-feature-marketing/Heading';
import { Footer1 } from '@signalco/cms-feature-marketing/Footer';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KnownPages } from '../../../src/knownPages';

const data: SectionData[] = [
    {
        header: 'uier',
        ctas: [
            { label: 'Get Started', href: KnownPages.App },
        ]
    },
    {
        features: [
            {
                header: 'Product',
                ctas: [
                    { label: 'uier', href: KnownPages.App },
                    { label: 'uier', href: KnownPages.App },
                    { label: 'uier', href: KnownPages.App },
                ]
            },
            {
                header: 'Product',
                ctas: [
                    { label: 'uier', href: KnownPages.App },
                    { label: 'uier', href: KnownPages.App },
                    { label: 'uier', href: KnownPages.App },
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
        tagline: 'uier',
    }
];

const sections = [
    Heading1,
    Footer1
];

export default function LandingPage() {
    return (
        <main>
            {sections.map((Section, index) => {
                const sectionData = data[index];
                return (
                    <Section key={index} {...sectionData} />
                );
            })}
        </main>
    );
}
