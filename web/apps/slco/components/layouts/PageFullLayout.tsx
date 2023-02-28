'use client';

import React from 'react';
import { ChildrenProps } from '@signalco/ui';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: ChildrenProps) {
    return (
        <>
            <PageNav fullWidth />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
            <Footer />
        </>
    );
}
