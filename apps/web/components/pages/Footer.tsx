import React, { ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Stack } from '@mui/system';
import { Grid, IconButton, Typography, Link as JoyLink } from '@mui/joy';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import GitHubIcon from '@mui/icons-material/GitHub';
import Container from 'components/shared/layout/Container';
import SignalcoLogotype from '../icons/SignalcoLogotype';
import DateTimeProvider from '../../src/services/DateTimeProvider';
import appSettingsProvider from '../../src/services/AppSettingsProvider';

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
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/', developerOnly: true }
        ]
    },
    {
        header: 'Resources',
        links: [
            { name: 'Status', href: 'https://status.signalco.io' },
            { name: 'Design', href: '/design' },
            { name: 'API', href: '/docs/api', developerOnly: true },
            { name: 'Storybook', href: 'https://storybook.signalco.dev', developerOnly: true },
            { name: 'Storybook (next)', href: 'https://next.storybook.signalco.dev', developerOnly: true },
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

function Link(props: { href: string, children: ReactNode }) {
    return (
        <NextLink href={props.href} passHref legacyBehavior>
            <JoyLink>
                {props.children}
            </JoyLink>
        </NextLink>
    );
}

export default function Footer() {
    return (
        <Box sx={{ alignSelf: 'stretch' }}>
            <Container maxWidth="lg">
                <Box component="footer" sx={{ padding: '64px 0 32px 0' }}>
                    <Stack spacing={4}>
                        <Grid container direction="row" justifyContent="space-between" spacing={4}>
                            {footerLinks.filter(i => appSettingsProvider.isDeveloper ? true : !i.developerOnly).map(section => (
                                <Grid key={section.header} xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Typography level="h6" textColor="neutral.400" sx={{ pb: 2 }}>{section.header}</Typography>
                                    <Stack spacing={1}>
                                        {section.links.filter(l => appSettingsProvider.isDeveloper ? true : !l.developerOnly).map(link => (
                                            <Link key={link.name} href={link.href}>{link.name}</Link>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Stack alignItems={{ xs: 'center', sm: 'stretch' }}>
                            <SignalcoLogotype width={220} />
                            <Stack alignItems="center" justifyContent="space-between" direction={{ xs: 'column-reverse', sm: 'row' }}>
                                <Typography
                                    textAlign={{ xs: 'center', sm: 'left' }}
                                    level="body2"
                                    textColor="neutral.400">Copyright © {DateTimeProvider.now().getFullYear()} signalco. All rights reserved.</Typography>
                                <Stack direction="row" spacing={1} alignItems={{ xs: 'center', sm: 'start' }}>
                                    <IconButton aria-label="Twitter link" href="https://twitter.com/signalco_io">
                                        <TwitterIcon />
                                    </IconButton>
                                    <IconButton aria-label="reddit link" href="https://www.reddit.com/r/signalco/">
                                        <RedditIcon />
                                    </IconButton>
                                    <IconButton aria-label="GitHub link" href="https://github.com/signalco-io/signalco">
                                        <GitHubIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
