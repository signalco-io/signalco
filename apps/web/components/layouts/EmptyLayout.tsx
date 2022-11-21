import React from 'react';
import { Box } from '@signalco/ui';
import { ChildrenProps } from '../../src/sharedTypes';

export function EmptyLayout(props: ChildrenProps) {
    const {
        children
    } = props;

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            {children}
        </Box>
    );
}
