import React from 'react';
import { Box, Breakpoint, Container, Stack } from '@mui/material';
import Footer from '../pages/Footer';
import { PageNavSsr } from '../PageNavSsr';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

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
