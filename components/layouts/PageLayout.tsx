import React from 'react';
import { Box, Breakpoint, Stack } from '@mui/material';
import Container from 'components/shared/layout/Container';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

export function PageLayout(props: ChildrenProps & { maxWidth?: false | Breakpoint | undefined }) {
    console.log('PageLayout rendered');

    return (
        <Stack spacing={4}>
            <PageNav />
            <Box sx={{ paddingTop: 10 }}>
                <Container maxWidth={props.maxWidth}>
                    {props.children}
                </Container>
            </Box>
            <Footer />
        </Stack>);
}
