'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import dynamic from 'next/dynamic';
import { SectionCenter } from './SectionCenter';

export const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));

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
