'use client';

import React, { type CSSProperties } from 'react';
import { Stack, Container, Divider, Typography, Box, MuiStack } from '@signalco/ui';
import CtaSection from '../pages/CtaSection';

function SectionCenter(props: { children?: React.ReactNode | undefined, style?: CSSProperties | undefined, narrow?: boolean }) {
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

function DataPart(props: { value: string, subtitle: string }) {
    return <Stack alignItems="center" spacing={1}>
        <Typography level="h3" component="span" lineHeight={1}>{props.value}</Typography>
        <Typography textTransform="uppercase" textColor="text.secondary" lineHeight={1}>{props.subtitle}</Typography>
    </Stack>
}

export default function LandingPageView() {
    return (
        <Stack style={{ overflowX: 'hidden' }}>
            <SectionCenter narrow style={{ backgroundColor: 'var(--joy-palette-background-surface)' }}>
                <MuiStack
                    spacing={{ xs: 6, md: 8 }}
                    alignItems="center"
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent={{ xs: 'space-between' }}>
                    <DataPart value="8" subtitle="Integrations" />
                    <DataPart value="500+" subtitle="Automations per day" />
                    <DataPart value="2000+" subtitle="Supported devices" />
                </MuiStack>
            </SectionCenter>
            <Divider />
            <Container>
                <div style={{ paddingBottom: 8 * 8 }}>
                    <CtaSection />
                </div>
            </Container>
        </Stack>
    );
}
