'use client';

import React from 'react';
import { GitHub, Twitter } from '@signalco/ui-icons';
import { Stack, Container, Grid, IconButton, Typography, Box, Link, MuiStack } from '@signalco/ui';
import { isDeveloper } from '../../src/services/EnvProvider';
import { now } from '../../src/services/DateTimeProvider';


type FooterSectionType = {
    header: string,
    links: { name: string, href: string, developerOnly?: boolean }[]
    developerOnly?: boolean
}

const footerLinks: FooterSectionType[] = [
    {
        header: 'Product',
        links: [
        ]
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
];

export default function Footer() {
    return (
        <Box sx={{ alignSelf: 'stretch', px: 2 }} component="footer">
            <Container maxWidth="lg">
                <footer style={{ padding: '64px 0 32px 0' }}>
                    <Stack spacing={4}>
                        <Grid container direction="row" justifyContent="space-between" spacing={4}>
                            {footerLinks.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                                <Grid key={section.header} xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Typography level="h6" component="h2" sx={{ pb: 2 }}>{section.header}</Typography>
                                    <Stack spacing={1}>
                                        {section.links.filter(l => isDeveloper ? true : !l.developerOnly).map(link => (
                                            <Link key={link.name} href={link.href}>{link.name}</Link>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <MuiStack alignItems={{ xs: 'center', sm: 'stretch' }}>
                            <MuiStack alignItems="center" justifyContent="space-between" direction={{ xs: 'column-reverse', sm: 'row' }}>
                                <Typography
                                    textAlign={{ xs: 'center', sm: 'left' }}
                                    level="body3">Copyright © {now().getFullYear()} signalco. All rights reserved.</Typography>
                                <MuiStack direction="row" spacing={1} alignItems={{ xs: 'center', sm: 'start' }}>
                                    <IconButton
                                        aria-label="Twitter link"
                                        href="https://twitter.com/signalco_io">
                                        <Twitter />
                                    </IconButton>
                                    <IconButton
                                        aria-label="reddit link"
                                        href="https://www.reddit.com/r/signalco/">
                                        <Typography>/r</Typography>
                                    </IconButton>
                                    <IconButton
                                        aria-label="GitHub link"
                                        href="https://github.com/signalco-io/signalco">
                                        <GitHub />
                                    </IconButton>
                                </MuiStack>
                            </MuiStack>
                        </MuiStack>
                    </Stack>
                </footer>
            </Container>
        </Box>
    );
}
