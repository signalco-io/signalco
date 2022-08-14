import { Button, Card, CardActionArea, Stack, ThemeProvider, Typography } from '@mui/material';
import SignalcoLogotype from 'components/icons/SignalcoLogotype';
import { PageLayout } from 'components/layouts/PageLayout';
import CtaSection from 'components/pages/CtaSection';
import FaqSection from 'components/pages/FaqSection';
import PageCenterHeader from 'components/pages/PageCenterHeader';
import Checkbox from 'components/shared/form/Checkbox';
import { PageWithMetadata, ThemeContext } from 'pages/_app';
import { useContext } from 'react';
import theme from 'src/theme';

interface PricingOption {
    id: string,
    label: string,
    price: { eur: number },
    duration: 'forever' | 'month' | 'year',
    description: string,
    features: string[],
    href: string,
    hrefLabel: string
}

function PricingCard(props: { option: PricingOption, variant: 'normal' | 'outlined' | 'inverted' }) {
    const { option, variant } = props;
    const themeContext = useContext(ThemeContext);
    const themeVariant = variant === 'inverted' ? (themeContext.isDark ? 'light' : 'dark') : (themeContext.theme ?? 'light');
    return (
        <ThemeProvider theme={theme(themeVariant)}>
            <Card
                sx={{
                    bgcolor: variant === 'outlined' ? 'transparent' : undefined,
                    borderWidth: 3,
                    borderColor: 'text.primary',
                    borderRadius: 3
                }}
                variant={variant === 'normal' ? 'elevation' : 'outlined'}>
                <CardActionArea href={option.href} sx={{ height: '100%' }} disabled={option.price.eur > 0}>
                    <Stack sx={{ p: { xs: 4, md: 6 }, height: '100%' }} spacing={{ xs: 3, md: 6 }} justifyContent="space-between">
                        <Stack spacing={{ xs: 3, md: 6 }}>
                            <Typography textAlign="center" fontWeight="bold" variant="h1" component="p"><SignalcoLogotype theme={themeVariant} width={200} hideBadge /> {option.label}</Typography>
                            <Stack direction="row" alignItems="end" spacing={1}>
                                <Typography variant="h2" fontWeight="bold" component="p">€{option.price.eur}</Typography>
                                <Typography>/</Typography>
                                <Typography>{option.duration}</Typography>
                            </Stack>
                            <Typography>{option.description}</Typography>
                            <Stack spacing={1}>
                                {option.features.map(feature => (
                                    <Stack key={feature}>
                                        <Checkbox checked readonly label={feature} />
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack spacing={1}>
                            <Button variant="contained" href={option.href} disabled={option.price.eur > 0}>{option.hrefLabel}</Button>
                            {option.price.eur > 0 && <Typography color="textSecondary" textAlign="center">Available soon</Typography>}
                            {option.price.eur <= 0 && <Typography color="textSecondary" textAlign="center">No credit card required</Typography>}
                        </Stack>
                    </Stack>
                </CardActionArea>
            </Card>
        </ThemeProvider>
    );
}

const pricingOptions: PricingOption[] = [
    {
        id: 'free',
        label: 'Free',
        price: { eur: 0 },
        duration: 'forever',
        description: 'Start automating today.',
        features: ['10 Entities', '10k monthly Executions', 'No credit card required'],
        href: '/app',
        hrefLabel: 'Start now'
    },
    {
        id: 'basic',
        label: 'Basic',
        price: { eur: 1.99 },
        duration: 'month',
        description: 'Expand with ease.',
        features: ['20 Entities', '50k monthly Executions', 'Unlimited users', 'Everything in Free'],
        href: '/subscription/basic',
        hrefLabel: 'Select Basic'
    },
    {
        id: 'pro',
        label: 'Pro',
        price: { eur: 4.99 },
        duration: 'month',
        description: 'Pro plan scales with you.',
        features: ['30 Entities', '1M monthly Executions', 'Everything in Basic'],
        href: '/subscription/pro',
        hrefLabel: 'Select Pro'
    }
];

const pricingCardVariantMap: ('normal' | 'outlined' | 'inverted')[] = ['normal', 'outlined', 'inverted'];

const pricingFaq = [
    { id: 'planForMe', question: 'Which plan is right for me?', answer: 'Free plan is perfect for anyone who is looking to start with automation. Basic plan is great when you have many automations and services. Pro plan is next step that allows you to scale automations and need advanced features.' },
    { id: 'entities', question: 'What are Entities?', answer: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom dashboard, automation process, etc.' },
    { id: 'executions', question: 'What are Executions?', answer: 'Execution is when one of your automation processes executes one action.' },
    { id: 'noCode', question: 'Is coding required to use signalco?', answer: 'No. You can create automation processes with custom triggers, conditions and conducts (actions) without writing a line of code.' },
    { id: 'executionsLimit', question: 'What happens if I run out of executions?', answer: 'Your automation processes will not execute until executions are added again. We add executions to your account every month as per your plan. If you are using Free or Basic plans, it\'s advised to upgrade to Pro plan. In Pro plan you can select how much executions and contacts you need in your billing page.' },
];

const PricingPage: PageWithMetadata = () => {
    return (
        <Stack spacing={{ xs: 4, md: 12 }}>
            <PageCenterHeader header={'Pricing'} subHeader={'Find the plan for you'} />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center">
                {pricingOptions.map((po, i) => <PricingCard key={po.id} option={po} variant={pricingCardVariantMap[i]} />)}
            </Stack>
            <FaqSection faq={pricingFaq} />
            <CtaSection />
        </Stack >
    );
};

PricingPage.title = 'Pricing';
PricingPage.layout = PageLayout;

export default PricingPage;
