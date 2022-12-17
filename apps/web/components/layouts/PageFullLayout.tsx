'use client';

import React from 'react';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

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
