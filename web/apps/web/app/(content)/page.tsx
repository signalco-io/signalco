import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Check } from '@signalco/ui-icons';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Pricing1 } from '@signalco/cms-components-marketing/Pricing';
import { Heading1 } from '@signalco/cms-components-marketing/Heading';
import { Feature2, Feature3, Feature4 } from '@signalco/cms-components-marketing/Feature';
import { Faq1 } from '@signalco/cms-components-marketing/Faq';
import { isDeveloper } from '../../src/services/EnvProvider';
import { KnownPages } from '../../src/knownPages';
import { NewsletterSection } from '../../components/views/NewsletterSection';
import DiscoverVisual from '../../components/pages/landing/visuals/DiscoverVisual';
import CtaSection from '../../components/pages/CtaSection';
import SignalcoLogotype from '../../components/icons/SignalcoLogotype';

export const sectionsComponentRegistry = {
    'Heading1': memo(Heading1),
    'Feature2': memo(Feature2),
    'Feature3': memo(Feature3),
    'Feature4': memo(Feature4),
    'Pricing1': memo(Pricing1),
    'Faq1': memo(Faq1)
};

const integrationsList = [
    { name: 'Samsung', img: '/assets/logos/samsunglogo.png', scale: 3.5, url: '/channels/samsung' },
    { name: 'Xiaomi', img: '/assets/logos/xiaomilogo.png', scale: 1, url: '/channels/xiaomi' },
    { name: 'Philips Hue', img: '/assets/logos/huelogo.png', scale: 1.6, url: '/channels/philipshue' },
    { name: 'Zigbee2MQTT', img: '/assets/logos/z2mlogo.png', scale: 1, url: '/channels/zigbee2mqtt' },
    { name: 'iRobot', img: '/assets/logos/irobotlogo.png', scale: 2.5, url: '/channels/irobot' },
    { name: 'GitHub', img: '/assets/logos/githublogo.png', scale: 2, url: '/channels/github-app' },
    // { name: "Tasmota", img: "/assets/logos/tasmotalogo.png", scale: 1, page: '/channels/tasmota' },
];

const integrationsLogoSize = 60;

export const sectionPricing = [
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
                        header: '10 entities',
                    },
                    {
                        asset: <Check />,
                        header: '2,000 executions',
                    },
                    {
                        asset: <Check />,
                        header: 'No credit card required',
                    },
                ],
                ctas: [
                    { label: 'Start for Free', href: KnownPages.App },
                ]
            },
            {
                header: 'Plus',
                description: 'When free isn\'t enough...',
                asset: '€2/mo',
                features: [
                    { asset: <Check />, header: '20 entities' },
                    { asset: <Check />, header: '10,000 executions' },
                    { asset: <Check />, header: '7 day history' },
                ],
                // ctas: [
                //     { label: 'Get Started', href: KnownPages.AppSettingsAccountBillingPlans },
                // ]
            },
            {
                header: 'Pro',
                description: 'Pro plan scales with you',
                asset: '€5/mo',
                features: [
                    { asset: <Check />, header: '50 entities' },
                    { asset: <Check />, header: '50,000 executions' },
                    { asset: <Check />, header: '30 day history' }
                ],
                // ctas: [
                //     { label: 'Start like a Pro', href: KnownPages.AppSettingsAccountBillingPlans, secondary: true },
                // ]
            }
        ]
    }
];

const sectionsData: SectionData[] = [
    {
        component: 'Heading1',
        tagline: 'Automate your life',
        // header: 'Signalco',
        description: <SignalcoLogotype width={220} />,
        ctas: [
            { label: 'Get Started', href: '/runs' },
        ],
    },
    {
        component: 'Feature2',
        tagline: 'Discover',
        header: 'All your services and devices in one place',
        features: [
            {
                header: 'Bring together',
                description: 'Every service and device is useful by itself, but the real magic happens when you bring them all together.'
            }, {
                header: 'Connect',
                description: 'Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps.'
            }, {
                header: 'Automation',
                description: 'Repetitive tasks are boring. Automate so you can focus on things that matter to you.'
            }
        ],
        asset: <DiscoverVisual />,
    },
    {
        component: 'Feature4',
        features: [
            { header: '8', description: 'INTEGRATIONS' },
            { header: '500+', description: 'AUTOMATIONS PER DAY' },
            { header: '2000+', description: 'SUPPORTED DEVICES' },
        ]
    },
    {
        component: 'Feature3',
        tagline: 'FEATURED INTEGRATIONS',
        features: integrationsList.map(channel => (
            {
                asset: (
                    <Link key={channel.name} href={channel.url} className="text-center transition-opacity duration-200 hover:opacity-75">
                        <Image
                            alt={channel.name}
                            src={channel.img}
                            width={`${integrationsLogoSize * channel.scale}`}
                            height={`${integrationsLogoSize * channel.scale}`} />
                    </Link>
                )
            }
        ))
    },
    {
        component: 'Feature2',
        tagline: 'Visualize',
        header: 'See your services in new light',
        description: 'Visualize your services and devices in a way that makes sense to you. Create your own custom views and dashboards.',
        features: [
            {
                header: 'Morning routine',
                description: 'Raise the blinds, turn on the coffee machine, and start your day with a single tap.',
            }, {
                header: 'Movie night',
                description: 'Dim the lights, turn on the projector, and start the movie with a single command.',
            }, {
                header: 'Work mode',
                description: 'Turn off the notifications, set the mood lighting, and focus on work.',
            }
        ],
        // TODO: Use interactive visual
        asset: (
            <>
                <Image className="image--light" src={'/images/playpitch.png'} alt="Play" quality={100} width={511} height={684} />
                <Image className="image--dark" src={'/images/playpitch-dark.png'} alt="Play" quality={100} width={511} height={684} />
            </>
        )
    },
    ...sectionPricing
];

export default function LandingPage() {
    return (
        <Stack>
            <SectionsView
                sectionsData={sectionsData}
                componentsRegistry={sectionsComponentRegistry}
                debug={isDeveloper} />
            <CtaSection />
            <NewsletterSection />
        </Stack>
    );
}
