import { Suspense } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import CtaSection from '../../../components/pages/CtaSection';
import ChannelsGallery from '../../../components/channels/ChannelsGallery';
import { sectionsComponentRegistry } from '../../(landing)/page';

export const channelsFaq = [
    {
        component: 'Faq1',
        header: 'FAQ',
        description: 'Find answers to common questions about signalco channels.',
        features: [
            { id: 'channel', header: 'What is Channel?', description: 'Channel is Entity that contains all information required for connected online service, application or device. Channels can execute actions directly or contain connected entities to manage.' },
            { id: 'entities', header: 'What are Entities?', description: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom space, automation process, etc.' },
            { id: 'executions', header: 'What are Executions?', description: 'Execution is when one of your automation processes executes one action (e.g.: when automation sends an email when new subscribes is added to a list).' },
        ]
    }
];

export default function ChannelsPage() {
    return (
        <Stack spacing={8}>
            <Stack spacing={4}>
                <PageCenterHeader level="h1" subHeader="List of all channels available on signalco">
                    Channels
                </PageCenterHeader>
                <Suspense>
                    <ChannelsGallery />
                </Suspense>
            </Stack>
            <SectionsView
                sectionsData={channelsFaq}
                componentsRegistry={sectionsComponentRegistry}
            />
            <CtaSection />
        </Stack >
    );
}
