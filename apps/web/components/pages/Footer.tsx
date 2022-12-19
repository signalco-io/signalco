'use client';

import React from 'react';
import { GitHub, Twitter } from '@signalco/ui-icons';
import { Stack, Container, Grid, IconButton, Typography, Box, Link } from '@signalco/ui';
import { Stack as MuiStack } from '@mui/system';
import SignalcoLogotype from '../icons/SignalcoLogotype';
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
            { name: 'Features', href: '/features' },
            { name: 'Channels', href: '/channels' },
            { name: 'App', href: '/app' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Station', href: '/station' },
        ]
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
    {
        header: 'Resources',
        links: [
            { name: 'Status', href: 'https://status.signalco.io' },
            { name: 'Design', href: isDeveloper ? 'https://ui.signalco.dev' : 'https://ui.signalco.io' },
            { name: 'API', href: '/docs/api', developerOnly: true }
        ]
    },
    {
        header: 'Legal',
        links: [
            { name: 'Privacy Policy', href: '/legal/privacy-policy' },
            { name: 'Terms of Service', href: '/legal/terms-of-service' },
            { name: 'Cookie Policy', href: '/legal/cookie-policy' },
            { name: 'Acceptable Use Policy', href: '/legal/acceptable-use-policy' },
            { name: 'SLA', href: '/legal/sla' },
        ]
    }
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
                            <SignalcoLogotype width={220} />
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
