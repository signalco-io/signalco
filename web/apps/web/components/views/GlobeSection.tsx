'use client';
import { useInView } from 'react-cool-inview';
import React from 'react';
import { Box } from '@signalco/ui/dist/Box';
import { GlobePart } from './LandingView';

export function GlobeSection() {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <Box ref={observe} sx={{ minHeight: { xs: '12vh', sm: '20vh', md: '380px' }, }}>
            {inView && <GlobePart />}
        </Box>
    );
}
