'use client';

import React from 'react';
import { Box } from '@signalco/ui';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

export function PageFullLayout(props: ChildrenProps) {
    return (
        <>
            <PageNav fullWidth />
            <Box sx={{ paddingTop: '80px' }}>
                {props.children}
            </Box>
            <Footer />
        </>
    );
}
