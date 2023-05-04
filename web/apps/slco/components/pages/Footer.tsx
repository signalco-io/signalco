'use client';

import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Link } from '@signalco/ui/dist/Link';
import { Container } from '@signalco/ui/dist/Container';
import { Box } from '@signalco/ui/dist/Box';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Grid } from '@signalco/ui/dist/Grid';
import { isDeveloper } from '../../src/services/EnvProvider';
import { now } from '../../src/services/DateTimeProvider';
import { Row } from '@signalco/ui/dist/Row';


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
                                    <Typography level="h6" component="h2">{section.header}</Typography>
                                    <Stack spacing={1}>
                                        {section.links.filter(l => isDeveloper ? true : !l.developerOnly).map(link => (
                                            <Link key={link.name} href={link.href}>{link.name}</Link>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Stack>
                            <Stack alignItems="center" justifyContent="space-between">
                                <Typography level="body3">Copyright © {now().getFullYear()} signalco. All rights reserved.</Typography>
                                <Row spacing={1}>
                                    <IconButton
                                        aria-label="Twitter link"
                                        href="https://twitter.com/signalco_io">
                                        <Typography>tw</Typography>
                                    </IconButton>
                                    <IconButton
                                        aria-label="reddit link"
                                        href="https://www.reddit.com/r/signalco/">
                                        <Typography>/r</Typography>
                                    </IconButton>
                                    <IconButton
                                        aria-label="GitHub link"
                                        href="https://github.com/signalco-io/signalco">
                                        <Typography>gh</Typography>
                                    </IconButton>
                                </Row>
                            </Stack>
                        </Stack>
                    </Stack>
                </footer>
            </Container>
        </Box>
    );
}
