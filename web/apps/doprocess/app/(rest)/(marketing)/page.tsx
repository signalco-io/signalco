import { memo } from 'react';
import { Check, CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { Pricing1 } from '@signalco/cms-components-marketing/Pricing';
import { Heading1 } from '@signalco/cms-components-marketing/Heading';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { Feature2, Feature1 } from '@signalco/cms-components-marketing/Feature';
import { Faq1 } from '@signalco/cms-components-marketing/Faq';
import { KnownPages } from '../../../src/knownPages';
import DoProcessLogo from '../../../components/brand/DoProcessLogo';

const data: SectionData[] = [
    {
        component: 'Heading1',
        tagline: 'The right way to',
        header: 'do process',
        description: 'DoProcess is the leading SaaS platform that helps you document, run, and automate your processes the right way. With our intuitive tools and powerful features, you can save time, increase efficiency, and focus on what matters most.',
        ctas: [
            { label: 'Get Started', href: KnownPages.Runs },
        ]
    },
    {
        component: 'Feature1',
        tagline: 'Efficiency',
        header: 'Streamline Your Processes with Ease and Precision',
        description: 'Our platform allows you to document, run, and automate processes in the most efficient way possible. Say goodbye to manual paperwork and hello to increased productivity.',
        features: [
            {
                header: '50%',
                description: 'Save time and reduce errors with automated workflows',
            }, {
                header: '50%',
                description: 'Collaborate seamlessly with your team on document processes'
            }
        ]
    },
    {
        component: 'Pricing1',
        tagline: 'Pricing',
        header: 'Flexible Pricing Plans for Every Business',
        description: 'Choose a pricing plan that suits your needs and budget.',
        features: [
            {
                features: [
                    {
                        asset: <Check />,
                        header: 'Streamline Processes',
                        description: 'Automate repetitive tasks and increase productivity with our intuitive software.'
                    },
                    {
                        asset: <Check />,
                        header: 'Streamline Processes',
                        description: 'Automate repetitive tasks and increase productivity with our intuitive software.'
                    },
                    {
                        asset: <Check />,
                        header: 'Streamline Processes',
                        description: 'Automate repetitive tasks and increase productivity with our intuitive software.'
                    }
                ]
            },
            {
                header: 'Pro Plan',
                description: 'For small teams or individuals that manage more processes.',
                asset: '$19/mo',
                features: [
                    { asset: <Check />, description: 'Everything from free plan...' },
                    { asset: <Check />, description: 'AI assistant' },
                    { asset: <Check />, description: 'Team/Group management' },
                    { asset: <Check />, description: 'Unlimited processes' }
                ],
                ctas: [
                    { label: 'Get Started', href: KnownPages.Runs },
                ]
            }
        ]
    },
    {
        component: 'Faq1',
        header: 'FAQ',
        description: 'Find answers to common questions about DoProcess and reduce barriers to entry.',
        ctas: [
            { label: 'Contact', href: KnownPages.Contact },
        ],
        features: [
            { header: 'What is DoProcess?', description: 'DoProcess is a SaaS platform that allows you to document, run, and automate processes the right way.' },
            { header: 'How does it work?', description: 'DoProcess works by providing a user-friendly interface to create and manage workflows, ensuring efficiency and accuracy in your processes.' },
            { header: 'How much does it cost?', description: 'DoProcess is free to use for individuals and small teams. For larger teams, we offer a Pro Plan that starts at $19/mo.' },
            { header: 'What are the benefits of using DoProcess?', description: 'DoProcess allows you to streamline your processes, automate repetitive tasks, and increase productivity.' },
            { header: 'How do I get started?', description: 'Simply sign up for an account and start documenting your processes today.' }
        ]
    },
    {
        component: 'Footer1',
        tagline: 'DoProcess',
        asset: <DoProcessLogo width={220} />,
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

const sectionsComponentRegistry = {
    'Heading1': memo(Heading1),
    'Feature1': memo(Feature1),
    'Feature2': memo(Feature2),
    'Pricing1': memo(Pricing1),
    'Faq1': memo(Faq1),
    'Footer1': memo(Footer1)
};

export default function LandingPage() {
    return (
        <main>
            <SectionsView
                sectionsData={data}
                componentsRegistry={sectionsComponentRegistry} />
        </main>
    );
}
