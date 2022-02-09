import { Box, Divider, Container, Grid, Typography, Stack, IconButton, Link } from "@mui/material";
import NextLink from "next/link";
import React, { useContext } from "react";
import { AppContext } from "../../pages/_app";
import GitHubIcon from '@mui/icons-material/GitHub';
import SignalcoLogo from "../icons/SignalcoLogo";

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

const Footer = () => {
    const appContext = useContext(AppContext);

    return (
        <Box sx={{ backgroundColor: appContext.theme === 'light' ? "rgba(0,0,0,0.06)" : "rgba(125,125,125,0.2)" }}>
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
                            <SignalcoLogo height={68} />
                            <Stack alignItems="center" justifyContent="space-between" direction="row">
                                <Typography variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                                <SLink href="https://github.com/signalco-io/signalco">
                                    <IconButton size="large" aria-label="GitHub link">
                                        <GitHubIcon />
                                    </IconButton>
                                </SLink>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container >
        </Box >
    );
};

export default Footer;