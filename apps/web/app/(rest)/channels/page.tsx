'use client';

import { Stack } from '@signalco/ui';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import FaqSection from '../../../components/pages/FaqSection';
import CtaSection from '../../../components/pages/CtaSection';
import ChannelsGallery from '../../../components/channels/ChannelsGallery';

const channelsFaq = [
    { id: 'channel', question: 'What is Channel?', answer: 'Channel is Entity that contains all information required for connected online service, application or device. Channels can execute actions directly or contain connected entities to manage.' },
    { id: 'entities', question: 'What are Entities?', answer: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom dashboard, automation process, etc.' },
];

export default function ChannelsPage() {
    return (
        <Stack spacing={4}>
            <Stack spacing={4}>
                <PageCenterHeader header="Channels" subHeader="List of all channels available on signalco" />
                <ChannelsGallery channelHrefFunc={(id) => `/channels/${id}`} />
            </Stack>
            <FaqSection faq={channelsFaq} />
            <CtaSection />
        </Stack >
    );
}
