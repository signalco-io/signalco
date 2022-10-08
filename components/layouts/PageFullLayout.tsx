import React from 'react';
import { Box } from '@mui/system';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

export function PageFullLayout(props: ChildrenProps) {
    return (
        <>
            <PageNav fullWidth />
            <Box sx={{ paddingTop: '75px' }}>
                {props.children}
            </Box>
            <Footer />
        </>
    );
}
