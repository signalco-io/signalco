'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import { GlobePart } from './LandingView';

export function GlobeSection() {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <div ref={observe} className="min-h-[12vh] sm:min-h-[20vh] md:min-h-[380px]">
            {inView && <GlobePart />}
        </div>
    );
}
