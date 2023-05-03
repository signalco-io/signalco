import React from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { ChildrenProps } from '@signalco/ui';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: ChildrenProps) {
    return (
        <Stack spacing={4}>
            <PageNav fullWidth />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
            <Footer />
        </Stack>
    );
}
