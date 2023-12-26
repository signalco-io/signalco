import { Check } from '@signalco/ui-icons';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KnownPages } from '../../../src/knownPages';
import Footer from '../../../components/pages/Footer';
import { Pricing1 } from '../../../components/cms/Pricing1';
import { Heading1 } from '../../../components/cms/Heading1';
import { Feature2 } from '../../../components/cms/Feature2';
import { Feature1 } from '../../../components/cms/Feature1';
import { Faq1 } from '../../../components/cms/Faq1';

export default function LandingPage() {
    const data: SectionData[] = [
        {
            tagline: 'The right way to',
            header: 'do process',
            description: 'DoProcess is the leading SaaS platform that helps you document, run, and automate your processes the right way. With our intuitive tools and powerful features, you can save time, increase efficiency, and focus on what matters most.',
            ctas: [
                { label: 'Get Started', href: KnownPages.Runs },
            ]
        },
        {
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
            tagline: 'Efficiency',
            header: 'Streamline any processes with ease',
            description: 'Our running process checklist capabilities allow you to automate and manage your workflows efficiently. With our intuitive platform, you can easily create, track, and optimize your processes, ensuring that every step is completed accurately and on time.',
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
        }
    ];

    const sections = [
        Heading1,
        Feature1,
        Feature2,
        Pricing1,
        Faq1
    ];

    return (
        <main>
            {sections.map((Section, index) => {
                const sectionData = data[index];
                return (
                    <Section key={index} {...sectionData} />
                );
            })}
            <Footer />
        </main>
    );
}
