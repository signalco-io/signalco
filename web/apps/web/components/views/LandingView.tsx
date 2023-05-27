'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Navigate } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Divider } from '@signalco/ui/dist/Divider';
import { Container } from '@signalco/ui/dist/Container';
import {Button} from '@signalco/ui/dist/Button';
import DeveloperOnly from '../shared/DeveloperOnly';
import DiscoverVisual from '../pages/landing/visuals/DiscoverVisual';
import Cover from '../pages/landing/Cover';
import CounterIndicator from '../pages/landing/CounterIndicator';
import CtaSection from '../pages/CtaSection';
import { StepContent } from './StepContent';
import { SectionCenter } from './SectionCenter';
import { PlaySection } from './PlaySection';
import { NewsletterSection } from './NewsletterSection';
import { GlobeSection } from './GlobeSection';
import { FeaturedIntegrationsSection } from './FeaturedIntegrationsSection';
import { FeatureDescription } from './FeatureDescription';
import { DataPart } from './DataPart';

export const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));
export const GlobePart = dynamic(() => import('../pages/landing/GlobeSection'));

export default function LandingPageView() {
    return (
        <Stack className="overflow-x-hidden">
            <div className="my-2">
                <Cover />
            </div>
            <DeveloperOnly>
                <CounterIndicator count={0} />
                <StepContent
                    header="Developers"
                    subtitle="Signalco is free and open source project run by small team of enthusiasts."
                    direction="horizontal">
                    <Stack alignItems="center">
                        <Button
                            variant="solid"
                            endDecorator={<Navigate />}
                            href="https://github.com/signalco-io"
                            size="lg">signalco on GitHub</Button>
                    </Stack>
                </StepContent>
            </DeveloperOnly>
            <CounterIndicator count={1} />
            <StepContent header="Discover" image={<DiscoverVisual />} imageContainerHeight={420}
                imageContainerStyles={{
                    position: 'absolute',
                    top: '-92px',
                    right: 0,
                    zIndex: -1
                }}>
                <FeatureDescription
                    header="Bring together"
                    content="Every service and device is useful by itself, but the real magic happens when you bring them all together." />
                <FeatureDescription
                    header="Connected"
                    content="Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps." />
                <FeatureDescription
                    header="Automation"
                    content="Repetitive tasks are boring. Automate so you can focus on things that matter to you." />
            </StepContent>
            <FeaturedIntegrationsSection />
            <CounterIndicator count={2} />
            <PlaySection />
            <CounterIndicator count={3} hideAfter />
            <StepContent header="Enjoy" direction="horizontal">
                <FeatureDescription
                    header="Anywhere you are"
                    content="Access all features wherever you are. Controlling devices in your home from other side of the world or room&nbsp;:) has never been simpler." />
                <FeatureDescription
                    header="Share"
                    content="Share devices, media, dashboards, everything connected, with anyone on signalco or publically. Invite with friends, family, and coworkers. You are in full control over what others can see and do." />
                <FeatureDescription
                    header="Relax"
                    content="Enjoy the automated life. Use gained free time doing what you love. Relax in nature, hobbies, family... or automate one more thing." />
            </StepContent>
            <GlobeSection />
            <Divider />
            <SectionCenter narrow className="bg-[--joy-palette-background-surface]">
                <div className="flex flex-col md:flex-row gap-4 md:gap-24 items-center justify-center py-4">
                    <DataPart value="8" subtitle="Integrations" />
                    <DataPart value="500+" subtitle="Automations per day" />
                    <DataPart value="2000+" subtitle="Supported devices" />
                </div>
            </SectionCenter>
            <Divider />
            <NewsletterSection />
            <Container>
                <div className="pb-8">
                    <CtaSection />
                </div>
            </Container>
        </Stack>
    );
}
