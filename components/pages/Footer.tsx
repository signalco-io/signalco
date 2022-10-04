import React from 'react';
import NextLink from 'next/link';
import { Box, Container, Divider, Grid, IconButton, Link, Stack, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import GitHubIcon from '@mui/icons-material/GitHub';
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
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true }
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

function SLink({ href, children }: { href: string; children: React.ReactElement | string; }) {
    return (
        <NextLink href={href} passHref>
            {typeof children === 'string' ? (
                <Link underline="hover">{children}</Link>
            ) : (
                children
            )}
        </NextLink>
    );
}

export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <Divider />
            <Container maxWidth="lg">
                <Box component="footer" sx={{ padding: '64px 0 32px 0' }}>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Grid container justifyContent="space-between" spacing={4}>
                                {footerLinks.filter(i => appSettingsProvider.isDeveloper ? true : !i.developerOnly).map(section => (
                                    <Grid item key={section.header} xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Typography variant="h4" color="textSecondary" sx={{ pb: 2 }}>{section.header}</Typography>
                                        <Stack spacing={1}>
                                            {section.links.filter(l => appSettingsProvider.isDeveloper ? true : !l.developerOnly).map(link => (
                                                <SLink key={link.name} href={link.href}>{link.name}</SLink>
                                            ))}
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Stack alignItems={{ xs: 'center', sm: 'stretch' }}>
                                <SignalcoLogotype height={68} />
                                <Stack alignItems="center" justifyContent="space-between" direction={{ xs: 'column-reverse', sm: 'row' }}>
                                    <Typography textAlign={{ xs: 'center', sm: 'left' }} variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {DateTimeProvider.now().getFullYear()} signalco. All rights reserved.</Typography>
                                    <Stack direction="row" spacing={1} alignItems={{ xs: 'center', sm: 'start' }}>
                                        <SLink href="https://twitter.com/signalco_io">
                                            <IconButton size="large" aria-label="Twitter link">
                                                <TwitterIcon />
                                            </IconButton>
                                        </SLink>
                                        <SLink href="https://www.reddit.com/r/signalco/">
                                            <IconButton size="large" aria-label="reddit link">
                                                <RedditIcon />
                                            </IconButton>
                                        </SLink>
                                        <SLink href="https://github.com/signalco-io/signalco">
                                            <IconButton size="large" aria-label="GitHub link">
                                                <GitHubIcon />
                                            </IconButton>
                                        </SLink>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
