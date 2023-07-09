'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import { SectionCenter } from './SectionCenter';
import { Newsletter } from './LandingView';

export function NewsletterSection() {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <div ref={observe}>
            <SectionCenter>
                {inView && <Newsletter />}
            </SectionCenter>
        </div>
    );
}
