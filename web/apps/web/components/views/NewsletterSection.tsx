import React from 'react';
import dynamic from 'next/dynamic';

export const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));

export function NewsletterSection() {
    return (
        <Newsletter />
    );
}
