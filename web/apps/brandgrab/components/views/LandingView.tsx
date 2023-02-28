import React from 'react';
import Stack from '@signalco/ui/dist/Stack';
import { StepContent } from '../pages/StepContent';
import { NewsletterSection } from '../pages/NewsletterSection';

export default function LandingPageView() {
    return (
        <Stack style={{ overflowX: 'hidden' }}>
            <StepContent header="BrandGrab">
            </StepContent>
            <NewsletterSection />
        </Stack>
    );
}
