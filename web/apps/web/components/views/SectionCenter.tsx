'use client';

import React, { type CSSProperties } from 'react';
import { Container } from '@signalco/ui/dist/Container';
import { Box } from '@signalco/ui';


export function SectionCenter(props: { children?: React.ReactNode | undefined; style?: CSSProperties | undefined; narrow?: boolean; }) {
    return (
        <section style={props.style}>
            <Container>
                <Box sx={{ px: { xs: 1, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
                    {props.children}
                </Box>
            </Container>
        </section>
    );
}
