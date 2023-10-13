import React from 'react';
import dynamic from 'next/dynamic';
import { SectionCenter } from './SectionCenter';

export const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));

export function NewsletterSection() {
    return (
        <SectionCenter>
            <Newsletter />
        </SectionCenter>
    );
}
