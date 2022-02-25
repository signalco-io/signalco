import { Box, Divider, Container, Grid, Typography, Stack, IconButton, Link } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import SignalcoLogo from "../icons/SignalcoLogo";
import RedditIcon from "@mui/icons-material/Reddit";

const SLink = ({ href, children }: { href: string, children: React.ReactElement | string }) => (
    <NextLink href={href} passHref>
        {typeof children === 'string' ? (
            <Link underline="hover">{children}</Link>
        ) : (
            <>
                {children}
            </>
        )}
    </NextLink>
)

const Footer = () => (
    <Box sx={{ bgcolor: 'background.paper' }}>
        <Divider />
        <Container maxWidth="lg">
            <Box component="footer" sx={{ padding: "64px 0 32px 0" }}>
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <Grid container justifyContent="space-between" spacing={2}>
                            <Grid item>
                                <Typography variant="h4" sx={{ pb: 2 }}>Projects</Typography>
                                <Stack spacing={1}>
                                    <SLink href="https://github.com/signalco-io/signalco">Website</SLink>
                                    <SLink href="https://github.com/signalco-io/cloud">Cloud</SLink>
                                    <SLink href="https://github.com/signalco-io/station">Station</SLink>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" sx={{ pb: 2 }}>Community</Typography>
                                <Typography variant="caption" color="textSecondary">Coming soon...</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" sx={{ pb: 2 }}>Resources</Typography>
                                <Stack spacing={1}>
                                    <SLink href="https://status.signalco.io">Status</SLink>
                                    <SLink href="https://storybook.dev.signalco.io">Storybook</SLink>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" sx={{ pb: 2 }}>Legal</Typography>
                                <Stack spacing={1}>
                                    <SLink href="/legal/privacy-policy">Privacy Policy</SLink>
                                    <SLink href="/legal/terms-of-service">Terms of Service</SLink>
                                    <SLink href="/legal/dpa">DPA</SLink>
                                    <SLink href="/legal/sla">SLA</SLink>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <SignalcoLogo priority height={68} />
                        <Stack alignItems="center" justifyContent="space-between" direction="row">
                            <Typography variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
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
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </Box>
);

export default Footer;