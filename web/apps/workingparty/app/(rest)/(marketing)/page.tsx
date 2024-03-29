import { Suspense } from 'react';
import Link from 'next/link';
import { Check } from '@signalco/ui-icons';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KnownPages } from '../../../src/knownPages';
import { marketplaceWorkers } from '../../../src/data/markerplaceWorkers';
import { cmsComponents } from '../../../src/components/cmsComponents';
import { DemoMessages } from './DemoMessages';
import { DemoMarketplace } from './DemoMarketplace';

const data: SectionData[] = [
    {
        component: 'Heading1',
        header: 'Working Party',
        description: (
            <figure className="border-l pl-4 pr-8">
                <div className="mb-2 text-base">{'/\u02C8\u0077\u0259\u02D0\u006B\u026A\u014B\u0020\u02CC\u0070\u0251\u02D0\u0074\u0069/'}</div>
                <blockquote>a group of people who investigate a particular problem and suggest ways of dealing with it</blockquote>
                <figcaption className="mt-2">
                    <Link href="https://www.merriam-webster.com/dictionary/working%20party" className="text-base text-muted-foreground">Merriam-Webster.com Dictionary, s.v. “working party,”</Link>
                </figcaption>
            </figure>
        ),
        asset: <Suspense><DemoMessages /></Suspense>
    },
    {
        component: 'Feature1',
        tagline: 'Expertise on Demand',
        header: 'Workers Marketplace',
        description: 'Hire expert workers to help you with your projects. From software development to personal trainers and chefs, we have you covered.',
        features: [
            {
                header: `> ${Math.floor(marketplaceWorkers.length / 10) * 10}`,
                description: 'Experts available to help you with your projects',
            },
            {
                asset: <DemoMarketplace />,
            }
        ]
    },
    {
        component: 'Pricing1',
        tagline: 'Pricing',
        header: 'Flexible Pricing Plans for Everyone',
        description: 'Choose a pricing plan that suits your needs and budget.',
        features: [
            {
                features: [
                    {
                        asset: <Check />,
                        header: 'Workers Marketplace',
                    },
                    {
                        asset: <Check />,
                        header: 'Unlimited messages history',
                    },
                    {
                        asset: <Check />,
                        header: 'Get Started Bonus',
                        description: 'Up to 5 active workers and 50 messages as one time sign-up bonus.'
                    },
                ],
                ctas: [
                    { label: 'Start for Free', href: KnownPages.App },
                ]
            },
            {
                header: 'Plus',
                description: 'When free isn\'t enough...',
                asset: '€5/mo',
                features: [
                    { asset: <Check />, header: 'Everything from Free...' },
                    { asset: <Check />, header: '100 messages/month' }
                ],
                ctas: [
                    { label: 'Get Started', href: KnownPages.AppSettingsAccountBillingPlans },
                ]
            },
            {
                header: 'Pro',
                description: 'For individuals and professionals that need more advanced features and more capacity.',
                asset: '€29/mo',
                features: [
                    { asset: <Check />, header: 'Everything from Plus...' },
                    { asset: <Check />, header: 'Up to 50 active workers' },
                    { asset: <Check />, header: '250 messages/month' }
                ],
                ctas: [
                    { label: 'Start like a Pro', href: KnownPages.AppSettingsAccountBillingPlans, secondary: true },
                ]
            }
        ]
    },
    {
        component: 'Faq1',
        header: 'FAQ',
        description: 'Find answers to common questions about Working Party and reduce barriers to entry.',
        ctas: [
            // { label: 'Contact', href: KnownPages.Contact },
        ],
        features: [
            { header: 'What is Working Party?', description: 'Working Party is SaaS platform that allows you to interact with specialized expert AIs allowing you to be more productive and efficient.' },
            { header: 'How does it work?', description: 'We use commercially available AIs (like ChatGPT from OpenAI) to carefully craft expert AI workers. You can then hire these expers from our Workers Marketplace.' },
            { header: 'How much does it cost?', description: 'We offer a free plan with limited features and paid plans starting at $5/month.' },
            { header: 'What are the benefits of using Working Party?', description: 'By using Working Party, you can save time and money by hiring expert workers for all kinds of tasks and project, all in one place.' },
            { header: 'How do I get started?', description: 'Simply sign up for an account and start using our platform start working on your new project.' }
        ]
    },
];

export default function LandingPage() {
    return (
        <main>
            <SectionsView
                sectionsData={data}
                componentsRegistry={cmsComponents} />
        </main>
    );
}
