import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { KnownPages } from '../../../src/knownPages';
import PricingCard, { PricingOption } from '../../../components/pages/pricing/PricingCard';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import FaqSection from '../../../components/pages/FaqSection';
import CtaSection from '../../../components/pages/CtaSection';

const pricingOptions: PricingOption[] = [
    {
        id: 'free',
        label: 'Free',
        price: { eur: 0 },
        duration: 'forever',
        description: 'Start automating today.',
        features: ['10 Entities', '2,000 Executions/mo', 'No credit card required'],
        href: KnownPages.App,
        hrefLabel: 'Start now'
    },
    {
        id: 'basic',
        label: 'Basic',
        price: { eur: 1.99 },
        duration: 'month',
        description: 'Expand with ease.',
        features: ['20 Entities', '10,000 Executions/mo', '7 day history', 'Unlimited users'],
        href: '/subscription/basic',
        hrefLabel: 'Select Basic'
    },
    {
        id: 'pro',
        label: 'Pro',
        price: { eur: 4.99 },
        duration: 'month',
        description: 'Pro plan scales with you.',
        features: ['30 Entities', '50,000 Executions/mo', '30 day history', 'Unlimited users'],
        href: '/subscription/pro',
        hrefLabel: 'Select Pro'
    }
];

const pricingCardVariantMap: ('normal' | 'outlined' | 'inverted')[] = ['normal', 'outlined', 'inverted'];

const pricingFaq = [
    { id: 'planForMe', question: 'Which plan is right for me?', answer: 'Free plan is perfect for anyone who is looking to start with automation. Basic plan is great when you have many automations and services. Pro plan is next step that allows you to scale automations and need advanced features.' },
    { id: 'entities', question: 'What are Entities?', answer: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom space, automation process, etc.' },
    { id: 'executions', question: 'What are Executions?', answer: 'Execution is when one of your automation processes executes one action.' },
    { id: 'noCode', question: 'Is coding required to use signalco?', answer: 'No. You can create automation processes with custom triggers, conditions and conducts (actions) without writing a line of code.' },
    { id: 'executionsLimit', question: 'What happens if I run out of executions?', answer: 'Your automation processes will not execute until executions are added again. We add executions to your account every month as per your plan. If you are using Free or Basic plans, it\'s advised to upgrade to Pro plan. In Pro plan you can select how much executions and contacts you need in your billing page.' },
];

export default function PricingPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader header={'Pricing'} subHeader={'Find the plan for you'} />
            <Row spacing={4} alignItems="stretch" justifyContent="center">
                {pricingOptions.map((po, i) => <PricingCard key={po.id} option={po} variant={pricingCardVariantMap[i] ?? 'normal'} />)}
            </Row>
            <FaqSection faq={pricingFaq} />
            <CtaSection />
        </Stack>
    );
}
