import { Suspense } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { sectionsComponentRegistry } from '../../page';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import CtaSection from '../../../components/pages/CtaSection';
import ChannelsGallery from '../../../components/channels/ChannelsGallery';
import { channelsFaq } from './data';

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
