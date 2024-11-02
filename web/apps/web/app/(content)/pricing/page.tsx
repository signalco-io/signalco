import { Stack } from '@signalco/ui-primitives/Stack';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { sectionPricing, sectionsComponentRegistry } from '../../page';
import { KnownPages } from '../../../src/knownPages';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import CtaSection from '../../../components/pages/CtaSection';

const pricingFaq = [
    {
        component: 'Faq1',
        header: 'FAQ',
        description: 'Find answers to common questions about signalco pricing.',
        ctas: [
            { label: 'Contact', href: KnownPages.Contact },
        ],
        features: [
            { id: 'planForMe', header: 'Which plan is right for me?', description: 'Free plan is perfect for anyone who is looking to start with automation. Basic plan is great when you have many automations and services. Pro plan is next step that allows you to scale automations and need advanced features.' },
            { id: 'entities', header: 'What are Entities?', description: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom space, automation process, etc.' },
            { id: 'executions', header: 'What are Executions?', description: 'Execution is when one of your automation processes executes one action.' },
            { id: 'noCode', header: 'Is coding required to use signalco?', description: 'No. You can create automation processes with custom triggers, conditions and conducts (actions) without writing a line of code.' },
            { id: 'executionsLimit', header: 'What happens if I run out of executions?', description: 'Your automation processes will not execute until executions are added again. We add executions to your account every month as per your plan. If you are using Free or Basic plans, it\'s advised to upgrade to Pro plan. In Pro plan you can select how much executions and contacts you need in your billing page.' },
        ]
    }
];

export default function PricingPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader level="h1" subHeader={'Find plat that matches your ambition.'}>
                Pricing
            </PageCenterHeader>
            <SectionsView
                sectionsData={[...sectionPricing, ...pricingFaq]}
                componentsRegistry={sectionsComponentRegistry}
            />
            <CtaSection />
        </Stack>
    );
}
