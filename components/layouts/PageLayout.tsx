import { Box, Breakpoint, Container, Stack } from '@mui/material';
import React from 'react';
import { ChildrenProps } from '../../src/sharedTypes';
import { PageNav } from '../PageNav';
import { PageNavSsr } from '../PageNavSsr';
import Footer from '../pages/Footer';

export function PageLayout(props: ChildrenProps & { maxWidth?: false | Breakpoint | undefined }) {
    const Nav = typeof window !== 'undefined' ? PageNav : PageNavSsr;

    return (
        <Stack spacing={4}>
            <Nav />
            <Box>
                <Container maxWidth={props.maxWidth}>
                    {props.children}
                </Container>
            </Box>
            <Footer />
        </Stack>);
}
